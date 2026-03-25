import { Link } from 'react-router-dom';
import type { CategoryInfo } from '@/core/types';

interface Props {
  category: CategoryInfo;
}

export default function AlgorithmCard({ category }: Props) {
  return (
    <Link
      to={`/${category.id}`}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/40 dark:hover:shadow-black/30 hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-700"
    >
      {/* Gradient accent bar */}
      <div className={`h-1 bg-gradient-to-r ${category.color} opacity-80 group-hover:opacity-100 transition-opacity`} />

      <div className="p-5">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg shadow-gray-300/20 dark:shadow-black/20 mb-4 group-hover:scale-105 group-hover:shadow-xl transition-all duration-300`}>
          <CategoryIcon icon={category.icon} />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {category.description}
        </p>

        <div className="mt-4 flex items-center text-xs font-medium text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
          <span>开始探索</span>
          <svg className="ml-1 w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function CategoryIcon({ icon }: { icon: string }) {
  const props = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (icon) {
    case 'bar-chart':
      return <svg {...props}><rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="5" width="4" height="16" rx="1" /><rect x="17" y="8" width="4" height="13" rx="1" /></svg>;
    case 'search':
      return <svg {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
    case 'map':
      return <svg {...props}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>;
    case 'git-branch':
      return <svg {...props}><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>;
    case 'tree':
      return <svg {...props}><circle cx="12" cy="5" r="3" /><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><line x1="12" y1="8" x2="6" y2="14" /><line x1="12" y1="8" x2="18" y2="14" /></svg>;
    case 'table':
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>;
    default:
      return null;
  }
}
