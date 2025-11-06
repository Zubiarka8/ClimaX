const config = require('../config');

/**
 * CORS Middleware for Fastify
 * Handles Cross-Origin Resource Sharing with configurable origins
 */
const corsMiddleware = (fastify, options, done) => {
    fastify.addHook('onRequest', async (request, reply) => {
        const origin = request.headers.origin;
        const { allowedOrigins, allowedMethods, allowedHeaders, credentials, maxAge } = config.CORS;
        let allowedOrigin = null;
        if (allowedOrigins.includes('*')) {
            allowedOrigin = '*';
        } else if (origin && allowedOrigins.includes(origin)) {
            allowedOrigin = origin;
        } else if (origin) {
            // For development, allow localhost origins even if not explicitly listed
            if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('[::1]')) {
                allowedOrigin = origin;
            }
        }
        if (request.method === 'OPTIONS') {
            if (allowedOrigin) {
                reply.header('Access-Control-Allow-Origin', allowedOrigin);
                reply.header('Access-Control-Allow-Methods', allowedMethods.join(', '));
                reply.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));
                reply.header('Access-Control-Max-Age', maxAge);
                if (credentials) reply.header('Access-Control-Allow-Credentials', 'true');
            }
            return reply.status(204).send();
        }
        if (allowedOrigin) {
            reply.header('Access-Control-Allow-Origin', allowedOrigin);
            reply.header('Access-Control-Allow-Methods', allowedMethods.join(', '));
            reply.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));
            reply.header('Access-Control-Max-Age', maxAge);
            if (credentials) reply.header('Access-Control-Allow-Credentials', 'true');
        }
    });
    done();
};

module.exports = corsMiddleware;
