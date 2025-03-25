import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { randomUUID } from 'crypto';

interface HttpExceptionResponse {
  error?: string;
  message?: string | string[];
  statusCode?: number;
}

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof Error) {
      this.loggerService.logError(exception);
    } else {
      this.loggerService.logError(new Error('Unknown error occurred'));
    }

    const exceptionResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as HttpExceptionResponse)
        : undefined;

    const responseBody = {
      error: exceptionResponse?.error || 'INTERNAL_SERVER_ERROR',
      message: exceptionResponse?.message || 'Something went wrong',
      requestId: randomUUID(),
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(responseBody);
  }
}
