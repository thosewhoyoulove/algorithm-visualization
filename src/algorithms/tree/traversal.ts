import type { AnimationStep } from '@/core/types';
import type { TreeNode, TreeStepData } from './types';

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

function makeStepData(
  root: TreeNode | null,
  highlighted: number[],
  current: number | null,
  result: number[],
): TreeStepData {
  return {
    root: cloneTree(root),
    highlighted,
    current,
    result: [...result],
  };
}

export function inorderTraversal(
  root: TreeNode | null,
): AnimationStep<TreeStepData>[] {
  const steps: AnimationStep<TreeStepData>[] = [];
  const result: number[] = [];

  steps.push({
    type: 'highlight',
    indices: [],
    data: makeStepData(root, [], null, result),
    codeLine: 0,
    description: '开始中序遍历 (左 → 根 → 右)',
  });

  function traverse(node: TreeNode | null): void {
    if (!node) return;

    steps.push({
      type: 'visit',
      indices: [node.id],
      data: makeStepData(root, [node.id], node.id, result),
      codeLine: 2,
      description: `访问节点 ${node.value}，先递归左子树`,
    });

    traverse(node.left);

    result.push(node.value);
    steps.push({
      type: 'select',
      indices: [node.id],
      data: makeStepData(root, [node.id], node.id, result),
      codeLine: 4,
      description: `将 ${node.value} 加入结果 → [${result.join(', ')}]`,
    });

    traverse(node.right);
  }

  traverse(root);

  steps.push({
    type: 'complete',
    indices: [],
    data: makeStepData(root, [], null, result),
    codeLine: 6,
    description: `中序遍历完成: [${result.join(', ')}]`,
  });

  return steps;
}

export function preorderTraversal(
  root: TreeNode | null,
): AnimationStep<TreeStepData>[] {
  const steps: AnimationStep<TreeStepData>[] = [];
  const result: number[] = [];

  steps.push({
    type: 'highlight',
    indices: [],
    data: makeStepData(root, [], null, result),
    codeLine: 0,
    description: '开始前序遍历 (根 → 左 → 右)',
  });

  function traverse(node: TreeNode | null): void {
    if (!node) return;

    result.push(node.value);
    steps.push({
      type: 'select',
      indices: [node.id],
      data: makeStepData(root, [node.id], node.id, result),
      codeLine: 2,
      description: `访问根节点 ${node.value}，加入结果 → [${result.join(', ')}]`,
    });

    steps.push({
      type: 'visit',
      indices: [node.id],
      data: makeStepData(root, [node.id], node.id, result),
      codeLine: 3,
      description: `递归左子树`,
    });
    traverse(node.left);

    steps.push({
      type: 'visit',
      indices: [node.id],
      data: makeStepData(root, [node.id], node.id, result),
      codeLine: 4,
      description: `递归右子树`,
    });
    traverse(node.right);
  }

  traverse(root);

  steps.push({
    type: 'complete',
    indices: [],
    data: makeStepData(root, [], null, result),
    codeLine: 5,
    description: `前序遍历完成: [${result.join(', ')}]`,
  });

  return steps;
}

export function postorderTraversal(
  root: TreeNode | null,
): AnimationStep<TreeStepData>[] {
  const steps: AnimationStep<TreeStepData>[] = [];
  const result: number[] = [];

  steps.push({
    type: 'highlight',
    indices: [],
    data: makeStepData(root, [], null, result),
    codeLine: 0,
    description: '开始后序遍历 (左 → 右 → 根)',
  });

  function traverse(node: TreeNode | null): void {
    if (!node) return;

    steps.push({
      type: 'visit',
      indices: [node.id],
      data: makeStepData(root, [node.id], node.id, result),
      codeLine: 2,
      description: `到达节点 ${node.value}，先递归左子树`,
    });
    traverse(node.left);

    steps.push({
      type: 'visit',
      indices: [node.id],
      data: makeStepData(root, [node.id], node.id, result),
      codeLine: 3,
      description: `节点 ${node.value}，递归右子树`,
    });
    traverse(node.right);

    result.push(node.value);
    steps.push({
      type: 'select',
      indices: [node.id],
      data: makeStepData(root, [node.id], node.id, result),
      codeLine: 5,
      description: `将 ${node.value} 加入结果 → [${result.join(', ')}]`,
    });
  }

  traverse(root);

  steps.push({
    type: 'complete',
    indices: [],
    data: makeStepData(root, [], null, result),
    codeLine: 6,
    description: `后序遍历完成: [${result.join(', ')}]`,
  });

  return steps;
}
