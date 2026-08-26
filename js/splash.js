function initSplashScreen() {
    createStars();
    
    // إعطاء فرصة لأنيميشن الشعار (4.8 ثواني)
    const splashDuration = 4800;
    
    setTimeout(() => {
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.classList.add('fade-out');
        
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            showCampusScreen();
        }, 800);
    }, splashDuration);
}

function showCampusScreen() {
    const campusScreen = document.getElementById('campus-screen');
    if (campusScreen) {
        campusScreen.classList.remove('hidden');
    }
}

function enterCampus() {
    const campusScreen = document.getElementById('campus-screen');
    campusScreen.classList.add('zoom-in');
    
    setTimeout(() => {
        campusScreen.classList.add('hidden');
        const loginPage = document.getElementById('login-page');
        loginPage.classList.remove('hidden');
    }, 850);
}

function createStars() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    particlesContainer.innerHTML = '';
    
    // توليد 65 نجمة متوزعة على كل الشاشة
    const starCount = 65;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star-particle';
        star.innerHTML = '✦';
        star.style.left = (Math.random() * 98) + 'vw';
        star.style.top = (Math.random() * 98) + 'vh';
        star.style.animationDelay = (Math.random() * 3) + 's';
        star.style.fontSize = (Math.random() * 12 + 8) + 'px';
        particlesContainer.appendChild(star);
    }
}

document.addEventListener('DOMContentLoaded', initSplashScreen);