/* ==================== UTILITY FUNCTIONS ==================== */

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation
function validatePassword(password) {
    if (password.length < 8) {
        return { valid: false, message: 'كلمة المرور يجب ألا تقل عن 8 أحرف' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'كلمة المرور يجب أن تحتوي على حروف صغيرة (a-z)' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'كلمة المرور يجب أن تحتوي على حروف كبيرة (A-Z)' };
    }
    if (!/[#@$!%*?&^()_+=\-]/.test(password)) {
        return { valid: false, message: 'كلمة المرور يجب أن تحتوي على رمز خاص مثل # أو @ أو $' };
    }
    return { valid: true, message: '' };
}

// Generate unique ID
function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('.toast-icon i');
    
    toastMessage.textContent = message;
    
    // Set icon based on type
    if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
        toast.querySelector('.toast-icon').style.color = 'var(--danger)';
    } else if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle';
        toast.querySelector('.toast-icon').style.color = 'var(--warning)';
    } else {
        toastIcon.className = 'fas fa-check-circle';
        toast.querySelector('.toast-icon').style.color = 'var(--success)';
    }
    
    toast.classList.remove('hidden');
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Hide after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 500);
    }, 3500);
}

// Highlight input error
function highlightError(inputId) {
    const input = document.getElementById(inputId);
    const wrapper = input.closest('.input-wrapper');
    
    if (wrapper) {
        wrapper.classList.add('error');
        
        // Shake animation
        wrapper.style.animation = 'shake 0.5s ease';
        
        setTimeout(() => {
            wrapper.classList.remove('error');
            wrapper.style.animation = '';
        }, 3000);
    }
    
    // Focus the input
    input.focus();
}

// Add shake animation to global CSS dynamically
(function addShakeAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
})();