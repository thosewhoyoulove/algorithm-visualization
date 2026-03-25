import type { AlgorithmInfo, AnimationStep } from '@/core/types';
import type { TreeNode, TreeStepData } from './types';
import { buildBST, bstInsert, bstSearch, resetNodeId } from './bst';
import { inorderTraversal, preorderTraversal, postorderTraversal } from './traversal';

export type { TreeNode, TreeStepData } from './types';
export { buildBST, bstInsert, bstSearch, assignPositions, resetNodeId } from './bst';
export { inorderTraversal, preorderTraversal, postorderTraversal } from './traversal';

const SAMPLE_VALUES = [50, 30, 70, 20, 40, 60, 80];

export function createSampleTree(): TreeNode {
  resetNodeId();
  return buildBST(SAMPLE_VALUES)!;
}

export const TREE_ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'bst-insert',
    name: 'BST 插入',
    category: 'tree',
    description: '将新值插入二叉搜索树，保持左小右大的性质',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function insert(root, value):',
      '  if root is null:',
      '    return new Node(value)',
      '  if value < root.value:',
      '    root.left = insert(root.left, value)',
      '  else if value > root.value:',
      '    root.right = insert(root.right, value)',
      '  else:',
      '    // value already exists',
      '  return root',
    ],
  },
  {
    id: 'bst-search',
    name: 'BST 搜索',
    category: 'tree',
    description: '在二叉搜索树中搜索目标值，利用 BST 性质缩小范围',
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function search(root, target):',
      '  if root is null:',
      '    return NOT_FOUND',
      '  if target == root.value:',
      '    return FOUND',
      '  if target < root.value:',
      '    return search(root.left, target)',
      '  else:',
      '    return search(root.right, target)',
      '  // search complete',
    ],
  },
  {
    id: 'inorder',
    name: '中序遍历',
    category: 'tree',
    description: '按照 左子树 → 根节点 → 右子树 的顺序遍历，BST 中序结果为升序',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(h)',
    pseudocode: [
      'function inorder(node):',
      '  if node is null: return',
      '  inorder(node.left)',
      '  // visit left subtree',
      '  collect(node.value)',
      '  // visit right subtree',
      '  inorder(node.right)',
    ],
  },
  {
    id: 'preorder',
    name: '前序遍历',
    category: 'tree',
    description: '按照 根节点 → 左子树 → 右子树 的顺序遍历，用于复制树结构',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(h)',
    pseudocode: [
      'function preorder(node):',
      '  if node is null: return',
      '  collect(node.value)',
      '  preorder(node.left)',
      '  preorder(node.right)',
      '  // traversal complete',
    ],
  },
  {
    id: 'postorder',
    name: '后序遍历',
    category: 'tree',
    description: '按照 左子树 → 右子树 → 根节点 的顺序遍历，用于删除树',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(h)',
    pseudocode: [
      'function postorder(node):',
      '  if node is null: return',
      '  postorder(node.left)',
      '  postorder(node.right)',
      '  // visit left and right first',
      '  collect(node.value)',
      '  // traversal complete',
    ],
  },
];

export type TreeAlgorithmId = 'bst-insert' | 'bst-search' | 'inorder' | 'preorder' | 'postorder';

export const TREE_FUNCTIONS: Record<
  TreeAlgorithmId,
  (root: TreeNode | null, value?: number) => AnimationStep<TreeStepData>[]
> = {
  'bst-insert': (root, value = 0) => bstInsert(root, value),
  'bst-search': (root, value = 0) => bstSearch(root, value),
  inorder: (root) => inorderTraversal(root),
  preorder: (root) => preorderTraversal(root),
  postorder: (root) => postorderTraversal(root),
};
