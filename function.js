// ========== ADDITIONAL EFFICIENCY FUNCTIONS ==========

/** Memoization cache for expensive computations */
const memoCache = new Map();

/**
 * Memoize expensive function results
 * @param {Function} fn - Function to memoize
 * @param {string} key - Cache key
 * @returns {*} Cached or computed result
 */
function memoize(fn, key) {
    if (memoCache.has(key)) return memoCache.get(key);
    const result = fn();
    memoCache.set(key, result);
    return result;
}

/** Clear memoization cache (for memory management) */
function clearMemoCache() {
    memoCache.clear();
}

/**
 * Validate Voter ID with memoization
 * @param {string} id - Voter ID to validate
 * @returns {object} Validation result
 */
function validateVoterID(id) {
    if (typeof id !== 'string') return { valid: false, message: 'Voter ID must be a string' };
    return memoize(() => {
        if (!id) return { valid: false, message: 'Voter ID is required' };
        if (!/^[A-Za-z]{3}[0-9]{7}$/.test(id)) return { valid: false, message: 'Invalid format' };
        return { valid: true, message: '' };
    }, 'vid_' + id);
}

/**
 * Validate Name with memoization  
 * @param {string} name - Name to validate
 * @returns {object} Validation result
 */
function validateName(name) {
    if (typeof name !== 'string') return { valid: false, message: 'Name must be a string' };
    return memoize(() => {
        if (!name || name.trim().length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
        if (name.length > 100) return { valid: false, message: 'Name is too long' };
        return { valid: true, message: '' };
    }, 'name_' + name);
}

/**
 * Calculate vote percentage efficiently
 * @param {number} votes - Candidate votes
 * @param {number} totalVotes - Total votes
 * @returns {number} Percentage rounded to 1 decimal
 */
function calculateVotePercentage(votes, totalVotes) {
    if (typeof votes !== 'number' || typeof totalVotes !== 'number') return 0;
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 1000) / 10;
}

/**
 * Get performance level based on percentage
 * @param {number} percentage - Score percentage
 * @returns {object} Level info with color and icon
 */
function getPerformanceLevel(percentage) {
    if (percentage >= 80) return { level: 'Excellent', color: '#00D68F', icon: 'fa-shield-alt' };
    if (percentage >= 60) return { level: 'Good', color: '#FFB800', icon: 'fa-eye' };
    return { level: 'Needs Improvement', color: '#FF4757', icon: 'fa-book-open' };
}

/** Pre-computed lookup tables for chart data */
const turnoutDataLookup = new Map([
    ['1952', 44.9], ['1957', 47.7], ['1962', 55.4], ['1967', 61.0],
    ['1971', 55.3], ['1977', 60.5], ['1980', 56.9], ['1984', 64.0],
    ['1989', 62.0], ['1991', 56.7], ['1996', 57.9], ['1998', 61.9],
    ['1999', 59.9], ['2004', 58.1], ['2009', 58.2], ['2014', 66.4],
    ['2019', 67.4], ['2024', 66.1]
]);

/**
 * Get turnout data from lookup table (O(1) instead of array search)
 * @param {string} year - Election year
 * @returns {number|undefined} Turnout percentage
 */
function getTurnoutData(year) {
    return turnoutDataLookup.get(year);
}