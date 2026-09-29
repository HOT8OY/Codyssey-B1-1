/**
 * ========================================================
 * 1. 전역 STATE 객체 (Single Source of Truth)
 * ========================================================
 * 핵심 UI 상태를 하나의 객체로 모아 일관되게 관리합니다.
 * "사용자 이벤트 → state 변경 → render() 화면 업데이트"
 */
const state = {
    // 1) 테마 상태: 'light' | 'dark'
    theme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',

    // 2) 모바일 햄버거 메뉴 상태: true (열림) | false (닫힘)
    isMenuOpen: false,

    // 3) 프로젝트 (GitHub API) 비동기 상태
    // status: 'idle' | 'loading' | 'success' | 'error' | 'empty'
    projects: {
        status: 'idle',
        data: [],
        error: null
    },

    // 4) Contact 폼 유효성 및 전송 상태
    form: {
        errors: {
            name: '',
            email: '',
            message: ''
        },
        isSubmitted: false
    }
};

/**
 * ========================================================
 * 2. DOM 요소 선택
 * ========================================================
 */
// 네비게이션 & 공통 인터랙션 요소
const hamburgerBtn = document.querySelector('#hamburger-btn');
const navMenu = document.querySelector('#nav-menu');
const scrollTopBtn = document.querySelector('.floating-button-up');
const darkmodeBtn = document.querySelector('.floating-darkmode');
const header = document.querySelector('header');

// Projects 요소
const projectsStatusEl = document.querySelector('#projects-status');
const projectsContainerEl = document.querySelector('#projects-container');

// Contact 폼 요소
const contactForm = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const nameError = document.querySelector('#name-error');
const emailError = document.querySelector('#email-error');
const messageError = document.querySelector('#message-error');
const formStatus = document.querySelector('#form-status');

/**
 * ========================================================
 * 3. 렌더링 함수들 (Render Functions)
 * state 데이터를 읽어 화면(DOM)에 투영하는 역할만 담당합니다.
 * ========================================================
 */

// 1) 테마 렌더링
function renderTheme() {
    document.body.setAttribute('data-theme', state.theme);
    darkmodeBtn.textContent = state.theme === 'dark' ? '🌕' : '☀️';
}

// 2) 햄버거 메뉴 렌더링
function renderMenu() {
    navMenu.classList.toggle('active', state.isMenuOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(state.isMenuOpen));
}

// 3) 프로젝트 (GitHub API) 렌더링
function renderProjects() {
    const { status, data, error } = state.projects;

    switch (status) {
        case 'loading':
            projectsStatusEl.innerHTML = `
                <div class="spinner"></div>
                <p>GitHub 프로젝트를 불러오는 중...</p>
            `;
            projectsStatusEl.classList.add('show');
            projectsContainerEl.innerHTML = '';
            break;

        case 'success':
            projectsStatusEl.classList.remove('show');
            projectsContainerEl.innerHTML = data.map(repo => `
                <article class="project-card">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || '설명 없음'}</p>
                    <div class="project-card-footer">
                        <span class="repo-stars">⭐️ ${repo.stargazers_count}</span>
                        <a href="${repo.html_url}" class="repo-link" target="_blank" rel="noopener noreferrer">GitHub 보기</a>
                    </div>
                </article>
            `).join('');
            break;

        case 'empty':
            projectsStatusEl.innerHTML = '<p>표시할 프로젝트가 없습니다.</p>';
            projectsStatusEl.classList.add('show');
            projectsContainerEl.innerHTML = '';
            break;

        case 'error':
            projectsStatusEl.innerHTML = `
                <p>프로젝트를 불러올 수 없습니다.</p>
                <p class="projects-error-msg">${error || '알 수 없는 오류가 발생했습니다.'}</p>
                <button type="button" id="retry-btn" class="btn-retry">다시 시도</button>
            `;
            projectsStatusEl.classList.add('show');
            projectsContainerEl.innerHTML = '';

            // 렌더링 후 동적으로 생성된 재시도 버튼에 이벤트 리스너 연결
            const retryBtn = document.querySelector('#retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', fetchGithubRepos);
            }
            break;

        case 'idle':
        default:
            projectsStatusEl.classList.remove('show');
            projectsContainerEl.innerHTML = '';
            break;
    }
}

// 4) Contact 폼 상태 렌더링 (에러 문구, 인풋 에러 스타일, 성공 알림)
function renderForm() {
    const { errors, isSubmitted } = state.form;

    // 이름 에러 렌더링
    nameError.textContent = errors.name;
    nameInput.classList.toggle('input-error', Boolean(errors.name));

    // 이메일 에러 렌더링
    emailError.textContent = errors.email;
    emailInput.classList.toggle('input-error', Boolean(errors.email));

    // 메시지 에러 렌더링
    messageError.textContent = errors.message;
    messageInput.classList.toggle('input-error', Boolean(errors.message));

    // 전송 성공 안내 메시지
    formStatus.textContent = isSubmitted ? '🎉 문의가 성공적으로 전송되었습니다!' : '';
}

/**
 * ========================================================
 * 4. 상태 변경(Action) 및 비동기 처리
 * ========================================================
 */

// 다크 모드 토글
function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', state.theme);
    renderTheme();
}

// 햄버거 메뉴 토글
function toggleMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    renderMenu();
}

// GitHub API 비동기 호출
const GITHUB_USERNAME = 'HOT8OY';

async function fetchGithubRepos() {
    // 1. 상태를 'loading'으로 변경하고 렌더링
    state.projects.status = 'loading';
    state.projects.error = null;
    renderProjects();

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);

        // 2. HTTP 에러 처리 (시간당 60회 제한 등)
        if (response.status === 403) {
            throw new Error('API 호출 한도 초과 (시간당 60회). 잠시 후 다시 시도하세요.');
        }
        if (!response.ok) {
            throw new Error(`요청 실패: ${response.status}`);
        }

        const repos = await response.json();

        // 3. 응답 결과에 따라 success / empty 상태로 변경 후 렌더링
        if (repos.length === 0) {
            state.projects.status = 'empty';
            state.projects.data = [];
        } else {
            state.projects.status = 'success';
            state.projects.data = repos;
        }
        renderProjects();
    } catch (err) {
        // 4. 에러 상태로 변경 후 렌더링
        state.projects.status = 'error';
        state.projects.error = err.message;
        renderProjects();
        console.error('레포지토리 로드 실패: ', err.message);
    }
}

/**
 * ========================================================
 * 5. 이벤트 리스너 바인딩
 * ========================================================
 */

// 다크 모드 토글
darkmodeBtn.addEventListener('click', toggleTheme);

// 햄버거 메뉴 토글
hamburgerBtn.addEventListener('click', toggleMenu);

// 모바일 메뉴 항목 클릭 시 메뉴 닫기
navMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && state.isMenuOpen) {
        state.isMenuOpen = false;
        renderMenu();
    }
});

// 스크롤 300px 이상 시 탑 버튼 표시 / 60px 이상 시 헤더 스타일 변경
window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY >= 300);
    header.classList.toggle('scrolled', window.scrollY > 60);
});

// 탑 버튼 클릭 시 최상단 스크롤
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Contact 폼 제출 처리
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const { name, email, message } = Object.fromEntries(formData);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    // 폼 상태 초기화
    state.form.errors = { name: '', email: '', message: '' };
    state.form.isSubmitted = false;

    let isValid = true;

    // 이름 검증
    if (!trimmedName) {
        isValid = false;
        state.form.errors.name = '이름을 입력하세요.';
    }

    // 이메일 정규식 검증
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
        isValid = false;
        state.form.errors.email = '이메일을 입력하세요.';
    } else if (!emailPattern.test(trimmedEmail)) {
        isValid = false;
        state.form.errors.email = '올바른 이메일 형식을 입력해주세요 (예: user@example.com).';
    }

    // 메시지 검증
    if (!trimmedMessage) {
        isValid = false;
        state.form.errors.message = '내용을 입력하세요.';
    }

    // 검증 성공 시
    if (isValid) {
        state.form.isSubmitted = true;
        contactForm.reset();
    }

    // 변경된 폼 상태를 화면에 반영
    renderForm();
});

// 입력 중 실시간 에러 제거
contactForm.addEventListener('input', (e) => {
    const fieldId = e.target.id;
    if (state.form.errors[fieldId]) {
        state.form.errors[fieldId] = '';
        renderForm();
    }
});

// 스크롤 애니메이션 (Intersection Observer)
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

/**
 * ========================================================
 * 6. 초기 실행
 * ========================================================
 */
renderTheme();
fetchGithubRepos();