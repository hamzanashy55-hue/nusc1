/* ==================== SPLASH & CAMPUS FLOW ==================== */

function initSplashScreen() {
    createParticles();
    
    // مدة الشاشة السوداء الأولى (4 ثواني)
    const splashDuration = 4000;
    
    setTimeout(() => {
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.classList.add('fade-out');
        
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            showCampusScreen();
        }, 800);
    }, splashDuration);
}

// إظهار شاشة الحرم الخارجي
function showCampusScreen() {
    const campusScreen = document.getElementById('campus-screen');
    if (campusScreen) {
        campusScreen.classList.remove('hidden');
    }
}

// الضغط على الباب والدخول لصفحة التسجيل
function enterCampus() {
    const campusScreen = document.getElementById('campus-screen');
    // تشغيل أنيميشن الزوم على الباب
    campusScreen.classList.add('zoom-in');
    
    setTimeout(() => {
        campusScreen.classList.add('hidden');
        const loginPage = document.getElementById('login-page');
        loginPage.classList.remove('hidden');
    }, 900);
}

// تأثير الجزيئات اللامعة في شاشة البداية
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.animationDelay = (Math.random() * 4 + 1) + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particle.style.background = Math.random() > 0.5 ? 'rgba(212, 168, 67, 0.8)' : 'rgba(255, 255, 255, 0.6)';
        
        particlesContainer.appendChild(particle);
    }
}

// تشغيل التدفق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initSplashScreen);