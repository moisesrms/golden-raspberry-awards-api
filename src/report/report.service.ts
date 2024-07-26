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

  // Função para separar produtores considerando vírgulas e "and"
  splitProducers(producerString: string): string[] {
    if (!producerString) {
      return [];
    }
    return producerString
      .split(/,| and /)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  calculateProducerIntervals(awards: MovieDto[]): Result | null {
    const producerWins: { [producer: string]: number[] } = {};

    // Agrupa os anos de prêmios por produtor
    awards.forEach((award) => {
      this.splitProducers(award.producers).forEach((producer) => {
        if (!producerWins[producer]) {
          producerWins[producer] = [];
        }
        producerWins[producer].push(award.year);
      });
    });

    // Ordena os anos de prêmios para cada produtor
    for (const producer in producerWins) {
      producerWins[producer].sort((a, b) => a - b);
    }

    let minIntervals: Interval[] = [];
    let maxIntervals: Interval[] = [];
    let minInterval = Infinity;
    let maxInterval = -Infinity;

    // Calcula os intervalos entre prêmios consecutivos
    for (const producer in producerWins) {
      const years = producerWins[producer];
      for (let i = 1; i < years.length; i++) {
        const interval = years[i] - years[i - 1];
        if (interval < minInterval) {
          minInterval = interval;
          minIntervals = [
            {
              producer,
              interval,
              previousWin: years[i - 1],
              followingWin: years[i],
            },
          ];
        } else if (interval === minInterval) {
          minIntervals.push({
            producer,
            interval,
            previousWin: years[i - 1],
            followingWin: years[i],
          });
        }
        if (interval > maxInterval) {
          maxInterval = interval;
          maxIntervals = [
            {
              producer,
              interval,
              previousWin: years[i - 1],
              followingWin: years[i],
            },
          ];
        } else if (interval === maxInterval) {
          maxIntervals.push({
            producer,
            interval,
            previousWin: years[i - 1],
            followingWin: years[i],
          });
        }
      }
    }

    return {
      min: minIntervals,
      max: maxIntervals,
    };
  }
}
