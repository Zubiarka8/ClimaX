const userRoutes = require('./userRoutes');

/**
 * Register all routes
 * @param {Object} fastify - Fastify instance
 */
async function registerRoutes(fastify) {
    fastify.get('/', async (request, reply) => {
        try {
            await fastify.prisma.$connect();
            return {
                success: true,
                message: 'ClimaX API is running',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                database: 'connected'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Database connection failed',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    });
    fastify.get('/health', async (request, reply) => {
        return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
        };
    });
    fastify.register(userRoutes, { prefix: '/api/users' });
    fastify.get('/api', async (request, reply) => {
        return {
            success: true,
            message: 'ClimaX API',
            version: '1.0.0',
            endpoints: {
                auth: {
                    'POST /api/users/register': 'Register a new user',
                    'POST /api/users/login': 'Login user',
                    'GET /api/users/check': 'Check if user exists'
                },
                users: {
                    'GET /api/users': 'Get all users (admin only)'
                },
                system: {
                    'GET /': 'API health check',
                    'GET /health': 'System health check',
                    'GET /api': 'API information'
                }
            }
        };
    });
}

module.exports = registerRoutes;
