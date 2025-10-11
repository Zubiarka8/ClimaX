const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * User routes configuration
 * @param {Object} fastify - Fastify instance
 * @param {Object} options - Route options
 */
async function userRoutes(fastify, options) {
    // Public routes (no authentication required)
    /**
     * POST /api/register
     * Register a new user
     */
    fastify.post('/register', {
        schema: {
            description: 'Register a new user',
            tags: ['Authentication'],
            body: {
                type: 'object',
                required: ['fullname', 'email', 'password'],
                properties: {
                    fullname: {
                        type: 'string',
                        minLength: 2,
                        description: 'User full name'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User email address'
                    },
                    password: {
                        type: 'string',
                        minLength: 6,
                        description: 'User password'
                    },
                    username: {
                        type: 'string',
                        minLength: 3,
                        description: 'Username (optional)'
                    }
                }
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer' },
                                fullname: { type: 'string' },
                                email: { type: 'string' },
                                username: { type: 'string' },
                                createdAt: { type: 'string' },
                                updatedAt: { type: 'string' }
                            }
                        }
                    }
                },
                400: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        code: { type: 'string' },
                        errors: { type: 'array' }
                    }
                },
                409: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        code: { type: 'string' },
                        errors: { type: 'array' }
                    }
                }
            }
        }
    }, userController.register);
    /**
     * POST /api/login
     * Login user
     */
    fastify.post('/login', {
        schema: {
            description: 'Login user',
            tags: ['Authentication'],
            body: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User email address'
                    },
                    password: {
                        type: 'string',
                        description: 'User password'
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                user: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer' },
                                        fullname: { type: 'string' },
                                        email: { type: 'string' },
                                        username: { type: 'string' },
                                        createdAt: { type: 'string' },
                                        updatedAt: { type: 'string' }
                                    }
                                },
                                token: { type: 'string' }
                            }
                        }
                    }
                },
                400: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        code: { type: 'string' },
                        errors: { type: 'array' }
                    }
                },
                401: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        code: { type: 'string' }
                    }
                }
            }
        }
    }, userController.login);
    /**
     * GET /api/users/check
     * Check if user exists (for registration validation)
     */
    fastify.get('/check', {
        schema: {
            description: 'Check if user exists by email or username',
            tags: ['Users'],
            querystring: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Email to check'
                    },
                    username: {
                        type: 'string',
                        description: 'Username to check'
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'object',
                            properties: {
                                exists: { type: 'boolean' },
                                byEmail: { type: 'boolean' },
                                byUsername: { type: 'boolean' }
                            }
                        }
                    }
                }
            }
        }
    }, userController.checkUserExists);

    // Admin routes (admin authentication required)
    /**
     * GET /api/users
     * Get all users (admin only)
     */
    fastify.get('/', {
        preHandler: [requireAdmin],
        schema: {
            description: 'Get all users (admin only)',
            tags: ['Admin'],
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer' },
                                    fullname: { type: 'string' },
                                    email: { type: 'string' },
                                    username: { type: 'string' },
                                    createdAt: { type: 'string' },
                                    updatedAt: { type: 'string' }
                                }
                            }
                        },
                        count: { type: 'integer' }
                    }
                }
            }
        }
    }, userController.getAllUsers);
}

module.exports = userRoutes;