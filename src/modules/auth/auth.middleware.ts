import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.access_token;

      const authHeader = req.headers.authorization;
      const headerToken = authHeader ? authHeader.split(' ')[1] : null;

      const jwtToken = token || headerToken;

      if (!jwtToken) {
        return res.status(401).json({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'No authentication token provided',
          timestamp: new Date().toISOString(),
        });
      }

      try {
        const user = await this.authService.verifyToken(jwtToken);

        req.user = user;

        next();
      } catch (error) {
        this.loggerService.logError(
          error instanceof Error
            ? error
            : new Error(error.message || 'Token verification error'),
        );

        if (error instanceof UnauthorizedException) {
          return res.status(401).json({
            statusCode: 401,
            error: 'Unauthorized',
            message: error.message,
            timestamp: new Date().toISOString(),
          });
        }

        return res.status(401).json({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid or expired token',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      this.loggerService.logError(
        error instanceof Error
          ? error
          : new Error('Unknown authentication error'),
      );

      return res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Internal server error during authentication',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
