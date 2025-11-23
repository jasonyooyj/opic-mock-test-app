# 토큰을 사용한 배포 방법

CLI 로그인에 문제가 있을 경우, Vercel Access Token을 사용하여 배포할 수 있습니다.

## 1단계: Vercel Access Token 발급

1. https://vercel.com/account/tokens 접속
2. Vercel 계정으로 로그인
3. "Create Token" 버튼 클릭
4. 토큰 이름 입력 (예: "OPIc App Deployment")
5. "Create" 클릭
6. **토큰을 복사해두세요** (한 번만 표시됩니다!)

## 2단계: 토큰으로 배포

터미널에서 다음 명령어 실행:

```powershell
# 프로덕션 배포
vercel --token YOUR_TOKEN_HERE --prod

# 또는 프리뷰 배포
vercel --token YOUR_TOKEN_HERE
```

`YOUR_TOKEN_HERE` 부분을 위에서 복사한 실제 토큰으로 교체하세요.

## 3단계: 환경 변수 설정

배포 후 Vercel 대시보드에서 환경 변수를 설정해야 합니다:

1. https://vercel.com 접속
2. 배포된 프로젝트 선택
3. Settings → Environment Variables
4. `OPENAI_API_KEY` 추가
5. Production, Preview, Development 모두 선택
6. Save 클릭
7. 재배포 (Redeploy)

## 보안 주의사항

⚠️ **토큰은 절대 공개하지 마세요!**
- 토큰을 Git에 커밋하지 마세요
- 토큰을 공유하지 마세요
- 토큰이 유출되면 즉시 삭제하고 새 토큰을 발급하세요


