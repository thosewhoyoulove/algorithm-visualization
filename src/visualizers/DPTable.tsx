interface Props {
  table: number[][];
  currentCell: [number, number] | null;
  highlightCells: [number, number][];
  rowLabels?: string[];
  colLabels?: string[];
}

export default function DPTable({
  table,
  currentCell,
  highlightCells,
  rowLabels,
  colLabels,
}: Props) {
  if (table.length === 0) return null;

  const isCurrent = (r: number, c: number) =>
    currentCell !== null && currentCell[0] === r && currentCell[1] === c;

  const isHighlight = (r: number, c: number) =>
    highlightCells.some(([hr, hc]) => hr === r && hc === c);

  const cellClass = (r: number, c: number, value: number) => {
    const base =
      'min-w-[2.5rem] h-10 flex items-center justify-center text-sm font-mono border border-gray-200 dark:border-gray-700 transition-all duration-200';

    if (isCurrent(r, c)) {
      return `${base} bg-amber-400/80 dark:bg-amber-500/60 text-amber-950 dark:text-amber-100 font-bold scale-110 ring-2 ring-amber-400 dark:ring-amber-500 z-10`;
    }
    if (isHighlight(r, c)) {
      return `${base} bg-blue-400/50 dark:bg-blue-500/40 text-blue-900 dark:text-blue-100 font-semibold`;
    }
    if (value !== 0) {
      return `${base} bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200`;
    }
    return `${base} bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-600`;
  };

  return (
    <div className="w-full h-full flex items-start justify-center overflow-auto p-4">
      <div className="inline-block">
        <table className="border-collapse">
          {colLabels && (
            <thead>
              <tr>
                {rowLabels && <th className="min-w-[2.5rem] h-8" />}
                {colLabels.map((label, ci) => (
                  <th
                    key={ci}
                    className="min-w-[2.5rem] h-8 text-xs font-medium text-gray-500 dark:text-gray-400 px-1 text-center"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {table.map((row, ri) => (
              <tr key={ri}>
                {rowLabels && (
                  <td className="pr-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-right whitespace-nowrap max-w-[8rem] truncate">
                    {rowLabels[ri]}
                  </td>
                )}
                {row.map((value, ci) => (
                  <td key={ci} className="p-0">
                    <div className={cellClass(ri, ci, value)}>
                      {value}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
