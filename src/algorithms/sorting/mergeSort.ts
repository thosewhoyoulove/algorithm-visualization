import type { AnimationStep } from '@/core/types';

export function mergeSort(arr: number[]): AnimationStep<number[]>[] {
  const steps: AnimationStep<number[]>[] = [];
  const a = [...arr];

  steps.push({
    type: 'highlight',
    indices: [],
    data: [...a],
    codeLine: 0,
    description: '开始归并排序',
  });

  function merge(left: number, mid: number, right: number) {
    const leftArr = a.slice(left, mid + 1);
    const rightArr = a.slice(mid + 1, right + 1);

    steps.push({
      type: 'merge',
      indices: Array.from({ length: right - left + 1 }, (_, k) => left + k),
      data: [...a],
      codeLine: 8,
      description: `合并 [${left}..${mid}] 和 [${mid + 1}..${right}]`,
    });

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        type: 'compare',
        indices: [left + i, mid + 1 + j],
        data: [...a],
        codeLine: 10,
        description: `比较 ${leftArr[i]} 和 ${rightArr[j]}`,
      });

      if (leftArr[i] <= rightArr[j]) {
        a[k] = leftArr[i];
        i++;
      } else {
        a[k] = rightArr[j];
        j++;
      }

      steps.push({
        type: 'update',
        indices: [k],
        data: [...a],
        codeLine: 11,
        description: `将 ${a[k]} 放到位置 ${k}`,
      });
      k++;
    }

    while (i < leftArr.length) {
      a[k] = leftArr[i];
      steps.push({
        type: 'update',
        indices: [k],
        data: [...a],
        codeLine: 13,
        description: `复制剩余元素 ${leftArr[i]} 到位置 ${k}`,
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      a[k] = rightArr[j];
      steps.push({
        type: 'update',
        indices: [k],
        data: [...a],
        codeLine: 14,
        description: `复制剩余元素 ${rightArr[j]} 到位置 ${k}`,
      });
      j++;
      k++;
    }
  }

  function sort(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        type: 'highlight',
        indices: Array.from({ length: right - left + 1 }, (_, k) => left + k),
        data: [...a],
        codeLine: 2,
        description: `分割 [${left}..${right}]，中点 ${mid}`,
      });

      sort(left, mid);
      sort(mid + 1, right);
      merge(left, mid, right);
    }
  }

  sort(0, a.length - 1);

  steps.push({
    type: 'complete',
    indices: Array.from({ length: a.length }, (_, i) => i),
    data: [...a],
    codeLine: 5,
    description: '归并排序完成',
  });

  return steps;
}
