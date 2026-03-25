import type { AlgorithmInfo, AnimationStep } from '@/core/types';
import type { Graph, GraphStepData } from './types';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { dijkstra } from './dijkstra';

export type { Graph, GraphNode, GraphEdge, GraphStepData } from './types';
export { bfs } from './bfs';
export { dfs } from './dfs';
export { dijkstra } from './dijkstra';

export type GraphAlgorithmId = 'graph-bfs' | 'graph-dfs' | 'graph-dijkstra';

export const GRAPH_ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'graph-bfs',
    name: '广度优先搜索',
    category: 'graph',
    description: '从起点开始，逐层访问所有邻居节点，使用队列实现',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function BFS(graph, start):',
      '  queue = [start], visited = {}',
      '  while queue is not empty:',
      '    node = queue.dequeue()',
      '    mark node as visited',
      '    for each neighbor of node:',
      '      if neighbor not visited:',
      '        queue.enqueue(neighbor)',
      '  // all reachable nodes visited',
    ],
  },
  {
    id: 'graph-dfs',
    name: '深度优先搜索',
    category: 'graph',
    description: '从起点开始，沿一条路径深入到底再回溯，使用栈实现',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function DFS(graph, start):',
      '  stack = [start], visited = {}',
      '  while stack is not empty:',
      '    node = stack.pop()',
      '    mark node as visited',
      '    for each neighbor of node:',
      '      if neighbor not visited:',
      '        stack.push(neighbor)',
      '  // all reachable nodes visited',
    ],
  },
  {
    id: 'graph-dijkstra',
    name: 'Dijkstra 最短路径',
    category: 'graph',
    description: '贪心算法，每次选择距离最小的未访问节点进行松弛操作，求单源最短路径',
    timeComplexity: { best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)' },
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function Dijkstra(graph, start):',
      '  dist[start] = 0, dist[*] = ∞',
      '  while unvisited is not empty:',
      '    u = min-distance unvisited node',
      '    for each neighbor v of u:',
      '      if dist[u] + w(u,v) < dist[v]:',
      '        dist[v] = dist[u] + w(u,v)',
      '        parent[v] = u',
      '  return dist, parent',
    ],
  },
];

export const GRAPH_FUNCTIONS: Record<
  GraphAlgorithmId,
  (graph: Graph, startId: number) => AnimationStep<GraphStepData>[]
> = {
  'graph-bfs': bfs,
  'graph-dfs': dfs,
  'graph-dijkstra': dijkstra,
};

export function createSampleGraph(): Graph {
  const count = 8;
  const cx = 300;
  const cy = 250;
  const radius = 180;

  const nodes = Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      id: i,
      x: Math.round(cx + radius * Math.cos(angle)),
      y: Math.round(cy + radius * Math.sin(angle)),
      label: String.fromCharCode(65 + i),
    };
  });

  const edges = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 7, weight: 8 },
    { from: 1, to: 2, weight: 8 },
    { from: 1, to: 7, weight: 3 },
    { from: 2, to: 3, weight: 7 },
    { from: 2, to: 5, weight: 4 },
    { from: 3, to: 4, weight: 9 },
    { from: 3, to: 5, weight: 14 },
    { from: 4, to: 5, weight: 10 },
    { from: 5, to: 6, weight: 2 },
    { from: 6, to: 7, weight: 6 },
    { from: 0, to: 2, weight: 5 },
  ];

  return { nodes, edges, directed: false };
}
