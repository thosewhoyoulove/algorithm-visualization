import type { AnimationStep } from '@/core/types';

export function insertionSort(arr: number[]): AnimationStep<number[]>[] {
  const steps: AnimationStep<number[]>[] = [];
  const a = [...arr];
  const n = a.length;

  steps.push({
    type: 'highlight',
    indices: [],
    data: [...a],
    codeLine: 0,
    description: '开始插入排序',
  });

  for (let i = 1; i < n; i++) {
    const key = a[i];

    steps.push({
      type: 'select',
      indices: [i],
      data: [...a],
      codeLine: 2,
      description: `取出 key = A[${i}] = ${key}`,
    });

    let j = i - 1;

    while (j >= 0 && a[j] > key) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        data: [...a],
        codeLine: 4,
        description: `比较 A[${j}]=${a[j]} > key=${key}`,
      });

      a[j + 1] = a[j];
      steps.push({
        type: 'swap',
        indices: [j, j + 1],
        data: [...a],
        codeLine: 5,
        description: `将 A[${j}]=${a[j]} 右移到 A[${j + 1}]`,
      });

      j--;
    }

    if (j >= 0) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        data: [...a],
        codeLine: 4,
        description: `A[${j}]=${a[j]} <= key=${key}，停止移动`,
      });
    }

    a[j + 1] = key;
    steps.push({
      type: 'insert',
      indices: [j + 1],
      data: [...a],
      codeLine: 7,
      description: `将 key=${key} 插入到位置 ${j + 1}`,
    });
  }

  steps.push({
    type: 'complete',
    indices: Array.from({ length: n }, (_, i) => i),
    data: [...a],
    codeLine: 9,
    description: '插入排序完成',
  });

  return steps;
}
