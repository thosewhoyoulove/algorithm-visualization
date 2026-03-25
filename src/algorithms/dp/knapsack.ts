import type { AnimationStep } from '@/core/types';
import type { DPStepData } from './types';

export function knapsack(
  weights: number[],
  values: number[],
  capacity: number,
): AnimationStep<DPStepData>[] {
  const steps: AnimationStep<DPStepData>[] = [];
  const n = weights.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0),
  );

  const rowLabels = ['0', ...weights.map((w, i) => `物品${i + 1}(w=${w},v=${values[i]})`)];
  const colLabels = Array.from({ length: capacity + 1 }, (_, i) => String(i));

  const snap = (
    current: [number, number] | null,
    highlights: [number, number][],
  ): DPStepData => ({
    table: dp.map((row) => [...row]),
    currentCell: current,
    highlightCells: highlights,
    rowLabels,
    colLabels,
  });

  steps.push({
    type: 'highlight',
    indices: [],
    data: snap(null, []),
    codeLine: 0,
    description: `初始化 ${n + 1}x${capacity + 1} 的 DP 表，全部为 0`,
  });

  for (let i = 1; i <= n; i++) {
    const w = weights[i - 1];
    const v = values[i - 1];

    for (let j = 1; j <= capacity; j++) {
      steps.push({
        type: 'visit',
        indices: [i, j],
        data: snap([i, j], [[i - 1, j]]),
        codeLine: 3,
        description: `考虑物品 ${i}（重量=${w}, 价值=${v}），容量=${j}`,
      });

      if (w > j) {
        dp[i][j] = dp[i - 1][j];
        steps.push({
          type: 'update',
          indices: [i, j],
          data: snap([i, j], [[i - 1, j]]),
          codeLine: 5,
          description: `物品 ${i} 太重（${w} > ${j}），dp[${i}][${j}] = dp[${i - 1}][${j}] = ${dp[i][j]}`,
        });
      } else {
        const exclude = dp[i - 1][j];
        const include = dp[i - 1][j - w] + v;

        steps.push({
          type: 'compare',
          indices: [i, j],
          data: snap([i, j], [[i - 1, j], [i - 1, j - w]]),
          codeLine: 7,
          description: `比较：不选=${exclude}，选取=${dp[i - 1][j - w]}+${v}=${include}`,
        });

        dp[i][j] = Math.max(exclude, include);

        steps.push({
          type: 'update',
          indices: [i, j],
          data: snap([i, j], []),
          codeLine: 8,
          description: `dp[${i}][${j}] = max(${exclude}, ${include}) = ${dp[i][j]}`,
        });
      }
    }
  }

  steps.push({
    type: 'complete',
    indices: [n, capacity],
    data: { ...snap([n, capacity], [[n, capacity]]), result: dp[n][capacity] },
    codeLine: 11,
    description: `背包最大价值 = ${dp[n][capacity]}`,
  });

  return steps;
}
