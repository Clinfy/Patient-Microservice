import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from 'src/config/env-validation';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { WinstonModule } from 'nest-winston';
import { AuthClientModule } from 'src/clients/auth/auth-client.module';
import { RequestContextModule } from 'src/common/context/request-context.module';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { ObservabilityModule } from 'src/observability/observability.module';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [
    //Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),

    //Winston Logger Module
    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        //new winston.transports.Console(),
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: '5m',
          maxFiles: '14d',
        }),
        new DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '10m',
          maxFiles: '30d',
        }),
      ],
    }),

    PrismaModule,
    AuthClientModule,
    RequestContextModule,
    ObservabilityModule,
  ],
  controllers: [AppController],
  providers: [AppService, AllExceptionsFilter, AuthGuard, ApiKeyGuard],
})
export class AppModule {}
