const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

class AuthService {
    constructor() {
        this.token = localStorage.getItem('auth_token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }
    /**
     * Set authentication token and user data
     * @param {string} token - JWT token
     * @param {Object} user - User data
    */
    setAuth(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }
    /**
     * Clear authentication data
     */
    clearAuth() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    }
    /**
     * Get authorization header
     * @returns {Object} - Authorization header
     */
    getAuthHeader() {
        return this.token ? { Authorization: `Bearer ${this.token}` } : {};
    }
    /**
     * Check if user is authenticated
     * @returns {boolean} - Authentication status
     */
    isAuthenticated() {
        return !!this.token && !!this.user;
    }
    /**
     * Make API request with authentication
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise} - API response
     */
    async apiRequest(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader(),
                ...options.headers,
            },
            ...options,
        };
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'API request failed');
            return data;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise} - Registration response
     */
    async register(userData) {
        try {
            const response = await this.apiRequest('/users/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    }
    /**
     * Login user
     * @param {Object} credentials - Login credentials
     * @returns {Promise} - Login response
     */
    async login(credentials) {
        try {
            const response = await this.apiRequest('/users/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });
            if (response.success && response.data) this.setAuth(response.data.token, response.data.user);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    }
    /**
     * Logout user
     */
    logout() {
        this.clearAuth();
    }
    /**
     * Check if user exists
     * @param {string} email - Email to check
     * @param {string} username - Username to check (optional)
     * @returns {Promise} - Existence check response
     */
    async checkUserExists(email, username = null) {
        try {
            const params = new URLSearchParams();
            if (email) params.append('email', email);
            if (username) params.append('username', username);
            const response = await this.apiRequest(`/users/check?${params.toString()}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to check user existence');
        }
    }
    /**
     * Get current user data
     * @returns {Object|null} - Current user data
     */
    getCurrentUser() {
        return this.user;
    }
    /**
     * Get current token
     * @returns {string|null} - Current token
     */
    getToken() {
        return this.token;
    }
}

export const authService = new AuthService();
export default authService;
