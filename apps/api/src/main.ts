import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { loadConfig } from '@library/config';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = loadConfig();

  // Middleware
  app.use(cookieParser());
  app.enableCors({
    origin: config.cors.origins,
    credentials: true,
  });

  // Global validation pipe
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Start server
  await app.listen(config.port);
  console.log(`\n✅ Library SaaS API running on: http://localhost:${config.port}/api/v1`);
  console.log(`📊 Health check: http://localhost:${config.port}/health`);
  console.log(`🔐 Node environment: ${config.nodeEnv}\n`);
}

bootstrap().catch((err) => {
  console.error('❌ Application failed to start:', err);
  process.exit(1);
});
