const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const userService = require('../services/userService');

/**
 * Authentication middleware to verify JWT tokens
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @returns {Promise<void>}
 */
const authenticateToken = async (request, reply) => {
    try {
        const authHeader = request.headers.authorization;
        const token = extractTokenFromHeader(authHeader);
        if (!token) {
            return reply.status(401).send({
                success: false,
                message: 'Access token is required',
                code: 'MISSING_TOKEN',
            });
        }
        const decoded = verifyToken(token);
        const user = await userService.getUserByEmail(decoded.email);
        if (!user) {
            return reply.status(401).send({
                success: false,
                message: 'Invalid token - user not found',
                code: 'INVALID_TOKEN',
            });
        }
        request.user = {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            username: user.username,
        };
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return reply.status(401).send({
                success: false,
                message: 'Invalid token',
                code: 'INVALID_TOKEN',
            });
        }
        if (error.name === 'TokenExpiredError') {
            return reply.status(401).send({
                success: false,
                message: 'Token has expired',
                code: 'TOKEN_EXPIRED',
            });
        }
        return reply.status(500).send({
            success: false,
            message: 'Authentication error',
            code: 'AUTH_ERROR',
        });
    }
};
/**
 * Optional authentication middleware - doesn't fail if no token
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @returns {Promise<void>}
 */
const optionalAuth = async (request, reply) => {
    try {
        const authHeader = request.headers.authorization;
        const token = extractTokenFromHeader(authHeader);
        if (!token) return;
        const decoded = verifyToken(token);
        const user = await userService.getUserByEmail(decoded.email);
        if (!user) return;
        request.user = {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            username: user.username,
        };
    } catch (error) {
        // Silently ignore authentication errors for optional auth
    }
};
/**
 * Admin authentication middleware
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @returns {Promise<void>}
 */
const requireAdmin = async (request, reply) => {
    await authenticateToken(request, reply);
    if (reply.sent) return;
    // Check if user is admin
    // For now, we'll assume all authenticated users are admins
    // You can add an 'isAdmin' field to your User model later
    if (!request.user) {
        return reply.status(403).send({
            success: false,
            message: 'Admin access required',
            code: 'ADMIN_REQUIRED',
        });
    }
};

module.exports = {
    authenticateToken,
    optionalAuth,
    requireAdmin,
};
