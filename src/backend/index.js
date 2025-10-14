const fastify = require('fastify')({
  logger: false
});

const config = require('./config');
const prisma = require('./config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const corsMiddleware = require('./middleware/cors');
const registerRoutes = require('./routes');

// Register CORS middleware
fastify.register(corsMiddleware);

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
      port: config.PORT,
      host: '0.0.0.0'
    });
    console.log(`🚀 ClimaX API server running on http://localhost:${config.PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${config.PORT}/api`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
