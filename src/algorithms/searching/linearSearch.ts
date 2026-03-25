import type { AnimationStep } from '@/core/types';

export function linearSearch(arr: number[], target: number): AnimationStep<number[]>[] {
  const steps: AnimationStep<number[]>[] = [];

  steps.push({
    type: 'visit',
    indices: [],
    data: [...arr],
    codeLine: 0,
    description: `开始线性搜索，目标值: ${target}`,
  });

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      type: 'visit',
      indices: [i],
      data: [...arr],
      codeLine: 2,
      description: `访问索引 ${i}`,
    });

    steps.push({
      type: 'compare',
      indices: [i],
      data: [...arr],
      codeLine: 3,
      description: `比较 A[${i}]=${arr[i]} 与目标值 ${target}`,
    });

    if (arr[i] === target) {
      steps.push({
        type: 'found',
        indices: [i],
        data: [...arr],
        codeLine: 4,
        description: `在索引 ${i} 找到目标值 ${target}`,
      });
      return steps;
    }
  }

  steps.push({
    type: 'not-found',
    indices: [],
    data: [...arr],
    codeLine: 7,
    description: `未找到目标值 ${target}`,
  });

  return steps;
}
