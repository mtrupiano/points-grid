export type playerStateVar = {
  name: string;
  numSquares: number;
};

export type GridData = {
  homeTeam: string;
  awayTeam: string;
  grid: string[][];
  players: playerStateVar[];
};
