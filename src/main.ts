import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { default as rateLimit } from 'express-rate-limit';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const frontendOrigins = process.env.FRONTEND_ORIGINS || 'http://localhost:4200';
  app.enableCors({
    origin: frontendOrigins.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests from your IP, please try again later',
      headers: true,
    }),
  );

  app.use(cookieParser());

  await app.listen(process.env.PORT || 3005);
}
bootstrap();
