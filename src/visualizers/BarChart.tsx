interface Props {
  data: number[];
  highlightIndices?: number[];
  compareIndices?: number[];
  swapIndices?: number[];
  sortedIndices?: number[];
  maxVal?: number;
}

const BAR_COLORS = {
  swap: 'bg-red-400 dark:bg-red-500 shadow-red-400/30 dark:shadow-red-500/20',
  compare: 'bg-amber-400 dark:bg-amber-500 shadow-amber-400/30 dark:shadow-amber-500/20',
  sorted: 'bg-emerald-400 dark:bg-emerald-500',
  highlight: 'bg-blue-400 dark:bg-blue-500 shadow-blue-400/30 dark:shadow-blue-500/20',
  default: 'bg-gray-300 dark:bg-gray-600',
} as const;

function getBarColor(
  index: number,
  compareIndices: number[],
  swapIndices: number[],
  sortedIndices: number[],
  highlightIndices: number[],
): string {
  if (swapIndices.includes(index)) return BAR_COLORS.swap;
  if (compareIndices.includes(index)) return BAR_COLORS.compare;
  if (sortedIndices.includes(index)) return BAR_COLORS.sorted;
  if (highlightIndices.includes(index)) return BAR_COLORS.highlight;
  return BAR_COLORS.default;
}

export default function BarChart({
  data,
  highlightIndices = [],
  compareIndices = [],
  swapIndices = [],
  sortedIndices = [],
  maxVal,
}: Props) {
  const max = maxVal ?? Math.max(...data, 1);
  const isActive = (i: number) =>
    swapIndices.includes(i) || compareIndices.includes(i) || highlightIndices.includes(i);

  return (
    <div className="flex items-end gap-[3px] h-full w-full px-2 pb-2">
      {data.map((value, index) => {
        const heightPct = (value / max) * 100;
        const color = getBarColor(index, compareIndices, swapIndices, sortedIndices, highlightIndices);
        const active = isActive(index);

        return (
          <div
            key={index}
            className="flex flex-col items-center flex-1 min-w-0 max-w-14"
          >
            <div
              className={`w-full rounded-t-sm transition-all duration-200 ease-out ${color} ${active ? 'shadow-lg scale-x-110' : ''}`}
              style={{ height: `${heightPct}%` }}
            />
            {data.length <= 30 && (
              <span className={`text-[10px] mt-1 tabular-nums truncate transition-colors ${
                active
                  ? 'text-gray-800 dark:text-gray-200 font-semibold'
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                {value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
