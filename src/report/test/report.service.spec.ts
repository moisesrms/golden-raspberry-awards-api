import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../report.service';
import { PrismaService } from '../../prisma.service';
import { movieListMock } from './mock/movie.list.mock';
import { nonDuplicateProducerMovieList } from './mock/non.duplicate.producer.movie.list';
import { MovieDto } from 'movie/types/movie.dto';

describe('calculateProducerIntervals', () => {
  let reportService: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportService, PrismaService],
    }).compile();

    reportService = module.get<ReportService>(ReportService);
  });

  it('should return min and max intervals for each producer', async () => {
    const winnerMovies: MovieDto[] = movieListMock.filter(
      (movie) => movie.winner,
    );

    const result = await reportService.calculateProducerIntervals(winnerMovies);

    expect(result).toEqual({
      min: [
        {
          producer: 'Bo Derek',
          interval: 6,
          previousWin: 1984,
          followingWin: 1990,
        },
      ],
      max: [
        {
          producer: 'Matthew Vaughn',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    });
  });

  it('should return empty arrays if there are no intervals', async () => {
    const movies: MovieDto[] = [];

    const result = await reportService.calculateProducerIntervals(movies);

    expect(result).toEqual({
      min: [],
      max: [],
    });
  });

  it('should return empty arrays if there are no two films by the same producer', async () => {
    const movies: MovieDto[] = nonDuplicateProducerMovieList;

    const result = await reportService.calculateProducerIntervals(movies);

    expect(result).toEqual({
      min: [],
      max: [],
    });
  });
});
