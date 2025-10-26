/**
 * Global error handler middleware
 * @param {Error} error - Error object
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
const errorHandler = (error, request, reply) => {
    console.error('Error:', error);
    let statusCode = 500;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message;
        code = error.code || 'CUSTOM_ERROR';
    } else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error';
        code = 'VALIDATION_ERROR';
    } else if (error.name === 'PrismaClientKnownRequestError') {
        statusCode = 400;
        message = 'Database error';
        code = 'DATABASE_ERROR';
    }
    reply.status(statusCode).send({
        success: false,
        message,
        code,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};

/**
 * 404 handler for undefined routes
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
const notFoundHandler = (request, reply) => {
    reply.status(404).send({
        success: false,
        message: 'Route not found',
        code: 'NOT_FOUND',
        path: request.url,
    });
};

module.exports = {
    errorHandler,
    notFoundHandler,
};
