"use client";

import { useState, useEffect } from "react";
import { Question, Answer } from "@/types";
import QuestionCard from "./QuestionCard";
import Timer from "./Timer";
import AudioRecorder from "./AudioRecorder";
import SampleAnswerPlayer from "./SampleAnswerPlayer";

interface TestInterfaceProps {
  questions: Question[];
  onAnswer: (answer: Answer) => void;
  onComplete: () => void;
  currentQuestionIndex: number;
  onNextQuestion?: () => void;
}

// OPIc test timing: 20 seconds preparation, then speaking time
const PREPARATION_TIME = 20;

export default function TestInterface({
  questions,
  onAnswer,
  onComplete,
  currentQuestionIndex,
  onNextQuestion,
}: TestInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [micPermissionStatus, setMicPermissionStatus] = useState<"unknown" | "granted" | "denied" | "prompt">("unknown");
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [preparationComplete, setPreparationComplete] = useState(false);
  const [preparationTimerRunning, setPreparationTimerRunning] = useState(true);
  const [isProcessingRecording, setIsProcessingRecording] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const speakingTimeLimit = currentQuestion.timeLimit || 120;

  // Reset all state when question changes
  useEffect(() => {
    setIsRecording(false);
    setRecordingStartTime(null);
    setError(null);
    setShowSampleAnswer(false);
    setPreparationComplete(false);
    setPreparationTimerRunning(true);
  }, [currentQuestionIndex]);

  // Check microphone permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const result = await navigator.permissions.query({ name: "microphone" as PermissionName });
          setMicPermissionStatus(result.state);
          
          result.onchange = () => {
            setMicPermissionStatus(result.state);
          };
        } catch (error) {
          // Some browsers don't support permissions API
          console.log("Permissions API not supported");
        }
      }
    };
    checkPermission();
  }, []);

  const handleStartRecording = () => {
    if (!preparationComplete) {
      return; // Don't allow recording until preparation is complete
    }
    setIsRecording(true);
    setRecordingStartTime(Date.now());
    setError(null);
  };

  const handlePreparationComplete = () => {
    setPreparationComplete(true);
    setPreparationTimerRunning(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleRecordingError = (errorMessage: string) => {
    setError(errorMessage);
    setIsRecording(false);
    setRecordingStartTime(null);
    setMicPermissionStatus("denied");
  };

  const handleRequestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Permission granted, stop the stream immediately
      stream.getTracks().forEach(track => track.stop());
      setMicPermissionStatus("granted");
      setError(null);
    } catch (error) {
      setMicPermissionStatus("denied");
      const errorMessage = 
        (error as Error).name === "NotAllowedError" || (error as Error).name === "PermissionDeniedError"
          ? "마이크 접근 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요."
          : "마이크를 사용할 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.";
      setError(errorMessage);
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsProcessingRecording(true);
    try {
      const duration = recordingStartTime
        ? Math.floor((Date.now() - recordingStartTime) / 1000)
        : 0;

      // Convert blob to base64 using Promise
      await new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const base64String = reader.result as string;
            const base64 = base64String.split(",")[1] || base64String;

            const answer: Answer = {
              questionId: currentQuestion.id,
              audioData: base64,
              audioMimeType: audioBlob.type,
              duration,
              timestamp: Date.now(),
            };

            onAnswer(answer);
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => {
          reject(new Error("Failed to read audio file"));
        };
        reader.readAsDataURL(audioBlob);
      });
    } catch (error) {
      console.error("Error processing recording:", error);
      setError("녹음 파일을 처리하는 중 오류가 발생했습니다.");
    } finally {
      setIsProcessingRecording(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      onNextQuestion?.();
    }
  };

  const handleSpeakingTimeUp = () => {
    if (isRecording) {
      setIsRecording(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {!preparationComplete ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <Timer
                initialSeconds={PREPARATION_TIME}
                onPhaseComplete={handlePreparationComplete}
                isRunning={preparationTimerRunning}
                phase="preparation"
              />
              <button
                onClick={handlePreparationComplete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors text-sm min-h-[44px]"
              >
                Skip
              </button>
            </div>
          ) : (
            <Timer
              initialSeconds={speakingTimeLimit}
              onTimeUp={handleSpeakingTimeUp}
              isRunning={isRecording}
              phase="speaking"
            />
          )}
          <AudioRecorder
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onRecordingComplete={handleRecordingComplete}
            onError={handleRecordingError}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            onClick={() => {
              if (!isRecording) {
                handleStartRecording();
              } else {
                setIsRecording(false);
              }
            }}
            disabled={!preparationComplete || (!isRecording && recordingStartTime !== null) || isProcessingRecording}
            className={`flex-1 py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px] ${
              isRecording
                ? "bg-red-600 hover:bg-red-700 text-white"
                : !preparationComplete
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-400"
            }`}
          >
            {!preparationComplete 
              ? "Preparing..." 
              : isRecording 
              ? "Stop Recording" 
              : "Start Recording"}
          </button>
          {!isRecording && recordingStartTime !== null && !isProcessingRecording && (
            <button
              onClick={handleNext}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px]"
            >
              {isLastQuestion ? "Complete Test" : "Next Question"}
            </button>
          )}
          {isProcessingRecording && (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
              Processing recording...
            </div>
          )}
          {(currentQuestion.sampleAnswer || currentQuestion.audioPath) && (
            <button
              onClick={() => setShowSampleAnswer(!showSampleAnswer)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px]"
            >
              {showSampleAnswer ? "Hide" : "Show"} Sample
            </button>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
            <p className="text-red-600 text-sm font-semibold">{error}</p>
            <div className="text-xs text-red-500 space-y-1">
              <p><strong>권한 설정 방법:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Chrome/Edge:</strong> 주소창 왼쪽의 자물쇠 아이콘 클릭 → 사이트 설정 → 마이크 허용</li>
                <li><strong>Firefox:</strong> 주소창 왼쪽의 자물쇠 아이콘 클릭 → 권한 → 마이크 허용</li>
                <li><strong>Safari:</strong> Safari → 설정 → 웹사이트 → 마이크 → 이 웹사이트 허용</li>
              </ul>
            </div>
            <button
              onClick={handleRequestPermission}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
            >
              권한 다시 요청하기
            </button>
          </div>
        )}
        {!preparationComplete && !error && (
          <p className="text-center text-blue-600 text-sm mt-2 font-semibold">
            Read the question and prepare your answer. Recording will be available after preparation time.
          </p>
        )}
        {preparationComplete && !isRecording && recordingStartTime === null && !error && (
          <p className="text-center text-gray-500 text-sm mt-2">
            Click "Start Recording" to begin your answer
          </p>
        )}
        {micPermissionStatus === "denied" && !error && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              마이크 권한이 거부되었습니다. "Start Recording" 버튼을 클릭하면 권한 요청이 다시 표시됩니다.
            </p>
          </div>
        )}

        {/* Sample Answer */}
        {showSampleAnswer && (currentQuestion.sampleAnswer || currentQuestion.audioPath) && (
          <div className="mt-4">
            <SampleAnswerPlayer
              audioPath={currentQuestion.audioPath}
              sampleAnswer={currentQuestion.sampleAnswer}
            />
          </div>
        )}
      </div>
    </div>
  );
}

