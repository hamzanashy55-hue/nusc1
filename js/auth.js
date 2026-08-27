/* ==================== AUTHENTICATION LOGIC ==================== */

let currentLoginRole = 'student';

// Switch role tabs on login page
function switchRole(role) {
    currentLoginRole = role;
    
    const tabs = document.querySelectorAll('.login-page .role-tab');
    const slider = document.querySelector('.login-page .tab-slider');
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.role === role) {
            tab.classList.add('active');
        }
    });
    
    // Move slider
    if (role === 'supervisor') {
        slider.style.right = 'calc(50%)';
    } else {
        slider.style.right = '5px';
    }
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    if (!email || !password) {
        showToast('يرجى إدخال البريد الإلكتروني وكلمة المرور', 'error');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
        return;
    }
    
    // Check stored users
    const users = JSON.parse(localStorage.getItem('nusc_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password && u.role === currentLoginRole);
    
    if (user) {
        // Save remember me preference
        if (rememberMe) {
            localStorage.setItem('nusc_remembered_email', email);
            localStorage.setItem('nusc_remembered_role', currentLoginRole);
        } else {
            localStorage.removeItem('nusc_remembered_email');
            localStorage.removeItem('nusc_remembered_role');
        }
        
        // Save current session
        localStorage.setItem('nusc_current_user', JSON.stringify(user));
        
        showToast(`مرحباً ${user.fullName}! تم تسجيل الدخول بنجاح`, 'success');
        
       setTimeout(() => navigateToDashboard(user), 1200);
    } else {
        showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
    }
}

// Show Forgot Password Modal
function showForgotPassword() {
    const modal = document.getElementById('forgot-password-modal');
    modal.classList.remove('hidden');
}

// Close Forgot Password Modal
function closeForgotPassword() {
    const modal = document.getElementById('forgot-password-modal');
    modal.classList.add('hidden');
}

// Handle Forgot Password
function handleForgotPassword() {
    const email = document.getElementById('forgot-email').value.trim();
    
    if (!email) {
        showToast('يرجى إدخال البريد الإلكتروني', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
        return;
    }
    
    // Simulate sending reset link
    showToast('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني', 'success');
    setTimeout(() => closeForgotPassword(), 1500);
}

// Toggle Password Visibility
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Page Navigation
function showRegisterPage() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.remove('hidden');
    window.scrollTo(0, 0);
}

function showLoginPage() {
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Load remembered email on page load
function loadRememberedCredentials() {
    const rememberedEmail = localStorage.getItem('nusc_remembered_email');
    const rememberedRole = localStorage.getItem('nusc_remembered_role');
    
    if (rememberedEmail) {
        document.getElementById('login-email').value = rememberedEmail;
        document.getElementById('remember-me').checked = true;
        
        if (rememberedRole) {
            switchRole(rememberedRole);
        }
    }
}
/* ==================== ADMIN SECRET ACCESS & LOGIC ==================== */

// المفتاح الرئيسي لاسترداد الحساب في حال نسيان الباسورد
const MASTER_RECOVERY_KEY = "NUSC@2026#ADMIN";

// تهيئة بيانات الأدمن الافتراضية
function initAdminAccount() {
    if (!localStorage.getItem('nusc_admin_credentials')) {
        const defaultAdmin = {
            email: "admin@nusc.edu.eg",
            password: "Admin#NUSC@2026"
        };
        localStorage.setItem('nusc_admin_credentials', JSON.stringify(defaultAdmin));
    }
}
initAdminAccount();

// كشف الضغطات المتتالية على اللوجو لفتح بوابة الأدمن (3 ضغطات سريعة)
let logoClickCount = 0;
let logoClickTimer = null;

function handleAdminSecretTrigger() {
    logoClickCount++;
    clearTimeout(logoClickTimer);

    if (logoClickCount === 3) {
        logoClickCount = 0;
        showAdminLoginModal();
    } else {
        logoClickTimer = setTimeout(() => {
            logoClickCount = 0;
        }, 1200);
    }
}

function showAdminLoginModal() {
    document.getElementById('admin-login-modal').classList.remove('hidden');
}

function closeAdminModal() {
    document.getElementById('admin-login-modal').classList.add('hidden');
}

function showAdminForgotModal() {
    closeAdminModal();
    document.getElementById('admin-forgot-modal').classList.remove('hidden');
}

function closeAdminForgotModal() {
    document.getElementById('admin-forgot-modal').classList.add('hidden');
}

// معالجة تسجيل دخول الأدمن
function handleAdminLogin(event) {
    event.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;

    const admin = JSON.parse(localStorage.getItem('nusc_admin_credentials'));

    if (email === admin.email && password === admin.password) {
        showToast('مرحباً بك يا سيادة المسؤول! جاري الدخول للوحة التحكم...', 'success');
        closeAdminModal();
        
        // حفظ جلسة الأدمن
        localStorage.setItem('nusc_current_user', JSON.stringify({ role: 'admin', fullName: 'المسؤول العام' }));
        
        // الانتقال للوحة التحكم المنظمة حسب الكليات (سيتم ربطها بواجهة الأدمن)
        console.log("Logged in as Admin. Access to faculties granted.");
    } else {
        showToast('بيانات المسؤول غير صحيحة!', 'error');
    }
}

// استعادة وتغيير كلمة مرور الأدمن عبر الماستر كي
function handleAdminPasswordReset(event) {
    event.preventDefault();
    const key = document.getElementById('admin-recovery-key').value.trim();
    const newPass = document.getElementById('admin-new-password').value;

    if (key !== MASTER_RECOVERY_KEY) {
        showToast('مفتاح الاسترداد الرئيسي غير صحيح!', 'error');
        return;
    }

    if (newPass.length < 8) {
        showToast('كلمة المرور يجب ألا تقل عن 8 أحرف', 'error');
        return;
    }

    const admin = JSON.parse(localStorage.getItem('nusc_admin_credentials'));
    admin.password = newPass;
    localStorage.setItem('nusc_admin_credentials', JSON.stringify(admin));

    showToast('تم تحديث كلمة مرور المسؤول بنجاح!', 'success');
    setTimeout(() => {
        closeAdminForgotModal();
        showAdminLoginModal();
    }, 1200);
}
function navigateToDashboard(user) {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('app-dashboard').classList.remove('hidden');

    if (user.role === 'student') {
        document.getElementById('header-faculty-name').textContent = user.facultyName || 'حاسبات وذكاء اصطناعي';
        document.getElementById('faculty-hero-title').textContent = user.facultyName || 'كلية الحاسبات والذكاء الاصطناعي';
        document.getElementById('profile-name').textContent = user.fullName;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-uni-email').textContent = user.universityEmail || 'لم يُحدد';
        document.getElementById('profile-code').textContent = user.studentCode;
        document.getElementById('profile-faculty').textContent = user.facultyName;
        document.getElementById('profile-year').textContent = user.year;
        document.getElementById('profile-spec').textContent = user.specialization;

        // تحميل مواد الكلية ديناميكياً
        const subjectsContainer = document.getElementById('faculty-subjects-grid');
        if (subjectsContainer && typeof getFacultySubjects === 'function') {
            const subjects = getFacultySubjects(user.faculty);
            subjectsContainer.innerHTML = subjects.map(sub => `
                <div class="subject-card">
                    <i class="fas fa-book-reader" style="font-size: 1.5rem; color: var(--primary-gold); margin-bottom: 8px; display:block;"></i>
                    ${sub}
                </div>
            `).join('');
        }
    }
}

function handleLogout() {
    localStorage.removeItem('nusc_current_user');
    location.reload();
}