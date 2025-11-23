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
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No test results yet.</p>
        <Link
          href="/test?level=IH"
          className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Start Your First Test
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {result.level}
                </span>
                <span className="text-gray-500 text-sm">
                  {formatDate(result.testDate)}
                </span>
                {result.completed && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Completed
                  </span>
                )}
              </div>

              <div className="mt-3">
                <p className="text-gray-700 mb-2">
                  Questions answered: {result.answers.length} / {result.questions.length}
                </p>
                {result.feedback && (
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">Overall Score:</span>
                    <span
                      className={`text-2xl font-bold ${getScoreColor(
                        result.feedback.overallScore
                      )}`}
                    >
                      {result.feedback.overallScore.toFixed(1)} / 5.0
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <Link
                href={`/review/${result.id}`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Review
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(result.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
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

