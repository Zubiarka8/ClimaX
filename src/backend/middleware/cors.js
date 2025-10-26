const config = require('../config');

/**
 * CORS Middleware for Fastify
 * Handles Cross-Origin Resource Sharing with configurable origins
 */
const corsMiddleware = (fastify, options, done) => {
    fastify.addHook('preHandler', async (request, reply) => {
        const origin = request.headers.origin;
        const { allowedOrigins, allowedMethods, allowedHeaders, credentials, maxAge } = config.CORS;
        if (allowedOrigins.includes('*')) {
            reply.header('Access-Control-Allow-Origin', '*');
        } else if (allowedOrigins.includes(origin)) {
            reply.header('Access-Control-Allow-Origin', origin);
        } else {
            // For development, allow localhost origins even if not explicitly listed
            if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
                reply.header('Access-Control-Allow-Origin', origin);
            }
        }
        reply.header('Access-Control-Allow-Methods', allowedMethods.join(', '));
        reply.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));
        reply.header('Access-Control-Max-Age', maxAge);
        if (credentials) reply.header('Access-Control-Allow-Credentials', 'true');
        if (request.method === 'OPTIONS') {
            reply.status(200).send();
            return;
        }
    });
    done();
};

module.exports = corsMiddleware;
