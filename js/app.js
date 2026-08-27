/* ==================== APP INITIALIZATION ==================== */

document.addEventListener('DOMContentLoaded', function () {
    // Populate faculty dropdowns
    populateFacultyDropdowns();

    // Load remembered credentials
    loadRememberedCredentials();

    // Add real-time password match checking for student
    const studentConfirmPassword = document.getElementById('student-confirm-password');
    if (studentConfirmPassword) {
        studentConfirmPassword.addEventListener('input', function () {
            const password = document.getElementById('student-password').value;
            checkPasswordMatch('student-confirm-password', password, 'password-match-msg');
        });
    }

    // Add real-time password match checking for supervisor
    const supervisorConfirmPassword = document.getElementById('supervisor-confirm-password');
    if (supervisorConfirmPassword) {
        supervisorConfirmPassword.addEventListener('input', function () {
            const password = document.getElementById('supervisor-password').value;
            // No match msg element for supervisor, but we can add validation
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        const multiSelects = document.querySelectorAll('.multi-select-container');
        multiSelects.forEach(container => {
            if (!container.contains(e.target)) {
                const dropdown = container.querySelector('.multi-select-dropdown');
                const header = container.querySelector('.multi-select-header');
                if (dropdown && !dropdown.classList.contains('hidden')) {
                    dropdown.classList.add('hidden');
                    header.classList.remove('open');
                }
            }
        });
    });

    // Keyboard accessibility - Enter to submit
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const loginPage = document.getElementById('login-page');
            if (!loginPage.classList.contains('hidden')) {
                const activeForm = document.getElementById('login-form');
                if (activeForm) {
                    handleLogin(e);
                }
            }
        }
    });

    console.log('🎓 NUSC Application Initialized Successfully');
    console.log('📚 Faculties loaded:', getAllFaculties().length);
});

/* ==================== FUTURE: DASHBOARD NAVIGATION ==================== */
/*
function navigateToDashboard(user) {
    // This will be implemented later
    // Will route to different dashboards based on user role
    if (user.role === 'student') {
        // Show student dashboard
    } else if (user.role === 'supervisor') {
        // Show supervisor dashboard
    }
}
*/
// فتح وقفل القائمة الجانبية
function toggleSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    sidebar.classList.toggle('hidden');
}

// التبديل بين الأيقونات الأربعة في الشريط السفلي
function switchDashboardTab(tabId) {
    document.querySelectorAll('.tab-view').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    const activeView = document.getElementById(`tab-${tabId}`);
    if (activeView) activeView.classList.remove('hidden');

    const activeBtn = document.querySelector(`.nav-item[onclick="switchDashboardTab('${tabId}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

// تبديل محرك الذكاء الاصطناعي
let selectedEngine = 'gemini';
function switchAIEngine(engine) {
    selectedEngine = engine;
    document.querySelectorAll('.ai-model-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.ai-model-btn[data-engine="${engine}"]`).classList.add('active');
}

// إرسال استفسار للذكاء الاصطناعي
function sendAIMessage() {
    const input = document.getElementById('ai-user-query');
    const text = input.value.trim();
    if (!text) return;

    const chatBox = document.getElementById('ai-chat-box');
    chatBox.innerHTML += `
        <div class="ai-msg user" style="justify-content: flex-end;">
            <div class="ai-bubble" style="background: var(--primary-gold); color: #000; font-weight:600;">${text}</div>
        </div>
    `;

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        chatBox.innerHTML += `
            <div class="ai-msg bot">
                <div class="ai-avatar">⚡</div>
                <div class="ai-bubble">تمت المعالجة عبر (${selectedEngine.toUpperCase()}): جاري تحليل سؤالك الأكاديمي وتقديم الشرح...</div>
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 700);
}

// تبديل خيارات الرفع (فيديو / رابط / كتاب)
function toggleUploadInputs() {
    const type = document.getElementById('upload-type').value;
    const fileWrapper = document.getElementById('file-upload-wrapper');
    const linkWrapper = document.getElementById('link-upload-wrapper');

    if (type === 'video-link') {
        fileWrapper.classList.add('hidden');
        linkWrapper.classList.remove('hidden');
    } else {
        fileWrapper.classList.remove('hidden');
        linkWrapper.classList.add('hidden');
    }
}

function handleMaterialUpload(e) {
    e.preventDefault();
    const subject = document.getElementById('upload-subject').value;
    const type = document.getElementById('upload-type').value;

    showToast(`تم رفع محتوى [${subject}] بنجاح!`, 'success');
    e.target.reset();
}