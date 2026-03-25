import { useState, useCallback, useMemo } from 'react';
import GridBoard from '@/visualizers/GridBoard';
import CodePanel from '@/components/CodePanel';
import PlaybackBar from '@/components/controls/PlaybackBar';
import { useAnimationController } from '@/core/useAnimationController';
import {
  PATHFINDING_ALGORITHMS,
  PATHFINDING_FUNCTIONS,
} from '@/algorithms/pathfinding/index';
import type { Grid, PathStep, CellType } from '@/algorithms/pathfinding/types';
import type { AnimationStep } from '@/core/types';

const DEFAULT_ROWS = 20;
const DEFAULT_COLS = 20;
const DEFAULT_START: [number, number] = [1, 1];
const DEFAULT_END: [number, number] = [18, 18];

type EditMode = 'wall' | 'start' | 'end';

function createEmptyGrid(rows: number, cols: number, start: [number, number], end: [number, number]): CellType[][] {
  const grid: CellType[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 'empty' as CellType));
  grid[start[0]][start[1]] = 'start';
  grid[end[0]][end[1]] = 'end';
  return grid;
}

function generateMaze(rows: number, cols: number, start: [number, number], end: [number, number]): CellType[][] {
  const grid = createEmptyGrid(rows, cols, start, end);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) continue;
      if (Math.random() < 0.3) grid[r][c] = 'wall';
    }
  }
  return grid;
}

export default function PathfindingPage() {
  const [algorithmId, setAlgorithmId] = useState(PATHFINDING_ALGORITHMS[0].id);
  const [startPos, setStartPos] = useState<[number, number]>(DEFAULT_START);
  const [endPos, setEndPos] = useState<[number, number]>(DEFAULT_END);
  const [cells, setCells] = useState<CellType[][]>(() => createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_START, DEFAULT_END));
  const [editMode, setEditMode] = useState<EditMode>('wall');
  const [steps, setSteps] = useState<AnimationStep<PathStep>[]>([]);
  const [showCode, setShowCode] = useState(true);

  const controller = useAnimationController<PathStep>(steps);
  const currentAlgo = PATHFINDING_ALGORITHMS.find((a) => a.id === algorithmId)!;

  const displayGrid = useMemo(() => {
    if (controller.currentStep) return controller.currentStep.data.grid;
    return cells;
  }, [controller.currentStep, cells]);

  const displayCurrent = controller.currentStep?.data.current ?? null;
  const displayFrontier = controller.currentStep?.data.frontier ?? [];
  const displayPath = controller.currentStep?.data.path ?? [];

  const clearPath = useCallback(() => {
    setSteps([]);
    setCells((prev) => prev.map((row) => row.map((cell) => (cell === 'visited' || cell === 'path' || cell === 'frontier') ? 'empty' : cell)));
  }, []);

  const clearWalls = useCallback(() => {
    setSteps([]);
    setCells(createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS, startPos, endPos));
  }, [startPos, endPos]);

  const handleGenerateMaze = useCallback(() => {
    setSteps([]);
    setCells(generateMaze(DEFAULT_ROWS, DEFAULT_COLS, startPos, endPos));
  }, [startPos, endPos]);

  const handleRun = useCallback(() => {
    const cleanCells = cells.map((row) => row.map((cell) => (cell === 'visited' || cell === 'path' || cell === 'frontier') ? 'empty' as CellType : cell));
    setCells(cleanCells);
    const grid: Grid = { cells: cleanCells, rows: DEFAULT_ROWS, cols: DEFAULT_COLS, start: startPos, end: endPos };
    const fn = PATHFINDING_FUNCTIONS[algorithmId];
    if (fn) setSteps(fn(grid));
  }, [cells, algorithmId, startPos, endPos]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (controller.isPlaying) return;
    clearPath();
    if (editMode === 'start') {
      setCells((prev) => { const next = prev.map((r) => [...r]); next[startPos[0]][startPos[1]] = 'empty'; next[row][col] = 'start'; return next; });
      setStartPos([row, col]);
    } else if (editMode === 'end') {
      setCells((prev) => { const next = prev.map((r) => [...r]); next[endPos[0]][endPos[1]] = 'empty'; next[row][col] = 'end'; return next; });
      setEndPos([row, col]);
    } else {
      setCells((prev) => { const next = prev.map((r) => [...r]); const current = next[row][col]; if (current === 'empty') next[row][col] = 'wall'; else if (current === 'wall') next[row][col] = 'empty'; return next; });
    }
  }, [editMode, controller.isPlaying, startPos, endPos, clearPath]);

  const handleCellDrag = useCallback((row: number, col: number) => {
    if (controller.isPlaying || editMode !== 'wall') return;
    setCells((prev) => { const current = prev[row][col]; if (current !== 'empty') return prev; const next = prev.map((r) => [...r]); next[row][col] = 'wall'; return next; });
  }, [editMode, controller.isPlaying]);

  const editModes: { mode: EditMode; label: string; active: string }[] = [
    { mode: 'wall', label: '画墙', active: 'bg-gray-600 text-white' },
    { mode: 'start', label: '起点', active: 'bg-emerald-500 text-white' },
    { mode: 'end', label: '终点', active: 'bg-red-500 text-white' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={algorithmId}
            onChange={(e) => { setAlgorithmId(e.target.value); clearPath(); }}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
          >
            {PATHFINDING_ALGORITHMS.map((algo) => (
              <option key={algo.id} value={algo.id}>{algo.name}</option>
            ))}
          </select>

          <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />

          <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 dark:bg-gray-800/60 p-0.5">
            {editModes.map(({ mode, label, active }) => (
              <button
                key={mode}
                onClick={() => setEditMode(mode)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                  editMode === mode ? `${active} shadow-sm` : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />

          <button onClick={handleGenerateMaze} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
            随机迷宫
          </button>
          <button onClick={clearWalls} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            清除墙壁
          </button>
          <button onClick={clearPath} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            清除路径
          </button>

          <div className="flex-1" />

          <button onClick={handleRun} className="px-4 py-1.5 text-sm font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 transition-all active:scale-[0.98]">
            开始寻路
          </button>
          <button
            onClick={() => setShowCode(!showCode)}
            className={`hidden lg:block px-3 py-1.5 text-[13px] font-medium rounded-lg border transition-colors ${
              showCode ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
          <div className="w-full max-w-[640px]">
            <GridBoard
              grid={displayGrid}
              current={displayCurrent}
              frontier={displayFrontier}
              path={displayPath}
              rows={DEFAULT_ROWS}
              cols={DEFAULT_COLS}
              onCellClick={handleCellClick}
              onCellDrag={handleCellDrag}
            />
            {/* Legend */}
            <div className="mt-3 flex flex-wrap justify-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
              {[
                { color: 'bg-emerald-500', label: '起点' },
                { color: 'bg-red-500', label: '终点' },
                { color: 'bg-gray-700 dark:bg-gray-500', label: '墙壁' },
                { color: 'bg-purple-300 dark:bg-purple-700', label: '已访问' },
                { color: 'bg-blue-300 dark:bg-blue-600', label: '前沿' },
                { color: 'bg-amber-400', label: '路径' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showCode && (
          <div className="hidden lg:block w-90 border-l border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-4 overflow-y-auto">
            <CodePanel
              code={currentAlgo.pseudocode}
              activeLine={controller.currentStep?.codeLine}
              description={controller.currentStep?.description}
              timeComplexity={currentAlgo.timeComplexity}
              spaceComplexity={currentAlgo.spaceComplexity}
            />
          </div>
        )}
      </div>

      <PlaybackBar controller={controller} />
    </div>
  );
}
