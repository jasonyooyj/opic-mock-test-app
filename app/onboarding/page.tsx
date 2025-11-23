"use client";

import { useState } from "react";
import Link from "next/link";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const sections = [
    {
      title: "OPIc란?",
      icon: "🎤",
      content: (
        <div className="space-y-4">
          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            <strong>OPIc (Oral Proficiency Interview - computer)</strong>는 컴퓨터를 통해 진행되는 영어 말하기 시험으로, 
            수험자의 실제 회화 능력을 평가하는 시험입니다.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-800">
              <strong>핵심 특징:</strong> 실제 회화 상황에서의 영어 능력을 측정하며, 
              개인 맞춤형 질문을 통해 자연스러운 대화 능력을 평가합니다.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "시험 구조",
      icon: "📋",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">1. 배경 설문 작성</h3>
            <p className="text-gray-700 leading-relaxed">
              시험 시작 전, 자신의 <strong>관심사, 직업, 취미, 생활 패턴</strong> 등을 묻는 설문지를 작성합니다.
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-indigo-900 text-sm">
                💡 <strong>팁:</strong> 설문지에서 선택한 주제에 따라 개인 맞춤형 질문이 생성되므로, 
                자신이 잘 알고 있는 주제를 선택하는 것이 유리합니다.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">2. 난이도 선택</h3>
            <p className="text-gray-700 leading-relaxed">
              설문 작성 후, 원하는 난이도를 선택합니다. 선택한 난이도에 따라 질문의 복잡성과 심층성이 결정됩니다.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="font-semibold text-sm sm:text-base text-green-800">IH (Intermediate High)</p>
                <p className="text-xs sm:text-sm text-green-700">중상급 레벨</p>
              </div>
              <div className="bg-purple-50 p-3 rounded border border-purple-200">
                <p className="font-semibold text-sm sm:text-base text-purple-800">AL (Advanced Low)</p>
                <p className="text-xs sm:text-sm text-purple-700">고급 레벨</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">3. 시험 진행</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>컴퓨터 화면에 나타나는 <strong>가상 인터뷰어(아바타)</strong>가 질문을 제시합니다</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>마이크를 통해 답변을 <strong>녹음</strong>합니다</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>전체 시험은 약 <strong>40-60분</strong> 동안 진행됩니다</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>총 <strong>12-15개의 질문</strong>이 주어집니다</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "질문 유형",
      icon: "❓",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            OPIc 시험은 다양한 유형의 질문으로 구성되어 있습니다:
          </p>
          <div className="space-y-3">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">1. 자기소개 및 배경 질문</h4>
              <p className="text-sm text-gray-600">이름, 직업, 거주지, 가족 등 기본 정보</p>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">2. 일상생활 질문</h4>
              <p className="text-sm text-gray-600">취미, 관심사, 일상 루틴, 주말 활동 등</p>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">3. 의견 및 선호도 질문</h4>
              <p className="text-sm text-gray-600">좋아하는 것, 싫어하는 것, 선호하는 이유 등</p>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">4. 경험 및 과거 질문</h4>
              <p className="text-sm text-gray-600">과거 경험, 여행, 특별한 기억 등</p>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">5. 롤플레이 (Role Play)</h4>
              <p className="text-sm text-gray-600">상황별 대화, 질문하기, 문제 해결하기</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "응답 시간",
      icon: "⏱️",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-2 border-indigo-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">시험 진행 시간 구조</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white p-3 rounded">
                <span className="font-medium text-gray-700">준비 시간 (Preparation Time)</span>
                <span className="font-bold text-indigo-600">20초</span>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded">
                <span className="font-medium text-gray-700">답변 시간 (Speaking Time)</span>
                <span className="font-bold text-indigo-600">최대 2분</span>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-yellow-800 text-sm">
              <strong>⏰ 시간 관리 팁:</strong> 준비 시간 동안 질문을 잘 읽고 답변 구조를 생각해보세요. 
              답변 시간은 충분히 활용하되, 너무 짧거나 길지 않게 적절히 분배하세요.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "등급 체계 (ACTFL)",
      icon: "🏆",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            OPIc는 <strong>ACTFL (American Council on the Teaching of Foreign Languages)</strong>의 
            등급 체계를 따릅니다.
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg border border-green-300">
              <h4 className="font-bold text-green-900 mb-2">Novice (초급)</h4>
              <p className="text-sm text-green-800">Novice Low, Mid, High</p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg border border-blue-300">
              <h4 className="font-bold text-blue-900 mb-2">Intermediate (중급)</h4>
              <p className="text-sm text-blue-800">Intermediate Low, Mid, High (IH)</p>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-4 rounded-lg border border-purple-300">
              <h4 className="font-bold text-purple-900 mb-2">Advanced (고급)</h4>
              <p className="text-sm text-purple-800">Advanced Low (AL), Mid, High</p>
            </div>
            <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-4 rounded-lg border border-orange-300">
              <h4 className="font-bold text-orange-900 mb-2">Superior (최고급)</h4>
              <p className="text-sm text-orange-800">Superior</p>
            </div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg mt-4">
            <p className="text-indigo-900 text-sm">
              <strong>평가 기준:</strong> 유창성(Fluency), 정확성(Accuracy), 복잡성(Complexity), 
              적절성(Appropriateness) 등을 종합적으로 평가합니다.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "시험 보는 방법",
      icon: "📝",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-2 border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">마이크 권한 허용</h4>
                <p className="text-sm text-gray-600">브라우저에서 마이크 접근 권한을 허용해주세요.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-2 border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">질문 읽기 및 준비</h4>
                <p className="text-sm text-gray-600">20초 준비 시간 동안 질문을 읽고 답변을 구상하세요.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-2 border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">녹음 시작</h4>
                <p className="text-sm text-gray-600">"Start Recording" 버튼을 클릭하여 답변을 녹음하세요.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-2 border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">답변 완료</h4>
                <p className="text-sm text-gray-600">답변이 끝나면 "Stop Recording" 버튼을 눌러 녹음을 중지하세요.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-2 border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">다음 질문으로</h4>
                <p className="text-sm text-gray-600">"Next Question" 버튼을 눌러 다음 질문으로 진행하세요.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "시험 준비 팁",
      icon: "💡",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-gray-900 mb-2">1. 주제별 연습</h4>
              <p className="text-sm text-gray-700">
                설문지에서 선택할 주제에 대해 미리 답변을 준비하고 연습하세요. 
                일상생활, 취미, 직업 등 다양한 주제를 다룰 수 있도록 준비하세요.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-gray-900 mb-2">2. 자연스러운 표현</h4>
              <p className="text-sm text-gray-700">
                암기한 답변보다는 자연스럽게 자신의 생각을 표현하는 것이 중요합니다. 
                실제 대화하듯이 말하는 연습을 하세요.
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-semibold text-gray-900 mb-2">3. 시간 관리</h4>
              <p className="text-sm text-gray-700">
                각 질문에 대한 답변 시간을 염두에 두고 연습하세요. 
                너무 짧거나 길지 않게, 적절한 길이의 답변을 연습하세요.
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-semibold text-gray-900 mb-2">4. 발음 및 억양</h4>
              <p className="text-sm text-gray-700">
                명확한 발음과 적절한 억양으로 말하기 위해 꾸준히 연습하세요. 
                모범 답안을 듣고 따라 말하는 연습도 도움이 됩니다.
              </p>
            </div>
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border-l-4 border-teal-500">
              <h4 className="font-semibold text-gray-900 mb-2">5. 다양한 표현 사용</h4>
              <p className="text-sm text-gray-700">
                같은 표현을 반복하지 않고, 다양한 어휘와 문장 구조를 사용하세요. 
                유용한 표현 카드를 활용하여 표현력을 늘리세요.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-6 md:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm sm:text-base text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            OPIc 시험 가이드
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            처음 시험을 보시는 분들을 위한 완벽한 가이드
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {currentStep + 1} / {sections.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / sections.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
          <div className="flex items-center mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl md:text-4xl mr-3 sm:mr-4">{sections[currentStep].icon}</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {sections[currentStep].title}
            </h2>
          </div>
          <div className="text-sm sm:text-base text-gray-700">{sections[currentStep].content}</div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center ${
              currentStep === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            ← 이전
          </button>

          <div className="flex gap-2">
            {sections.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-indigo-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {currentStep < sections.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-4 sm:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
            >
              다음 →
            </button>
          ) : (
            <Link
              href="/test?level=IH"
              className="px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-center text-sm sm:text-base min-h-[44px] flex items-center justify-center"
            >
              테스트 시작하기 →
            </Link>
          )}
        </div>

        {/* Quick Start Button */}
        {currentStep === sections.length - 1 && (
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-2">준비되셨나요?</h3>
              <p className="mb-4 text-indigo-100">
                이제 실제 모의고사를 통해 실력을 확인해보세요!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/test?level=IH"
                  className="px-4 sm:px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
                >
                  IH 레벨 테스트
                </Link>
                <Link
                  href="/test?level=AL"
                  className="px-4 sm:px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
                >
                  AL 레벨 테스트
                </Link>
                <Link
                  href="/practice"
                  className="px-4 sm:px-6 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
                >
                  연습 모드
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



