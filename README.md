# 🌐 HOT8OY | Frontend Developer Portfolio

> 순수 HTML, CSS, JavaScript로 만든 반응형 포트폴리오 웹사이트

🔗 **배포 URL**: [https://hot8oy.github.io/Codyssey-B1-1/](https://hot8oy.github.io/Codyssey-B1-1/)

---

## 📸 스크린샷

| 데스크톱 | 모바일 | 다크 모드 |
|:---:|:---:|:---:|
| ![데스크톱 스크린샷]() | ![모바일 스크린샷]() | ![다크모드 스크린샷]() |

---

## 📖 프로젝트 소개

외부 라이브러리 없이 **HTML / CSS / JavaScript**만으로 제작한 반응형 포트폴리오입니다.  
**"사용자 이벤트 → 상태 변경 → DOM 업데이트"** 흐름을 직접 구현하며 웹의 동작 원리를 학습하는 것을 목표로 합니다.

---

## 🛠 사용 기술

| 분류 | 기술 |
|---|---|
| **Markup** | HTML5 (시맨틱 태그) |
| **Styling** | CSS3 — Flexbox, Grid, CSS 변수, 반응형(미디어 쿼리) |
| **Scripting** | JavaScript (ES6+) — DOM 조작, 이벤트 처리, async/await, Fetch API |
| **API** | GitHub REST API (`/users/{id}/repos`) |
| **배포** | GitHub Pages |

---

## 📂 프로젝트 구조

```
Codyssey-B1-1/
├── index.html          # 메인 페이지
├── css/
│   └── style.css       # 전체 스타일시트
├── js/
│   └── main-logic.js   # 인터랙션 · API 연동 로직
├── assets/             # 이미지 파일
└── README.md
```

---

## ✨ 주요 기능

### 페이지 구성
- **Hero** — 인사말 + CTA 버튼 (프로젝트 보기 / 연락하기)
- **About** — 자기소개 + 프로필 이미지
- **Skills** — 기술 스택 목록
- **Projects** — GitHub API 연동 카드 (동적 렌더링)
- **Contact** — 문의 폼 (유효성 검사 포함)
- **Footer** — 저작권 · 소셜 링크

### 인터랙션
| 기능 | 설명 |
|---|---|
| 🍔 햄버거 메뉴 | 모바일에서 `classList.toggle('active')`로 메뉴 열기/닫기 |
| 🔝 스크롤 탑 버튼 | 스크롤 **300px** 이상에서 노출, 클릭 시 최상단으로 이동 |
| 🎨 다크 모드 | 토글 버튼으로 테마 전환, `localStorage`에 저장하여 새로고침 후에도 유지 |
| 📜 네비게이션 스타일 변경 | 스크롤 **60px** 이상 시 헤더 배경색·그림자 변화 |
| 🪄 스크롤 애니메이션 | `IntersectionObserver` (threshold: **0.2**)로 섹션 페이드인 |
| 🔗 부드러운 스크롤 | 내비게이션 클릭 시 해당 섹션으로 smooth scroll |

### GitHub API 연동
- `fetch` + `async/await`로 레포지토리 목록 호출
- **상태별 UI 분기**:
  - ⏳ 로딩 중 → 스피너 + 안내 텍스트
  - ✅ 성공 → `map()`으로 프로젝트 카드 렌더링
  - ❌ 에러 → 에러 메시지 + **다시 시도** 버튼
  - 📭 빈 데이터 → "표시할 프로젝트가 없습니다"

### 폼 유효성 검사
- 필수값 검증 (이름 · 이메일 · 메시지)
- 이메일 정규식 형식 검증
- 입력 필드 근처 에러 메시지 실시간 표시/숨김
- `event.preventDefault()`로 기본 동작 방지 후 성공 메시지 출력

---

## 💡 상태 → 렌더링 흐름

1. **다크 모드** — 토글 클릭 → `data-theme` 변경 + localStorage 저장 → 전체 스타일 전환
2. **API 연동** — fetch 호출 → 로딩/성공/에러 상태 변경 → Projects 섹션 렌더링 분기
3. **폼 검증** — submit 이벤트 → 유효성 상태 판정 → 에러 메시지 표시 or 성공 처리

---

## 🚀 로컬 실행

```bash
# 저장소 클론
git clone https://github.com/HOT8OY/Codyssey-B1-1.git

# VS Code로 열기
code Codyssey-B1-1

# Live Server 확장 설치 후 index.html 우클릭 → Open with Live Server
```

---

## ⚠️ 참고 사항

- GitHub API는 인증 없이 호출 시 **시간당 60회** 제한이 있습니다.
- 레이트 리밋 발생 시 (403 응답) 에러 UI가 표시됩니다.
- 최신 **Chrome** 브라우저 기준으로 동작을 확인했습니다.

---

© 2026 HOT8OY. All rights reserved.