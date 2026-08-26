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