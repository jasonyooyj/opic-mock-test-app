# Git 설정 및 GitHub 푸시 가이드

## 방법 1: Cursor의 내장 Git 기능 사용 (가장 쉬움)

### 1단계: Source Control 열기
1. Cursor 좌측 사이드바에서 **Source Control** 아이콘 클릭 (또는 `Ctrl+Shift+G`)
2. 또는 상단 메뉴: View → Source Control

### 2단계: 저장소 초기화
- "Initialize Repository" 버튼이 보이면 클릭
- 이미 초기화되어 있다면 이 단계 건너뛰기

### 3단계: 파일 스테이징
- "Changes" 섹션에 모든 파일이 표시됨
- 각 파일 옆의 "+" 아이콘을 클릭하여 스테이징
- 또는 "Stage All Changes" 버튼 클릭

### 4단계: 커밋
- 상단의 메시지 입력란에 커밋 메시지 입력:
  ```
  Initial commit - Ready for deployment
  ```
- "Commit" 버튼 클릭 (또는 `Ctrl+Enter`)

### 5단계: GitHub에 푸시
- "Publish Branch" 버튼 클릭
- 또는 "..." 메뉴 → "Publish Branch"
- 새 저장소 생성 옵션 선택
- 저장소 이름 입력 (예: `opic-mock-test-app`)
- Public 또는 Private 선택
- "Publish" 클릭

## 방법 2: Git 설치 후 터미널 사용

### Git 설치
1. https://git-scm.com/download/win 접속
2. 다운로드 및 설치
3. 설치 후 터미널 재시작

### 터미널 명령어
```powershell
# 1. 저장소 초기화
git init

# 2. 모든 파일 추가
git add .

# 3. 커밋
git commit -m "Initial commit - Ready for deployment"

# 4. GitHub에 푸시 (저장소 생성 후)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## 추천 방법
**방법 1 (Cursor 내장 Git)**을 권장합니다. 더 쉽고 직관적입니다!

