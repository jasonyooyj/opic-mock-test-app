# OPIc 모의고사 앱

OPIc (Oral Proficiency Interview - computer) IH/AL 레벨 모의고사 앱입니다. 실제 시험과 유사한 환경에서 연습하고, AI 기반 자동 평가를 받을 수 있습니다.

## 주요 기능

- **실제 시험 모드**: OPIc IH/AL 레벨 질문 세트로 실전 연습
- **음성 녹음**: Web Audio API를 사용한 고품질 음성 녹음
- **AI 평가**: GPT-4를 활용한 자동 평가 및 상세 피드백
- **시험 기록**: LocalStorage를 통한 시험 결과 저장
- **복습 모드**: 이전 답변 재생 및 평가 결과 재확인
- **통계 대시보드**: 시험 히스토리 및 통계 확인

## 기술 스택

- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **AI API**: OpenAI GPT-4
- **스타일링**: Tailwind CSS
- **상태 관리**: React Hooks

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

#### OpenAI API 키 발급받기

1. [OpenAI Platform](https://platform.openai.com/)에 접속
2. 계정이 없다면 회원가입 (이메일 또는 Google/Microsoft 계정으로 가입 가능)
3. 로그인 후 왼쪽 메뉴에서 **"API keys"** 클릭
4. **"+ Create new secret key"** 버튼 클릭
5. 키 이름을 입력하고 **"Create secret key"** 클릭
6. **API 키가 표시됩니다** - 이 키는 한 번만 표시되므로 복사해두세요!
   - 형식: `sk-...` (약 51자)
   - ⚠️ **주의**: 이 키를 안전하게 보관하세요. 다른 사람과 공유하지 마세요.

#### .env.local 파일 생성

프로젝트 루트 디렉토리(`package.json`이 있는 폴더)에 `.env.local` 파일을 생성하세요:

**Windows:**
1. 프로젝트 폴더에서 마우스 우클릭 → "새로 만들기" → "텍스트 문서"
2. 파일 이름을 `.env.local`로 변경 (확장자 포함)
3. 파일을 열고 다음 내용을 추가:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```
4. `sk-your-api-key-here` 부분을 위에서 복사한 실제 API 키로 교체
5. 저장

**Mac/Linux:**
```bash
# 터미널에서 프로젝트 루트로 이동 후
echo "OPENAI_API_KEY=sk-your-api-key-here" > .env.local
# 실제 API 키로 교체하세요
```

**VS Code 사용 시:**
1. VS Code에서 프로젝트 열기
2. 왼쪽 파일 탐색기에서 프로젝트 루트 클릭
3. 새 파일 아이콘 클릭 → `.env.local` 입력
4. 다음 내용 추가:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```
5. 실제 API 키로 교체 후 저장

**예시:**
```
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

⚠️ **중요:**
- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다
- API 키는 절대 공개 저장소에 업로드하지 마세요
- API 키가 유출되면 [OpenAI Platform](https://platform.openai.com/api-keys)에서 즉시 삭제하세요

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── evaluate/      # 평가 API
│   │   ├── opic/          # 질문 데이터 API
│   │   └── realtime/      # Realtime API 프록시
│   ├── test/              # 테스트 페이지
│   ├── history/           # 시험 기록 페이지
│   └── review/            # 복습 페이지
├── components/            # React 컴포넌트
│   ├── TestInterface.tsx  # 테스트 인터페이스
│   ├── AudioRecorder.tsx  # 음성 녹음 컴포넌트
│   ├── Timer.tsx          # 타이머 컴포넌트
│   ├── QuestionCard.tsx   # 질문 카드
│   ├── FeedbackCard.tsx   # 피드백 카드
│   └── HistoryList.tsx    # 기록 목록
├── lib/                   # 유틸리티 함수
│   ├── opic-questions.ts  # OPIc 질문 데이터
│   ├── storage.ts         # LocalStorage 관리
│   ├── evaluation.ts      # 평가 로직
│   └── realtime-api.ts    # Realtime API 클라이언트
└── types/                 # TypeScript 타입 정의
```

## 사용 방법

1. **테스트 시작**: 홈페이지에서 "테스트 시작" 버튼을 클릭하고 레벨(IH 또는 AL)을 선택하세요.

2. **답변 녹음**: 각 질문에 대해 "Start Recording" 버튼을 눌러 답변을 녹음하세요.

3. **평가 확인**: 모든 질문에 답변한 후 자동 평가 결과를 확인하세요.

4. **복습**: 시험 기록 페이지에서 이전 테스트를 선택하여 복습할 수 있습니다.

## 평가 기준

- **유창성 (Fluency)**: 말의 흐름과 속도
- **정확성 (Accuracy)**: 내용의 정확성
- **어휘력 (Vocabulary)**: 어휘 사용의 다양성과 적절성
- **문법 (Grammar)**: 문법 구조의 정확성
- **발음 (Pronunciation)**: 발음의 명확성

각 항목은 0-5점 척도로 평가됩니다.

## 주의사항

- OpenAI API 키가 필요합니다. [OpenAI](https://platform.openai.com/)에서 발급받을 수 있습니다.
- 음성 녹음은 브라우저의 마이크 접근 권한이 필요합니다.
- 시험 기록은 브라우저의 LocalStorage에 저장되므로, 브라우저 데이터를 삭제하면 기록이 사라집니다.

## 라이선스

MIT

