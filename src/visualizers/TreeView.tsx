import type { TreeNode } from '@/algorithms/tree/types';

const NODE_RADIUS = 20;
const H_SPACING = 50;
const V_SPACING = 60;
const PADDING = 40;

interface Props {
  root: TreeNode | null;
  highlighted: number[];
  current: number | null;
  result: number[];
}

function getTreeBounds(node: TreeNode | null): { minX: number; maxX: number; maxY: number } {
  if (!node) return { minX: 0, maxX: 0, maxY: 0 };
  const left = getTreeBounds(node.left);
  const right = getTreeBounds(node.right);
  const x = node.x ?? 0;
  const y = node.y ?? 0;
  return {
    minX: Math.min(x, left.minX, right.minX),
    maxX: Math.max(x, left.maxX, right.maxX),
    maxY: Math.max(y, left.maxY, right.maxY),
  };
}

function nodeScreenX(x: number, minX: number): number {
  return PADDING + (x - minX) * H_SPACING;
}

function nodeScreenY(y: number): number {
  return PADDING + y * V_SPACING;
}

function getNodeFill(
  nodeId: number,
  highlighted: number[],
  current: number | null,
): string {
  if (current === nodeId) return '#f59e0b';
  if (highlighted.includes(nodeId)) return '#3b82f6';
  return '#6b7280';
}

function getNodeStroke(
  nodeId: number,
  current: number | null,
): string {
  if (current === nodeId) return '#d97706';
  return 'transparent';
}

function RenderEdges({
  node,
  minX,
}: {
  node: TreeNode | null;
  minX: number;
}) {
  if (!node) return null;
  const px = nodeScreenX(node.x ?? 0, minX);
  const py = nodeScreenY(node.y ?? 0);

  return (
    <>
      {node.left && (
        <>
          <line
            x1={px}
            y1={py}
            x2={nodeScreenX(node.left.x ?? 0, minX)}
            y2={nodeScreenY(node.left.y ?? 0)}
            stroke="#4b5563"
            strokeWidth={2}
            className="dark:stroke-gray-500"
          />
          <RenderEdges node={node.left} minX={minX} />
        </>
      )}
      {node.right && (
        <>
          <line
            x1={px}
            y1={py}
            x2={nodeScreenX(node.right.x ?? 0, minX)}
            y2={nodeScreenY(node.right.y ?? 0)}
            stroke="#4b5563"
            strokeWidth={2}
            className="dark:stroke-gray-500"
          />
          <RenderEdges node={node.right} minX={minX} />
        </>
      )}
    </>
  );
}

function RenderNodes({
  node,
  minX,
  highlighted,
  current,
}: {
  node: TreeNode | null;
  minX: number;
  highlighted: number[];
  current: number | null;
}) {
  if (!node) return null;
  const cx = nodeScreenX(node.x ?? 0, minX);
  const cy = nodeScreenY(node.y ?? 0);
  const fill = getNodeFill(node.id, highlighted, current);
  const stroke = getNodeStroke(node.id, current);
  const isPulsing = current === node.id;

  return (
    <>
      <g>
        {isPulsing && (
          <circle
            cx={cx}
            cy={cy}
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
          cx={cx}
          cy={cy}
          r={NODE_RADIUS}
          fill={fill}
          stroke={stroke}
          strokeWidth={isPulsing ? 3 : 0}
          className="transition-colors duration-200"
        />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={13}
          fontWeight={600}
          className="select-none pointer-events-none"
        >
          {node.value}
        </text>
      </g>
      <RenderNodes node={node.left} minX={minX} highlighted={highlighted} current={current} />
      <RenderNodes node={node.right} minX={minX} highlighted={highlighted} current={current} />
    </>
  );
}

export default function TreeView({ root, highlighted, current, result }: Props) {
  if (!root) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
        空树 - 请插入节点或重置
      </div>
    );
  }

  const bounds = getTreeBounds(root);
  const svgWidth = (bounds.maxX - bounds.minX) * H_SPACING + PADDING * 2;
  const treeHeight = bounds.maxY * V_SPACING + PADDING * 2;
  const resultBarHeight = result.length > 0 ? 60 : 0;
  const svgHeight = treeHeight + resultBarHeight;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <RenderEdges node={root} minX={bounds.minX} />
      <RenderNodes
        node={root}
        minX={bounds.minX}
        highlighted={highlighted}
        current={current}
      />

      {result.length > 0 && (
        <g transform={`translate(0, ${treeHeight})`}>
          <text
            x={PADDING}
            y={12}
            fill="#9ca3af"
            fontSize={11}
            fontWeight={500}
          >
            遍历结果:
          </text>
          {result.map((val, i) => {
            const bx = PADDING + i * 36;
            return (
              <g key={i}>
                <rect
                  x={bx}
                  y={20}
                  width={32}
                  height={28}
                  rx={6}
                  fill="#3b82f6"
                  opacity={0.85}
                />
                <text
                  x={bx + 16}
                  y={34}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={12}
                  fontWeight={600}
                >
                  {val}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
