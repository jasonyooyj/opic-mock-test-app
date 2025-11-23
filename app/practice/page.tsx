"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Question, Answer } from "@/types";
import { getQuestionsForLevel, getQuestionsByTopic } from "@/lib/opic-questions";
import QuestionCard from "@/components/QuestionCard";
import AudioRecorder from "@/components/AudioRecorder";
import SampleAnswerPlayer from "@/components/SampleAnswerPlayer";
import ComparisonView from "@/components/ComparisonView";
import UsefulExpressions from "@/components/UsefulExpressions";
import TopicSelector from "@/components/TopicSelector";

function PracticePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = (searchParams.get("level") as "IH" | "AL") || "IH";
  const topicParam = searchParams.get("topic");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(topicParam ? [topicParam] : []);

  useEffect(() => {
    if (selectedTopics.length > 0) {
      const topicQuestions = selectedTopics.flatMap((topic) =>
        getQuestionsByTopic(level, topic)
      );
      setQuestions(topicQuestions.length > 0 ? topicQuestions : getQuestionsForLevel(level));
    } else {
      setQuestions(getQuestionsForLevel(level));
    }
    setCurrentQuestionIndex(0);
    setAnswers([]);
  }, [level, selectedTopics]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingStartTime(Date.now());
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    const duration = recordingStartTime
      ? Math.floor((Date.now() - recordingStartTime) / 1000)
      : 0;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64 = base64String.split(",")[1] || base64String;

      const answer: Answer = {
        questionId: currentQuestion.id,
        audioData: base64,
        audioMimeType: audioBlob.type,
        duration,
        timestamp: Date.now(),
      };

      setAnswers((prev) => {
        const filtered = prev.filter((a) => a.questionId !== answer.questionId);
        return [...filtered, answer];
      });
    };
    reader.readAsDataURL(audioBlob);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowSampleAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowSampleAnswer(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-gray-600">질문을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">연습 모드</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">시간 제한 없이 자유롭게 연습하세요</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] flex items-center"
          >
            ← Home
          </button>
        </div>

        {/* 주제 선택 */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">주제 선택</h2>
          <TopicSelector
            selectedTopics={selectedTopics}
            onTopicsChange={setSelectedTopics}
            multiSelect={true}
          />
        </div>

        {/* 진행 표시 */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* 질문 카드 */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        {/* 녹음 섹션 */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">답변 녹음</h3>
            <AudioRecorder
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onRecordingComplete={handleRecordingComplete}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => setIsRecording(!isRecording)}
              disabled={!isRecording && recordingStartTime !== null}
              className={`flex-1 py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px] ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-400"
              }`}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            <button
              onClick={() => setShowSampleAnswer(!showSampleAnswer)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px]"
            >
              {showSampleAnswer ? "Hide" : "Show"} Sample Answer
            </button>
          </div>
        </div>

        {/* 모범 답안 */}
        {showSampleAnswer && (
          <SampleAnswerPlayer
            audioPath={currentQuestion.audioPath}
            sampleAnswer={currentQuestion.sampleAnswer}
          />
        )}

        {/* 비교 뷰 */}
        {currentAnswer && (
          <ComparisonView
            question={currentQuestion}
            userAnswer={currentAnswer}
            showAudio={true}
          />
        )}

        {/* 유용한 표현 */}
        {currentQuestion.usefulExpressions && currentQuestion.usefulExpressions.length > 0 && (
          <UsefulExpressions expressions={currentQuestion.usefulExpressions} />
        )}

        {/* 네비게이션 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px]"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-gray-600">질문을 불러오는 중...</p>
        </div>
      </div>
    }>
      <PracticePageContent />
    </Suspense>
  );
}

