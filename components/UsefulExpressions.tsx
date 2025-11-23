"use client";

import { useState } from "react";

interface UsefulExpressionsProps {
  expressions: string[];
  title?: string;
}

export default function UsefulExpressions({
  expressions,
  title = "유용한 표현",
}: UsefulExpressionsProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (!expressions || expressions.length === 0) {
    return null;
  }

  const displayExpressions = expanded ? expressions : expressions.slice(0, 6);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {expressions.length > 6 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
          >
            {expanded ? "접기" : `더 보기 (${expressions.length - 6}개)`}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {displayExpressions.map((expression, index) => (
          <div
            key={index}
            className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 hover:bg-indigo-100 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-indigo-900 font-medium flex-1">{expression}</p>
              <button
                onClick={() => handleCopy(expression, index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 hover:text-indigo-700"
                title="복사"
              >
                {copiedIndex === index ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {expressions.length > 6 && !expanded && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setExpanded(true)}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            + {expressions.length - 6}개 더 보기
          </button>
        </div>
      )}
    </div>
  );
}



