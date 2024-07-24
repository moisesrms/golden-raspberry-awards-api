import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Interval, Result } from './types/get-producer-intervals.dto';
import { MovieDto } from 'movie/types/movie.dto';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async getProducerIntervals(): Promise<Result | null> {
    const movies = await this.prisma.movie.findMany({
      where: {
        winner: true,
      },
    });

    return this.calculateProducerIntervals(movies);
  }

  calculateProducerIntervals(movies: MovieDto[]): Result | null {
    const wins: Record<string, number[]> = {};

    // Collect all win years for each producer
    movies.forEach((movie) => {
      const producers = movie.producers.split(',').map((p) => p.trim());
      producers.forEach((producer) => {
        if (!wins[producer]) {
          wins[producer] = [];
        }
        wins[producer].push(movie.year);
      });
    });

    const intervals: Interval[] = [];

    // Calculate intervals for each producer
    Object.keys(wins).forEach((producer) => {
      const years = wins[producer].sort((a, b) => a - b);
      for (let i = 1; i < years.length; i++) {
        intervals.push({
          producer,
          interval: years[i] - years[i - 1],
          previousWin: years[i - 1],
          followingWin: years[i],
        });
      }
    });

    if (intervals.length === 0) {
      return { min: [], max: [] };
    }

    // Find min and max intervals
    const minInterval = Math.min(...intervals.map((i) => i.interval));
    const maxInterval = Math.max(...intervals.map((i) => i.interval));

    const min = intervals.filter((i) => i.interval === minInterval);
    const max = intervals.filter((i) => i.interval === maxInterval);

    return { min, max };
  }
}
