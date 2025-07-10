# NestJS-Style Decorators for Express + Swagger + Zod

## 🎯 **Overview**

This decorator system brings NestJS-style decorators to your Express application, providing:
- **Automatic Swagger documentation generation**
- **Built-in Zod schema validation** 
- **Clean, declarative API definitions**
- **Type-safe request/response handling**

## 🚀 **Setup Instructions**

### 1. Enable Experimental Decorators

Add these settings to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "ES2020",
    "lib": ["ES2020"]
  }
}
```

### 2. Available Decorators

#### **HTTP Method Decorators**
```typescript
@Get('/path')           // GET endpoint
@Post('/path')          // POST endpoint  
@Put('/path')           // PUT endpoint
@Delete('/path')        // DELETE endpoint
@Patch('/path')         // PATCH endpoint
```

#### **API Documentation Decorators**
```typescript
@ApiController('/base-path')    // Class decorator for base path
@ApiOperation({ summary, description })  // Method description
@ApiTags('tag1', 'tag2')       // Group endpoints by tags
@ApiResponse(statusCode, options)  // Response documentation
@ApiBearerAuth()               // Require JWT authentication
```

#### **Validation Decorators**
```typescript
@ApiBody(zodSchema, 'description')     // Request body validation
@ApiParam('name', zodSchema, 'desc')   // Path parameter validation  
@ApiQuery('name', zodSchema, 'desc')   // Query parameter validation
```

#### **Middleware Decorators**
```typescript
@UseMiddleware(middleware1, middleware2)  // Apply Express middlewares
```

## 📝 **Usage Examples**

### Basic Controller Example

```typescript
import { Request, Response } from 'express';
import { z } from 'zod';
import { 
  Get, Post, ApiOperation, ApiTags, ApiBody, 
  ApiResponse, ApiBearerAuth, UseMiddleware 
} from '../decorators/api.decorators';
import { auth } from '../middleware/auth.middleware';

// Define Zod schemas
const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  password: z.string().min(8)
});

export class UserController {
  @Get('/users')
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Retrieve a list of all users' 
  })
  @ApiTags('Users')
  @ApiResponse(200, { description: 'List of users retrieved successfully' })
  async getUsers(req: Request, res: Response) {
    // Your implementation here
    res.json({ users: [] });
  }

  @Post('/users')
  @ApiOperation({ 
    summary: 'Create user',
    description: 'Create a new user account' 
  })
  @ApiTags('Users')
  @ApiBody(createUserSchema, 'User creation data')
  @ApiResponse(201, { description: 'User created successfully' })
  @ApiResponse(400, { description: 'Validation error' })
  async createUser(req: Request, res: Response) {
    // req.body is automatically validated against createUserSchema
    const userData = req.body;
    res.status(201).json({ message: 'User created', data: userData });
  }

  @Get('/users/profile')
  @UseMiddleware(auth)  // Apply authentication middleware
  @ApiBearerAuth()      // Require Bearer token in Swagger
  @ApiOperation({ 
    summary: 'Get user profile',
    description: 'Get the authenticated user profile' 
  })
  @ApiTags('Users')
  @ApiResponse(200, { description: 'Profile retrieved successfully' })
  @ApiResponse(401, { description: 'Unauthorized' })
  async getProfile(req: Request, res: Response) {
    const user = (req as any).user;  // Added by auth middleware
    res.json({ profile: user });
  }
}
```

### Advanced Example with Validation

```typescript
import { z } from 'zod';

const getUsersQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val)).optional(),
  limit: z.string().transform(val => parseInt(val)).optional(),
  search: z.string().optional()
});

const userParamsSchema = z.object({
  id: z.string().uuid('Invalid user ID format')
});

export class AdvancedUserController {
  @Get('/users')
  @ApiOperation({ summary: 'Get users with pagination' })
  @ApiQuery('page', z.string().optional(), 'Page number')
  @ApiQuery('limit', z.string().optional(), 'Items per page') 
  @ApiQuery('search', z.string().optional(), 'Search term')
  async getUsers(req: Request, res: Response) {
    // req.query is validated and transformed
    const { page = 1, limit = 10, search } = req.query;
    res.json({ users: [], pagination: { page, limit, search } });
  }

  @Get('/users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam('id', z.string().uuid(), 'User UUID')
  @ApiResponse(200, { description: 'User found' })
  @ApiResponse(404, { description: 'User not found' })
  async getUserById(req: Request, res: Response) {
    // req.params.id is validated as UUID
    const { id } = req.params;
    res.json({ user: { id } });
  }
}
```

## 🔧 **Creating Routes from Controllers**

Use the `createRouterFromController` helper to generate Express routes:

```typescript
import { createRouterFromController } from '../decorators/router.generator';
import { UserController } from './controllers/user.controller';

// Create controller instance
const userController = new UserController();

// Generate Express router from decorators
const userRouter = createRouterFromController(userController);

// Use in your Express app
app.use('/api/v1', userRouter);
```

## 📊 **Generating Swagger Documentation**

```typescript
import { generateSwaggerFromController } from '../decorators/router.generator';

const userController = new UserController();
const swaggerPaths = generateSwaggerFromController(userController, '/api/v1');

// Merge with your existing swagger config
const swaggerSpec = {
  ...existingSwaggerConfig,
  paths: {
    ...existingSwaggerConfig.paths,
    ...swaggerPaths.paths
  }
};
```

## 🎨 **Features**

### ✅ **Automatic Validation**
- Request body, params, and query validation using Zod
- Automatic error responses for validation failures
- Type-safe request objects

### ✅ **Swagger Integration** 
- Auto-generated OpenAPI documentation
- Schema definitions from Zod schemas
- Interactive API explorer

### ✅ **Middleware Support**
- Apply Express middlewares with `@UseMiddleware()`
- Built-in authentication decorator `@ApiBearerAuth()`
- Custom middleware support

### ✅ **Type Safety**
- Full TypeScript support
- Zod schema integration
- Type-safe decorators

## 🔄 **Migration from Traditional Routes**

**Before (Traditional Express):**
```typescript
router.post('/users', validateRequest(createUserSchema), (req, res) => {
  // Handle request
});
```

**After (With Decorators):**
```typescript
@Post('/users')
@ApiBody(createUserSchema)
@ApiOperation({ summary: 'Create user' })
async createUser(req: Request, res: Response) {
  // Handle request - validation is automatic
}
```

## 📚 **Benefits**

1. **🧹 Clean Code**: Declarative API definitions
2. **📖 Auto Documentation**: Swagger docs generated automatically  
3. **🔒 Type Safety**: Full TypeScript + Zod integration
4. **🚀 Faster Development**: Less boilerplate code
5. **🔧 Easy Maintenance**: Centralized route definitions
6. **✅ Built-in Validation**: Automatic request validation

## 🎯 **Best Practices**

1. **Group related endpoints** in the same controller class
2. **Use descriptive `@ApiOperation`** summaries and descriptions
3. **Define Zod schemas** outside controller classes for reusability
4. **Apply `@ApiTags`** to organize endpoints in Swagger UI
5. **Use `@UseMiddleware`** for shared functionality like authentication
6. **Provide comprehensive `@ApiResponse`** documentation for all status codes

This decorator system brings the best of NestJS to your Express application while maintaining full compatibility with existing Express patterns! 🚀
