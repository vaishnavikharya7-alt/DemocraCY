// JSDoc comments
/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHTML(str) { ... }

// Proper state management
const state = {
    currentStep: -1,
    selectedCandidate: null,
    // ...
};

// Utility functions extracted
function debounce(func, wait = 100) { ... }
function throttle(func, limit = 100) { ... }
function formatNumber(num) { ... }

// Object.freeze for immutable data
const processSteps = Object.freeze([...]);
const fraudScenarios = Object.freeze([...]);