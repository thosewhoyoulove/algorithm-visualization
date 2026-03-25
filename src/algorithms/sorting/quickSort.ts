import type { AnimationStep } from '@/core/types';

export function quickSort(arr: number[]): AnimationStep<number[]>[] {
  const steps: AnimationStep<number[]>[] = [];
  const a = [...arr];

  steps.push({
    type: 'highlight',
    indices: [],
    data: [...a],
    codeLine: 0,
    description: '开始快速排序',
  });

  function partition(low: number, high: number): number {
    const pivot = a[high];

    steps.push({
      type: 'partition',
      indices: [high],
      data: [...a],
      codeLine: 7,
      description: `选择基准值 pivot = A[${high}] = ${pivot}`,
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        type: 'compare',
        indices: [j, high],
        data: [...a],
        codeLine: 9,
        description: `比较 A[${j}]=${a[j]} 和 pivot=${pivot}`,
      });

      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({
            type: 'swap',
            indices: [i, j],
            data: [...a],
            codeLine: 11,
            description: `交换 A[${i}] 和 A[${j}]`,
          });
        }
      }
    }

    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    steps.push({
      type: 'swap',
      indices: [i + 1, high],
      data: [...a],
      codeLine: 14,
      description: `将基准值放到位置 ${i + 1}`,
    });

    steps.push({
      type: 'complete',
      indices: [i + 1],
      data: [...a],
      codeLine: 15,
      description: `A[${i + 1}]=${a[i + 1]} 已就位`,
    });

    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      steps.push({
        type: 'highlight',
        indices: Array.from({ length: high - low + 1 }, (_, k) => low + k),
        data: [...a],
        codeLine: 1,
        description: `处理子数组 [${low}..${high}]`,
      });

      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, a.length - 1);

  steps.push({
    type: 'complete',
    indices: Array.from({ length: a.length }, (_, i) => i),
    data: [...a],
    codeLine: 4,
    description: '快速排序完成',
  });

  return steps;
}
