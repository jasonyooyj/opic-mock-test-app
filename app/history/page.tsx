"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TestResult } from "@/types";
import { getAllTestResults, deleteTestResult } from "@/lib/storage";
import HistoryList from "@/components/HistoryList";
import { calculateLearningProgress, LearningProgress } from "@/lib/progress-tracker";
import { getAllTopics } from "@/lib/topic-categories";

export default function HistoryPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    ihTests: 0,
    alTests: 0,
  });
  const [ihProgress, setIhProgress] = useState<LearningProgress | null>(null);
  const [alProgress, setAlProgress] = useState<LearningProgress | null>(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    const allResults = getAllTestResults();
    const sortedResults = allResults.sort(
      (a, b) => b.testDate - a.testDate
    );
    setResults(sortedResults);

    // Calculate statistics
    const completedResults = sortedResults.filter((r) => r.completed && r.feedback);
    const totalTests = completedResults.length;
    const averageScore =
      totalTests > 0
        ? completedResults.reduce(
            (sum, r) => sum + (r.feedback?.overallScore || 0),
            0
          ) / totalTests
        : 0;
    const ihTests = sortedResults.filter((r) => r.level === "IH").length;
    const alTests = sortedResults.filter((r) => r.level === "AL").length;

    setStats({
      totalTests: sortedResults.length,
      averageScore,
      ihTests,
      alTests,
    });

    // 학습 진행도 계산
    setIhProgress(calculateLearningProgress("IH"));
    setAlProgress(calculateLearningProgress("AL"));
  };

  const handleDelete = (id: string) => {
    if (confirm("정말 이 시험 기록을 삭제하시겠습니까?")) {
      deleteTestResult(id);
      loadResults();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test History</h1>
            <p className="text-gray-600 mt-1">View and review your past test results</p>
          </div>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-gray-500 text-sm mb-1">Total Tests</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalTests}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-gray-500 text-sm mb-1">Average Score</div>
            <div className="text-3xl font-bold text-indigo-600">
              {stats.averageScore > 0 ? stats.averageScore.toFixed(1) : "N/A"}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-gray-500 text-sm mb-1">IH Tests</div>
            <div className="text-3xl font-bold text-blue-600">{stats.ihTests}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-gray-500 text-sm mb-1">AL Tests</div>
            <div className="text-3xl font-bold text-purple-600">{stats.alTests}</div>
          </div>
        </div>

        {/* Test Results List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Tests</h2>
          <HistoryList results={results} onDelete={handleDelete} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Link
              href="/test?level=IH"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Start IH Test
            </Link>
            <Link
              href="/test?level=AL"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Start AL Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

