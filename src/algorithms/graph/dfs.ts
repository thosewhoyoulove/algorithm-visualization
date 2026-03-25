import type { AnimationStep } from '@/core/types';
import type { Graph, GraphStepData } from './types';

function getNeighbors(graph: Graph, nodeId: number): { id: number; weight: number }[] {
  const neighbors: { id: number; weight: number }[] = [];
  for (const edge of graph.edges) {
    if (edge.from === nodeId) {
      neighbors.push({ id: edge.to, weight: edge.weight });
    } else if (!graph.directed && edge.to === nodeId) {
      neighbors.push({ id: edge.from, weight: edge.weight });
    }
  }
  return neighbors;
}

export function dfs(graph: Graph, startId: number): AnimationStep<GraphStepData>[] {
  const steps: AnimationStep<GraphStepData>[] = [];
  const visited: number[] = [];
  const visitedSet = new Set<number>();
  const stack: number[] = [startId];
  const highlightEdges: [number, number][] = [];

  const snap = (
    type: AnimationStep['type'],
    current: number | null,
    description: string,
    codeLine: number,
  ) => {
    steps.push({
      type,
      indices: current !== null ? [current] : [],
      data: {
        graph,
        visited: [...visited],
        current,
        frontier: [...stack],
        highlightEdges: [...highlightEdges],
      },
      codeLine,
      description,
    });
  };

  const startLabel = graph.nodes.find((n) => n.id === startId)?.label ?? String(startId);
  snap('push', null, `将起始节点 ${startLabel} 压入栈`, 2);

  while (stack.length > 0) {
    const v = stack.pop()!;
    const vLabel = graph.nodes.find((n) => n.id === v)?.label ?? String(v);

    snap('pop', v, `从栈中弹出节点 ${vLabel}`, 4);

    if (visitedSet.has(v)) continue;

    visitedSet.add(v);
    visited.push(v);
    snap('visit', v, `访问节点 ${vLabel}`, 6);

    const neighbors = getNeighbors(graph, v);
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const { id: u } = neighbors[i];
      if (!visitedSet.has(u)) {
        stack.push(u);
        highlightEdges.push([v, u]);
        const uLabel = graph.nodes.find((n) => n.id === u)?.label ?? String(u);
        snap('push', v, `将邻居节点 ${uLabel} 压入栈`, 9);
      }
    }
  }

  snap('complete', null, `DFS 遍历完成，共访问 ${visited.length} 个节点`, 14);
  return steps;
}
