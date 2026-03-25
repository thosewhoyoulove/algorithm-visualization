import type { AlgorithmInfo, AnimationStep } from '@/core/types';
import type { DPStepData } from './types';
import { fibonacci } from './fibonacci';
import { knapsack } from './knapsack';
import { lcs } from './lcs';

export type { DPStepData } from './types';
export { fibonacci, knapsack, lcs };

export const DP_ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'fibonacci',
    name: '斐波那契数列',
    category: 'dp',
    description: '使用自底向上动态规划计算斐波那契数列，避免重复计算子问题。',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function fibonacci(n):',
      '  dp[0] = 0, dp[1] = 1',
      '  for i = 2 to n:',
      '    dp[i] = dp[i-1] + dp[i-2]',
      '    // 当前值等于前两项之和',
      '  return dp[n]',
      '  // 返回第n个斐波那契数',
    ],
  },
  {
    id: 'knapsack',
    name: '0/1 背包问题',
    category: 'dp',
    description: '给定一组物品（各有重量和价值）和一个容量有限的背包，求能装入背包的物品的最大总价值。',
    timeComplexity: { best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)' },
    spaceComplexity: 'O(nW)',
    pseudocode: [
      'function knapsack(weights, values, W):',
      '  for i = 0 to n: dp[i][0] = 0',
      '  for j = 0 to W: dp[0][j] = 0',
      '  for i = 1 to n:',
      '    for j = 1 to W:',
      '      if weights[i] > j:',
      '        dp[i][j] = dp[i-1][j]',
      '      else:',
      '        dp[i][j] = max(dp[i-1][j],',
      '                       dp[i-1][j-w]+v)',
      '  return dp[n][W]',
      '  // 返回最大价值',
    ],
  },
  {
    id: 'lcs',
    name: '最长公共子序列',
    category: 'dp',
    description: '求两个字符串的最长公共子序列（LCS），即在两个序列中都以相同顺序出现的最长子序列。',
    timeComplexity: { best: 'O(mn)', average: 'O(mn)', worst: 'O(mn)' },
    spaceComplexity: 'O(mn)',
    pseudocode: [
      'function LCS(X, Y):',
      '  for i = 0 to m: dp[i][0] = 0',
      '  for j = 0 to n: dp[0][j] = 0',
      '  for i = 1 to m:',
      '    for j = 1 to n:',
      '      if X[i] == Y[j]:',
      '        dp[i][j] = dp[i-1][j-1] + 1',
      '      else:',
      '        dp[i][j] = max(dp[i-1][j],',
      '                       dp[i][j-1])',
      '  return dp[m][n]',
      '  // 回溯可得到具体子序列',
    ],
  },
];

export const DP_FUNCTIONS: Record<
  string,
  (...args: never[]) => AnimationStep<DPStepData>[]
> = {
  fibonacci: fibonacci as (...args: never[]) => AnimationStep<DPStepData>[],
  knapsack: knapsack as (...args: never[]) => AnimationStep<DPStepData>[],
  lcs: lcs as (...args: never[]) => AnimationStep<DPStepData>[],
};
