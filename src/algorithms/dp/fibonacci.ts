import type { AnimationStep } from '@/core/types';
import type { DPStepData } from './types';

export function fibonacci(n: number): AnimationStep<DPStepData>[] {
  const steps: AnimationStep<DPStepData>[] = [];
  const dp = new Array(n + 1).fill(0);

  const colLabels = Array.from({ length: n + 1 }, (_, i) => String(i));

  const snap = (
    current: number | null,
    highlights: number[],
  ): DPStepData => ({
    table: [[...dp]],
    currentCell: current !== null ? [0, current] : null,
    highlightCells: highlights.map((c) => [0, c] as [number, number]),
    colLabels,
  });

  steps.push({
    type: 'highlight',
    indices: [],
    data: snap(null, []),
    codeLine: 0,
    description: `初始化 dp 数组，长度为 ${n + 1}`,
  });

  dp[0] = 0;
  dp[1] = 1;

  steps.push({
    type: 'set',
    indices: [0, 1],
    data: snap(null, [0, 1]),
    codeLine: 1,
    description: 'dp[0] = 0, dp[1] = 1（基础情况）',
  });

  for (let i = 2; i <= n; i++) {
    steps.push({
      type: 'visit',
      indices: [i],
      data: snap(i, [i - 1, i - 2]),
      codeLine: 3,
      description: `计算 dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]}`,
    });

    dp[i] = dp[i - 1] + dp[i - 2];

    steps.push({
      type: 'update',
      indices: [i],
      data: snap(i, []),
      codeLine: 4,
      description: `dp[${i}] = ${dp[i]}`,
    });
  }

  steps.push({
    type: 'complete',
    indices: Array.from({ length: n + 1 }, (_, i) => i),
    data: { ...snap(null, [n]), result: dp[n] },
    codeLine: 6,
    description: `斐波那契(${n}) = ${dp[n]}`,
  });

  return steps;
}
