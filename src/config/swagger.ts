import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API',
            version: '1.0.0',
            description: 'API documentation for your project',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // Optional, but recommended
                },
            },
        },
        security: [
            {
                bearerAuth: [], // Apply this security globally to all routes
            },
        ],
        servers: [
            {
                url: 'http://localhost:3000', // Your server URL
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Adjust the path as needed
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
