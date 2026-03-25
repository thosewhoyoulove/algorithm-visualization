export type StepType =
  | 'compare'
  | 'swap'
  | 'highlight'
  | 'visit'
  | 'update'
  | 'complete'
  | 'set'
  | 'partition'
  | 'merge'
  | 'found'
  | 'not-found'
  | 'enqueue'
  | 'dequeue'
  | 'push'
  | 'pop'
  | 'relax'
  | 'insert'
  | 'delete'
  | 'select';

export interface AnimationStep<T = unknown> {
  type: StepType;
  indices: number[];
  data: T;
  codeLine?: number;
  description: string;
  extra?: Record<string, unknown>;
}

export interface AlgorithmInfo {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  pseudocode: string[];
}

export type AlgorithmCategory =
  | 'sorting'
  | 'searching'
  | 'graph'
  | 'tree'
  | 'dp'
  | 'pathfinding';

export interface CategoryInfo {
  id: AlgorithmCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'sorting',
    name: '排序算法',
    description: '冒泡排序、选择排序、插入排序、快速排序、归并排序',
    icon: 'bar-chart',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'searching',
    name: '搜索算法',
    description: '线性搜索、二分查找',
    icon: 'search',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'pathfinding',
    name: '路径查找',
    description: 'BFS 寻路、DFS 寻路、A* 算法',
    icon: 'map',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'graph',
    name: '图算法',
    description: 'BFS、DFS、Dijkstra 最短路径',
    icon: 'git-branch',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'tree',
    name: '树结构',
    description: '二叉搜索树、前中后序遍历',
    icon: 'tree',
    color: 'from-rose-500 to-red-500',
  },
  {
    id: 'dp',
    name: '动态规划',
    description: '斐波那契、背包问题、最长公共子序列',
    icon: 'table',
    color: 'from-indigo-500 to-violet-500',
  },
];
