# 작업 방식

## 누가 무엇을 하나

사용자는 방향을 정하고, 그림과 판을 보고 고르고, 다른 에이전트에게 의뢰 문구를 전달하고, 음악을 Suno로 만든다.
Claude Code는 게임 규칙, 판, 화면, 검증 도구, 문서를 만들고, Codex의 그림을 검토해 커밋하고 push한다. 그림이 필요하면 `docs/concept.md`에 그림 목록과 의뢰 문구를 쓴다.
Codex는 그림을 만들어 등록하고, 배경마다 바닥 격자를 재서 적는다. 커밋하거나 push하지 않는다.

## 한 바퀴

1. 사용자가 방향을 정한다. 되돌리기 비싼 결정은 Claude Code가 목업이나 시험 그림으로 먼저 보여 주고 확인받는다.
2. Claude Code가 규칙과 판과 화면을 만들고 `tools/verify.html`을 통과시킨다. 그림이 필요하면 `docs/concept.md`에 목록과 의뢰 문구를 쓰고, 배치 안내 그림을 만든다. 커밋하고 push한다.
3. 사용자가 Codex에게 의뢰 문구를 전달한다. Codex는 그림을 만들어 등록하고, Codex 세션 로그(`session_logs/YYYY-MM-DD-codex.md`)의 "커밋 대기" 목록에 바꾼 파일을 적은 다음 멈춘다.
4. 사용자가 Claude Code에게 검토를 맡긴다. Claude Code는 그림을 실제 화면에서 보고, 격자가 맞는지 확인하고, 로컬 경로나 개인 정보를 걸러 커밋하고 push한다. 고칠 그림은 목록으로 사용자에게 알린다.
5. 사용자가 플레이해 보고 의견을 낸다. 다음 바퀴의 1번으로 돌아간다.

두 에이전트는 같은 폴더에서 동시에 일해도 된다. 서로 작업 중인지 묻지 않는 대신 고치는 파일을 나눈다.
Codex는 그림 파일, `assets/manifest.js`, `assets/bg-grid.js`, `assets/generation.json`, Codex 세션 로그만 고치고, Claude Code는 그 밖의 파일을 고친다.
Claude Code는 Codex가 작업하는 동안 Codex 파일을 고치지 않는다.

## 공개 저장소에 올리지 않는 것

이 저장소는 공개 저장소다. 컴퓨터 안의 절대 경로(`C:\Users\...`), 이메일, 비밀번호, API 키, 이미지 파일의 생성 정보 메타데이터는 파일에 쓰지 않거나 커밋 전에 지운다.
다른 게임의 스크린샷인 `references/`의 이미지는 `.gitignore`로 막혀 있고, 그림을 만드는 컴퓨터에만 둔다.

## 두 컴퓨터

랩탑과 데스크탑에서 번갈아 작업한다. 시작할 때 `git pull`, 끝낼 때 커밋과 push를 한다. 다른 컴퓨터로 옮기기 전에 `git status`와 `git log origin/main..`으로 push까지 끝났는지 확인한다.
처음 옮겨 올 때는 `git clone https://github.com/soomin007/outlet-villains.git`으로 받고, `references/` 이미지는 따로 복사한다.
