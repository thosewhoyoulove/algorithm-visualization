import type { AnimationStep } from '@/core/types';

export function binarySearch(arr: number[], target: number): AnimationStep<number[]>[] {
  const steps: AnimationStep<number[]>[] = [];
  const sorted = [...arr].sort((a, b) => a - b);

  let low = 0;
  let high = sorted.length - 1;

  steps.push({
    type: 'visit',
    indices: [],
    data: [...sorted],
    codeLine: 0,
    description: `开始二分查找，目标值: ${target}`,
    extra: { low, high, mid: -1 },
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    steps.push({
      type: 'visit',
      indices: [mid],
      data: [...sorted],
      codeLine: 2,
      description: `计算中间索引 mid = ⌊(${low} + ${high}) / 2⌋ = ${mid}`,
      extra: { low, high, mid },
    });

    steps.push({
      type: 'compare',
      indices: [mid],
      data: [...sorted],
      codeLine: 3,
      description: `比较 A[${mid}]=${sorted[mid]} 与目标值 ${target}`,
      extra: { low, high, mid },
    });

    if (sorted[mid] === target) {
      steps.push({
        type: 'found',
        indices: [mid],
        data: [...sorted],
        codeLine: 4,
        description: `在索引 ${mid} 找到目标值 ${target}`,
        extra: { low, high, mid },
      });
      return steps;
    } else if (sorted[mid] < target) {
      low = mid + 1;
      steps.push({
        type: 'visit',
        indices: [mid],
        data: [...sorted],
        codeLine: 6,
        description: `A[${mid}]=${sorted[mid]} < ${target}，搜索右半部分，low = ${low}`,
        extra: { low, high, mid },
      });
    } else {
      high = mid - 1;
      steps.push({
        type: 'visit',
        indices: [mid],
        data: [...sorted],
        codeLine: 8,
        description: `A[${mid}]=${sorted[mid]} > ${target}，搜索左半部分，high = ${high}`,
        extra: { low, high, mid },
      });
    }
  }

  steps.push({
    type: 'not-found',
    indices: [],
    data: [...sorted],
    codeLine: 10,
    description: `未找到目标值 ${target}`,
    extra: { low, high, mid: -1 },
  });

  return steps;
}
