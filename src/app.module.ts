import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieController } from './movie/movie.controller';
import { MovieService } from './movie/movie.service';
import { ReportService } from './report/report.service';
import { ReportController } from './report/report.controller';

@Module({
  imports: [],
  controllers: [AppController, MovieController, ReportController],
  providers: [AppService, MovieService, ReportService],
})
export class AppModule {}
