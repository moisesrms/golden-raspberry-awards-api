import { Injectable, Logger } from '@nestjs/common';
import { MovieDto } from 'movie/types/movie.dto';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  healthCheck(): string {
    return 'OK';
  }

  async initDB(fileName?: string): Promise<void> {
    Logger.log('Clearing database');
    await this.prisma.movie.deleteMany();

    Logger.log('Importing movies from assets/movielist.csv');
    await this.loadCSVToDatabase(`assets/${fileName ?? 'movielist.csv'}`);
  }

  async loadCSVToDatabase(filePath: string): Promise<void> {
    // Read and parse the CSV file
    createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', async (row) => {
        const movie: MovieDto = {
          year: parseInt(row.year, 10),
          title: row.title,
          studios: row.studios,
          producers: row.producers,
          winner: row.winner.toLowerCase() === 'yes',
        };
        await this.prisma.movie.create({
          data: movie,
        });
      })
      .on('end', async () => {
        Logger.log('CSV file successfully processed');
        Logger.log('Movies successfully inserted into the database');
      })
      .on('error', (error) => {
        Logger.error('Error reading CSV file:', error);
      });
  }

  async loadCSVToArray(fileName: string): Promise<MovieDto[]> {
    const filePath = `assets/${fileName}`;
    const movies: MovieDto[] = [];
    // Read and parse the CSV file
    createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', async (row) => {
        const movie: MovieDto = {
          year: parseInt(row.year, 10),
          title: row.title,
          studios: row.studios,
          producers: row.producers,
          winner: row.winner.toLowerCase() === 'yes',
        };
        movies.push(movie);
      })
      .on('end', async () => {
        Logger.log('CSV file successfully processed');
        Logger.log('Movies successfully inserted into the database');
      })
      .on('error', (error) => {
        Logger.error('Error reading CSV file:', error);
      });
    return movies;
  }
}
