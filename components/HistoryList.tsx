"use client";

import { TestResult } from "@/types";
import Link from "next/link";

interface HistoryListProps {
  results: TestResult[];
  onDelete?: (id: string) => void;
}

export default function HistoryList({ results, onDelete }: HistoryListProps) {
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

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-12 text-center">
        <p className="text-gray-500 text-base sm:text-lg">No test results yet.</p>
        <Link
          href="/test?level=IH"
          className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
        >
          Start Your First Test
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <span className="bg-indigo-100 text-indigo-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  {result.level}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  {formatDate(result.testDate)}
                </span>
                {result.completed && (
                  <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    Completed
                  </span>
                )}
              </div>

              <div className="mt-2 sm:mt-3">
                <p className="text-sm sm:text-base text-gray-700 mb-2">
                  Questions answered: {result.answers.length} / {result.questions.length}
                </p>
                {result.feedback && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <span className="text-sm sm:text-base text-gray-600">Overall Score:</span>
                    <span
                      className={`text-xl sm:text-2xl font-bold ${getScoreColor(
                        result.feedback.overallScore
                      )}`}
                    >
                      {result.feedback.overallScore.toFixed(1)} / 5.0
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row gap-2 w-full sm:w-auto">
              <Link
                href={`/review/${result.id}`}
                className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] flex items-center justify-center"
              >
                Review
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(result.id)}
                  className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px]"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

