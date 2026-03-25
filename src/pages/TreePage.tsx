import { useState, useMemo, useCallback } from 'react';
import {
  createSampleTree,
  TREE_ALGORITHMS,
  TREE_FUNCTIONS,
  bstInsert,
  resetNodeId,
} from '@/algorithms/tree';
import type { TreeAlgorithmId } from '@/algorithms/tree';
import type { TreeNode, TreeStepData } from '@/algorithms/tree/types';
import type { AnimationStep } from '@/core/types';
import { useAnimationController } from '@/core/useAnimationController';
import TreeView from '@/visualizers/TreeView';
import CodePanel from '@/components/CodePanel';
import PlaybackBar from '@/components/controls/PlaybackBar';

const ALGO_IDS: TreeAlgorithmId[] = ['bst-insert', 'bst-search', 'inorder', 'preorder', 'postorder'];
const needsInput = (id: TreeAlgorithmId) => id === 'bst-insert' || id === 'bst-search';

export default function TreePage() {
  const [tree, setTree] = useState<TreeNode | null>(createSampleTree);
  const [selectedAlgo, setSelectedAlgo] = useState<TreeAlgorithmId>('inorder');
  const [inputValue, setInputValue] = useState('');
  const [steps, setSteps] = useState<AnimationStep<TreeStepData>[]>([]);
  const [showCode, setShowCode] = useState(true);

  const controller = useAnimationController(steps);
  const currentStep = controller.currentStep as AnimationStep<TreeStepData> | null;

  const algoInfo = useMemo(() => TREE_ALGORITHMS.find((a) => a.id === selectedAlgo)!, [selectedAlgo]);

  const displayData: TreeStepData = useMemo(() => {
    if (currentStep) return currentStep.data;
    return { root: tree, highlighted: [], current: null, result: [] };
  }, [currentStep, tree]);

  const handleRun = useCallback(() => {
    if (needsInput(selectedAlgo)) {
      const num = parseInt(inputValue, 10);
      if (isNaN(num)) return;
      if (selectedAlgo === 'bst-insert') {
        const newSteps = bstInsert(tree, num);
        setSteps(newSteps);
        const lastStep = newSteps[newSteps.length - 1];
        if (lastStep) setTree(lastStep.data.root);
      } else {
        const fn = TREE_FUNCTIONS[selectedAlgo];
        setSteps(fn(tree, num));
      }
    } else {
      const fn = TREE_FUNCTIONS[selectedAlgo];
      setSteps(fn(tree));
    }
  }, [selectedAlgo, tree, inputValue]);

  const handleReset = useCallback(() => {
    resetNodeId();
    setTree(createSampleTree());
    setSteps([]);
  }, []);

  const handleAlgoChange = useCallback((id: TreeAlgorithmId) => {
    setSelectedAlgo(id);
    setSteps([]);
    setInputValue('');
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2.5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1 overflow-x-auto">
            {ALGO_IDS.map((id) => {
              const info = TREE_ALGORITHMS.find((a) => a.id === id)!;
              return (
                <button
                  key={id}
                  onClick={() => handleAlgoChange(id)}
                  className={`px-3 py-1.5 text-[13px] rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedAlgo === id
                      ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {info.name}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            {needsInput(selectedAlgo) && (
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRun()}
                placeholder={selectedAlgo === 'bst-insert' ? '插入值' : '搜索值'}
                className="w-24 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            )}
            <button onClick={handleRun} className="px-4 py-1.5 text-[13px] rounded-lg font-medium bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/20 transition-all active:scale-[0.98]">
              运行
            </button>
            <button onClick={handleReset} className="px-3 py-1.5 text-[13px] rounded-lg font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              重置树
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className={`hidden lg:block px-3 py-1.5 text-[13px] font-medium rounded-lg border transition-colors ${
                showCode ? 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
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
            <TreeView
              root={displayData.root}
              highlighted={displayData.highlighted}
              current={displayData.current}
              result={displayData.result}
            />
          </div>
        </div>
        {showCode && (
          <div className="hidden lg:block w-80 border-l border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-4 overflow-y-auto">
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
