"use client";

import { useState } from "react";
import { Question, Answer } from "@/types";
import SampleAnswerPlayer from "./SampleAnswerPlayer";

interface ComparisonViewProps {
  question: Question;
  userAnswer: Answer;
  showAudio?: boolean;
}

export default function ComparisonView({
  question,
  userAnswer,
  showAudio = true,
}: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState<"user" | "sample" | "side-by-side">("side-by-side");

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">답변 비교</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("user")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "user"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            내 답변
          </button>
          <button
            onClick={() => setActiveTab("sample")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "sample"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            모범 답안
          </button>
          <button
            onClick={() => setActiveTab("side-by-side")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "side-by-side"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            나란히 비교
          </button>
        </div>
      </div>

      {activeTab === "user" && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">내 답변</h4>
          {showAudio && userAnswer.audioData && (
            <div className="bg-blue-50 rounded-lg p-4">
              <audio
                controls
                className="w-full"
                src={
                  userAnswer.audioData
                    ? `data:${userAnswer.audioMimeType || "audio/webm"};base64,${userAnswer.audioData}`
                    : undefined
                }
              />
            </div>
          )}
          {userAnswer.transcript && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {userAnswer.transcript}
              </p>
            </div>
          )}
          {!userAnswer.transcript && !userAnswer.audioData && (
            <p className="text-gray-500 italic">답변이 없습니다.</p>
          )}
          <div className="text-sm text-gray-500">
            답변 시간: {userAnswer.duration}초
          </div>
        </div>
      )}

      {activeTab === "sample" && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">모범 답안</h4>
          {question.audioPath || question.sampleAnswer ? (
            <SampleAnswerPlayer
              audioPath={question.audioPath}
              sampleAnswer={question.sampleAnswer}
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 italic">모범 답안이 제공되지 않았습니다.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "side-by-side" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">내 답변</h4>
            {showAudio && userAnswer.audioData && (
              <div className="bg-blue-50 rounded-lg p-4">
                <audio
                  controls
                  className="w-full"
                  src={
                    userAnswer.audioData
                      ? `data:${userAnswer.audioMimeType || "audio/webm"};base64,${userAnswer.audioData}`
                      : undefined
                  }
                />
              </div>
            )}
            {userAnswer.transcript && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {userAnswer.transcript}
                </p>
              </div>
            )}
            {!userAnswer.transcript && !userAnswer.audioData && (
              <p className="text-gray-500 italic text-sm">답변이 없습니다.</p>
            )}
            <div className="text-xs text-gray-500">
              답변 시간: {userAnswer.duration}초
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">모범 답안</h4>
            {question.audioPath || question.sampleAnswer ? (
              <SampleAnswerPlayer
                audioPath={question.audioPath}
                sampleAnswer={question.sampleAnswer}
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 italic text-sm">모범 답안이 제공되지 않았습니다.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {question.usefulExpressions && question.usefulExpressions.length > 0 && (
        <div className="pt-4 border-t">
          <h4 className="font-semibold text-gray-900 mb-2">유용한 표현</h4>
          <div className="flex flex-wrap gap-2">
            {question.usefulExpressions.map((expression, index) => (
              <span
                key={index}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
              >
                {expression}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

