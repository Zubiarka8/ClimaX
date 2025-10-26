import { ref, computed } from 'vue';
import { authService } from '../services/authService.js';

const user = ref(authService.getCurrentUser());
const token = ref(authService.getToken());
const isLoading = ref(false);
const error = ref(null);

const isAuthenticated = computed(() => !!token.value && !!user.value);

const setUser = (userData) => {
    user.value = userData;
};

const setToken = (tokenValue) => {
    token.value = tokenValue;
};

const setLoading = (loading) => {
    isLoading.value = loading;
};

const setError = (errorMessage) => {
    error.value = errorMessage;
};

const clearError = () => {
    error.value = null;
};

const login = async (credentials) => {
    try {
        setLoading(true);
        clearError();
        const response = await authService.login(credentials);
        if (response.success) {
            setUser(response.data.user);
            setToken(response.data.token);
            return response;
        } else {
            throw new Error(response.message || 'Login failed');
        }
    } catch (err) {
        const errorMessage = err.message || 'Login failed';
        setError(errorMessage);
        throw new Error(errorMessage);
    } finally {
        setLoading(false);
    }
};

const register = async (userData) => {
    try {
        setLoading(true);
        clearError();
        const response = await authService.register(userData);
        if (response.success) {
            return await login({
                email: userData.email,
                password: userData.password,
            });
        } else {
            throw new Error(response.message || 'Registration failed');
        }
    } catch (err) {
        const errorMessage = err.message || 'Registration failed';
        setError(errorMessage);
        throw new Error(errorMessage);
    } finally {
        setLoading(false);
    }
};

const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    clearError();
};

const checkUserExists = async (email, username = null) => {
    try {
        clearError();
        const response = await authService.checkUserExists(email, username);
        return response;
    } catch (err) {
        const errorMessage = err.message || 'Failed to check user existence';
        setError(errorMessage);
        throw new Error(errorMessage);
    }
};


const initializeAuth = () => {
    const currentUser = authService.getCurrentUser();
    const currentToken = authService.getToken();
    if (currentUser && currentToken) {
        setUser(currentUser);
        setToken(currentToken);
    }
};

export const useAuthStore = () => {
    return {
        user: computed(() => user.value),
        token: computed(() => token.value),
        isLoading: computed(() => isLoading.value),
        error: computed(() => error.value),
        isAuthenticated,
        login,
        register,
        logout,
        checkUserExists,
        setUser,
        setToken,
        setLoading,
        setError,
        clearError,
        initializeAuth,
    };
};

initializeAuth();
