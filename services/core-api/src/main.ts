import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger UI Setup
  const config = new DocumentBuilder()
    .setTitle('TixPulse Core API')
    .setDescription(
      'Dokumentasi Interaktif & Testing UI untuk TixPulse Ticketing Platform Backend.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Masukkan JWT token di sini (tanpa kata Bearer)',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'TixPulse API Documentation & Testing UI',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 TixPulse Core API is running on http://localhost:${port}`);
  logger.log(`📚 Interactive Testing UI (Swagger) is available on http://localhost:${port}/api/docs`);
}

await bootstrap();
