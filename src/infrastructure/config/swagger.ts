import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'G_ACADEMICA API',
      version: '0.1.0',
      description: 'API de gestión académica — estudiantes, docentes, cursos, inscripciones, calificaciones y reportes',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Desarrollo' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/presentation/routes/*.ts', './src/application/dtos/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
