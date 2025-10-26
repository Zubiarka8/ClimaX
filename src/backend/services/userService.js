const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

class UserService {
    /**
     * Get all users (for admin purposes)
     * @returns {Promise<Array>} - Array of users
     */
    async getAllUsers() {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    fullname: true,
                    email: true,
                    username: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return users;
        } catch (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }
    /**
     * Get user by email
     * @param {string} email - User email
     * @returns {Promise<Object|null>} - User object or null
     */
    async getUserByEmail(email) {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });
            return user;
        } catch (error) {
            throw new Error(`Failed to fetch user by email: ${error.message}`);
        }
    }
    /**
     * Get user by username
     * @param {string} username - Username
     * @returns {Promise<Object|null>} - User object or null
     */
    async getUserByUsername(username) {
        try {
            const user = await prisma.user.findUnique({
                where: { username },
            });
            return user;
        } catch (error) {
            throw new Error(`Failed to fetch user by username: ${error.message}`);
        }
    }
    /**
     * Check if user exists by email or username
     * @param {string} email - User email
     * @param {string} username - Username (optional)
     * @returns {Promise<Object>} - Existence check result
     */
    async checkUserExists(email, username = null) {
        try {
            const userByEmail = await this.getUserByEmail(email);
            const userByUsername = username ? await this.getUserByUsername(username) : null;
            return {
                exists: !!(userByEmail || userByUsername),
                byEmail: !!userByEmail,
                byUsername: !!userByUsername,
                user: userByEmail || userByUsername,
            };
        } catch (error) {
            throw new Error(`Failed to check user existence: ${error.message}`);
        }
    }
    /**
     * Create a new user
     * @param {Object} userData - User data
     * @returns {Promise<Object>} - Created user (without password)
     */
    async createUser(userData) {
        try {
            const hashedPassword = await hashPassword(userData.password);
            const user = await prisma.user.create({
                data: {
                    fullname: userData.fullname,
                    email: userData.email,
                    password: hashedPassword,
                    username: userData.username || null,
                },
                select: {
                    id: true,
                    fullname: true,
                    email: true,
                    username: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return user;
        } catch (error) {
            if (error.code === 'P2002') throw new Error('User with this email or username already exists');
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }
    /**
     * Authenticate user login
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} - Authentication result
     */
    async authenticateUser(email, password) {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                return {
                    success: false,
                    message: 'Invalid email or password',
                };
            }
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Invalid email or password',
                };
            }
            const token = generateToken({
                id: user.id,
                email: user.email,
                fullname: user.fullname,
            });
            const userData = {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            return {
                success: true,
                user: userData,
                token,
            };
        } catch (error) {
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }
}

module.exports = new UserService();
