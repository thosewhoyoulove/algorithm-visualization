import { useState, useMemo, useCallback } from 'react';
import { DP_ALGORITHMS, DP_FUNCTIONS } from '@/algorithms/dp/index';
import type { DPStepData } from '@/algorithms/dp/types';
import type { AnimationStep } from '@/core/types';
import { useAnimationController } from '@/core/useAnimationController';
import DPTable from '@/visualizers/DPTable';
import CodePanel from '@/components/CodePanel';
import PlaybackBar from '@/components/controls/PlaybackBar';

type DPAlgorithmId = 'fibonacci' | 'knapsack' | 'lcs';

const KNAPSACK_PRESETS = [
  { label: '示例 1', weights: [2, 3, 4, 5], values: [3, 4, 5, 6], capacity: 8 },
  { label: '示例 2', weights: [1, 2, 3], values: [6, 10, 12], capacity: 5 },
  { label: '示例 3', weights: [3, 4, 5, 6], values: [2, 3, 4, 5], capacity: 10 },
];

export default function DPPage() {
  const [selectedAlgo, setSelectedAlgo] = useState<DPAlgorithmId>('fibonacci');
  const [fibN, setFibN] = useState(10);
  const [knapsackPreset, setKnapsackPreset] = useState(0);
  const [lcsStr1, setLcsStr1] = useState('ABCBDAB');
  const [lcsStr2, setLcsStr2] = useState('BDCAB');
  const [steps, setSteps] = useState<AnimationStep<DPStepData>[]>([]);
  const [showCode, setShowCode] = useState(true);

  const controller = useAnimationController<DPStepData>(steps);
  const currentStep = controller.currentStep as AnimationStep<DPStepData> | null;

  const algoInfo = useMemo(() => DP_ALGORITHMS.find((a) => a.id === selectedAlgo)!, [selectedAlgo]);

  const handleRun = useCallback(() => {
    controller.reset();
    let newSteps: AnimationStep<DPStepData>[] = [];
    if (selectedAlgo === 'fibonacci') {
      const fn = DP_FUNCTIONS['fibonacci'];
      newSteps = (fn as (n: number) => AnimationStep<DPStepData>[])(Math.max(2, Math.min(fibN, 30)));
    } else if (selectedAlgo === 'knapsack') {
      const preset = KNAPSACK_PRESETS[knapsackPreset];
      const fn = DP_FUNCTIONS['knapsack'];
      newSteps = (fn as (w: number[], v: number[], c: number) => AnimationStep<DPStepData>[])(preset.weights, preset.values, preset.capacity);
    } else {
      const fn = DP_FUNCTIONS['lcs'];
      newSteps = (fn as (a: string, b: string) => AnimationStep<DPStepData>[])(lcsStr1 || 'A', lcsStr2 || 'B');
    }
    setSteps(newSteps);
  }, [selectedAlgo, fibN, knapsackPreset, lcsStr1, lcsStr2, controller]);

  const handleAlgoChange = useCallback((id: DPAlgorithmId) => {
    setSelectedAlgo(id);
    setSteps([]);
    controller.reset();
  }, [controller]);

  const displayData: DPStepData | null = currentStep?.data ?? null;

  const result = useMemo(() => {
    if (!currentStep || currentStep.type !== 'complete') return null;
    return currentStep.data.result ?? null;
  }, [currentStep]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-gray-200/80 dark:border-gray-800/80 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 overflow-x-auto">
            {DP_ALGORITHMS.map((algo) => (
              <button
                key={algo.id}
                onClick={() => handleAlgoChange(algo.id as DPAlgorithmId)}
                className={`px-3 py-1.5 text-[13px] font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                  selectedAlgo === algo.id
                    ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {algo.name}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />

          {selectedAlgo === 'fibonacci' && (
            <div className="flex items-center gap-1.5">
              <label className="text-[13px] text-gray-500 dark:text-gray-400">n =</label>
              <input type="number" min={2} max={30} value={fibN} onChange={(e) => setFibN(Number(e.target.value))}
                className="w-16 px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
          )}

          {selectedAlgo === 'knapsack' && (
            <select value={knapsackPreset} onChange={(e) => setKnapsackPreset(Number(e.target.value))}
              className="px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              {KNAPSACK_PRESETS.map((p, i) => (
                <option key={i} value={i}>{p.label} (C={p.capacity})</option>
              ))}
            </select>
          )}

          {selectedAlgo === 'lcs' && (
            <div className="flex items-center gap-1.5">
              <input type="text" value={lcsStr1} onChange={(e) => setLcsStr1(e.target.value.toUpperCase())} maxLength={12} placeholder="S1"
                className="w-24 px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              <span className="text-xs text-gray-400">vs</span>
              <input type="text" value={lcsStr2} onChange={(e) => setLcsStr2(e.target.value.toUpperCase())} maxLength={12} placeholder="S2"
                className="w-24 px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={handleRun} className="px-4 py-1.5 text-[13px] font-medium rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 transition-all active:scale-[0.98]">
              运行
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className={`hidden lg:block px-3 py-1.5 text-[13px] font-medium rounded-lg border transition-colors ${
                showCode ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              Code
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 min-h-0">
        <div className={`flex flex-col min-w-0 ${showCode ? 'flex-1' : 'w-full'}`}>
          <div className="px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
            <span>{algoInfo.name} -- DP 表</span>
            {result !== null && result !== undefined && (
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                Result: {String(result)}
              </span>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
            {displayData ? (
              <DPTable
                table={displayData.table}
                currentCell={displayData.currentCell}
                highlightCells={displayData.highlightCells}
                rowLabels={displayData.rowLabels}
                colLabels={displayData.colLabels}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
                点击「运行」开始算法可视化
              </div>
            )}
          </div>
          {currentStep?.description && (
            <div className="shrink-0 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/50">
              {currentStep.description}
            </div>
          )}
        </div>

        {showCode && (
          <div className="hidden lg:block w-80 border-l border-gray-200/80 dark:border-gray-800/80 p-4 overflow-y-auto bg-white dark:bg-gray-950">
            <CodePanel
              code={algoInfo.pseudocode}
              activeLine={currentStep?.codeLine}
              description={algoInfo.description}
              timeComplexity={algoInfo.timeComplexity}
              spaceComplexity={algoInfo.spaceComplexity}
            />
          </div>
        )}
      </div>

      <PlaybackBar controller={controller} />
    </div>
  );
}
