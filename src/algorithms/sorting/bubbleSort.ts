import type { AnimationStep } from '@/core/types';

export function bubbleSort(arr: number[]): AnimationStep<number[]>[] {
  const steps: AnimationStep<number[]>[] = [];
  const a = [...arr];
  const n = a.length;

  steps.push({
    type: 'highlight',
    indices: [],
    data: [...a],
    codeLine: 0,
    description: '开始冒泡排序',
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        data: [...a],
        codeLine: 4,
        description: `比较 A[${j}]=${a[j]} 和 A[${j + 1}]=${a[j + 1]}`,
      });

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          data: [...a],
          codeLine: 5,
          description: `交换 A[${j}] 和 A[${j + 1}]`,
        });
      }
    }

    steps.push({
      type: 'complete',
      indices: [n - i - 1],
      data: [...a],
      codeLine: 7,
      description: `第 ${i + 1} 轮结束，A[${n - i - 1}] 已就位`,
    });
  }

  steps.push({
    type: 'complete',
    indices: Array.from({ length: n }, (_, i) => i),
    data: [...a],
    codeLine: 9,
    description: '冒泡排序完成',
  });

  return steps;
}
