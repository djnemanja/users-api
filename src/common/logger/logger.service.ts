import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';

@Injectable()
export class LoggerService {
  private transactionLogger: winston.Logger;
  private errorLogger: winston.Logger;

  constructor() {
    const logDirectory = path.join(__dirname, '../../../logs');

    this.transactionLogger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info: any) => {
          return `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`;
        }),
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(logDirectory, 'transactions.log'),
        }),
      ],
    });

    this.errorLogger = winston.createLogger({
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info: any) => {
          return `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}\nStack: ${info.stack || 'N/A'}`;
        }),
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(logDirectory, 'errors.log'),
        }),
      ],
    });
  }

  logTransaction(message: string): void {
    this.transactionLogger.info(message);
  }

  logError(error: Error): void {
    this.errorLogger.error(error.message, { stack: error.stack });
  }
}
