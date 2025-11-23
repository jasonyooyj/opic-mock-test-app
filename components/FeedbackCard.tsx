"use client";

import { Feedback } from "@/types";

interface FeedbackCardProps {
  feedback: Feedback;
}

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Good";
    if (score >= 2.5) return "Fair";
    if (score >= 1.5) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Evaluation Results</h3>
        <div className="flex items-center gap-4">
          <span className={`text-4xl font-bold ${getScoreColor(feedback.overallScore)}`}>
            {feedback.overallScore.toFixed(1)}
          </span>
          <span className="text-xl text-gray-600">
            {getScoreLabel(feedback.overallScore)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Fluency</span>
            <span className={getScoreColor(feedback.criteria.fluency)}>
              {feedback.criteria.fluency.toFixed(1)}/5.0
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Accuracy</span>
            <span className={getScoreColor(feedback.criteria.accuracy)}>
              {feedback.criteria.accuracy.toFixed(1)}/5.0
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Vocabulary</span>
            <span className={getScoreColor(feedback.criteria.vocabulary)}>
              {feedback.criteria.vocabulary.toFixed(1)}/5.0
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Grammar</span>
            <span className={getScoreColor(feedback.criteria.grammar)}>
              {feedback.criteria.grammar.toFixed(1)}/5.0
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Pronunciation</span>
            <span className={getScoreColor(feedback.criteria.pronunciation)}>
              {feedback.criteria.pronunciation.toFixed(1)}/5.0
            </span>
          </div>
        </div>
      </div>

      {feedback.strengths.length > 0 && (
        <div>
          <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {feedback.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
      )}

      {feedback.weaknesses.length > 0 && (
        <div>
          <h4 className="font-semibold text-red-700 mb-2">Areas for Improvement</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {feedback.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </div>
      )}

      {feedback.suggestions.length > 0 && (
        <div>
          <h4 className="font-semibold text-indigo-700 mb-2">Suggestions</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {feedback.detailedFeedback && (
        <div className="pt-4 border-t">
          <h4 className="font-semibold text-gray-900 mb-2">Detailed Feedback</h4>
          <p className="text-gray-700 leading-relaxed">{feedback.detailedFeedback}</p>
        </div>
      )}
    </div>
  );
}


