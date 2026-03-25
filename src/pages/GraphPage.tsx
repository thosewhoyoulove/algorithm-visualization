import { useState, useMemo, useCallback } from 'react';
import {
  createSampleGraph,
  GRAPH_ALGORITHMS,
  GRAPH_FUNCTIONS,
} from '@/algorithms/graph';
import type { GraphAlgorithmId } from '@/algorithms/graph';
import type { Graph, GraphStepData } from '@/algorithms/graph/types';
import type { AnimationStep } from '@/core/types';
import { useAnimationController } from '@/core/useAnimationController';
import GraphCanvas from '@/visualizers/GraphCanvas';
import CodePanel from '@/components/CodePanel';
import PlaybackBar from '@/components/controls/PlaybackBar';

const ALGO_IDS: GraphAlgorithmId[] = ['graph-bfs', 'graph-dfs', 'graph-dijkstra'];

export default function GraphPage() {
  const [graph, setGraph] = useState<Graph>(createSampleGraph);
  const [selectedAlgo, setSelectedAlgo] = useState<GraphAlgorithmId>('graph-bfs');
  const [startNode, setStartNode] = useState(0);
  const [steps, setSteps] = useState<AnimationStep<GraphStepData>[]>([]);
  const [showCode, setShowCode] = useState(true);

  const controller = useAnimationController(steps);
  const currentStep = controller.currentStep as AnimationStep<GraphStepData> | null;

  const algoInfo = useMemo(() => GRAPH_ALGORITHMS.find((a) => a.id === selectedAlgo)!, [selectedAlgo]);

  const displayData: GraphStepData = useMemo(() => {
    if (currentStep) return currentStep.data;
    return { graph, visited: [], current: null, frontier: [], highlightEdges: [] };
  }, [currentStep, graph]);

  const handleRun = useCallback(() => {
    const fn = GRAPH_FUNCTIONS[selectedAlgo];
    setSteps(fn(graph, startNode));
  }, [selectedAlgo, graph, startNode]);

  const handleNewGraph = useCallback(() => {
    setGraph(createSampleGraph());
    setStartNode(0);
    setSteps([]);
  }, []);

  const handleAlgoChange = useCallback((id: GraphAlgorithmId) => {
    setSelectedAlgo(id);
    setSteps([]);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2.5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1 overflow-x-auto">
            {ALGO_IDS.map((id) => {
              const info = GRAPH_ALGORITHMS.find((a) => a.id === id)!;
              return (
                <button
                  key={id}
                  onClick={() => handleAlgoChange(id)}
                  className={`px-3 py-1.5 text-[13px] rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedAlgo === id
                      ? 'bg-purple-500 text-white shadow-sm shadow-purple-500/20'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {info.name}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[13px] text-gray-500 dark:text-gray-400">起点:</label>
            <select
              value={startNode}
              onChange={(e) => { setStartNode(Number(e.target.value)); setSteps([]); }}
              className="px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {graph.nodes.map((node) => (
                <option key={node.id} value={node.id}>{node.label}</option>
              ))}
            </select>
            <button onClick={handleRun} className="px-4 py-1.5 text-[13px] rounded-lg font-medium bg-purple-500 hover:bg-purple-600 text-white shadow-sm shadow-purple-500/20 transition-all active:scale-[0.98]">
              运行
            </button>
            <button onClick={handleNewGraph} className="px-3 py-1.5 text-[13px] rounded-lg font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              新图
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className={`hidden lg:block px-3 py-1.5 text-[13px] font-medium rounded-lg border transition-colors ${
                showCode ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              Code
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
          <div className="w-full h-full max-w-3xl">
            <GraphCanvas
              graph={displayData.graph}
              visited={displayData.visited}
              current={displayData.current}
              frontier={displayData.frontier}
              highlightEdges={displayData.highlightEdges}
              distances={displayData.distances}
            />
          </div>
        </div>
        {showCode && (
          <div className="hidden lg:block w-90 border-l border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-4 overflow-y-auto">
            <CodePanel
              code={algoInfo.pseudocode}
              activeLine={currentStep?.codeLine}
              description={currentStep?.description ?? algoInfo.description}
              timeComplexity={algoInfo.timeComplexity}
              spaceComplexity={algoInfo.spaceComplexity}
            />
          </div>
        )}
      </div>

      {steps.length > 0 && <PlaybackBar controller={controller} />}
    </div>
  );
}
