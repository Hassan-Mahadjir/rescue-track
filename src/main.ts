import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true });
  // Enable CORS for all routes (apply validation pipe globally)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: 'http://192.168.31.234:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credential: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
