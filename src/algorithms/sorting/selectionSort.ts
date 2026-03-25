import type { AnimationStep } from '@/core/types';

export function selectionSort(arr: number[]): AnimationStep<number[]>[] {
  const steps: AnimationStep<number[]>[] = [];
  const a = [...arr];
  const n = a.length;

  steps.push({
    type: 'highlight',
    indices: [],
    data: [...a],
    codeLine: 0,
    description: '开始选择排序',
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      type: 'select',
      indices: [i],
      data: [...a],
      codeLine: 3,
      description: `假设最小值为 A[${i}]=${a[i]}`,
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'compare',
        indices: [j, minIdx],
        data: [...a],
        codeLine: 5,
        description: `比较 A[${j}]=${a[j]} 和当前最小值 A[${minIdx}]=${a[minIdx]}`,
      });

      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({
          type: 'highlight',
          indices: [minIdx],
          data: [...a],
          codeLine: 6,
          description: `更新最小值索引为 ${minIdx}，值为 ${a[minIdx]}`,
        });
      }
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({
        type: 'swap',
        indices: [i, minIdx],
        data: [...a],
        codeLine: 9,
        description: `交换 A[${i}] 和 A[${minIdx}]`,
      });
    }

    steps.push({
      type: 'complete',
      indices: [i],
      data: [...a],
      codeLine: 10,
      description: `A[${i}]=${a[i]} 已就位`,
    });
  }

  steps.push({
    type: 'complete',
    indices: Array.from({ length: n }, (_, i) => i),
    data: [...a],
    codeLine: 12,
    description: '选择排序完成',
  });

  return steps;
}
