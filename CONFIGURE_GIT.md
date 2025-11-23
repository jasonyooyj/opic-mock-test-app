# Cursor에서 Git 사용자 정보 설정하기

## 방법 1: Cursor UI를 통해 설정 (권장)

### 1단계: Source Control 열기
1. Cursor 좌측 사이드바에서 **Source Control** 아이콘 클릭 (또는 `Ctrl+Shift+G`)

### 2단계: 저장소 초기화 시도
1. "Initialize Repository" 버튼 클릭
2. 사용자 정보 설정 프롬프트가 나타나면:
   - **Name**: GitHub 사용자 이름 또는 원하는 이름 입력
   - **Email**: GitHub 계정 이메일 입력

### 3단계: 또는 Settings에서 설정
1. `Ctrl+,` (또는 File → Preferences → Settings)로 설정 열기
2. 검색창에 "git user" 입력
3. 다음 설정 찾기:
   - **Git: User Name** - 사용자 이름 입력
   - **Git: User Email** - 이메일 주소 입력

## 방법 2: Cursor 터미널에서 설정

Cursor의 내장 터미널을 사용하여 설정:

1. **Cursor 터미널 열기**
   - `Ctrl+`` (백틱) 또는 Terminal → New Terminal

2. **다음 명령어 실행** (실제 정보로 교체):
   ```bash
   git config --global user.name "Your GitHub Username"
   git config --global user.email "your.email@example.com"
   ```

3. **설정 확인**:
   ```bash
   git config --global user.name
   git config --global user.email
   ```

## 방법 3: Git 설치 후 설정

시스템에 Git을 설치하려면:

1. **Git 다운로드**
   - https://git-scm.com/download/win 접속
   - 다운로드 및 설치

2. **설치 후 터미널 재시작**

3. **설정 명령어 실행**:
   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## 추천 방법

**방법 1 (Cursor Settings)**을 권장합니다. 가장 쉽고 안정적입니다!

## 다음 단계

사용자 정보 설정 후:
1. Source Control에서 "Initialize Repository" 클릭
2. 모든 파일 스테이징
3. 커밋
4. GitHub에 푸시

