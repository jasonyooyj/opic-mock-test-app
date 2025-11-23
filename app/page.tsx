import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            OPIc 모의고사
          </h1>
          <p className="text-xl text-gray-600">
            IH/AL 레벨 실전 연습
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <p className="text-gray-700 leading-relaxed">
            실제 OPIc 시험과 유사한 환경에서 연습하고, 
            AI 기반 자동 평가를 통해 실력을 향상시키세요.
          </p>

          {/* Onboarding Banner */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">처음이신가요? 🎓</h3>
                <p className="text-indigo-100">
                  OPIc 시험 구조와 보는 방법을 자세히 알아보세요
                </p>
              </div>
              <Link
                href="/onboarding"
                className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                시험 가이드 보기 →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Link
              href="/test?level=IH"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-center"
            >
              테스트 시작
            </Link>
            <Link
              href="/practice"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-center"
            >
              연습 모드
            </Link>
            <Link
              href="/history"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-center"
            >
              시험 기록
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">주요 기능</h2>
          <ul className="text-left space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>실제 시험과 유사한 인터페이스</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>AI 기반 자동 평가 및 피드백</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>시험 기록 저장 및 복습</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>실시간 음성 인터뷰</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>HACKERS 자료 기반 주제별 학습</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>모범 답안 듣기 및 비교 기능</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>유용한 표현 학습 카드</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

