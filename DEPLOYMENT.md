# 배포 가이드 (Deployment Guide)

이 Next.js 애플리케이션을 Vercel에 배포하는 방법입니다.

## 방법 1: Vercel 대시보드 사용 (권장)

### 1단계: GitHub에 코드 푸시
```bash
# Git 저장소 초기화 (아직 안 했다면)
git init
git add .
git commit -m "Initial commit"

# GitHub에 새 저장소 생성 후
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### 2단계: Vercel에 프로젝트 연결
1. [Vercel](https://vercel.com)에 접속하여 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)

### 3단계: 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 추가하세요:

**필수 환경 변수:**
- `OPENAI_API_KEY`: OpenAI API 키 (서버 사이드)

**선택적 환경 변수:**
- `NEXT_PUBLIC_OPENAI_API_KEY`: 클라이언트 사이드 Realtime API용 (보안상 권장하지 않음)

**설정 방법:**
1. 프로젝트 설정 → "Environment Variables"
2. 각 변수 추가:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-your-actual-api-key`
   - Environment: Production, Preview, Development 모두 선택
3. "Save" 클릭

### 4단계: 배포
- 저장소에 푸시하면 자동으로 배포됩니다
- 또는 Vercel 대시보드에서 "Redeploy" 클릭

## 방법 2: Vercel CLI 사용

### 1단계: 로그인
```bash
vercel login
```

### 2단계: 배포
```bash
# 프로덕션 배포
vercel --prod

# 또는 프리뷰 배포
vercel
```

### 3단계: 환경 변수 설정
```bash
# 환경 변수 추가
vercel env add OPENAI_API_KEY

# 또는 대시보드에서 설정
```

## 배포 후 확인사항

1. **API 라우트 테스트**
   - `/api/evaluate` 엔드포인트가 정상 작동하는지 확인
   - OpenAI API 키가 올바르게 설정되었는지 확인

2. **환경 변수 확인**
   - Vercel 대시보드 → Settings → Environment Variables
   - 모든 환경(Production, Preview, Development)에 변수가 설정되었는지 확인

3. **빌드 로그 확인**
   - Vercel 대시보드 → Deployments → 최신 배포 → Build Logs
   - 빌드 오류가 없는지 확인

## 문제 해결

### 빌드 실패
- `npm run build`를 로컬에서 실행하여 오류 확인
- TypeScript 오류나 의존성 문제 확인

### API 라우트 오류
- 환경 변수가 올바르게 설정되었는지 확인
- Vercel 함수 로그 확인 (대시보드 → Functions)

### 환경 변수 인식 안 됨
- 변수 이름 확인 (대소문자 구분)
- 배포 후 재배포 필요할 수 있음
- 모든 환경(Production, Preview, Development)에 설정되었는지 확인

## 추가 설정

### 커스텀 도메인
1. Vercel 대시보드 → Settings → Domains
2. 도메인 추가 및 DNS 설정

### 환경별 설정
- Production: 프로덕션 환경
- Preview: Pull Request마다 생성되는 프리뷰
- Development: 개발 환경

각 환경에 맞는 환경 변수를 설정할 수 있습니다.


