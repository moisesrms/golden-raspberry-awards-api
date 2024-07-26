import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MovieService } from 'src/movie/movie.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const movieService = app.get(MovieService);
  await movieService.seed();

  Logger.log('Application is running on: http://localhost:3000');
}
bootstrap();
