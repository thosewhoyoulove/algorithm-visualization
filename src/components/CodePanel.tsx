interface Props {
  code: string[];
  activeLine?: number;
  description?: string;
  timeComplexity?: { best: string; average: string; worst: string };
  spaceComplexity?: string;
}

export default function CodePanel({ code, activeLine, description, timeComplexity, spaceComplexity }: Props) {
  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto">
      {description && (
        <div className="px-3.5 py-2.5 bg-primary-50/80 dark:bg-primary-950/30 rounded-xl text-sm leading-relaxed text-primary-800 dark:text-primary-200 border border-primary-100 dark:border-primary-900/40">
          {description}
        </div>
      )}

      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-900/50 shadow-sm">
        <div className="px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/40">
          Pseudocode
        </div>
        <pre className="p-2 text-[13px] leading-6 overflow-x-auto">
          {code.map((line, i) => (
            <div
              key={i}
              className={`px-2 py-0.5 rounded-md transition-all duration-200 ${
                activeLine === i
                  ? 'bg-amber-100/90 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 font-semibold -mx-0.5 px-2.5 shadow-sm shadow-amber-200/30 dark:shadow-amber-900/20'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className="inline-block w-5 text-right mr-3 text-[11px] text-gray-300 dark:text-gray-600 select-none tabular-nums">
                {i + 1}
              </span>
              {line}
            </div>
          ))}
        </pre>
      </div>

      {timeComplexity && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-900/50 p-3.5 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2.5">
            Complexity
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-sm">
            <ComplexityItem label="Best" value={timeComplexity.best} color="text-emerald-600 dark:text-emerald-400" />
            <ComplexityItem label="Avg" value={timeComplexity.average} color="text-amber-600 dark:text-amber-400" />
            <ComplexityItem label="Worst" value={timeComplexity.worst} color="text-red-500 dark:text-red-400" />
            {spaceComplexity && (
              <ComplexityItem label="Space" value={spaceComplexity} color="text-purple-600 dark:text-purple-400" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ComplexityItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</span>
      <span className={`font-mono font-semibold text-[13px] ${color}`}>{value}</span>
    </div>
  );
}
