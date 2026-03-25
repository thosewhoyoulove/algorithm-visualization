export interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
  id: number;
}

export interface TreeStepData {
  root: TreeNode | null;
  highlighted: number[];
  current: number | null;
  result: number[];
}
