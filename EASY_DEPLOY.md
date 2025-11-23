# 가장 쉬운 배포 방법

Git이 설치되어 있지 않으므로, **GitHub Desktop**을 사용하는 것이 가장 쉽습니다!

## 방법 1: GitHub Desktop 사용 (가장 쉬움! ⭐)

### 1단계: GitHub Desktop 설치
1. https://desktop.github.com/ 접속
2. "Download for Windows" 클릭
3. 설치 파일 실행 및 설치
4. GitHub 계정으로 로그인

### 2단계: 저장소 추가
1. GitHub Desktop 실행
2. File → Add Local Repository 클릭
3. "Choose..." 버튼 클릭
4. 프로젝트 폴더 선택:
   ```
   C:\Users\basqu\iCloudDrive\Programs\251123 OPIc
   ```
5. "Add repository" 클릭

### 3단계: 커밋 및 푸시
1. 좌측 하단에 "Summary" 입력란에 커밋 메시지 입력:
   ```
   Initial commit - Ready for deployment
   ```
2. "Commit to main" 버튼 클릭
3. 상단 메뉴에서 "Publish repository" 클릭
4. 저장소 이름 입력 (예: `opic-mock-test-app`)
5. Public 또는 Private 선택
6. "Publish Repository" 클릭

### 4단계: Vercel에 배포
1. https://vercel.com 접속
2. GitHub 계정으로 로그인
3. "Add New Project" 클릭
4. 방금 푸시한 저장소 선택
5. 환경 변수 `OPENAI_API_KEY` 설정
6. "Deploy" 클릭

## 방법 2: Git 직접 설치

### Git 설치
1. https://git-scm.com/download/win 접속
2. 다운로드 및 설치
3. 설치 중 옵션:
   - "Git from the command line and also from 3rd-party software" 선택
   - 나머지는 기본값 유지

### 설치 후 설정
PowerShell 또는 CMD에서:
```powershell
git config --global user.name "Your GitHub Username"
git config --global user.email "your.email@example.com"
```

### 저장소 초기화 및 푸시
```powershell
cd "C:\Users\basqu\iCloudDrive\Programs\251123 OPIc"
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 방법 3: GitHub 웹 인터페이스 사용

1. https://github.com/new 접속
2. 새 저장소 생성 (이름: `opic-mock-test-app`)
3. "uploading an existing file" 클릭
4. 프로젝트 폴더의 모든 파일 드래그 앤 드롭
5. "Commit changes" 클릭

⚠️ **주의**: 이 방법은 큰 파일이나 많은 파일이 있으면 느릴 수 있습니다.

## 추천

**방법 1 (GitHub Desktop)**을 강력히 권장합니다! 
- 설치가 쉽고
- GUI로 직관적이며
- Git 명령어를 몰라도 사용 가능합니다

