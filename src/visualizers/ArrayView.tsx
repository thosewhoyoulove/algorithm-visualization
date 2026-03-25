interface Props {
  data: number[];
  currentIndex: number;
  foundIndex: number;
  searchRange: [number, number] | null;
  target: number;
}

function getCellStyle(
  index: number,
  currentIndex: number,
  foundIndex: number,
  searchRange: [number, number] | null,
): string {
  if (foundIndex === index) {
    return 'bg-emerald-400 dark:bg-emerald-500 text-white scale-110 ring-2 ring-emerald-300 dark:ring-emerald-600';
  }
  if (currentIndex === index) {
    return 'bg-amber-400 dark:bg-amber-500 text-white scale-105 ring-2 ring-amber-300 dark:ring-amber-600';
  }
  if (searchRange && (index < searchRange[0] || index > searchRange[1])) {
    return 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 opacity-50';
  }
  if (searchRange && index >= searchRange[0] && index <= searchRange[1]) {
    return 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 ring-1 ring-blue-200 dark:ring-blue-800';
  }
  return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
}

export default function ArrayView({
  data,
  currentIndex,
  foundIndex,
  searchRange,
  target,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500 dark:text-gray-400">目标值:</span>
        <span className="px-3 py-1 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-mono font-bold text-lg">
          {target}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {data.map((value, index) => {
          const cellStyle = getCellStyle(index, currentIndex, foundIndex, searchRange);

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-12 h-12 flex items-center justify-center
                  rounded-lg font-mono font-semibold text-sm
                  transition-all duration-200 ease-out
                  ${cellStyle}
                `}
              >
                {value}
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums">
                {index}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-400 dark:bg-amber-500 inline-block" />
          当前检查
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-500 inline-block" />
          已找到
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-100 dark:bg-blue-900/40 ring-1 ring-blue-200 dark:ring-blue-800 inline-block" />
          搜索范围
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-800 opacity-50 inline-block" />
          已排除
        </span>
      </div>
    </div>
  );
}
