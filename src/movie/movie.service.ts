import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MovieDto } from './types/movie.dto';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  async create(movie: MovieDto): Promise<MovieDto | null> {
    return this.prisma.movie.create({
      data: movie,
    });
  }

  async findAll(): Promise<MovieDto[]> {
    return this.prisma.movie.findMany();
  }

  async findOne(id: string): Promise<MovieDto | null> {
    return this.prisma.movie.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, movie: Partial<MovieDto>): Promise<MovieDto | null> {
    return this.prisma.movie.update({
      where: {
        id,
      },
      data: movie,
    });
  }

  async remove(id: string): Promise<MovieDto | null> {
    return this.prisma.movie.delete({
      where: {
        id,
      },
    });
  }
}
