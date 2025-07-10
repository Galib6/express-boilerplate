import express, { type Express, type Request, type Response } from 'express';

import { connectToDatabase } from '@/configs/db';
import { envConfig } from '@/configs/env';
import { setupSwagger } from '@/configs/swagger';
import { errorHandler } from '@/middlewares/errorHandler';
import { applyMiddleware } from '@/middlewares/index';
import { notFound } from '@/middlewares/notFound';
import auth from '@/routes/authRoute';

const app: Express = express();

app.use(express.json({ limit: '1mb' }));

const initializeApp = async () => {
  try {
    await connectToDatabase();

    applyMiddleware(app);

    const PORT = envConfig.PORT || 5000;
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server is running on port ${PORT}`);
      // eslint-disable-next-line no-console
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Error initializing app:', error);
    process.exit(1);
  }
};

// Setup Swagger documentation before routes
setupSwagger(app);

initializeApp();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Phew-Phew,  API is running! 🚀"
 */
app.get('/', (_req: Request, res: Response) => {
  res.send('Phew-Phew,  API is running! 🚀');
});

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: API health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "API is healthy! 🏥"
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                   example: 12345.67
 */
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy! 🏥',
    uptime: process.uptime(),
  });
});

app.use('/api/v1/auth', auth);

app.use(notFound);
app.use(errorHandler);

export default app;
