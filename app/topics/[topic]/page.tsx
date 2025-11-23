"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Question } from "@/types";
import { getQuestionsByTopic, getQuestionsForLevel } from "@/lib/opic-questions";
import { getTopicById, getAllTopics } from "@/lib/topic-categories";
import QuestionCard from "@/components/QuestionCard";
import SampleAnswerPlayer from "@/components/SampleAnswerPlayer";
import UsefulExpressions from "@/components/UsefulExpressions";
import Link from "next/link";

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topic as string;
  const [level, setLevel] = useState<"IH" | "AL">("IH");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const topic = getTopicById(topicId);

  useEffect(() => {
    if (topicId) {
      const topicQuestions = getQuestionsByTopic(level, topicId);
      if (topicQuestions.length > 0) {
        setQuestions(topicQuestions);
      } else {
        // 주제에 질문이 없으면 전체 질문 표시
        setQuestions(getQuestionsForLevel(level));
      }
      setCurrentQuestionIndex(0);
    }
  }, [topicId, level]);

  const currentQuestion = questions[currentQuestionIndex];

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center space-y-4">
          <p className="text-sm sm:text-base text-gray-600">주제를 찾을 수 없습니다.</p>
          <Link
            href="/practice"
            className="text-sm sm:text-base text-indigo-600 hover:text-indigo-700 font-semibold min-h-[44px] flex items-center justify-center"
          >
            연습 모드로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{topic.nameKo}</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">{topic.name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLevel("IH")}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px] ${
                  level === "IH"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                IH
              </button>
              <button
                onClick={() => setLevel("AL")}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px] ${
                  level === "AL"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                AL
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/practice"
              className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] flex items-center"
            >
              ← 연습 모드
            </Link>
            <Link
              href={`/practice?topic=${topicId}`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
            >
              이 주제로 연습하기
            </Link>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-12 text-center">
            <p className="text-gray-500 text-base sm:text-lg">
              이 주제에 대한 질문이 아직 없습니다.
            </p>
            <Link
              href="/practice"
              className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
            >
              다른 주제 보기
            </Link>
          </div>
        ) : (
          <>
            {/* Progress */}
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

            {/* Question Card */}
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
            />

            {/* Sample Answer */}
            <SampleAnswerPlayer
              audioPath={currentQuestion.audioPath}
              sampleAnswer={currentQuestion.sampleAnswer}
            />

            {/* Useful Expressions */}
            {currentQuestion.usefulExpressions &&
              currentQuestion.usefulExpressions.length > 0 && (
                <UsefulExpressions expressions={currentQuestion.usefulExpressions} />
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
                    Math.min(questions.length - 1, prev + 1)
                  )
                }
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px]"
              >
                Next
              </button>
            </div>

            {/* Question List */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                모든 질문 ({questions.length}개)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`text-left p-3 rounded-lg transition-colors ${
                      index === currentQuestionIndex
                        ? "bg-indigo-100 text-indigo-700 font-semibold"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="text-sm">
                      Q{index + 1}: {question.type}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}



