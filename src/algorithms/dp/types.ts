export interface DPStepData {
  table: number[][];
  currentCell: [number, number] | null;
  highlightCells: [number, number][];
  rowLabels?: string[];
  colLabels?: string[];
  result?: string | number;
}
