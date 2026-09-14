import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './generated/routes';
import swaggerJson from './generated/swagger.json';

export function createApp(): Express {
  const app: Express = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Swagger Documentation UI
  app.use('/docs', swaggerUi.serve, (_req: Request, res: Response) => {
    res.send(swaggerUi.generateHTML(swaggerJson));
  });

  // Register TSOA Routes
  RegisterRoutes(app);

  // Global Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
      message: err.message || 'Internal Server Error',
    });
  });

  return app;
}
