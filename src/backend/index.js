const fastify = require('fastify')({
  logger: false
});

const {
  PORT,
  HOST,
  APP_NAME,
  APP_VERSION,
  IS_DEVELOPMENT,
  OPEN_METEO_API_URL,
  GEOCODING_API_URL
} = require('./env.config.js');
const prisma = require('./config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const config = require('./config');
const registerRoutes = require('./routes');

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const { allowedOrigins } = config.CORS;
        // Check if origin is explicitly allowed
        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        // For development, allow localhost origins (IPv4 and IPv6)
        if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('[::1]')) {
            return callback(null, true);
        }
        // Reject other origins
        callback(new Error('Not allowed by CORS'));
    },
    methods: config.CORS.allowedMethods,
    allowedHeaders: config.CORS.allowedHeaders,
    credentials: config.CORS.credentials,
    maxAge: config.CORS.maxAge
};

fastify.register(require('@fastify/cors'), corsOptions);

// Make Prisma available to routes
fastify.decorate('prisma', prisma);
fastify.register(registerRoutes);
fastify.setErrorHandler(errorHandler);
fastify.setNotFoundHandler(notFoundHandler);
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  try {
    await fastify.close();
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const start = async () => {
  try {
    await fastify.listen({
      port: PORT,
      host: HOST
    });
    console.log(`🚀 ${APP_NAME} v${APP_VERSION} server running on http://${HOST}:${PORT}`);
    console.log(`📚 API Documentation available at http://${HOST}:${PORT}/api`);
    console.log(`🌤️ Weather API: ${OPEN_METEO_API_URL}`);
    console.log(`📍 Geocoding API: ${GEOCODING_API_URL}`);
    if (IS_DEVELOPMENT) {
      console.log(`🔧 Development mode enabled`);
    }
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
