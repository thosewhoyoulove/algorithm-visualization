export type CellType =
  | 'empty'
  | 'wall'
  | 'start'
  | 'end'
  | 'visited'
  | 'path'
  | 'frontier';

export interface Grid {
  cells: CellType[][];
  rows: number;
  cols: number;
  start: [number, number];
  end: [number, number];
}

export interface PathStep {
  grid: CellType[][];
  current: [number, number] | null;
  frontier: [number, number][];
  path: [number, number][];
}
