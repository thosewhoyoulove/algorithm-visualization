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

export function dijkstra(graph: Graph, startId: number): AnimationStep<GraphStepData>[] {
  const steps: AnimationStep<GraphStepData>[] = [];
  const visited: number[] = [];
  const visitedSet = new Set<number>();
  const dist: Record<number, number> = {};
  const parent: Record<number, number | null> = {};
  const highlightEdges: [number, number][] = [];

  for (const node of graph.nodes) {
    dist[node.id] = Infinity;
    parent[node.id] = null;
  }
  dist[startId] = 0;

  const getFrontier = () =>
    graph.nodes
      .filter((n) => !visitedSet.has(n.id) && dist[n.id] < Infinity)
      .map((n) => n.id);

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
        frontier: getFrontier(),
        distances: { ...dist },
        parent: { ...parent },
        highlightEdges: [...highlightEdges],
      },
      codeLine,
      description,
    });
  };

  const startLabel = graph.nodes.find((n) => n.id === startId)?.label ?? String(startId);
  snap('visit', startId, `初始化：起始节点 ${startLabel} 距离设为 0，其余为 ∞`, 3);

  while (true) {
    let u = -1;
    let minDist = Infinity;
    for (const node of graph.nodes) {
      if (!visitedSet.has(node.id) && dist[node.id] < minDist) {
        minDist = dist[node.id];
        u = node.id;
      }
    }
    if (u === -1) break;

    const uLabel = graph.nodes.find((n) => n.id === u)?.label ?? String(u);
    visitedSet.add(u);
    visited.push(u);
    snap('visit', u, `选取未访问中距离最小的节点 ${uLabel}（距离 = ${dist[u]}）`, 6);

    const neighbors = getNeighbors(graph, u);
    for (const { id: v, weight } of neighbors) {
      if (visitedSet.has(v)) continue;

      const vLabel = graph.nodes.find((n) => n.id === v)?.label ?? String(v);
      highlightEdges.push([u, v]);
      const alt = dist[u] + weight;

      snap('relax', u, `松弛边 ${uLabel} → ${vLabel}（当前 ${dist[v] === Infinity ? '∞' : dist[v]}，经 ${uLabel} 为 ${alt}）`, 9);

      if (alt < dist[v]) {
        dist[v] = alt;
        parent[v] = u;
        snap('update', v, `更新节点 ${vLabel} 的最短距离为 ${alt}`, 11);
      }
    }
  }

  snap('complete', null, `Dijkstra 完成，已计算从 ${startLabel} 到所有可达节点的最短路径`, 16);
  return steps;
}
