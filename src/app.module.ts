import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import appConfig from './app.config';
import { UploadModule } from './upload/upload.module';
import * as crypto from 'crypto';
import { EventsModule } from './event/events.module';
import { FinancesModule } from './finance/finances.module';
import { AlbumsModule } from './album/albums.module';
import { NotificationsModule } from './notification/notifications.module';
import { NewsModule } from './news/news.module';
import { AwardsModule } from './award/awards.module';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';

const env = process.env.NODE_ENV || 'development';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: [`.env.${env}`, '.env'], // load environment-specific file first, then fallback to .env
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        autoLoadEntities: true,
        synchronize: false, // Set false in production
      }),
    }),
    UserModule,
    AuthModule,
    UploadModule,
    EventsModule,
    FinancesModule,
    AlbumsModule,
    NotificationsModule,
    NewsModule,
    AwardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Vary', 'Origin');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header(
          'Access-Control-Allow-Methods',
          'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        );
        res.header(
          'Access-Control-Allow-Headers',
          'Content-Type,Authorization',
        );
        if (req.method === 'OPTIONS') {
          return res.sendStatus(204);
        }
        next();
      })
      .forRoutes('*'); // ⚡ Áp dụng cho toàn bộ route
  }
}
