"use client";

import { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      warmup: "Warm-up",
      roleplay: "Role-play",
      opinion: "Opinion",
      narration: "Narration",
      summary: "Summary",
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="bg-indigo-100 text-indigo-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
            {getQuestionTypeLabel(question.type)}
          </span>
          <span className="text-gray-500 text-xs sm:text-sm">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
          {question.level}
        </span>
      </div>

      <div className="pt-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
          {question.text}
        </h2>
        {question.description && (
          <p className="text-gray-600 text-base md:text-lg italic">
            {question.description}
          </p>
        )}
      </div>

      {question.timeLimit && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Time limit: {Math.floor(question.timeLimit / 60)}:
            {String(question.timeLimit % 60).padStart(2, "0")}
          </p>
        </div>
      )}
    </div>
  );
}



