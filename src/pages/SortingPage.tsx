import { useState, useMemo, useCallback } from 'react';
import { sortingAlgorithms, sortingFunctions } from '@/algorithms/sorting';
import BarChart from '@/visualizers/BarChart';
import CodePanel from '@/components/CodePanel';
import PlaybackBar from '@/components/controls/PlaybackBar';
import { useAnimationController } from '@/core/useAnimationController';

function generateRandomArray(size: number, min = 5, max = 100): number[] {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min,
  );
}

export default function SortingPage() {
  const [selectedId, setSelectedId] = useState(sortingAlgorithms[0].id);
  const [inputData, setInputData] = useState<number[]>(() => generateRandomArray(20));
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showCode, setShowCode] = useState(true);

  const selectedAlgo = sortingAlgorithms.find((a) => a.id === selectedId)!;

  const steps = useMemo(() => {
    const fn = sortingFunctions[selectedId];
    return fn(inputData);
  }, [selectedId, inputData]);

  const controller = useAnimationController(steps);
  const { currentStep } = controller;

  const currentData = currentStep?.data ?? inputData;

  const compareIndices = currentStep?.type === 'compare' ? currentStep.indices : [];
  const swapIndices = currentStep?.type === 'swap' ? currentStep.indices : [];
  const highlightIndices =
    currentStep?.type === 'highlight' ||
    currentStep?.type === 'select' ||
    currentStep?.type === 'partition' ||
    currentStep?.type === 'insert' ||
    currentStep?.type === 'merge' ||
    currentStep?.type === 'update'
      ? currentStep.indices
      : [];

  const sortedIndices = useMemo(() => {
    if (!currentStep) return [];
    if (currentStep.type === 'complete') return currentStep.indices;
    const completedIndices: number[] = [];
    const idx = controller.currentStepIndex;
    for (let i = idx; i >= 0; i--) {
      if (steps[i].type === 'complete') {
        for (const ci of steps[i].indices) {
          if (!completedIndices.includes(ci)) completedIndices.push(ci);
        }
      }
    }
    return completedIndices;
  }, [currentStep, controller.currentStepIndex, steps]);

  const handleGenerateNew = useCallback(() => {
    controller.reset();
    setInputData(generateRandomArray(20));
  }, [controller]);

  const handleCustomInput = useCallback(() => {
    const values = customInput
      .split(/[,\s]+/)
      .map(Number)
      .filter((n) => !isNaN(n) && n > 0);
    if (values.length >= 2) {
      controller.reset();
      setInputData(values);
      setShowCustomInput(false);
      setCustomInput('');
    }
  }, [customInput, controller]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-gray-200/80 dark:border-gray-800/80 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {sortingAlgorithms.map((algo) => (
            <button
              key={algo.id}
              onClick={() => { setSelectedId(algo.id); controller.reset(); }}
              className={`px-3 py-1.5 text-[13px] font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                selectedId === algo.id
                  ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {algo.name}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleGenerateNew}
              className="px-3 py-1.5 text-[13px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              随机数据
            </button>
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="px-3 py-1.5 text-[13px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              自定义
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className={`hidden lg:block px-3 py-1.5 text-[13px] font-medium rounded-lg border transition-colors ${
                showCode
                  ? 'border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Code
            </button>
          </div>
        </div>

        {showCustomInput && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomInput()}
              placeholder="输入数字，逗号或空格分隔"
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-shadow"
            />
            <button
              onClick={handleCustomInput}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              确认
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Visualization */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 min-h-0 p-4">
            <BarChart
              data={currentData}
              highlightIndices={highlightIndices}
              compareIndices={compareIndices}
              sortedIndices={sortedIndices}
              swapIndices={swapIndices}
            />
          </div>
          {currentStep?.description && (
            <div className="shrink-0 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/50">
              {currentStep.description}
            </div>
          )}
        </div>

        {/* Code panel - responsive */}
        {showCode && (
          <div className="hidden lg:block w-80 border-l border-gray-200/80 dark:border-gray-800/80 p-4 overflow-y-auto bg-white dark:bg-gray-950">
            <CodePanel
              code={selectedAlgo.pseudocode}
              activeLine={currentStep?.codeLine}
              description={selectedAlgo.description}
              timeComplexity={selectedAlgo.timeComplexity}
              spaceComplexity={selectedAlgo.spaceComplexity}
            />
          </div>
        )}
      </div>

      <PlaybackBar controller={controller} />
    </div>
  );
}
