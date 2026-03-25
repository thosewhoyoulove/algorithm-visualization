import type { AnimationStep } from '@/core/types';
import type { DPStepData } from './types';

export function lcs(str1: string, str2: string): AnimationStep<DPStepData>[] {
  const steps: AnimationStep<DPStepData>[] = [];
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );

  const rowLabels = ['""', ...str1.split('')];
  const colLabels = ['""', ...str2.split('')];

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
    description: `初始化 ${m + 1}x${n + 1} 的 LCS 表，基础行列为 0`,
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      steps.push({
        type: 'visit',
        indices: [i, j],
        data: snap([i, j], []),
        codeLine: 3,
        description: `比较 str1[${i - 1}]='${str1[i - 1]}' 和 str2[${j - 1}]='${str2[j - 1]}'`,
      });

      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          type: 'update',
          indices: [i, j],
          data: snap([i, j], [[i - 1, j - 1]]),
          codeLine: 5,
          description: `字符匹配！dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
        });
      } else {
        const fromTop = dp[i - 1][j];
        const fromLeft = dp[i][j - 1];
        dp[i][j] = Math.max(fromTop, fromLeft);

        steps.push({
          type: 'update',
          indices: [i, j],
          data: snap([i, j], [[i - 1, j], [i, j - 1]]),
          codeLine: 8,
          description: `字符不匹配，dp[${i}][${j}] = max(dp[${i - 1}][${j}]=${fromTop}, dp[${i}][${j - 1}]=${fromLeft}) = ${dp[i][j]}`,
        });
      }
    }
  }

  const lcsStr = backtrackLCS(dp, str1, str2);

  steps.push({
    type: 'complete',
    indices: [m, n],
    data: { ...snap([m, n], [[m, n]]), result: `长度=${dp[m][n]}，序列="${lcsStr}"` },
    codeLine: 11,
    description: `LCS 长度 = ${dp[m][n]}，最长公共子序列 = "${lcsStr}"`,
  });

  return steps;
}

function backtrackLCS(dp: number[][], str1: string, str2: string): string {
  let i = str1.length;
  let j = str2.length;
  const result: string[] = [];

  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      result.unshift(str1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result.join('');
}
