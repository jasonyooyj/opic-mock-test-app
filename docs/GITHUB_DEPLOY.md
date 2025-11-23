# GitHub + Vercel 배포 가이드

GitHub 계정이 Cursor에 연결되어 있으므로, 다음 단계로 쉽게 배포할 수 있습니다!

## 🚀 배포 단계

### 1단계: GitHub에 코드 업로드

#### 방법 A: Cursor의 Git 기능 사용 (권장)

1. **Cursor에서 Git 초기화**
   - Cursor 좌측 사이드바에서 "Source Control" 아이콘 클릭 (또는 `Ctrl+Shift+G`)
   - "Initialize Repository" 클릭 (아직 초기화되지 않았다면)

2. **변경사항 커밋**
   - 모든 파일이 스테이징 영역에 추가되었는지 확인
   - 커밋 메시지 입력: `"Initial commit - Ready for deployment"`
   - "Commit" 버튼 클릭

3. **GitHub에 푸시**
   - "Publish Branch" 또는 "Push" 버튼 클릭
   - 새 저장소 생성 옵션 선택
   - 저장소 이름 입력 (예: `opic-mock-test-app`)
   - Public 또는 Private 선택
   - "Publish" 클릭

#### 방법 B: GitHub Desktop 사용

1. **GitHub Desktop 설치** (아직 없다면)
   - https://desktop.github.com/ 에서 다운로드

2. **저장소 추가**
   - File → Add Local Repository
   - 프로젝트 폴더 선택: `C:\Users\basqu\iCloudDrive\Programs\251123 OPIc`

3. **GitHub에 푸시**
   - "Publish repository" 클릭
   - 저장소 이름 입력
   - "Publish" 클릭

### 2단계: Vercel에 프로젝트 연결

1. **Vercel 접속**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인 (GitHub 계정 사용)

2. **프로젝트 추가**
   - "Add New Project" 또는 "New Project" 클릭
   - 방금 푸시한 GitHub 저장소 선택
   - "Import" 클릭

3. **프로젝트 설정 확인**
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값 유지)
   - **Build Command**: `npm run build` (기본값 유지)
   - **Output Directory**: `.next` (기본값 유지)
   - **Install Command**: `npm install` (기본값 유지)

4. **환경 변수 설정** (중요!)
   - "Environment Variables" 섹션으로 스크롤
   - "Add" 클릭
   - Name: `OPENAI_API_KEY`
   - Value: 실제 OpenAI API 키 입력
   - Environment: Production, Preview, Development 모두 선택
   - "Save" 클릭

5. **배포 시작**
   - "Deploy" 버튼 클릭
   - 배포가 자동으로 시작됩니다 (약 2-3분 소요)

### 3단계: 배포 확인

1. **배포 완료 대기**
   - Vercel 대시보드에서 배포 진행 상황 확인
   - "Building..." → "Ready" 상태로 변경될 때까지 대기

2. **사이트 접속**
   - 배포 완료 후 제공되는 URL로 접속
   - 예: `https://your-project-name.vercel.app`

3. **기능 테스트**
   - 홈페이지 로드 확인
   - 테스트 시작 기능 확인
   - API 엔드포인트 동작 확인

## ✅ 배포 완료 후

### 자동 배포 설정
- GitHub에 코드를 푸시하면 자동으로 재배포됩니다
- Pull Request를 생성하면 Preview 배포가 자동 생성됩니다

### 환경 변수 관리
- Settings → Environment Variables에서 언제든지 수정 가능
- 변경 후 재배포 필요

### 도메인 설정 (선택사항)
- Settings → Domains에서 커스텀 도메인 추가 가능

## 🔧 문제 해결

### 빌드 실패 시
1. Vercel 대시보드 → Deployments → 최신 배포 클릭
2. "Build Logs" 탭에서 오류 확인
3. 로컬에서 `npm run build` 실행하여 동일한 오류 재현 확인

### API 오류 시
1. 환경 변수 `OPENAI_API_KEY`가 올바르게 설정되었는지 확인
2. Settings → Environment Variables 확인
3. Functions 탭에서 API 로그 확인

### 자동 배포가 안 될 때
1. Settings → Git 확인
2. GitHub 저장소 연결 상태 확인
3. 필요시 "Disconnect" 후 다시 연결

## 📝 참고사항

- **환경 변수는 반드시 설정해야 합니다!** `OPENAI_API_KEY` 없이는 평가 기능이 작동하지 않습니다.
- 첫 배포는 약 2-3분 소요됩니다.
- 이후 코드 변경 시 GitHub에 푸시하면 자동으로 재배포됩니다.


