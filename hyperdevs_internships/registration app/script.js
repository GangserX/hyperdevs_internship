// Login & Registration Interface JavaScript

// DOM Elements
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authContainer = document.getElementById('authContainer');
const welcomeScreen = document.getElementById('welcomeScreen');
const logoutBtn = document.getElementById('logoutBtn');

// Form Elements
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const confirmPassword = document.getElementById('confirmPassword');

// Message Elements
const loginMessage = document.getElementById('loginMessage');
const signupMessage = document.getElementById('signupMessage');

// Password Strength Elements
const strengthBar = document.querySelector('.strength-fill');
const strengthText = document.querySelector('.strength-level');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    initializeEventListeners();
});

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showWelcomeScreen();
    } else {
        showAuthContainer();
    }
}

// Initialize all event listeners
function initializeEventListeners() {
    // Tab switching
    loginTab.addEventListener('click', () => switchToLogin());
    signupTab.addEventListener('click', () => switchToSignup());
    
    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Password toggle functionality
    document.querySelectorAll('.password-toggle').forEach(button => {
        button.addEventListener('click', togglePasswordVisibility);
    });
    
    // Real-time validation
    loginEmail.addEventListener('input', () => validateEmail(loginEmail));
    signupEmail.addEventListener('input', () => validateEmail(signupEmail));
    signupPassword.addEventListener('input', () => {
        validatePassword(signupPassword);
        checkPasswordStrength(signupPassword.value);
        validateConfirmPassword();
    });
    confirmPassword.addEventListener('input', validateConfirmPassword);
    
    // Clear validation on focus
    [loginEmail, loginPassword, signupEmail, signupPassword, confirmPassword].forEach(input => {
        input.addEventListener('focus', () => clearValidation(input));
    });
}

// Switch to login form
function switchToLogin() {
    loginTab.classList.add('active-tab');
    signupTab.classList.remove('active-tab');
    
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    
    clearAllMessages();
    clearAllValidation();
}

// Switch to signup form
function switchToSignup() {
    signupTab.classList.add('active-tab');
    loginTab.classList.remove('active-tab');
    
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    
    clearAllMessages();
    clearAllValidation();
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    
    // Validate inputs
    let isValid = true;
    
    if (!validateEmail(loginEmail)) {
        isValid = false;
    }
    
    if (!password) {
        showFieldError(loginPassword, 'Password is required');
        isValid = false;
    }
    
    if (!isValid) {
        showMessage(loginMessage, 'Please fix the errors above', 'danger');
        return;
    }
    
    // Simulate login process
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    showLoading(submitBtn);
    
    setTimeout(() => {
        // Check if user exists in localStorage (from previous registration)
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => u.email === email && u.password === password);
        
        hideLoading(submitBtn);
        
        if (user) {
            // Successful login
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            showMessage(loginMessage, 'Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                showWelcomeScreen();
            }, 1500);
        } else {
            // Failed login
            showMessage(loginMessage, 'Invalid email or password. Please try again.', 'danger');
        }
    }, 1500);
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const email = signupEmail.value.trim();
    const password = signupPassword.value;
    const confirmPass = confirmPassword.value;
    
    // Validate all inputs
    let isValid = true;
    
    if (!validateEmail(signupEmail)) {
        isValid = false;
    }
    
    if (!validatePassword(signupPassword)) {
        isValid = false;
    }
    
    if (!validateConfirmPassword()) {
        isValid = false;
    }
    
    if (!isValid) {
        showMessage(signupMessage, 'Please fix the errors above', 'danger');
        return;
    }
    
    // Simulate signup process
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    showLoading(submitBtn);
    
    setTimeout(() => {
        // Check if email already exists
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const existingUser = registeredUsers.find(u => u.email === email);
        
        hideLoading(submitBtn);
        
        if (existingUser) {
            showMessage(signupMessage, 'Email already registered. Please use a different email.', 'danger');
            return;
        }
        
        // Create new user
        const newUser = {
            email: email,
            password: password,
            registeredAt: new Date().toISOString()
        };
        
        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        showMessage(signupMessage, 'Account created successfully! Welcome!', 'success');
        
        setTimeout(() => {
            showWelcomeScreen();
        }, 1500);
    }, 1500);
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    showAuthContainer();
    clearAllForms();
    clearAllMessages();
    clearAllValidation();
}

// Email validation
function validateEmail(emailInput) {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError(emailInput, 'Email is required');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        return false;
    }
    
    showFieldSuccess(emailInput);
    return true;
}

// Password validation
function validatePassword(passwordInput) {
    const password = passwordInput.value;
    
    if (!password) {
        showFieldError(passwordInput, 'Password is required');
        return false;
    }
    
    // Password strength requirements
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!minLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        showFieldError(passwordInput, 'Password must be at least 8 characters with uppercase, lowercase, number, and special character');
        return false;
    }
    
    showFieldSuccess(passwordInput);
    return true;
}

// Confirm password validation
function validateConfirmPassword() {
    const password = signupPassword.value;
    const confirmPass = confirmPassword.value;
    
    if (!confirmPass) {
        showFieldError(confirmPassword, 'Please confirm your password');
        return false;
    }
    
    if (password !== confirmPass) {
        showFieldError(confirmPassword, 'Passwords do not match');
        return false;
    }
    
    showFieldSuccess(confirmPassword);
    return true;
}

// Check password strength and update indicator
function checkPasswordStrength(password) {
    let strength = 0;
    let strengthLevel = 'weak';
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    // Remove existing strength classes
    strengthBar.className = 'strength-fill';
    
    switch (strength) {
        case 0:
        case 1:
            strengthLevel = 'weak';
            strengthBar.classList.add('weak');
            break;
        case 2:
        case 3:
            strengthLevel = 'fair';
            strengthBar.classList.add('fair');
            break;
        case 4:
            strengthLevel = 'good';
            strengthBar.classList.add('good');
            break;
        case 5:
            strengthLevel = 'strong';
            strengthBar.classList.add('strong');
            break;
    }
    
    strengthText.textContent = strengthLevel.charAt(0).toUpperCase() + strengthLevel.slice(1);
    strengthText.className = `strength-level ${strengthLevel}`;
}

// Toggle password visibility
function togglePasswordVisibility(e) {
    const button = e.currentTarget;
    const targetId = button.getAttribute('data-target');
    const passwordInput = document.getElementById(targetId);
    const icon = button.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show field error
function showFieldError(input, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    const feedback = input.parentNode.querySelector('.invalid-feedback') || 
                    input.parentNode.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = message;
    }
}

// Show field success
function showFieldSuccess(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const feedback = input.parentNode.querySelector('.invalid-feedback') || 
                    input.parentNode.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = '';
    }
}

// Clear field validation
function clearValidation(input) {
    input.classList.remove('is-invalid', 'is-valid');
    const feedback = input.parentNode.querySelector('.invalid-feedback') || 
                    input.parentNode.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = '';
    }
}

// Show message
function showMessage(messageElement, text, type) {
    messageElement.className = `alert alert-${type}`;
    messageElement.textContent = text;
    messageElement.classList.remove('d-none');
    
    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(() => {
            messageElement.classList.add('d-none');
        }, 3000);
    }
}

// Show loading state
function showLoading(button) {
    button.classList.add('loading');
    button.disabled = true;
}

// Hide loading state
function hideLoading(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

// Show welcome screen
function showWelcomeScreen() {
    authContainer.classList.add('d-none');
    welcomeScreen.classList.remove('d-none');
}

// Show auth container
function showAuthContainer() {
    welcomeScreen.classList.add('d-none');
    authContainer.classList.remove('d-none');
}

// Clear all forms
function clearAllForms() {
    loginForm.reset();
    signupForm.reset();
    
    // Reset password strength indicator
    strengthBar.className = 'strength-fill';
    strengthText.textContent = 'Weak';
    strengthText.className = 'strength-level weak';
}

// Clear all messages
function clearAllMessages() {
    [loginMessage, signupMessage].forEach(msg => {
        msg.classList.add('d-none');
        msg.textContent = '';
    });
}

// Clear all validation
function clearAllValidation() {
    [loginEmail, loginPassword, signupEmail, signupPassword, confirmPassword].forEach(input => {
        clearValidation(input);
    });
}

// Utility function to simulate network delay
function simulateNetworkDelay(callback, delay = 1000) {
    setTimeout(callback, delay);
}

// Add some demo users for testing (optional)
function initializeDemoUsers() {
    const existingUsers = localStorage.getItem('registeredUsers');
    if (!existingUsers) {
        const demoUsers = [
            {
                email: 'demo@example.com',
                password: 'Demo123!',
                registeredAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('registeredUsers', JSON.stringify(demoUsers));
    }
}

// Initialize demo users on first load
initializeDemoUsers();
