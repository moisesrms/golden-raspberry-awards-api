import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { MovieDto } from './../src/movie/types/movie.dto';
import { movieListMock } from './../src/report/test/mock/movie.list.mock';
import { ReportService } from './../src/report/report.service';
import { MovieService } from './../src/movie/movie.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let movieService: MovieService;
  let reportService: ReportService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    movieService = moduleFixture.get<MovieService>(MovieService);
    reportService = moduleFixture.get<ReportService>(ReportService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Health check', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('OK');
  });

  it('Should receive the producer intervals report to a mocked movie list', async () => {
    const movies: MovieDto[] = movieListMock;

    for await (const movie of movies) {
      movieService.create(movie);
    }

    const result = await request(app.getHttpServer()).get(
      '/report/producer-intervals',
    );
    expect(result.status).toBe(200);

    expect(result.body?.min).toBeDefined();
    expect(result.body?.max).toBeDefined();

    expect(Array.isArray(result.body?.min)).toBeTruthy();
    expect(Array.isArray(result.body?.max)).toBeTruthy();

    expect(result.body?.min?.length).toBe(1);
    expect(result.body?.max?.length).toBe(1);

    expect(result.body?.min?.[0]).toEqual({
      producer: 'Joel Silver',
      interval: 1,
      previousWin: 1990,
      followingWin: 1991,
    });

    expect(result.body?.max?.[0]).toEqual({
      producer: 'Matthew Vaughn',
      interval: 13,
      previousWin: 2002,
      followingWin: 2015,
    });
  });

  it('Should receive the producer intervals report to a csv loaded movie list', async () => {
    await movieService.seed('movielist.csv');

    const movies = await movieService.loadCSVToArray('movielist.csv');

    const resultExpected = reportService.calculateProducerIntervals(movies!);

    const result = await request(app.getHttpServer()).get(
      '/report/producer-intervals',
    );
    expect(result.status).toBe(200);

    expect(result.body).toEqual(resultExpected);
  });
});
