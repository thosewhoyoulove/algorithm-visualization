export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
}

export interface GraphStepData {
  graph: Graph;
  visited: number[];
  current: number | null;
  frontier: number[];
  distances?: Record<number, number>;
  parent?: Record<number, number | null>;
  highlightEdges?: [number, number][];
}
