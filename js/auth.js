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
        
        // TODO: Navigate to dashboard
        // setTimeout(() => navigateToDashboard(user), 1500);
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