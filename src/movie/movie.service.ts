import { Injectable, Logger } from '@nestjs/common';
import { MovieDto } from './types/movie.dto';
import { Movie } from './types/movie';
import Database, { RunResult } from 'better-sqlite3';
import { createReadStream } from 'fs';
import csv from 'csv-parser';

@Injectable()
export class MovieService {
  private db: Database.Database;

  constructor() {}

  private createTables() {
    Logger.log('Creating tables...');
    this.db.exec(`
      CREATE TABLE Movie (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER,
        title TEXT,
        studios TEXT,
        producers TEXT,
        winner BOOLEAN
      );
    `);
  }

  async initDB(fileName?: string): Promise<void> {
    this.db = new Database(':memory:');

    this.createTables();
    Logger.log('Importing movies from assets/movielist.csv');
    this.loadCSVToDatabase(`assets/${fileName ?? 'movielist.csv'}`);
  }

  async loadCSVToDatabase(filePath: string): Promise<void> {
    const stmt = this.db.prepare(
      'INSERT INTO Movie (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)',
    );
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

        console.log({ movie });

        stmt.run(
          movie.year,
          movie.title,
          movie.studios,
          movie.producers,
          movie.winner,
        );
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

  create(movie: MovieDto) {
    const { year, title, studios, producers, winner } = movie;
    const stmt = this.db.prepare(
      'INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)',
    );
    return stmt.run(year, title, studios, producers, winner).lastInsertRowid;
  }

  async findAll() {
    const stmt = this.db.prepare('SELECT * FROM movies');
    return stmt.all() as Movie[];
  }

  async findAllWinners() {
    const stmt = this.db.prepare(`SELECT * FROM Movie WHERE winner = ${true}`);
    return stmt.all() as Movie[];
  }

  async findOne(id: string) {
    const stmt = this.db.prepare(`SELECT * FROM Movie WHERE id = ?`);
    return stmt.get(id) as Movie;
  }

  async update(id: string, movie: Partial<MovieDto>) {
    const { year, title, studios, producers, winner } = movie;
    const stmt = this.db.prepare(
      'UPDATE movies SET year = ?, title = ?, studios = ?, producers = ?, winner = ? WHERE id = ?',
    );
    const result: RunResult = stmt.run(
      year,
      title,
      studios,
      producers,
      winner,
      id,
    );
    return result.changes;
  }

  async remove(id: string) {
    const stmt = this.db.prepare('DELETE FROM movies WHERE id = ?');
    const result: RunResult = stmt.run(id);
    return result.changes;
  }

  async clearDb() {
    const stmt = this.db.prepare('DELETE FROM movies');
    stmt.run();
  }
}
