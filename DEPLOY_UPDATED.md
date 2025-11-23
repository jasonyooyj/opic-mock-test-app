# 배포 가이드 - 업데이트된 버전

## 🚀 빠른 배포 방법

### 방법 1: GitHub Desktop 사용 (가장 쉬움)

#### 1단계: GitHub Desktop 설치 (아직 없다면)
1. https://desktop.github.com/ 접속
2. "Download for Windows" 클릭 및 설치
3. GitHub 계정으로 로그인

#### 2단계: 저장소 추가 및 커밋
1. GitHub Desktop 실행
2. **File → Add Local Repository** 클릭
3. "Choose..." 버튼 클릭
4. 프로젝트 폴더 선택:
   ```
   C:\Users\basqu\iCloudDrive\Programs\251123 OPIc
   ```
5. "Add repository" 클릭

#### 3단계: 변경사항 커밋
1. 좌측 하단 "Summary"에 커밋 메시지 입력:
   ```
   Fix package.json and update dependencies
   ```
2. "Commit to main" 버튼 클릭

#### 4단계: GitHub에 푸시
- **이미 저장소가 연결되어 있다면:**
  - "Push origin" 버튼 클릭
  
- **새 저장소라면:**
  - "Publish repository" 클릭
  - 저장소 이름 입력 (예: `opic-mock-test-app`)
  - Public 또는 Private 선택
  - "Publish Repository" 클릭

#### 5단계: Vercel에서 자동 배포
- GitHub에 푸시하면 Vercel이 자동으로 재배포합니다
- Vercel 대시보드에서 배포 상태 확인:
  - https://vercel.com/dashboard

---

### 방법 2: Vercel CLI 사용

#### 1단계: Vercel CLI 설치/업데이트
```powershell
npm install -g vercel@latest
```

#### 2단계: 로그인
```powershell
vercel login
```
브라우저가 열리면 GitHub 계정으로 로그인

#### 3단계: 배포
```powershell
cd "C:\Users\basqu\iCloudDrive\Programs\251123 OPIc"
vercel --prod
```

---

### 방법 3: Vercel 대시보드에서 수동 재배포

1. https://vercel.com 접속 및 로그인
2. 프로젝트 선택
3. "Deployments" 탭 클릭
4. 최신 배포 옆 "..." 메뉴 클릭
5. "Redeploy" 선택
6. "Redeploy" 확인

---

## ✅ 배포 전 확인사항

### 환경 변수 확인
Vercel 대시보드에서 다음 환경 변수가 설정되어 있는지 확인:
- `OPENAI_API_KEY`: OpenAI API 키

**확인 방법:**
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. `OPENAI_API_KEY`가 Production, Preview, Development 모두에 설정되어 있는지 확인

### 로컬 빌드 테스트 (선택사항)
배포 전에 로컬에서 빌드가 성공하는지 확인:
```powershell
npm run build
```

---

## 🔧 문제 해결

### 빌드 실패 시
1. Vercel 대시보드 → Deployments → 최신 배포 클릭
2. "Build Logs" 탭에서 오류 확인
3. 로컬에서 `npm run build` 실행하여 동일한 오류 재현

### 환경 변수 오류
- Settings → Environment Variables에서 `OPENAI_API_KEY` 확인
- 변경 후 재배포 필요

### 자동 배포가 안 될 때
- GitHub 저장소 연결 상태 확인
- Settings → Git에서 연결 상태 확인

---

## 📝 참고사항

- **자동 배포**: GitHub에 푸시하면 Vercel이 자동으로 재배포합니다
- **환경 변수**: `.env.local` 파일은 Git에 포함되지 않습니다 (안전함)
- **배포 시간**: 일반적으로 2-3분 소요됩니다

