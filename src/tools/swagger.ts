import jsdoc from 'swagger-jsdoc';

export const swaggerDocs = jsdoc({
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'DDD Node - API',
      version: '1.0.0',
    },
    servers: [
      {
        url: '/',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-JWT',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['dist/**/**/**/**/**/*.action.js', 'src/**/**/**/**/**/*.action.ts'],
});
