import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ErrorExceptionFilter } from './common/filters/errorException.filter';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { LoggerService } from './common/logger/logger.service';
import { ConfigModule } from '@nestjs/config';
import AppDataSource from './config/dataSource';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    LoggerService,
    {
      provide: 'APP_FILTER',
      useClass: ErrorExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/logout', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
