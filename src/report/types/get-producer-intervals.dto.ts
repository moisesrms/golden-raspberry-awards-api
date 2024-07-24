export interface Interval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface Result {
  min: Interval[];
  max: Interval[];
}
