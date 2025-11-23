# 빠른 배포 가이드

## ✅ 배포 준비 완료
- 빌드 오류 수정 완료
- 의존성 설치 완료
- Suspense 경계 추가 완료
- 빌드 테스트 성공

## 🚀 배포 방법

### 옵션 1: Vercel 대시보드 사용 (가장 쉬움)

1. **GitHub에 코드 업로드**
   - GitHub에 새 저장소 생성
   - 코드를 푸시 (Git이 설치되어 있지 않다면 GitHub Desktop 사용)

2. **Vercel에 연결**
   - https://vercel.com 접속 및 로그인
   - "Add New Project" 클릭
   - GitHub 저장소 선택
   - 자동으로 Next.js 감지됨

3. **환경 변수 설정**
   - 프로젝트 설정 → Environment Variables
   - `OPENAI_API_KEY` 추가 (값: 실제 OpenAI API 키)
   - Production, Preview, Development 모두 선택

4. **배포**
   - "Deploy" 클릭
   - 자동으로 배포 완료!

### 옵션 2: Vercel CLI 사용

**⚠️ 주의:** 사용자 이름에 한글이나 특수문자가 있으면 CLI 로그인에 문제가 발생할 수 있습니다.

터미널에서 다음 명령어 실행:

```powershell
# 1. Vercel CLI 업데이트 (이미 완료됨)
npm install -g vercel@latest

# 2. 로그인 시도 (브라우저가 열림)
vercel login

# 3. 로그인이 성공하면 프로덕션 배포
vercel --prod
```

**로그인 오류 발생 시:**
- Vercel 대시보드 방법(옵션 1)을 사용하는 것을 권장합니다
- 또는 Vercel 웹사이트에서 Access Token을 발급받아 사용:
  1. https://vercel.com/account/tokens 접속
  2. "Create Token" 클릭
  3. 토큰 복사 후 다음 명령어 실행:
     ```powershell
     vercel --token YOUR_TOKEN --prod
     ```

## 📝 중요 사항

### 환경 변수
배포 후 반드시 Vercel 대시보드에서 다음 환경 변수를 설정하세요:
- `OPENAI_API_KEY`: OpenAI API 키

### 배포 확인
배포가 완료되면 Vercel에서 제공하는 URL로 접속하여 테스트하세요.

## 🔧 문제 해결

### 빌드 실패 시
- Vercel 대시보드 → Deployments → Build Logs 확인
- 로컬에서 `npm run build` 실행하여 오류 확인

### API 오류 시
- 환경 변수가 올바르게 설정되었는지 확인
- Vercel Functions 로그 확인

