import { useCallback, useRef, useState } from 'react';
import type { CellType } from '@/algorithms/pathfinding/types';

interface Props {
  grid: CellType[][];
  current: [number, number] | null;
  frontier: [number, number][];
  path: [number, number][];
  rows: number;
  cols: number;
  onCellClick?: (row: number, col: number) => void;
  onCellDrag?: (row: number, col: number) => void;
}

const CELL_COLORS: Record<CellType, string> = {
  empty: 'bg-white dark:bg-gray-900',
  wall: 'bg-gray-700 dark:bg-gray-600',
  start: 'bg-emerald-500',
  end: 'bg-red-500',
  visited: 'bg-purple-300 dark:bg-purple-700',
  path: 'bg-amber-400 dark:bg-amber-500',
  frontier: 'bg-blue-300 dark:bg-blue-600',
};

function coordKey(r: number, c: number): string {
  return `${r},${c}`;
}

export default function GridBoard({
  grid,
  current,
  frontier,
  path,
  rows,
  cols,
  onCellClick,
  onCellDrag,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const frontierSet = new Set(frontier.map(([r, c]) => coordKey(r, c)));
  const pathSet = new Set(path.map(([r, c]) => coordKey(r, c)));

  const getCellClass = useCallback(
    (row: number, col: number, cellType: CellType): string => {
      const key = coordKey(row, col);
      const isCurrent =
        current !== null && current[0] === row && current[1] === col;

      let colorClass: string;
      if (cellType === 'start' || cellType === 'end') {
        colorClass = CELL_COLORS[cellType];
      } else if (pathSet.has(key)) {
        colorClass = CELL_COLORS.path;
      } else if (isCurrent) {
        colorClass = 'bg-yellow-400 dark:bg-yellow-500';
      } else if (frontierSet.has(key)) {
        colorClass = CELL_COLORS.frontier;
      } else {
        colorClass = CELL_COLORS[cellType];
      }

      const ring = isCurrent ? 'ring-2 ring-yellow-400 ring-offset-1 dark:ring-offset-gray-950 animate-pulse' : '';

      return `${colorClass} ${ring} rounded-[2px] border border-gray-200 dark:border-gray-800 transition-colors duration-150`;
    },
    [current, frontierSet, pathSet],
  );

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      setIsDragging(true);
      onCellClick?.(row, col);
    },
    [onCellClick],
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (isDragging) {
        onCellDrag?.(row, col);
      }
    },
    [isDragging, onCellDrag],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="grid gap-0 w-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          aspectRatio: `${cols} / ${rows}`,
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={getCellClass(r, c, cell)}
              onMouseDown={() => handleMouseDown(r, c)}
              onMouseEnter={() => handleMouseEnter(r, c)}
            />
          )),
        )}
      </div>
    </div>
  );
}
