const userService = require('../services/userService');
const { validateRegistration, validateLogin } = require('../utils/validation');

class UserController {
    /**
     * Get all users (admin only)
     * @param {Object} request - Fastify request object
     * @param {Object} reply - Fastify reply object
     */
    async getAllUsers(request, reply) {
        try {
            const users = await userService.getAllUsers();
            return reply.send({
                success: true,
                data: users,
                count: users.length,
            });
        } catch (error) {
            return reply.status(500).send({
                success: false,
                message: error.message,
                code: 'FETCH_USERS_ERROR',
            });
        }
    }
    /**
     * Check if user exists (for registration validation)
     * @param {Object} request - Fastify request object
     * @param {Object} reply - Fastify reply object
     */
    async checkUserExists(request, reply) {
        try {
        const { email, username } = request.query;
        if (!email && !username) {
            return reply.status(400).send({
                success: false,
                message: 'Email or username is required',
                code: 'MISSING_PARAMETERS',
            });
        }
        const exists = await userService.checkUserExists(email, username);
        return reply.send({
            success: true,
            data: {
                exists: exists.exists,
                byEmail: exists.byEmail,
                byUsername: exists.byUsername,
            },
        });
        } catch (error) {
            return reply.status(500).send({
                success: false,
                message: error.message,
                code: 'CHECK_USER_ERROR',
            });
        }
    }
    /**
     * Register a new user
     * @param {Object} request - Fastify request object
     * @param {Object} reply - Fastify reply object
     */
    async register(request, reply) {
        try {
        const { fullname, email, password, username } = request.body;
        // Validate input data
        const validation = validateRegistration({ fullname, email, password, username });
        if (!validation.isValid) {
            return reply.status(400).send({
                success: false,
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                errors: validation.errors,
            });
        }
        // Check if user already exists
        const userExists = await userService.checkUserExists(email, username);
        if (userExists.exists) {
            const errors = [];
            if (userExists.byEmail) errors.push('User with this email already exists');
            if (userExists.byUsername) errors.push('User with this username already exists');
            return reply.status(409).send({
                success: false,
                message: 'User already exists',
                code: 'USER_EXISTS',
                errors,
            });
        }
        // Create new user
        const newUser = await userService.createUser({
            fullname,
            email,
            password,
            username,
        });
        return reply.status(201).send({
            success: true,
            message: 'User registered successfully',
            data: newUser,
        });
        } catch (error) {
            return reply.status(500).send({
                success: false,
                message: error.message,
                code: 'REGISTRATION_ERROR',
            });
        }
    }
    /**
     * Login user
     * @param {Object} request - Fastify request object
     * @param {Object} reply - Fastify reply object
     */
    async login(request, reply) {
        try {
            const { email, password } = request.body;
            // Validate input data
            const validation = validateLogin({ email, password });
            if (!validation.isValid) {
                return reply.status(400).send({
                    success: false,
                    message: 'Validation failed',
                    code: 'VALIDATION_ERROR',
                    errors: validation.errors,
                });
            }
            // Authenticate user
            const result = await userService.authenticateUser(email, password);
            if (!result.success) {
                return reply.status(401).send({
                    success: false,
                    message: result.message,
                    code: 'AUTHENTICATION_FAILED',
                });
            }
            return reply.send({
                success: true,
                message: 'Login successful',
                data: {
                    user: result.user,
                    token: result.token,
                },
            });
        } catch (error) {
            return reply.status(500).send({
                success: false,
                message: error.message,
                code: 'LOGIN_ERROR',
            });
        }
    }
}

module.exports = new UserController();
