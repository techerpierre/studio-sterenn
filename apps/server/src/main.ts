import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import env from '@/config/env';
import { AllExceptionsFilter } from './modules/common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(env.PORT ?? 3000);
}
bootstrap();
