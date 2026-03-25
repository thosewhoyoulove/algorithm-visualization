import { useState, useMemo, useCallback } from 'react';
import { SEARCHING_ALGORITHMS, SEARCHING_FUNCTIONS } from '@/algorithms/searching';
import ArrayView from '@/visualizers/ArrayView';
import CodePanel from '@/components/CodePanel';
import PlaybackBar from '@/components/controls/PlaybackBar';
import { useAnimationController } from '@/core/useAnimationController';

function generateRandomArray(size: number, min = 1, max = 99): number[] {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min,
  );
}

function pickRandomTarget(arr: number[]): number {
  if (Math.random() < 0.7) return arr[Math.floor(Math.random() * arr.length)];
  return Math.floor(Math.random() * 99) + 1;
}

export default function SearchingPage() {
  const [selectedId, setSelectedId] = useState(SEARCHING_ALGORITHMS[0].id);
  const [inputData, setInputData] = useState<number[]>(() => generateRandomArray(16));
  const [target, setTarget] = useState<number>(() => pickRandomTarget(inputData));
  const [targetInput, setTargetInput] = useState(String(target));
  const [showCode, setShowCode] = useState(true);

  const selectedAlgo = SEARCHING_ALGORITHMS.find((a) => a.id === selectedId)!;

  const effectiveData = useMemo(() => {
    if (selectedId === 'binary-search') return [...inputData].sort((a, b) => a - b);
    return inputData;
  }, [selectedId, inputData]);

  const steps = useMemo(() => {
    const fn = SEARCHING_FUNCTIONS[selectedId];
    return fn(effectiveData, target);
  }, [selectedId, effectiveData, target]);

  const controller = useAnimationController(steps);
  const { currentStep } = controller;

  const currentIndex = useMemo(() => {
    if (!currentStep) return -1;
    if (currentStep.type === 'compare' || currentStep.type === 'visit') return currentStep.indices[0] ?? -1;
    return -1;
  }, [currentStep]);

  const foundIndex = useMemo(() => {
    if (!currentStep) return -1;
    if (currentStep.type === 'found') return currentStep.indices[0] ?? -1;
    return -1;
  }, [currentStep]);

  const searchRange = useMemo((): [number, number] | null => {
    if (!currentStep?.extra) return null;
    const { low, high } = currentStep.extra as { low?: number; high?: number };
    if (typeof low === 'number' && typeof high === 'number' && low <= high) return [low, high];
    return null;
  }, [currentStep]);

  const handleGenerateNew = useCallback(() => {
    controller.reset();
    const newArr = generateRandomArray(16);
    setInputData(newArr);
    const newTarget = pickRandomTarget(newArr);
    setTarget(newTarget);
    setTargetInput(String(newTarget));
  }, [controller]);

  const handleTargetChange = useCallback(() => {
    const parsed = Number(targetInput);
    if (!isNaN(parsed)) { controller.reset(); setTarget(parsed); }
  }, [targetInput, controller]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-gray-200/80 dark:border-gray-800/80 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {SEARCHING_ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => { setSelectedId(algo.id); controller.reset(); }}
              className={`px-3 py-1.5 text-[13px] font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                selectedId === algo.id
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {algo.name}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <label className="text-[13px] text-gray-500 dark:text-gray-400">目标:</label>
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                onBlur={handleTargetChange}
                onKeyDown={(e) => e.key === 'Enter' && handleTargetChange()}
                className="w-16 px-2 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 tabular-nums"
              />
            </div>
            <button
              onClick={handleGenerateNew}
              className="px-3 py-1.5 text-[13px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              随机生成
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className={`hidden lg:block px-3 py-1.5 text-[13px] font-medium rounded-lg border transition-colors ${
                showCode
                  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
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
          <div className="flex-1 min-h-0 p-4">
            <ArrayView
              data={effectiveData}
              currentIndex={currentIndex}
              foundIndex={foundIndex}
              searchRange={searchRange}
              target={target}
            />
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
