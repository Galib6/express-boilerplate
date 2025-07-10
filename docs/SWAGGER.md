# Swagger API Documentation

## Overview

This project uses Swagger (via swagger-jsdoc and swagger-ui-express) to provide API documentation. 

## Accessing the Documentation

When the server is running, the Swagger documentation is available at:
- `http://localhost:{PORT}/api-docs`

## How to Document API Endpoints

This project follows a structured approach to Swagger documentation:

1. **Create .doc.ts files**: Place Swagger JSDoc comments in separate `.doc.ts` files next to your route files
2. **Use reference schemas**: Define reusable schemas in `swagger.config.ts` 
3. **Document with JSDoc**: Use `@swagger` annotations to document API endpoints

### Quick Reference

#### Basic Endpoint Documentation

```typescript
/**
 * @swagger
 * /v1/resource:
 *   get:
 *     summary: Short description
 *     tags: [ResourceName]
 *     responses:
 *       200:
 *         description: Success response
 */
```

#### Path Parameters

```typescript
/**
 * @swagger
 * /v1/resource/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
```

#### Query Parameters

```typescript
/**
 * @swagger
 * /v1/resource:
 *   get:
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 */
```

#### Request Body

```typescript
/**
 * @swagger
 * /v1/resource:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceInput'
 */
```

#### Authentication

```typescript
/**
 * @swagger
 * /v1/protected:
 *   get:
 *     security:
 *       - bearerAuth: []
 */
```

#### Using References

```typescript
/**
 * @swagger
 * /v1/resource:
 *   post:
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResourceResponse'
 */
```

## Templates

See `src/features/user/routes/user.routes.doc.templates.ts` for comprehensive examples of how to document different types of API endpoints.

```
http://localhost:<PORT>/api-docs
```

## Documenting New Endpoints

To document new endpoints, follow these best practices:

### 1. Use JSDoc Comments in Route Files

Add JSDoc comments with Swagger annotations to your route files:

```typescript
/**
 * @swagger
 * /api/example:
 *   get:
 *     summary: Example endpoint
 *     description: A more detailed description of the endpoint
 *     tags: [Example]
 *     parameters:
 *       - name: query
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
```

### 2. Add Schemas to Central Configuration

For reusable components, add them to the `swagger.config.ts` file's `swaggerDefinition.components.schemas` section.

### 3. Create Dedicated Documentation Files

For complex features, consider creating a dedicated `.doc.ts` file alongside your route file, like:

```
feature/
  routes/
    feature.routes.ts
    feature.routes.doc.ts
```

## Security

To mark an endpoint as requiring authentication, add the security requirement:

```typescript
/**
 * @swagger
 * /api/secured:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     // other properties
 */
```

To explicitly mark an endpoint as not requiring authentication, use an empty security array:

```typescript
/**
 * @swagger
 * /api/public:
 *   post:
 *     security: []
 *     // other properties
 */
```

## Best Practices

1. Always include a summary and description for each endpoint
2. Group related endpoints with tags
3. Document all possible response types and their formats
4. Include examples where possible
5. Keep the documentation in sync with the actual implementation
