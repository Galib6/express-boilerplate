/**
 * 🌟 Central API Documentation Hub
 *
 * This is the ONE place to manage all API documentation.
 * Simple, maintainable, and follows industry standards.
 */

import { Application } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { env } from '../config/env-config';

// 📋 Central Schema Registry
export const APISchemas = {
  // Common schemas used across all endpoints
  Error: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Error message' },
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

  // Pagination wrapper
  PaginatedResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: { type: 'array', items: {} },
      pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 100 },
          totalPages: { type: 'integer', example: 10 },
        },
      },
    },
  },

  // Standard success response
  SuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Operation successful' },
      data: { type: 'object' },
    },
  },

  // User-related schemas
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

  UserInput: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email', example: 'user@example.com' },
      firstName: { type: 'string', example: 'John' },
      password: { type: 'string', example: 'Password1!', minLength: 8 },
    },
    required: ['email', 'firstName', 'password'],
  },

  LoginInput: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email', example: 'user@example.com' },
      password: { type: 'string', example: 'Password1!' },
    },
    required: ['email', 'password'],
  },

  AuthResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Authentication successful' },
      data: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
    },
  },
};

// 🔧 Standard Response Templates
export const StandardResponses = {
  200: {
    description: 'Success',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/SuccessResponse' },
      },
    },
  },
  201: {
    description: 'Created',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/SuccessResponse' },
      },
    },
  },
  400: {
    description: 'Bad Request',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Error' },
        example: {
          success: false,
          message: 'Validation error',
          errors: [{ field: 'email', message: 'Invalid email format' }],
        },
      },
    },
  },
  401: {
    description: 'Unauthorized',
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
  403: {
    description: 'Forbidden',
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
  404: {
    description: 'Not Found',
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
  500: {
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
};

// 📖 Main Documentation Configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express TypeScript API',
    version: '1.0.0',
    description: `
## 🚀 Modern RESTful API

This API provides a robust backend service built with:
- **Express.js** + **TypeScript** for type safety
- **Prisma** + **PostgreSQL** for data management  
- **JWT Authentication** for security
- **Comprehensive validation** and error handling
    `,
    contact: {
      name: 'API Support',
      email: 'support@yourapi.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT || 3000}`,
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
        description: 'Enter your JWT token',
      },
    },
    schemas: APISchemas,
    responses: StandardResponses,
    parameters: {
      PageParam: {
        in: 'query',
        name: 'page',
        schema: { type: 'integer', minimum: 1, default: 1 },
        description: 'Page number for pagination',
      },
      LimitParam: {
        in: 'query',
        name: 'limit',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        description: 'Number of items per page',
      },
      SearchParam: {
        in: 'query',
        name: 'search',
        schema: { type: 'string' },
        description: 'Search term for filtering results',
      },
      IdParam: {
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'Resource ID',
      },
    },
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User registration, login, and profile management',
    },
    {
      name: 'Users',
      description: 'User management operations',
    },
    {
      name: 'Health',
      description: 'API health and status endpoints',
    },
  ],
};

// Swagger JSDoc options
const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ['./src/features/*/routes/*.ts', './src/features/*/controllers/*.ts', './src/app.ts'],
};

// Generate Swagger spec
const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * 🎨 Setup Multiple Documentation Formats
 */
export const setupDocumentation = (app: Application): void => {
  // 1. Swagger UI (Interactive)
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info { margin: 20px 0; }
        .swagger-ui .info .title { color: #2563eb; }
      `,
      customSiteTitle: 'API Documentation | Your API',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true,
      },
    }),
  );

  // 2. Raw OpenAPI JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // 3. Postman Collection (Auto-generated)
  app.get('/postman-collection.json', (req, res) => {
    // Simple Postman collection generation
    const collection = {
      info: {
        name: 'Express TypeScript API',
        description: 'Auto-generated from OpenAPI spec',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      auth: {
        type: 'bearer',
        bearer: [{ key: 'token', value: '{{authToken}}', type: 'string' }],
      },
      variable: [
        { key: 'baseUrl', value: `http://localhost:${env.PORT || 3000}`, type: 'string' },
        { key: 'authToken', value: '', type: 'string' },
      ],
      item: [], // Would need full implementation
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(collection);
  });

  // 4. API Status/Health page
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      message: 'API is healthy',
      data: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        environment: env.NODE_ENV || 'development',
        documentation: {
          swagger: '/api-docs',
          openapi: '/api-docs.json',
          postman: '/postman-collection.json',
        },
      },
    });
  });

  console.log('📚 Documentation available at:');
  console.log(`   • Swagger UI: http://localhost:${env.PORT || 3000}/api-docs`);
  console.log(`   • OpenAPI:    http://localhost:${env.PORT || 3000}/api-docs.json`);
  console.log(`   • Health:     http://localhost:${env.PORT || 3000}/api/health`);
};

/**
 * 🏷️ Simple Documentation Helpers
 */
export const DocHelpers = {
  // Quick endpoint documentation
  endpoint: (config: {
    method: string;
    path: string;
    summary: string;
    description?: string;
    tags: string[];
    auth?: boolean;
    body?: string;
    responses?: number[];
  }) => `
/**
 * @swagger
 * ${config.path}:
 *   ${config.method.toLowerCase()}:
 *     summary: ${config.summary}
 *     description: ${config.description || config.summary}
 *     tags: [${config.tags.join(', ')}]${config.auth ? '\n *     security:\n *       - bearerAuth: []' : ''}${config.body ? `\n *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n *             $ref: '#/components/schemas/${config.body}'` : ''}
 *     responses:${(config.responses || [200, 400, 500]).map(code => `\n *       ${code}:\n *         $ref: '#/components/responses/${code}'`).join('')}
 */`,

  // For CRUD operations
  crud: (resource: string, schema: string) => ({
    list: DocHelpers.endpoint({
      method: 'GET',
      path: `/api/${resource}`,
      summary: `List ${resource}`,
      description: `Get paginated list of ${resource}`,
      tags: [resource.charAt(0).toUpperCase() + resource.slice(1)],
      auth: true,
      responses: [200, 401, 500],
    }),

    get: DocHelpers.endpoint({
      method: 'GET',
      path: `/api/${resource}/{id}`,
      summary: `Get ${resource}`,
      description: `Get a specific ${resource} by ID`,
      tags: [resource.charAt(0).toUpperCase() + resource.slice(1)],
      auth: true,
      responses: [200, 401, 404, 500],
    }),

    create: DocHelpers.endpoint({
      method: 'POST',
      path: `/api/${resource}`,
      summary: `Create ${resource}`,
      description: `Create a new ${resource}`,
      tags: [resource.charAt(0).toUpperCase() + resource.slice(1)],
      auth: true,
      body: schema,
      responses: [201, 400, 401, 500],
    }),

    update: DocHelpers.endpoint({
      method: 'PUT',
      path: `/api/${resource}/{id}`,
      summary: `Update ${resource}`,
      description: `Update an existing ${resource}`,
      tags: [resource.charAt(0).toUpperCase() + resource.slice(1)],
      auth: true,
      body: schema,
      responses: [200, 400, 401, 404, 500],
    }),

    delete: DocHelpers.endpoint({
      method: 'DELETE',
      path: `/api/${resource}/{id}`,
      summary: `Delete ${resource}`,
      description: `Delete a ${resource}`,
      tags: [resource.charAt(0).toUpperCase() + resource.slice(1)],
      auth: true,
      responses: [200, 401, 404, 500],
    }),
  }),
};

export default swaggerSpec;
