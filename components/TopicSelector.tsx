"use client";

import { useState } from "react";
import { getAllTopics, getTopicsByCategory, TopicCategory } from "@/lib/topic-categories";

interface TopicSelectorProps {
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
  multiSelect?: boolean;
  showCategories?: boolean;
}

export default function TopicSelector({
  selectedTopics,
  onTopicsChange,
  multiSelect = true,
  showCategories = true,
}: TopicSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "main" | "surprise" | "roleplay" | "summary">("all");
  const allTopics = getAllTopics();

  const getDisplayTopics = (): TopicCategory[] => {
    if (activeCategory === "all") return allTopics;
    return getTopicsByCategory(activeCategory);
  };

  const toggleTopic = (topicId: string) => {
    if (multiSelect) {
      if (selectedTopics.includes(topicId)) {
        onTopicsChange(selectedTopics.filter((id) => id !== topicId));
      } else {
        onTopicsChange([...selectedTopics, topicId]);
      }
    } else {
      onTopicsChange([topicId]);
    }
  };

  const selectAll = () => {
    const displayTopics = getDisplayTopics();
    onTopicsChange(displayTopics.map((t) => t.id));
  };

  const clearAll = () => {
    onTopicsChange([]);
  };

  return (
    <div className="space-y-4">
      {showCategories && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px] ${
              activeCategory === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setActiveCategory("main")}
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px] ${
              activeCategory === "main"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            주요 주제
          </button>
          <button
            onClick={() => setActiveCategory("surprise")}
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px] ${
              activeCategory === "surprise"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            돌발 주제
          </button>
          <button
            onClick={() => setActiveCategory("roleplay")}
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px] ${
              activeCategory === "roleplay"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            롤플레이
          </button>
          <button
            onClick={() => setActiveCategory("summary")}
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px] ${
              activeCategory === "summary"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            정리
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {selectedTopics.length}개 주제 선택됨
        </div>
        {multiSelect && (
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              모두 선택
            </button>
            <button
              onClick={clearAll}
              className="text-sm text-gray-600 hover:text-gray-700 font-semibold"
            >
              모두 해제
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-96 overflow-y-auto">
        {getDisplayTopics().map((topic) => {
          const isSelected = selectedTopics.includes(topic.id);
          return (
            <button
              key={topic.id}
              onClick={() => toggleTopic(topic.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                  : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold mb-1">{topic.nameKo}</div>
                  <div className="text-xs text-gray-500">{topic.name}</div>
                </div>
                {isSelected && (
                  <span className="text-indigo-600 ml-2">✓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}



