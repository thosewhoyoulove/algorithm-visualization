import type { AlgorithmInfo, AnimationStep } from '@/core/types';
import type { Grid, PathStep } from './types';
import { bfsPathfinding } from './bfsPathfinding';
import { dfsPathfinding } from './dfsPathfinding';

export type { Grid, PathStep, CellType } from './types';

export const PATHFINDING_ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'bfs-pathfinding',
    name: 'BFS 寻路',
    category: 'pathfinding',
    description:
      '广度优先搜索 (BFS) 逐层探索网格，保证在无权图中找到最短路径。使用队列按先进先出的顺序访问节点。',
    timeComplexity: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)' },
    spaceComplexity: 'O(V)',
    pseudocode: [
      'BFS(grid, start, end):',
      '  queue ← [start]',
      '  while queue 不为空:',
      '    current ← queue.dequeue()',
      '    if current == end:',
      '      return 重建路径()',
      '    for 每个邻居 neighbor:',
      '      if neighbor 未访问 且 非墙壁:',
      '        标记 neighbor 为已访问',
      '        queue.enqueue(neighbor)',
      '  return 无路径',
    ],
  },
  {
    id: 'dfs-pathfinding',
    name: 'DFS 寻路',
    category: 'pathfinding',
    description:
      '深度优先搜索 (DFS) 沿一条路径尽可能深入探索，然后回溯。使用栈实现，不保证找到最短路径，但内存使用较少。',
    timeComplexity: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)' },
    spaceComplexity: 'O(V)',
    pseudocode: [
      'DFS(grid, start, end):',
      '  stack ← [start]',
      '  while stack 不为空:',
      '    current ← stack.pop()',
      '    if current == end:',
      '      return 重建路径()',
      '    for 每个邻居 neighbor:',
      '      if neighbor 未访问 且 非墙壁:',
      '        标记 neighbor 为已访问',
      '        stack.push(neighbor)',
      '  return 无路径',
    ],
  },
];

export const PATHFINDING_FUNCTIONS: Record<
  string,
  (grid: Grid) => AnimationStep<PathStep>[]
> = {
  'bfs-pathfinding': bfsPathfinding,
  'dfs-pathfinding': dfsPathfinding,
};
