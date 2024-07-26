import { Movie } from './movie';

export type MovieDto = Omit<Movie, 'id'>;
