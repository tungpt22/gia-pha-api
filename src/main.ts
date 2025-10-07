import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import { JwtAuthGuard } from './security/jwt-auth.guard';
import { TransformInterceptor } from './config/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  app.setGlobalPrefix('api/v1');

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('CPCM API')
    .setDescription('Cow Play Cow Moo API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(process.env.PORT ?? 3000);
  Logger.log('Server started at port: ' + (process.env.PORT ?? 3000));
}

bootstrap();
