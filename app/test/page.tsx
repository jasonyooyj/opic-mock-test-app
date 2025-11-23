"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Question, Answer, TestResult, Feedback } from "@/types";
import { getQuestionsForLevel } from "@/lib/opic-questions";
import { saveTestResult } from "@/lib/storage";
import TestInterface from "@/components/TestInterface";
import FeedbackCard from "@/components/FeedbackCard";

function TestPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = (searchParams.get("level") as "IH" | "AL") || "IH";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [testId, setTestId] = useState<string>("");
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  useEffect(() => {
    const questionsForLevel = getQuestionsForLevel(level);
    setQuestions(questionsForLevel);
    setTestId(`test_${Date.now()}`);
  }, [level]);

  const handleAnswer = (answer: Answer) => {
    setAnswers((prev) => {
      // Replace existing answer for this question if it exists
      const filtered = prev.filter((a) => a.questionId !== answer.questionId);
      return [...filtered, answer];
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleComplete = async () => {
    setIsEvaluating(true);
    setEvaluationError(null);
    
    try {
      // Validate that we have answers before evaluating
      if (!answers || answers.length === 0) {
        throw new Error("답변이 없습니다. 먼저 질문에 답변해주세요.");
      }
      
      // Evaluate answers
      const evaluationResponse = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions,
          answers,
          level,
        }),
      });

      if (!evaluationResponse.ok) {
        let errorData;
        try {
          errorData = await evaluationResponse.json();
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          errorData = { 
            message: `HTTP ${evaluationResponse.status}: ${evaluationResponse.statusText}` 
          };
        }
        const errorMsg = errorData.message || errorData.error || `평가 중 오류가 발생했습니다 (HTTP ${evaluationResponse.status})`;
        const errorDetails = errorData.details ? `\n\n상세 정보: ${JSON.stringify(errorData.details, null, 2)}` : '';
        console.error("=== Evaluation API Error ===", {
          status: evaluationResponse.status,
          statusText: evaluationResponse.statusText,
          errorData,
          fullResponse: errorData,
        });
        throw new Error(errorMsg + errorDetails);
      }

      const feedbackData: Feedback = await evaluationResponse.json();
      setFeedback(feedbackData);

      // Save test result
      const testResult: TestResult = {
        id: testId,
        testDate: Date.now(),
        level,
        questions,
        answers,
        feedback: feedbackData,
        completed: true,
      };

      await saveTestResult(testResult);
      setIsTestComplete(true);
    } catch (error) {
      console.error("Error evaluating test:", error);
      let errorMessage = "평가 중 오류가 발생했습니다.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = (error as any).message || JSON.stringify(error);
      }
      
      setEvaluationError(errorMessage);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (isEvaluating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-xl text-gray-700">Evaluating your answers...</p>
          <p className="text-gray-500">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (evaluationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">평가 중 오류가 발생했습니다</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <p className="text-red-800 text-sm font-medium">{evaluationError}</p>
            </div>
            {evaluationError.includes("API 키") || evaluationError.includes("API key") ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-blue-800 text-sm font-semibold mb-2">API 키 설정 방법:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-700 text-sm">
                  <li>프로젝트 루트 디렉토리에 <code className="bg-blue-100 px-1 rounded">.env.local</code> 파일을 생성하세요</li>
                  <li>다음 내용을 추가하세요: <code className="bg-blue-100 px-1 rounded">OPENAI_API_KEY=your_api_key_here</code></li>
                  <li>개발 서버를 재시작하세요</li>
                </ol>
              </div>
            ) : (
              <div className="text-sm text-gray-500 space-y-2">
                <p><strong>가능한 해결 방법:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                  <li>인터넷 연결을 확인해주세요</li>
                  <li>잠시 후 다시 시도해주세요</li>
                  <li>API 키가 올바르게 설정되어 있는지 확인해주세요</li>
                  <li>브라우저 개발자 도구(F12)의 콘솔 탭에서 자세한 오류 정보를 확인할 수 있습니다</li>
                </ul>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setEvaluationError(null);
                handleComplete();
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              다시 시도
            </button>
            <button
              onClick={() => {
                setEvaluationError(null);
                router.push("/");
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isTestComplete && feedback) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h1>
            <p className="text-gray-600">Your results are ready</p>
          </div>

          <FeedbackCard feedback={feedback} />

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/history")}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              View History
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back to Home
        </button>
        <span className="text-sm text-gray-500">Level: {level}</span>
      </div>

      <TestInterface
        questions={questions}
        onAnswer={handleAnswer}
        onComplete={handleComplete}
        currentQuestionIndex={currentQuestionIndex}
        onNextQuestion={handleNextQuestion}
      />
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    }>
      <TestPageContent />
    </Suspense>
  );
}

