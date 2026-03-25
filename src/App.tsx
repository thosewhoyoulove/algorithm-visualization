import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import SortingPage from '@/pages/SortingPage';
import SearchingPage from '@/pages/SearchingPage';
import PathfindingPage from '@/pages/PathfindingPage';
import GraphPage from '@/pages/GraphPage';
import TreePage from '@/pages/TreePage';
import DPPage from '@/pages/DPPage';

function NotFoundPage() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="max-w-sm rounded-2xl border border-gray-200/80 bg-white p-8 text-center shadow-xl shadow-gray-200/30 dark:border-gray-800/80 dark:bg-gray-900 dark:shadow-black/20">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
          <span className="text-2xl font-bold text-red-500">404</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          页面未找到
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          你访问的页面不存在，点击下方返回首页。
        </p>
        <a
          href="/"
          className="mt-5 inline-flex rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-lg active:scale-[0.98]"
        >
          返回首页
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="sorting" element={<SortingPage />} />
        <Route path="searching" element={<SearchingPage />} />
        <Route path="pathfinding" element={<PathfindingPage />} />
        <Route path="graph" element={<GraphPage />} />
        <Route path="tree" element={<TreePage />} />
        <Route path="dp" element={<DPPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
