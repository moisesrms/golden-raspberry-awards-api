import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AppService } from 'app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const myService = app.get(AppService);
  await myService.initDB();

  Logger.log('Application is running on: http://localhost:3000');
}
bootstrap();
