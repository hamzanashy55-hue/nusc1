/* ==================== SPLASH SCREEN LOGIC ==================== */

function initSplashScreen() {
    createParticles();
    
    // Duration of splash screen (5 seconds total)
    const splashDuration = 5500;
    
    setTimeout(() => {
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.classList.add('fade-out');
        
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            showLoginPageDirect();
        }, 800);
    }, splashDuration);
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random animation delay and duration
        particle.style.animationDelay = (Math.random() * 5 + 1) + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Some particles are golden, some white
        if (Math.random() > 0.5) {
            particle.style.background = 'rgba(212, 168, 67, 0.8)';
        } else {
            particle.style.background = 'rgba(255, 255, 255, 0.5)';
        }
        
        particlesContainer.appendChild(particle);
    }
}

// Show login page directly (called after splash)
function showLoginPageDirect() {
    const loginPage = document.getElementById('login-page');
    loginPage.classList.remove('hidden');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initSplashScreen);