// This file contains guidance on how to document your API endpoints for Swagger
// It is meant to be a reference, not actual code to be executed

// Example 1: Basic GET endpoint
// -----------------------------------------
// Copy and paste this into your .doc.ts file:
/**
 * @swagger
 * /v1/resource:
 *   get:
 *     summary: Get all resources
 *     description: Retrieve a list of all resources
 *     tags: [Resource]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Resource'
 */

// Example 2: GET with Path Parameter
// -----------------------------------------
/**
 * @swagger
 * /v1/resource/{id}:
 *   get:
 *     summary: Get resource by ID
 *     tags: [Resource]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 */

// Example 3: POST with Request Body
// -----------------------------------------
/**
 * @swagger
 * /v1/resource:
 *   post:
 *     summary: Create a resource
 *     tags: [Resource]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceInput'
 *     responses:
 *       201:
 *         description: Resource created
 *       400:
 *         description: Invalid input
 */

// Example 4: GET with Query Parameters
// -----------------------------------------
/**
 * @swagger
 * /v1/resource/search:
 *   get:
 *     summary: Search resources
 *     tags: [Resource]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Success
 */

// Example 5: Authenticated Endpoint
// -----------------------------------------
/**
 * @swagger
 * /v1/resource/protected:
 *   get:
 *     summary: Protected resource
 *     tags: [Resource]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

// Best Practices for Writing API Documentation
// ---------------------------------------------
// 1. Keep a separate .doc.ts file for each feature module
// 2. Use schema references ($ref) instead of duplicating schemas
// 3. Always include proper response schemas
// 4. Document authentication requirements
// 5. Group endpoints by tags
// 6. Use descriptive summaries and descriptions
// 7. Document all possible response codes
// 8. Include examples where helpful
