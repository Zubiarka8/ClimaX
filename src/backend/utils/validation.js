/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and message
 */
const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return {
            isValid: false,
            message: 'Password must be at least 6 characters long',
        };
    }
    if (password.length > 128) {
        return {
            isValid: false,
            message: 'Password must be less than 128 characters',
        };
    }
    return {
        isValid: true,
        message: 'Password is valid',
    };
};

/**
 * Validate user registration data
 * @param {Object} data - User registration data
 * @returns {Object} - Validation result
 */
const validateRegistration = (data) => {
    const errors = [];
    if (!data.fullname || data.fullname.trim().length < 2) errors.push('Full name must be at least 2 characters long');
    if (!data.email || !isValidEmail(data.email)) errors.push('Valid email is required');
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) errors.push(passwordValidation.message);
    if (data.username && data.username.trim().length < 3) errors.push('Username must be at least 3 characters long');
    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate user login data
 * @param {Object} data - User login data
 * @returns {Object} - Validation result
 */
const validateLogin = (data) => {
    const errors = [];
    if (!data.email || !isValidEmail(data.email)) errors.push('Valid email is required');
    if (!data.password || data.password.length < 1) errors.push('Password is required');
    return {
        isValid: errors.length === 0,
        errors,
    };
};

module.exports = {
    isValidEmail,
    validatePassword,
    validateRegistration,
    validateLogin,
};
