const config = require('../config');

/**
 * CORS Middleware for Fastify
 * Handles Cross-Origin Resource Sharing with configurable origins
 */
const corsMiddleware = (fastify, options, done) => {
    fastify.addHook('preHandler', async (request, reply) => {
        const origin = request.headers.origin;
        const { allowedOrigins, allowedMethods, allowedHeaders, credentials, maxAge } = config.CORS;
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            reply.header('Access-Control-Allow-Origin', origin);
        } else if (allowedOrigins.includes('*')) {
            reply.header('Access-Control-Allow-Origin', '*');
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
