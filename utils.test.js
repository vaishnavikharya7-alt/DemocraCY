/**
 * @jest-environment jsdom
 */

// ========== Import utilities (we'll define them inline since single-file project) ==========

// These mirror the functions in index.html
function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    if (typeof password !== 'string') return { valid: false, message: 'Password must be a string' };
    if (password.length < 6) return { valid: false, message: 'Password must be at least 6 characters' };
    if (password.length > 128) return { valid: false, message: 'Password is too long' };
    return { valid: true, message: '' };
}

function formatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    return num.toLocaleString('en-IN');
}

function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit = 100) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function validateVoterID(id) {
    if (typeof id !== 'string') return { valid: false, message: 'Voter ID must be a string' };
    if (!id) return { valid: false, message: 'Voter ID is required' };
    if (!/^[A-Za-z]{3}[0-9]{7}$/.test(id)) return { valid: false, message: 'Invalid format. Example: ABC1234567' };
    return { valid: true, message: '' };
}

function validateName(name) {
    if (typeof name !== 'string') return { valid: false, message: 'Name must be a string' };
    if (!name || name.trim().length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
    if (name.length > 100) return { valid: false, message: 'Name is too long' };
    return { valid: true, message: '' };
}

function calculateVotePercentage(votes, totalVotes) {
    if (typeof votes !== 'number' || typeof totalVotes !== 'number') return 0;
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 1000) / 10; // 1 decimal
}

function getPerformanceLevel(percentage) {
    if (percentage >= 80) return { level: 'Excellent', color: '#00D68F', icon: 'fa-shield-alt' };
    if (percentage >= 60) return { level: 'Good', color: '#FFB800', icon: 'fa-eye' };
    return { level: 'Needs Improvement', color: '#FF4757', icon: 'fa-book-open' };
}

// ========== TESTS ==========

describe('sanitizeHTML', () => {
    test('should escape script tags', () => {
        expect(sanitizeHTML('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });

    test('should escape HTML entities', () => {
        expect(sanitizeHTML('<div>&"\'</div>')).toBe('&lt;div&gt;&amp;&quot;\'&lt;/div&gt;');
    });

    test('should escape img tags with onerror', () => {
        expect(sanitizeHTML('<img src=x onerror=alert(1)>')).toBe('&lt;img src=x onerror=alert(1)&gt;');
    });

    test('should return empty string for null', () => {
        expect(sanitizeHTML(null)).toBe('');
    });

    test('should return empty string for undefined', () => {
        expect(sanitizeHTML(undefined)).toBe('');
    });

    test('should return empty string for number', () => {
        expect(sanitizeHTML(123)).toBe('');
    });

    test('should return empty string for object', () => {
        expect(sanitizeHTML({})).toBe('');
    });

    test('should return empty string for boolean', () => {
        expect(sanitizeHTML(true)).toBe('');
    });

    test('should return empty string for empty string', () => {
        expect(sanitizeHTML('')).toBe('');
    });

    test('should return same text for safe input', () => {
        expect(sanitizeHTML('Hello World')).toBe('Hello World');
    });

    test('should handle unicode characters', () => {
        expect(sanitizeHTML('नमस्ते दुनिया')).toBe('नमस्ते दुनिया');
    });

    test('should handle special characters safely', () => {
        expect(sanitizeHTML('a&b<c>d"e\'f')).toBe('a&amp;b&lt;c&gt;d&quot;e\'f');
    });
});

describe('isValidEmail', () => {
    test('should accept valid email', () => {
        expect(isValidEmail('user@example.com')).toBe(true);
    });

    test('should accept subdomain email', () => {
        expect(isValidEmail('user@mail.domain.co.in')).toBe(true);
    });

    test('should accept email with numbers', () => {
        expect(isValidEmail('user123@test456.com')).toBe(true);
    });

    test('should accept email with dots', () => {
        expect(isValidEmail('first.last@domain.com')).toBe(true);
    });

    test('should accept email with plus', () => {
        expect(isValidEmail('user+tag@gmail.com')).toBe(true);
    });

    test('should reject empty string', () => {
        expect(isValidEmail('')).toBe(false);
    });

    test('should reject missing @', () => {
        expect(isValidEmail('userexample.com')).toBe(false);
    });

    test('should reject missing domain', () => {
        expect(isValidEmail('user@')).toBe(false);
    });

    test('should reject missing local part', () => {
        expect(isValidEmail('@domain.com')).toBe(false);
    });

    test('should reject double @', () => {
        expect(isValidEmail('user@@domain.com')).toBe(false);
    });

    test('should reject null', () => {
        expect(isValidEmail(null)).toBe(false);
    });

    test('should reject undefined', () => {
        expect(isValidEmail(undefined)).toBe(false);
    });

    test('should reject number', () => {
        expect(isValidEmail(123)).toBe(false);
    });

    test('should reject spaces', () => {
        expect(isValidEmail('user @domain.com')).toBe(false);
    });

    test('should reject trailing dot', () => {
        expect(isValidEmail('user@domain.')).toBe(false);
    });
});

describe('validatePassword', () => {
    test('should accept valid password', () => {
        expect(validatePassword('password123')).toEqual({ valid: true, message: '' });
    });

    test('should accept 6 character password', () => {
        expect(validatePassword('123456')).toEqual({ valid: true, message: '' });
    });

    test('should accept 128 character password', () => {
        expect(validatePassword('a'.repeat(128))).toEqual({ valid: true, message: '' });
    });

    test('should reject 5 character password', () => {
        const result = validatePassword('12345');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('6 characters');
    });

    test('should reject empty password', () => {
        const result = validatePassword('');
        expect(result.valid).toBe(false);
    });

    test('should reject 129 character password', () => {
        const result = validatePassword('a'.repeat(129));
        expect(result.valid).toBe(false);
        expect(result.message).toContain('too long');
    });

    test('should reject non-string input', () => {
        const result = validatePassword(123456);
        expect(result.valid).toBe(false);
    });

    test('should reject null', () => {
        const result = validatePassword(null);
        expect(result.valid).toBe(false);
    });
});

describe('formatNumber', () => {
    test('should format zero', () => {
        expect(formatNumber(0)).toBe('0');
    });

    test('should format small number', () => {
        expect(formatNumber(100)).toBe('100');
    });

    test('should format thousand', () => {
        expect(formatNumber(1000)).toBe('1,000');
    });

    test('should format lakh (Indian)', () => {
        expect(formatNumber(100000)).toBe('1,00,000');
    });

    test('should format million', () => {
        expect(formatNumber(1000000)).toBe('10,00,000');
    });

    test('should format large number', () => {
        expect(formatNumber(912000000)).toBe('91,20,00,000');
    });

    test('should handle NaN', () => {
        expect(formatNumber(NaN)).toBe('0');
    });

    test('should handle string input', () => {
        expect(formatNumber('123')).toBe('0');
    });

    test('should handle null', () => {
        expect(formatNumber(null)).toBe('0');
    });

    test('should handle undefined', () => {
        expect(formatNumber(undefined)).toBe('0');
    });
});

describe('validateVoterID', () => {
    test('should accept valid voter ID', () => {
        expect(validateVoterID('ABC1234567')).toEqual({ valid: true, message: '' });
    });

    test('should accept lowercase voter ID', () => {
        expect(validateVoterID('xyz9876543')).toEqual({ valid: true, message: '' });
    });

    test('should accept mixed case voter ID', () => {
        expect(validateVoterID('AbC1234567')).toEqual({ valid: true, message: '' });
    });

    test('should reject empty string', () => {
        const result = validateVoterID('');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('required');
    });

    test('should reject too short', () => {
        expect(validateVoterID('AB123').valid).toBe(false);
    });

    test('should reject letters only', () => {
        expect(validateVoterID('ABCDEFGHI').valid).toBe(false);
    });

    test('should reject numbers only', () => {
        expect(validateVoterID('1234567890').valid).toBe(false);
    });

    test('should reject with special chars', () => {
        expect(validateVoterID('AB@1234567').valid).toBe(false);
    });

    test('should reject null', () => {
        expect(validateVoterID(null).valid).toBe(false);
    });

    test('should reject number', () => {
        expect(validateVoterID(123).valid).toBe(false);
    });
});

describe('validateName', () => {
    test('should accept valid name', () => {
        expect(validateName('Arjun Sharma')).toEqual({ valid: true, message: '' });
    });

    test('should accept 2 character name', () => {
        expect(validateName('AB')).toEqual({ valid: true, message: '' });
    });

    test('should reject single character', () => {
        const result = validateName('A');
        expect(result.valid).toBe(false);
    });

    test('should reject empty string', () => {
        const result = validateName('');
        expect(result.valid).toBe(false);
    });

    test('should reject whitespace only', () => {
        const result = validateName('   ');
        expect(result.valid).toBe(false);
    });

    test('should reject too long name', () => {
        const result = validateName('A'.repeat(101));
        expect(result.valid).toBe(false);
    });

    test('should accept 100 character name', () => {
        expect(validateName('A'.repeat(100)).valid).toBe(true);
    });

    test('should reject null', () => {
        expect(validateName(null).valid).toBe(false);
    });

    test('should reject number', () => {
        expect(validateName(123).valid).toBe(false);
    });
});

describe('calculateVotePercentage', () => {
    test('should calculate correct percentage', () => {
        expect(calculateVotePercentage(50, 200)).toBe(25);
    });

    test('should calculate 100 percent', () => {
        expect(calculateVotePercentage(100, 100)).toBe(100);
    });

    test('should calculate 0 percent', () => {
        expect(calculateVotePercentage(0, 100)).toBe(0);
    });

    test('should return 0 for zero total', () => {
        expect(calculateVotePercentage(50, 0)).toBe(0);
    });

    test('should round to 1 decimal', () => {
        expect(calculateVotePercentage(1, 3)).toBe(33.3);
    });

    test('should handle NaN votes', () => {
        expect(calculateVotePercentage(NaN, 100)).toBe(0);
    });

    test('should handle NaN total', () => {
        expect(calculateVotePercentage(50, NaN)).toBe(0);
    });

    test('should handle negative votes', () => {
        expect(calculateVotePercentage(-10, 100)).toBe(-0.1);
    });
});

describe('getPerformanceLevel', () => {
    test('should return Excellent for 80+', () => {
        const result = getPerformanceLevel(80);
        expect(result.level).toBe('Excellent');
        expect(result.color).toBe('#00D68F');
    });

    test('should return Excellent for 100', () => {
        expect(getPerformanceLevel(100).level).toBe('Excellent');
    });

    test('should return Good for 60-79', () => {
        expect(getPerformanceLevel(60).level).toBe('Good');
        expect(getPerformanceLevel(75).level).toBe('Good');
    });

    test('should return Good color', () => {
        expect(getPerformanceLevel(60).color).toBe('#FFB800');
    });

    test('should return Needs Improvement for below 60', () => {
        expect(getPerformanceLevel(59).level).toBe('Needs Improvement');
    });

    test('should return Needs Improvement for 0', () => {
        expect(getPerformanceLevel(0).level).toBe('Needs Improvement');
    });

    test('should return correct icon for Excellent', () => {
        expect(getPerformanceLevel(90).icon).toBe('fa-shield-alt');
    });

    test('should return correct icon for Good', () => {
        expect(getPerformanceLevel(70).icon).toBe('fa-eye');
    });

    test('should return correct icon for Needs Improvement', () => {
        expect(getPerformanceLevel(30).icon).toBe('fa-book-open');
    });
});

describe('debounce', () => {
    test('should delay function execution', (done) => {
        let count = 0;
        const debounced = debounce(() => { count++; }, 100);
        
        debounced();
        debounced();
        debounced();
        
        expect(count).toBe(0);
        
        setTimeout(() => {
            expect(count).toBe(1);
            done();
        }, 200);
    });

    test('should pass arguments', (done) => {
        let received;
        const debounced = debounce((val) => { received = val; }, 100);
        
        debounced('hello');
        
        setTimeout(() => {
            expect(received).toBe('hello');
            done();
        }, 200);
    });

    test('should reset timer on subsequent calls', (done) => {
        let count = 0;
        const debounced = debounce(() => { count++; }, 100);
        
        debounced();
        
        setTimeout(() => {
            debounced(); // Reset
        }, 50);
        
        setTimeout(() => {
            expect(count).toBe(0); // Should not have fired yet
        }, 120);
        
        setTimeout(() => {
            expect(count).toBe(1);
            done();
        }, 250);
    });
});

describe('throttle', () => {
    test('should limit function calls', () => {
        let count = 0;
        const throttled = throttle(() => { count++; }, 100);
        
        throttled();
        throttled();
        throttled();
        
        expect(count).toBe(1);
    });

    test('should allow call after limit', (done) => {
        let count = 0;
        const throttled = throttle(() => { count++; }, 100);
        
        throttled();
        expect(count).toBe(1);
        
        setTimeout(() => {
            throttled();
            expect(count).toBe(2);
            done();
        }, 150);
    });

    test('should pass arguments', () => {
        let received;
        const throttled = throttle((val) => { received = val; }, 100);
        
        throttled('test');
        expect(received).toBe('test');
    });

    test('should preserve context', () => {
        const obj = {
            value: 42,
            getValue: function() { return this.value; }
        };
        
        let received;
        const throttled = throttle(function() { received = this.value; }, 100);
        throttled.call(obj);
        expect(received).toBe(42);
    });
});
