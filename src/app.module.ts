import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from 'src/entities';
import { validate } from 'src/config/env-validation';

@Module({
  imports: [
    //Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),

    //TypeOrm Module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_HOST'),
        entities: [...ENTITIES],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
