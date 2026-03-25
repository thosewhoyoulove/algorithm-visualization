import type { AlgorithmInfo, AnimationStep } from '@/core/types';
import { linearSearch } from './linearSearch';
import { binarySearch } from './binarySearch';

export const SEARCHING_ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'linear-search',
    name: '线性搜索',
    category: 'searching',
    description:
      '从数组的第一个元素开始，逐个检查每个元素是否等于目标值，直到找到目标或遍历完整个数组。简单直观，适用于无序数组。',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'procedure linearSearch(A, target)',
      '  for i = 0 to length(A)-1 do',
      '    visit A[i]',
      '    if A[i] == target then',
      '      return i  // 找到目标',
      '    end if',
      '  end for',
      '  return -1  // 未找到',
      'end procedure',
    ],
  },
  {
    id: 'binary-search',
    name: '二分查找',
    category: 'searching',
    description:
      '在已排序的数组中，每次比较中间元素与目标值，将搜索范围缩小一半。效率远高于线性搜索，但要求数组有序。',
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'procedure binarySearch(A, target)',
      '  low = 0, high = length(A)-1',
      '  while low <= high do',
      '    mid = ⌊(low + high) / 2⌋',
      '    if A[mid] == target then',
      '      return mid  // 找到目标',
      '    else if A[mid] < target then',
      '      low = mid + 1  // 搜索右半部分',
      '    else',
      '      high = mid - 1  // 搜索左半部分',
      '    end if',
      '  return -1  // 未找到',
      'end procedure',
    ],
  },
];

export const SEARCHING_FUNCTIONS: Record<
  string,
  (arr: number[], target: number) => AnimationStep<number[]>[]
> = {
  'linear-search': linearSearch,
  'binary-search': binarySearch,
};
