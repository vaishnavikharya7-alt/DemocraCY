// XSS Prevention
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Input Validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    if (password.length < 6) return { valid: false, message: 'Too short' };
    if (password.length > 128) return { valid: false, message: 'Too long' };
    return { valid: true, message: '' };
}

// CSP Header
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; ..."></meta>