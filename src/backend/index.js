const fastify = require('fastify')();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

fastify.get('/', async (request, reply) => {
  try {
    // Prueba simple a la base de datos para verificar conexión
    await prisma.$connect();
    return { message: 'Conexión a la base de datos exitosa' };
  } catch (error) {
    return { message: 'Error de conexión a base de datos', error: error.message };
  } finally {
    await prisma.$disconnect();
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Servidor en http://localhost:3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
