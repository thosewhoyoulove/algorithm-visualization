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

export function bfs(graph: Graph, startId: number): AnimationStep<GraphStepData>[] {
  const steps: AnimationStep<GraphStepData>[] = [];
  const visited: number[] = [];
  const discovered = new Set<number>([startId]);
  const queue: number[] = [startId];
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
        frontier: [...queue],
        highlightEdges: [...highlightEdges],
      },
      codeLine,
      description,
    });
  };

  const startLabel = graph.nodes.find((n) => n.id === startId)?.label ?? String(startId);
  snap('enqueue', null, `将起始节点 ${startLabel} 加入队列`, 2);

  while (queue.length > 0) {
    const v = queue.shift()!;
    const vLabel = graph.nodes.find((n) => n.id === v)?.label ?? String(v);

    snap('dequeue', v, `从队列中取出节点 ${vLabel}`, 4);

    visited.push(v);
    snap('visit', v, `访问节点 ${vLabel}`, 5);

    const neighbors = getNeighbors(graph, v);
    for (const { id: u } of neighbors) {
      if (!discovered.has(u)) {
        discovered.add(u);
        queue.push(u);
        highlightEdges.push([v, u]);
        const uLabel = graph.nodes.find((n) => n.id === u)?.label ?? String(u);
        snap('enqueue', v, `将邻居节点 ${uLabel} 加入队列`, 8);
      }
    }
  }

  snap('complete', null, `BFS 遍历完成，共访问 ${visited.length} 个节点`, 12);
  return steps;
}
