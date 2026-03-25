import type { Graph } from '@/algorithms/graph/types';

const NODE_RADIUS = 22;

interface Props {
  graph: Graph;
  visited: number[];
  current: number | null;
  frontier: number[];
  highlightEdges?: [number, number][];
  distances?: Record<number, number>;
}

function getNodeFill(
  nodeId: number,
  visited: number[],
  current: number | null,
  frontier: number[],
): string {
  if (current === nodeId) return '#f59e0b';
  if (visited.includes(nodeId)) return '#8b5cf6';
  if (frontier.includes(nodeId)) return '#3b82f6';
  return '#6b7280';
}

function isEdgeHighlighted(
  from: number,
  to: number,
  highlightEdges: [number, number][],
): boolean {
  return highlightEdges.some(
    ([a, b]) => (a === from && b === to) || (a === to && b === from),
  );
}

export default function GraphCanvas({
  graph,
  visited,
  current,
  frontier,
  highlightEdges = [],
  distances,
}: Props) {
  if (graph.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
        空图 - 请生成新图
      </div>
    );
  }

  const xs = graph.nodes.map((n) => n.x);
  const ys = graph.nodes.map((n) => n.y);
  const padding = 60;
  const minX = Math.min(...xs) - padding;
  const minY = Math.min(...ys) - padding;
  const maxX = Math.max(...xs) + padding;
  const maxY = Math.max(...ys) + padding;
  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

  return (
    <svg viewBox={viewBox} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
        </marker>
      </defs>

      {graph.edges.map((edge, i) => {
        const fromNode = nodeMap.get(edge.from);
        const toNode = nodeMap.get(edge.to);
        if (!fromNode || !toNode) return null;

        const highlighted = isEdgeHighlighted(edge.from, edge.to, highlightEdges);
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;

        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const offsetX = len > 0 ? (-dy / len) * 10 : 0;
        const offsetY = len > 0 ? (dx / len) * 10 : 0;

        return (
          <g key={`edge-${i}`}>
            <line
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={highlighted ? '#f59e0b' : '#4b5563'}
              strokeWidth={highlighted ? 3 : 2}
              opacity={highlighted ? 1 : 0.5}
              markerEnd={graph.directed ? 'url(#arrowhead)' : undefined}
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
            />
            <rect
              x={midX + offsetX - 12}
              y={midY + offsetY - 9}
              width={24}
              height={18}
              rx={4}
              fill="#1f2937"
              opacity={0.75}
            />
            <text
              x={midX + offsetX}
              y={midY + offsetY}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#e5e7eb"
              fontSize={11}
              fontWeight={600}
              className="select-none pointer-events-none"
            >
              {edge.weight}
            </text>
          </g>
        );
      })}

      {graph.nodes.map((node) => {
        const fill = getNodeFill(node.id, visited, current, frontier);
        const isPulsing = current === node.id;
        const dist = distances?.[node.id];
        const showDist = dist !== undefined && visited.includes(node.id);

        return (
          <g key={`node-${node.id}`}>
            {isPulsing && (
              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_RADIUS + 6}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={2}
                opacity={0.5}
              >
                <animate
                  attributeName="r"
                  values={`${NODE_RADIUS + 4};${NODE_RADIUS + 10};${NODE_RADIUS + 4}`}
                  dur="1.2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.2;0.6"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={NODE_RADIUS}
              fill={fill}
              stroke={isPulsing ? '#d97706' : 'transparent'}
              strokeWidth={isPulsing ? 3 : 0}
              style={{ transition: 'fill 0.3s' }}
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize={14}
              fontWeight={700}
              className="select-none pointer-events-none"
            >
              {node.label}
            </text>
            {showDist && (
              <>
                <rect
                  x={node.x + NODE_RADIUS - 2}
                  y={node.y - NODE_RADIUS - 2}
                  width={dist === Infinity ? 20 : String(dist).length * 8 + 10}
                  height={18}
                  rx={4}
                  fill="#7c3aed"
                  opacity={0.9}
                />
                <text
                  x={node.x + NODE_RADIUS + (dist === Infinity ? 10 : String(dist).length * 4 + 5) - 2}
                  y={node.y - NODE_RADIUS + 7}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={10}
                  fontWeight={600}
                  className="select-none pointer-events-none"
                >
                  {dist === Infinity ? '∞' : dist}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
