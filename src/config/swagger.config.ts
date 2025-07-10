import { Application, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { env } from './env-config';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express TypeScript Prisma PostgreSQL API',
    version: '1.0.0',
    description: 'A production-ready RESTful API using Express, TypeScript, Prisma, and PostgreSQL',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
    contact: {
      name: 'API Support',
      url: 'https://yourwebsite.com',
      email: 'support@yourwebsite.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Development Server',
    },
    {
      url: 'https://api.yourproduction.com',
      description: 'Production Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // Error response
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error message',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },

      // User schemas
      LoginInput: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', example: 'Password1!' },
        },
        required: ['email', 'password'],
      },
      RegisterInput: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          firstName: { type: 'string', example: 'John' },
          password: { type: 'string', example: 'Password1!' },
          password2: { type: 'string', example: 'Password1!' },
        },
        required: ['email', 'firstName', 'password', 'password2'],
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Login successful' },
          data: {
            type: 'object',
            properties: {
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              user: { $ref: '#/components/schemas/User' },
            },
          },
        },
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Registration successful' },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
            },
          },
        },
      },
      ProfileResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Profile retrieved successfully' },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
            },
          },
        },
      },
    },
    responses: {
      // Common response patterns
      BadRequest: {
        description: 'Bad Request - Invalid input data',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'Validation error',
              errors: [
                { field: 'email', message: 'Invalid email format' },
                { field: 'password', message: 'Password must be at least 8 characters' },
              ],
            },
          },
        },
      },
      Unauthorized: {
        description: 'Unauthorized - Authentication required',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'Authentication required',
            },
          },
        },
      },
      Forbidden: {
        description: 'Forbidden - Insufficient permissions',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'Insufficient permissions',
            },
          },
        },
      },
      NotFound: {
        description: 'Not Found - Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'Resource not found',
            },
          },
        },
      },
      InternalServerError: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'Internal server error',
            },
          },
        },
      },
    },
  },
  // Global security requirement
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: [
    './src/features/*/routes/*.ts',
    './src/features/*/routes/*.doc.ts',
    './src/features/*/types/*.ts',
    './src/docs/*.yml',
  ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Function to setup our Swagger
export const setupSwagger = (app: Application): void => {
  // Swagger page
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API Documentation',
    }),
  );

  // Docs in JSON format
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger documentation available at /api-docs');
};
