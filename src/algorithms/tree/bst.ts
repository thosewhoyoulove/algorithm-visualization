import type { AnimationStep } from '@/core/types';
import type { TreeNode, TreeStepData } from './types';

let nextNodeId = 1;

export function resetNodeId(): void {
  nextNodeId = 1;
}

function createNode(value: number): TreeNode {
  return { value, left: null, right: null, id: nextNodeId++ };
}

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

function collectIds(node: TreeNode | null): number[] {
  if (!node) return [];
  return [node.id, ...collectIds(node.left), ...collectIds(node.right)];
}

export function assignPositions(root: TreeNode | null): void {
  let xPos = 0;
  function inorder(node: TreeNode | null, depth: number): void {
    if (!node) return;
    inorder(node.left, depth + 1);
    node.x = xPos++;
    node.y = depth;
    inorder(node.right, depth + 1);
  }
  inorder(root, 0);
}

export function buildBST(values: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  for (const v of values) {
    root = insertNode(root, v);
  }
  assignPositions(root);
  return root;
}

function insertNode(root: TreeNode | null, value: number): TreeNode {
  if (!root) return createNode(value);
  if (value < root.value) {
    root.left = insertNode(root.left, value);
  } else if (value > root.value) {
    root.right = insertNode(root.right, value);
  }
  return root;
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

export function bstInsert(
  root: TreeNode | null,
  value: number,
): AnimationStep<TreeStepData>[] {
  const steps: AnimationStep<TreeStepData>[] = [];

  steps.push({
    type: 'highlight',
    indices: [],
    data: makeStepData(root, [], null, []),
    codeLine: 0,
    description: `开始插入值 ${value}`,
  });

  function insert(node: TreeNode | null, parent: TreeNode | null, isLeft: boolean): TreeNode {
    if (!node) {
      const newNode = createNode(value);
      if (parent) {
        if (isLeft) parent.left = newNode;
        else parent.right = newNode;
      }
      assignPositions(root ?? newNode);
      steps.push({
        type: 'insert',
        indices: [newNode.id],
        data: makeStepData(root ?? newNode, [newNode.id], newNode.id, []),
        codeLine: 2,
        description: `插入新节点 ${value}`,
      });
      return newNode;
    }

    steps.push({
      type: 'compare',
      indices: [node.id],
      data: makeStepData(root!, [node.id], node.id, []),
      codeLine: 3,
      description: `比较 ${value} 与节点 ${node.value}`,
    });

    if (value < node.value) {
      steps.push({
        type: 'visit',
        indices: [node.id],
        data: makeStepData(root!, [node.id], node.id, []),
        codeLine: 4,
        description: `${value} < ${node.value}，走向左子树`,
      });
      node.left = insert(node.left, node, true);
    } else if (value > node.value) {
      steps.push({
        type: 'visit',
        indices: [node.id],
        data: makeStepData(root!, [node.id], node.id, []),
        codeLine: 6,
        description: `${value} > ${node.value}，走向右子树`,
      });
      node.right = insert(node.right, node, false);
    } else {
      steps.push({
        type: 'found',
        indices: [node.id],
        data: makeStepData(root!, [node.id], node.id, []),
        codeLine: 8,
        description: `值 ${value} 已存在，跳过插入`,
      });
    }

    return node;
  }

  if (!root) {
    root = insert(null, null, false);
  } else {
    insert(root, null, false);
  }

  assignPositions(root);
  steps.push({
    type: 'complete',
    indices: collectIds(root),
    data: makeStepData(root, [], null, []),
    codeLine: 9,
    description: `插入完成`,
  });

  return steps;
}

export function bstSearch(
  root: TreeNode | null,
  target: number,
): AnimationStep<TreeStepData>[] {
  const steps: AnimationStep<TreeStepData>[] = [];

  steps.push({
    type: 'highlight',
    indices: [],
    data: makeStepData(root, [], null, []),
    codeLine: 0,
    description: `开始搜索值 ${target}`,
  });

  function search(node: TreeNode | null): boolean {
    if (!node) {
      steps.push({
        type: 'not-found',
        indices: [],
        data: makeStepData(root, [], null, []),
        codeLine: 2,
        description: `到达空节点，值 ${target} 不存在`,
      });
      return false;
    }

    steps.push({
      type: 'compare',
      indices: [node.id],
      data: makeStepData(root, [node.id], node.id, []),
      codeLine: 3,
      description: `比较 ${target} 与节点 ${node.value}`,
    });

    if (target === node.value) {
      steps.push({
        type: 'found',
        indices: [node.id],
        data: makeStepData(root, [node.id], node.id, []),
        codeLine: 4,
        description: `找到目标值 ${target}!`,
      });
      return true;
    }

    if (target < node.value) {
      steps.push({
        type: 'visit',
        indices: [node.id],
        data: makeStepData(root, [node.id], node.id, []),
        codeLine: 6,
        description: `${target} < ${node.value}，搜索左子树`,
      });
      return search(node.left);
    }

    steps.push({
      type: 'visit',
      indices: [node.id],
      data: makeStepData(root, [node.id], node.id, []),
      codeLine: 8,
      description: `${target} > ${node.value}，搜索右子树`,
    });
    return search(node.right);
  }

  const found = search(root);

  steps.push({
    type: 'complete',
    indices: [],
    data: makeStepData(root, [], null, []),
    codeLine: 9,
    description: found ? `搜索完成：找到 ${target}` : `搜索完成：${target} 不存在`,
  });

  return steps;
}
