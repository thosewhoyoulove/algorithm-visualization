import type { AnimationStep } from '@/core/types';
import type { Grid, PathStep, CellType } from './types';

const DIRECTIONS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function cloneGrid(grid: CellType[][]): CellType[][] {
  return grid.map((row) => [...row]);
}

export function dfsPathfinding(grid: Grid): AnimationStep<PathStep>[] {
  const steps: AnimationStep<PathStep>[] = [];
  const { rows, cols, start, end } = grid;
  const cells = cloneGrid(grid.cells);

  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false),
  );
  const stack: [number, number][] = [start];
  const parentMap = new Map<string, [number, number]>();

  const stackSet = new Set<string>([`${start[0]},${start[1]}`]);

  steps.push({
    type: 'push',
    indices: [start[0] * cols + start[1]],
    data: {
      grid: cloneGrid(cells),
      current: null,
      frontier: [[...start]],
      path: [],
    },
    codeLine: 0,
    description: `将起点 (${start[0]}, ${start[1]}) 压入栈`,
  });

  while (stack.length > 0) {
    const current = stack.pop()!;
    const [cr, cc] = current;
    stackSet.delete(`${cr},${cc}`);

    if (visited[cr][cc]) continue;
    visited[cr][cc] = true;

    if (cr !== start[0] || cc !== start[1]) {
      cells[cr][cc] = 'visited';
    }

    const currentFrontier = [...stackSet].map(
      (s) => s.split(',').map(Number) as [number, number],
    );

    steps.push({
      type: 'pop',
      indices: [cr * cols + cc],
      data: {
        grid: cloneGrid(cells),
        current: [cr, cc],
        frontier: currentFrontier,
        path: [],
      },
      codeLine: 2,
      description: `从栈中弹出 (${cr}, ${cc}) 进行访问`,
    });

    if (cr === end[0] && cc === end[1]) {
      const path = reconstructPath(parentMap, start, end);
      const finalGrid = cloneGrid(cells);
      for (const [pr, pc] of path) {
        if (
          (pr !== start[0] || pc !== start[1]) &&
          (pr !== end[0] || pc !== end[1])
        ) {
          finalGrid[pr][pc] = 'path';
        }
      }

      steps.push({
        type: 'found',
        indices: path.map(([r, c]) => r * cols + c),
        data: {
          grid: finalGrid,
          current: [cr, cc],
          frontier: [],
          path,
        },
        codeLine: 3,
        description: `找到路径! 路径长度: ${path.length}`,
      });
      return steps;
    }

    steps.push({
      type: 'visit',
      indices: [cr * cols + cc],
      data: {
        grid: cloneGrid(cells),
        current: [cr, cc],
        frontier: currentFrontier,
        path: [],
      },
      codeLine: 5,
      description: `标记 (${cr}, ${cc}) 为已访问`,
    });

    for (const [dr, dc] of DIRECTIONS) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !visited[nr][nc] &&
        cells[nr][nc] !== 'wall'
      ) {
        parentMap.set(`${nr},${nc}`, [cr, cc]);
        stack.push([nr, nc]);
        stackSet.add(`${nr},${nc}`);

        if (nr !== end[0] || nc !== end[1]) {
          cells[nr][nc] = 'frontier';
        }

        const updatedFrontier = [...stackSet].map(
          (s) => s.split(',').map(Number) as [number, number],
        );

        steps.push({
          type: 'push',
          indices: [nr * cols + nc],
          data: {
            grid: cloneGrid(cells),
            current: [cr, cc],
            frontier: updatedFrontier,
            path: [],
          },
          codeLine: 8,
          description: `将邻居 (${nr}, ${nc}) 压入栈`,
        });
      }
    }
  }

  steps.push({
    type: 'complete',
    indices: [],
    data: {
      grid: cloneGrid(cells),
      current: null,
      frontier: [],
      path: [],
    },
    codeLine: 10,
    description: '未找到路径',
  });

  return steps;
}

function reconstructPath(
  parent: Map<string, [number, number]>,
  start: [number, number],
  end: [number, number],
): [number, number][] {
  const path: [number, number][] = [];
  let current: [number, number] | undefined = end;
  while (current) {
    path.unshift(current);
    if (current[0] === start[0] && current[1] === start[1]) break;
    current = parent.get(`${current[0]},${current[1]}`);
  }
  return path;
}
