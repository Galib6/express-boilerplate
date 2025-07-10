import { NextFunction, Request, Response } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * Enhanced validation middleware for request data using Zod
 * Supports validation of body, params, and query separately
 */
export interface ValidationSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export const validateRequestEnhanced = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Array<{ field: string; message: string }> = [];

    // Validate body
    if (schemas.body) {
      const bodyResult = schemas.body.safeParse(req.body);
      if (!bodyResult.success) {
        errors.push(
          ...bodyResult.error.errors.map(err => ({
            field: `body.${err.path.join('.')}`,
            message: err.message,
          })),
        );
      } else {
        req.body = bodyResult.data;
      }
    }

    // Validate params
    if (schemas.params) {
      const paramsResult = schemas.params.safeParse(req.params);
      if (!paramsResult.success) {
        errors.push(
          ...paramsResult.error.errors.map(err => ({
            field: `params.${err.path.join('.')}`,
            message: err.message,
          })),
        );
      } else {
        req.params = paramsResult.data;
      }
    }

    // Validate query
    if (schemas.query) {
      const queryResult = schemas.query.safeParse(req.query);
      if (!queryResult.success) {
        errors.push(
          ...queryResult.error.errors.map(err => ({
            field: `query.${err.path.join('.')}`,
            message: err.message,
          })),
        );
      } else {
        req.query = queryResult.data;
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      res.status(400).json({ success: false, message: 'Validation error', errors });
      return;
    }

    // Call next middleware if all validations pass
    next();
  };
};

// Keep the original for backward compatibility
export const validateRequest = (schema: ZodSchema<unknown>) => {
  return validateRequestEnhanced({ body: schema });
};
