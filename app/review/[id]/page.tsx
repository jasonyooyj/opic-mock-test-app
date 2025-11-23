"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TestResult } from "@/types";
import { getTestResultById } from "@/lib/storage";
import QuestionCard from "@/components/QuestionCard";
import FeedbackCard from "@/components/FeedbackCard";
import ComparisonView from "@/components/ComparisonView";
import SampleAnswerPlayer from "@/components/SampleAnswerPlayer";
import { format } from "date-fns";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const result = getTestResultById(testId);
    if (!result) {
      router.push("/history");
      return;
    }
    setTestResult(result);
  }, [testId, router]);

  useEffect(() => {
    if (testResult) {
      const currentAnswer = testResult.answers.find(
        (a) => a.questionId === testResult.questions[currentQuestionIndex]?.id
      );
      if (currentAnswer?.audioData && currentAnswer.audioMimeType) {
        // Convert base64 to blob
        const byteCharacters = atob(currentAnswer.audioData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: currentAnswer.audioMimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setAudioUrl(null);
      }
    }
  }, [testResult, currentQuestionIndex]);

  if (!testResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading review...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = testResult.questions[currentQuestionIndex];
  const currentAnswer = testResult.answers.find(
    (a) => a.questionId === currentQuestion.id
  );

  const handlePlayAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
    }
  };

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Test Review</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {formatDate(testResult.testDate)} • Level: {testResult.level}
              </p>
            </div>
            <button
              onClick={() => router.push("/history")}
              className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] flex items-center"
            >
              ← Back to History
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Progress Indicator */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {testResult.questions.length}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(
                    ((currentQuestionIndex + 1) / testResult.questions.length) * 100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / testResult.questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={testResult.questions.length}
            />

            {/* Comparison View */}
            {currentAnswer ? (
              <ComparisonView
                question={currentQuestion}
                userAnswer={currentAnswer}
                showAudio={true}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Your Answer</h3>
                <p className="text-gray-500 italic">No answer provided for this question.</p>
                {(currentQuestion.sampleAnswer || currentQuestion.audioPath) && (
                  <div className="pt-4 border-t">
                    <SampleAnswerPlayer
                      audioPath={currentQuestion.audioPath}
                      sampleAnswer={currentQuestion.sampleAnswer}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px]"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(testResult.questions.length - 1, prev + 1)
                  )
                }
                disabled={currentQuestionIndex === testResult.questions.length - 1}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px]"
              >
                Next
              </button>
            </div>
          </div>

          {/* Sidebar - Feedback */}
          <div className="space-y-4 sm:space-y-6">
            {testResult.feedback && (
              <FeedbackCard feedback={testResult.feedback} />
            )}

            {/* Sample Answer */}
            {(currentQuestion.sampleAnswer || currentQuestion.audioPath) && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  모범 답안
                </h3>
                <SampleAnswerPlayer
                  audioPath={currentQuestion.audioPath}
                  sampleAnswer={currentQuestion.sampleAnswer}
                />
              </div>
            )}

            {/* Question List */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                All Questions
              </h3>
              <div className="space-y-2">
                {testResult.questions.map((question, index) => {
                  const hasAnswer = testResult.answers.some(
                    (a) => a.questionId === question.id
                  );
                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        index === currentQuestionIndex
                          ? "bg-indigo-100 text-indigo-700 font-semibold"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Q{index + 1}: {question.type}
                        </span>
                        {hasAnswer ? (
                          <span className="text-green-600 text-xs">✓</span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

