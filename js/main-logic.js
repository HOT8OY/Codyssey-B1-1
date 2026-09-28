// - [ ] **햄버거 메뉴 토글**: 클릭 시 모바일 메뉴 열림/닫힘 (`classList.toggle('active')`)
const hamburgerBtn = document.querySelector('#hamburger-btn');
const navMenu = document.querySelector("#nav-menu");

hamburgerBtn.addEventListener('click', function () {
    navMenu.classList.toggle('active')
})
// - [ ] **위로 가기(Scroll-to-top) 버튼**:
//   - [ ] 스크롤 300px 이상 내렸을 때만 버튼 노출 (그전엔 숨김)
//   - [ ] 클릭 시 부드럽게 최상단으로 이동 (`window.scrollTo`)
const scrollTop = document.querySelector('.floating-button-up');

window.addEventListener('scroll', () => {
    scrollTop.classList.toggle('show', window.scrollY >= 300)
});

scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
});

// - [ ] **다크 모드 토글 & 상태 저장**:
//   - [ ] 버튼 클릭 시 `document.body`의 `data-theme="dark"` 속성 토글
//   - [ ] `localStorage`에 저장하여 새로고침 시에도 유지
const darkmodeBtn = document.querySelector('.floating-darkmode')
// 로컬 스토리지에 theme :dark가 저장되어있는지 확인
if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    darkmodeBtn.textContent = '🌕';
}

darkmodeBtn.addEventListener('click', () => {
    if (document.body.getAttribute('data-theme') === 'dark') {
        document.body.setAttribute('data-theme', 'light')
        darkmodeBtn.textContent = '☀️';
        localStorage.setItem('theme', 'light')
    }
    else {
        document.body.setAttribute('data-theme', 'dark')
        darkmodeBtn.textContent = '🌕';
        localStorage.setItem('theme', 'dark')
    }
})

// - [ ] **네비게이션 스타일 변경**: 스크롤 60px 이상 시 헤더 배경색/그림자 변화
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60)
}
)

// - [ ] **Contact 폼 유효성 검증**:
//   - [ ] `submit` 시 기본 새로고침 방지 (`event.preventDefault()`)
//   - [ ] 필수값 및 이메일 형식 검증 후 인풋 근처에 에러 메시지 표시
//   - [ ] 성공 시 성공 안내 메시지 표시
const contactForm = document.querySelector('#contact-form')
const nameError = document.querySelector('#name-error');
const emailError = document.querySelector('#email-error');
const messageError = document.querySelector('#message-error');
const formStatus = document.querySelector('#form-status');

contactForm.addEventListener('submit', (e) => {
    // 1. 브라우저 기본 새로고침 방지
    e.preventDefault();

    // 2. 이전 상태 초기화
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    formStatus.textContent = '';

    // 3. FormData로 입력값 추출 및 공백 제거
    const formData = new FormData(contactForm);
    const { name, email, message } = Object.fromEntries(formData);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    let isValid = true;

    // 4. 이름 유효성 검사
    if (!trimmedName) {
        isValid = false;
        nameError.textContent = '이름을 입력하세요.'
    };
    // 5. 이메일 유효성 검사(정규식 사용)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
        isValid = false;
        emailError.textContent = '이메일을 입력하세요.'
    } else if (!emailPattern.test(trimmedEmail)) {
        isValid = false;
        emailError.textContent = '올바른 이메일 형식을 입력해주세요 (예: user@example.com).';
    }
    // 6. 메시지 유효성 검사
    if (!trimmedMessage) {
        isValid = false;
        messageError.textContent = '내용을 입력하세요.'
    }
    // 7. 모든 검증 통과 (성공 처리)
    if (isValid) {
        formStatus.textContent = '🎉 문의가 성공적으로 전송되었습니다!';
        contactForm.reset(); // 입력필드 초기화
    }
});
// 8. 사용자가 타이핑을 시작하면 실시간으로 에러 문구가 사라지게
contactForm.addEventListener('input', (e) => {
    if (e.target.id === 'name') nameError.textContent = '';
    if (e.target.id === 'email') emailError.textContent = '';
    if (e.target.id === 'message') messageError.textContent = '';
})

// - [ ] **스크롤 애니메이션**: `IntersectionObserver`로 섹션 진입 시 페이드인 효과

//  1. 관찰자 생성
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // 요소가 화면에 20% 이상 들어왔을 때
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // CSS 애니메이션 작동 클래스 추가
            observer.unobserve(entry.target); // 한번 나타나면 감시 종료
        }
    });
}, {
    threshold: 0.2
});

//  2. 감시할 모든 섹션 선택 후 관찰 시작
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    observer.observe(section);
});

//  4) GitHub API 연동 (비동기 처리)
// - [ ] `fetch` 및 `async/await`로 `https://api.github.com/users/{본인아이디}/repos` 호출
// - [ ] `try...catch` 예외 처리 (시간당 60회 제한 등 403 에러 처리 포함)
// - [ ] **상태별 UI 분기**:
//   - [ ] 로딩 상태: 로딩 중 텍스트 또는 스피너 표시
//   - [ ] 성공 상태: `map`을 사용해 프로젝트 카드 동적 렌더링 (이름, 설명, 별점 등)
//   - [ ] 에러 상태: "프로젝트를 불러올 수 없습니다" 안내 + [다시 시도] 버튼
//   - [ ] 빈 상태: 레포지토리가 없을 때 안내 문구

const GITHUB_USERNAME = "HOT8OY";

// DOM 요소 선택
const statusEl = document.querySelector('#projects-status') // 성공, 실패, 없음을 표시하는 상태 칸
const containerEl = document.querySelector('#projects-container') // Git repo가 들어갈 Grid컨테이너

async function fetchGithubRepos() {
    // 1. 로딩 상태 표시
    statusEl.innerHTML = `
        <div class="spinner"></div>
        <p>Github 프로젝트를 불러오는 중...</p>
        `;
    statusEl.classList.add('show');
    containerEl.innerHTML = ''; // 이전 카드 초기화

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);

        // 2. HTTP 에러 처리
        if (response.status == 403) {
            throw new Error('API 호출 한도 초과 (시간당 60회. 잠시 후 다시 시도하세요.');
        }
        if (!response.ok) {
            throw new Error(`요청 실패: ${response.status}`);
        }

        const repos = await response.json();

        // 3. 로딩 안내 숨기기
        statusEl.classList.remove('show');

        // 4. 빈 상태 처리
        if (repos.length === 0) {
            statusEl.innerHTML = '<p>표시할 프로젝트가 없습니다.</p>';
            statusEl.classList.add('show');
            return;
        }

        // 5. 성공 상태 - map으로 카드 렌더링
        containerEl.innerHTML = repos.map(repo => `
            <article class="project-card">
            <h3>${repo.name}</h3>
            <p>${repo.description || '설명 없음'}</p>
            <span>⭐️ ${repo.stargazers_count}</span>
            <a href="${repo.html_url}" target='_blank'>Github 보기</a>
            </article>`)
            .join('');
    } catch (error) {
        // 6. 에러 상태 처리
        statusEl.innerHTML = `
        <p>프로젝트를 불러올 수 없습니다.</p>
        <p>${error.message}</p>
        <button id="retry-btn">다시 시도</button>
        `;
        statusEl.classList.add('show');
        console.error('레포지토리 로드 실패: ', error.message);

        // 7. 다시 시도 버튼 이벤트
        document.querySelector('#retry-btn').addEventListener('click', fetchGithubRepos);
    }
}
// 페이지 로드 시 실행
fetchGithubRepos();