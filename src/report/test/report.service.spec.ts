import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../../report/report.service';
import { movieListMock } from './mock/movie.list.mock';
import { nonDuplicateProducerMovieList } from './mock/non.duplicate.producer.movie.list';
import { MovieDto } from '../../movie/types/movie.dto';
import { MovieService } from '../../movie/movie.service';

describe('calculateProducerIntervals', () => {
  let reportService: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieService, ReportService],
    }).compile();

    reportService = module.get<ReportService>(ReportService);
  });

  it('should return min and max intervals for each producer', async () => {
    const winnerMovies: MovieDto[] = movieListMock.filter(
      (movie) => movie.winner,
    );

    const result = reportService.calculateProducerIntervals(winnerMovies);

    expect(result).toEqual({
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
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

    const result = reportService.calculateProducerIntervals(movies);

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

  it('should split producers by comma and "and"', async () => {
    const result = reportService.splitProducers(
      'Avi Lerner, Kevin King Templeton, Yariv Lerner, and Les Weldon',
    );
    expect(result).toEqual([
      'Avi Lerner',
      'Kevin King Templeton',
      'Yariv Lerner',
      'Les Weldon',
    ]);
  });
});
