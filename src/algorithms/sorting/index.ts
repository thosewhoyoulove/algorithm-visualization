import type { AlgorithmInfo, AnimationStep } from '@/core/types';
import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { insertionSort } from './insertionSort';
import { quickSort } from './quickSort';
import { mergeSort } from './mergeSort';

export const sortingAlgorithms: AlgorithmInfo[] = [
  {
    id: 'bubble-sort',
    name: '冒泡排序',
    category: 'sorting',
    description:
      '重复遍历数组，比较相邻元素并交换顺序错误的元素对，直到无需交换为止。每一轮将最大的未排序元素"冒泡"到正确位置。',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'procedure bubbleSort(A)',
      '  n = length(A)',
      '  for i = 0 to n-1 do',
      '    for j = 0 to n-i-2 do',
      '      if A[j] > A[j+1] then',
      '        swap(A[j], A[j+1])',
      '      end if',
      '    end for',
      '  end for',
      'end procedure',
    ],
  },
  {
    id: 'selection-sort',
    name: '选择排序',
    category: 'sorting',
    description:
      '每次从未排序部分找出最小元素，将其与未排序部分的第一个元素交换，逐步将数组变为有序。',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'procedure selectionSort(A)',
      '  n = length(A)',
      '  for i = 0 to n-1 do',
      '    minIdx = i',
      '    for j = i+1 to n-1 do',
      '      if A[j] < A[minIdx] then',
      '        minIdx = j',
      '      end if',
      '    end for',
      '    swap(A[i], A[minIdx])',
      '  end for',
      '  return A',
      'end procedure',
    ],
  },
  {
    id: 'insertion-sort',
    name: '插入排序',
    category: 'sorting',
    description:
      '将数组分为已排序和未排序两部分，依次将未排序元素插入已排序部分的正确位置，类似于整理扑克牌。',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'procedure insertionSort(A)',
      '  for i = 1 to length(A)-1 do',
      '    key = A[i]',
      '    j = i - 1',
      '    while j >= 0 and A[j] > key do',
      '      A[j+1] = A[j]',
      '      j = j - 1',
      '    end while',
      '    A[j+1] = key',
      '  end for',
      'end procedure',
    ],
  },
  {
    id: 'quick-sort',
    name: '快速排序',
    category: 'sorting',
    description:
      '选取一个基准元素，将数组分为小于基准和大于基准的两部分，然后递归排序。平均情况下是最快的通用排序算法之一。',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    pseudocode: [
      'procedure quickSort(A, low, high)',
      '  if low < high then',
      '    pivot = partition(A, low, high)',
      '    quickSort(A, low, pivot-1)',
      '    quickSort(A, pivot+1, high)',
      '  end if',
      '',
      'procedure partition(A, low, high)',
      '  pivot = A[high]',
      '  i = low - 1',
      '  for j = low to high-1 do',
      '    if A[j] <= pivot then',
      '      i = i + 1',
      '      swap(A[i], A[j])',
      '  swap(A[i+1], A[high])',
      '  return i + 1',
    ],
  },
  {
    id: 'merge-sort',
    name: '归并排序',
    category: 'sorting',
    description:
      '采用分治策略，将数组递归地拆分为两半，分别排序后再合并。保证 O(n log n) 的时间复杂度，是稳定排序算法。',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    pseudocode: [
      'procedure mergeSort(A, left, right)',
      '  if left < right then',
      '    mid = (left + right) / 2',
      '    mergeSort(A, left, mid)',
      '    mergeSort(A, mid+1, right)',
      '    merge(A, left, mid, right)',
      '',
      'procedure merge(A, left, mid, right)',
      '  create temp arrays L, R',
      '  copy A[left..mid] to L',
      '  copy A[mid+1..right] to R',
      '  while both arrays have elements',
      '    compare and place smaller into A',
      '  copy remaining from L',
      '  copy remaining from R',
    ],
  },
];

export const sortingFunctions: Record<
  string,
  (arr: number[]) => AnimationStep<number[]>[]
> = {
  'bubble-sort': bubbleSort,
  'selection-sort': selectionSort,
  'insertion-sort': insertionSort,
  'quick-sort': quickSort,
  'merge-sort': mergeSort,
};
