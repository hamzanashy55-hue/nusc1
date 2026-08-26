/* ==================== REGISTRATION LOGIC ==================== */

let currentRegisterRole = 'student';
let selectedSupervisorFaculties = [];

// Switch role tabs on register page
function switchRegisterRole(role) {
    currentRegisterRole = role;
    
    const tabs = document.querySelectorAll('.register-role-tabs .role-tab');
    const slider = document.querySelector('.register-role-tabs .tab-slider');
    
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
    
    // Toggle forms
    const studentForm = document.getElementById('student-register-form');
    const supervisorForm = document.getElementById('supervisor-register-form');
    
    if (role === 'student') {
        studentForm.classList.remove('hidden');
        supervisorForm.classList.add('hidden');
    } else {
        studentForm.classList.add('hidden');
        supervisorForm.classList.remove('hidden');
    }
}

// Populate faculty dropdowns
function populateFacultyDropdowns() {
    const faculties = getAllFaculties();
    
    // Student faculty select
    const studentFacultySelect = document.getElementById('student-faculty');
    faculties.forEach(faculty => {
        const option = document.createElement('option');
        option.value = faculty.key;
        option.textContent = `${faculty.icon} ${faculty.name}`;
        studentFacultySelect.appendChild(option);
    });
    
    // Supervisor multi-select
    const supervisorDropdown = document.getElementById('supervisor-faculties-dropdown');
    faculties.forEach(faculty => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'multi-select-option';
        optionDiv.dataset.value = faculty.key;
        optionDiv.innerHTML = `
            <div class="checkbox"></div>
            <span>${faculty.icon} ${faculty.name}</span>
        `;
        optionDiv.addEventListener('click', () => toggleSupervisorFaculty(faculty.key, faculty.name, faculty.icon));
        supervisorDropdown.appendChild(optionDiv);
    });
}

// Student: On faculty change
function onFacultyChange() {
    const facultyKey = document.getElementById('student-faculty').value;
    const yearSelect = document.getElementById('student-year');
    const specSelect = document.getElementById('student-specialization');
    
    // Reset
    yearSelect.innerHTML = '<option value="">اختر الفرقة</option>';
    specSelect.innerHTML = '<option value="">اختر التخصص</option>';
    
    if (!facultyKey) {
        yearSelect.disabled = true;
        specSelect.disabled = true;
        return;
    }
    
    // Populate years
    const years = getFacultyYears(facultyKey);
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
    yearSelect.disabled = false;
    
    // Populate specializations
    const specs = getFacultySpecializations(facultyKey);
    specs.forEach(spec => {
        const option = document.createElement('option');
        option.value = spec;
        option.textContent = spec;
        specSelect.appendChild(option);
    });
    specSelect.disabled = false;
}

// Supervisor: Toggle multi-select dropdown
function toggleMultiSelect(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const header = dropdown.previousElementSibling;
    
    dropdown.classList.toggle('hidden');
    header.classList.toggle('open');
    
    // Close on outside click
    if (!dropdown.classList.contains('hidden')) {
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.parentElement.contains(e.target)) {
                dropdown.classList.add('hidden');
                header.classList.remove('open');
                document.removeEventListener('click', closeDropdown);
            }
        });
    }
}

// Supervisor: Toggle faculty selection
function toggleSupervisorFaculty(facultyKey, facultyName, icon) {
    const option = document.querySelector(`.multi-select-option[data-value="${facultyKey}"]`);
    const index = selectedSupervisorFaculties.indexOf(facultyKey);
    
    if (index > -1) {
        // Remove
        selectedSupervisorFaculties.splice(index, 1);
        option.classList.remove('selected');
    } else {
        // Add
        selectedSupervisorFaculties.push(facultyKey);
        option.classList.add('selected');
    }
    
    updateSupervisorFacultyTags();
    updateSupervisorSubjectFields();
}

// Update selected faculty tags
function updateSupervisorFacultyTags() {
    const tagsContainer = document.getElementById('supervisor-selected-faculties');
    tagsContainer.innerHTML = '';
    
    selectedSupervisorFaculties.forEach(key => {
        const faculty = FACULTIES_DATA[key];
        const tag = document.createElement('div');
        tag.className = 'selected-tag';
        tag.innerHTML = `
            <span>${faculty.icon} ${faculty.name}</span>
            <button type="button" class="remove-tag" onclick="removeSupervisorFaculty('${key}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        tagsContainer.appendChild(tag);
    });
    
    // Update placeholder
    const placeholder = document.querySelector('.multi-select-placeholder');
    if (selectedSupervisorFaculties.length > 0) {
        placeholder.textContent = `تم اختيار ${selectedSupervisorFaculties.length} كلية`;
        placeholder.style.color = 'var(--primary-gold)';
    } else {
        placeholder.textContent = 'اختر الكلية / الكليات';
        placeholder.style.color = 'var(--gray)';
    }
}

// Remove supervisor faculty
function removeSupervisorFaculty(key) {
    const option = document.querySelector(`.multi-select-option[data-value="${key}"]`);
    if (option) option.classList.remove('selected');
    
    const index = selectedSupervisorFaculties.indexOf(key);
    if (index > -1) {
        selectedSupervisorFaculties.splice(index, 1);
    }
    
    updateSupervisorFacultyTags();
    updateSupervisorSubjectFields();
}

// Update supervisor subject input fields based on selected faculties
function updateSupervisorSubjectFields() {
    const subjectsArea = document.getElementById('supervisor-subjects-area');
    subjectsArea.innerHTML = '';
    
    if (selectedSupervisorFaculties.length === 0) return;
    
    if (selectedSupervisorFaculties.length === 1) {
        // Single faculty - simple input
        const key = selectedSupervisorFaculties[0];
        const faculty = FACULTIES_DATA[key];
        
        const group = document.createElement('div');
        group.className = 'input-group';
        group.innerHTML = `
            <label>المادة التي تدرسها في ${faculty.name} <span class="required">*</span></label>
            <div class="input-wrapper">
                <i class="fas fa-book"></i>
                <input type="text" 
                       class="supervisor-subject-input" 
                       data-faculty="${key}" 
                       placeholder="أدخل اسم المادة"
                       required>
            </div>
        `;
        subjectsArea.appendChild(group);
    } else {
        // Multiple faculties - grouped inputs
        selectedSupervisorFaculties.forEach(key => {
            const faculty = FACULTIES_DATA[key];
            
            const group = document.createElement('div');
            group.className = 'faculty-subject-group';
            group.innerHTML = `
                <h4><i class="fas fa-building-columns"></i> ${faculty.icon} ${faculty.name}</h4>
                <div class="input-group">
                    <div class="input-wrapper">
                        <i class="fas fa-book"></i>
                        <input type="text" 
                               class="supervisor-subject-input" 
                               data-faculty="${key}" 
                               placeholder="أدخل اسم المادة في ${faculty.name}"
                               required>
                    </div>
                </div>
            `;
            subjectsArea.appendChild(group);
        });
    }
}

// Handle Student Registration
function handleStudentRegister(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('student-fullname').value.trim();
    const personalEmail = document.getElementById('student-personal-email').value.trim();
    const universityEmail = document.getElementById('student-university-email').value.trim();
    const studentCode = document.getElementById('student-code').value.trim();
    const faculty = document.getElementById('student-faculty').value;
    const year = document.getElementById('student-year').value;
    const specialization = document.getElementById('student-specialization').value;
    const password = document.getElementById('student-password').value;
    const confirmPassword = document.getElementById('student-confirm-password').value;
    
    // Validate full name (5 parts)
    const nameParts = fullName.split(/\s+/);
    if (nameParts.length < 5) {
        showToast('يجب إدخال الاسم خماسي كامل (5 أجزاء على الأقل)', 'error');
        highlightError('student-fullname');
        return;
    }
    
    // Validate email
    if (!isValidEmail(personalEmail)) {
        showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
        highlightError('student-personal-email');
        return;
    }
    
    // Validate university email if provided
    if (universityEmail && !isValidEmail(universityEmail)) {
        showToast('البريد الإلكتروني الجامعي غير صحيح', 'error');
        highlightError('student-university-email');
        return;
    }
    
    // Validate student code
    if (!studentCode) {
        showToast('يرجى إدخال كود الطالب', 'error');
        highlightError('student-code');
        return;
    }
    
    // Validate faculty selection
    if (!faculty) {
        showToast('يرجى اختيار الكلية', 'error');
        return;
    }
    
    // Validate year
    if (!year) {
        showToast('يرجى اختيار الفرقة', 'error');
        return;
    }
    
    // Validate specialization
    if (!specialization) {
        showToast('يرجى اختيار التخصص', 'error');
        return;
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showToast(passwordValidation.message, 'error');
        highlightError('student-password');
        return;
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
        showToast('كلمتا المرور غير متطابقتين', 'error');
        highlightError('student-confirm-password');
        return;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('nusc_users') || '[]');
    if (users.find(u => u.email === personalEmail)) {
        showToast('هذا البريد الإلكتروني مسجل بالفعل', 'error');
        return;
    }
    
    // Create user object
    const newUser = {
        id: generateId(),
        role: 'student',
        fullName: fullName,
        email: personalEmail,
        universityEmail: universityEmail || null,
        studentCode: studentCode,
        faculty: faculty,
        facultyName: getFacultyName(faculty),
        year: year,
        specialization: specialization,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('nusc_users', JSON.stringify(users));
    
    showToast('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول', 'success');
    
    // Navigate to login after delay
    setTimeout(() => {
        showLoginPage();
        // Pre-fill email
        document.getElementById('login-email').value = personalEmail;
        switchRole('student');
    }, 2000);
}

// Handle Supervisor Registration
function handleSupervisorRegister(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('supervisor-fullname').value.trim();
    const email = document.getElementById('supervisor-email').value.trim();
    const password = document.getElementById('supervisor-password').value;
    const confirmPassword = document.getElementById('supervisor-confirm-password').value;
    
    // Validate full name (4 parts)
    const nameParts = fullName.split(/\s+/);
    if (nameParts.length < 4) {
        showToast('يجب إدخال الاسم رباعي كامل (4 أجزاء على الأقل)', 'error');
        highlightError('supervisor-fullname');
        return;
    }
    
    // Validate email
    if (!isValidEmail(email)) {
        showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
        highlightError('supervisor-email');
        return;
    }
    
    // Validate faculties selected
    if (selectedSupervisorFaculties.length === 0) {
        showToast('يرجى اختيار كلية واحدة على الأقل', 'error');
        return;
    }
    
    // Validate subjects
    const subjectInputs = document.querySelectorAll('.supervisor-subject-input');
    const subjects = {};
    let allSubjectsFilled = true;
    
    subjectInputs.forEach(input => {
        const value = input.value.trim();
        if (!value) {
            allSubjectsFilled = false;
        }
        subjects[input.dataset.faculty] = value;
    });
    
    if (!allSubjectsFilled) {
        showToast('يرجى إدخال المادة لكل كلية مختارة', 'error');
        return;
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showToast(passwordValidation.message, 'error');
        highlightError('supervisor-password');
        return;
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
        showToast('كلمتا المرور غير متطابقتين', 'error');
        highlightError('supervisor-confirm-password');
        return;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('nusc_users') || '[]');
    if (users.find(u => u.email === email)) {
        showToast('هذا البريد الإلكتروني مسجل بالفعل', 'error');
        return;
    }
    
    // Create supervisor object
    const newSupervisor = {
        id: generateId(),
        role: 'supervisor',
        fullName: fullName,
        email: email,
        faculties: selectedSupervisorFaculties.map(key => ({
            key: key,
            name: getFacultyName(key),
            subject: subjects[key] || ''
        })),
        password: password,
        createdAt: new Date().toISOString()
    };
    
    // Save
    users.push(newSupervisor);
    localStorage.setItem('nusc_users', JSON.stringify(users));
    
    showToast('تم إنشاء حساب المشرف بنجاح!', 'success');
    
    // Navigate to login
    setTimeout(() => {
        showLoginPage();
        document.getElementById('login-email').value = email;
        switchRole('supervisor');
    }, 2000);
}

// Password Strength Checker (Student)
function checkPasswordStrength(password) {
    const fill = document.getElementById('strength-fill');
    const text = document.getElementById('strength-text');
    
    updateStrengthIndicator(password, fill, text);
    
    // Also check match
    const confirmPassword = document.getElementById('student-confirm-password').value;
    if (confirmPassword) {
        checkPasswordMatch('student-confirm-password', password, 'password-match-msg');
    }
}

// Password Strength Checker (Supervisor)
function checkPasswordStrengthSupervisor(password) {
    const fill = document.getElementById('supervisor-strength-fill');
    const text = document.getElementById('supervisor-strength-text');
    
    updateStrengthIndicator(password, fill, text);
}

// Common strength indicator updater
function updateStrengthIndicator(password, fillElement, textElement) {
    // Reset
    fillElement.className = 'strength-fill';
    textElement.className = 'strength-text';
    textElement.textContent = '';
    
    if (!password) return;
    
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[#@$!%*?&^()_+=\-]/.test(password)) score++;
    if (password.length >= 12) score++;
    
    if (score <= 2) {
        fillElement.classList.add('weak');
        textElement.classList.add('weak');
        textElement.textContent = 'ضعيفة';
    } else if (score <= 3) {
        fillElement.classList.add('medium');
        textElement.classList.add('medium');
        textElement.textContent = 'متوسطة';
    } else {
        fillElement.classList.add('strong');
        textElement.classList.add('strong');
        textElement.textContent = 'قوية';
    }
}

// Check password match
function checkPasswordMatch(confirmInputId, originalPassword, msgId) {
    const confirmInput = document.getElementById(confirmInputId);
    const msg = document.getElementById(msgId);
    
    if (!confirmInput.value) {
        if (msg) msg.textContent = '';
        return;
    }
    
    if (confirmInput.value === originalPassword) {
        if (msg) {
            msg.textContent = '✓ كلمتا المرور متطابقتان';
            msg.className = 'password-match-msg match';
        }
    } else {
        if (msg) {
            msg.textContent = '✗ كلمتا المرور غير متطابقتين';
            msg.className = 'password-match-msg no-match';
        }
    }
}