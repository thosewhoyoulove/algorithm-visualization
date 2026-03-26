import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AlgorithmCard from '@/components/AlgorithmCard';
import { CATEGORIES } from '@/core/types';

export default function Home() {
  return (
    <div className="h-full min-h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden bg-gradient-to-b from-white via-gray-50/50 to-gray-100/80 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900/80">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-14 sm:pt-20 sm:pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center rounded-full border border-primary-200/80 bg-primary-50/80 px-3.5 py-1 text-[13px] font-medium text-primary-700 dark:border-primary-800/60 dark:bg-primary-950/40 dark:text-primary-300 backdrop-blur-sm"
            >
              AlgoViz -- 综合算法可视化平台
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="mt-5 max-w-2xl text-[2.5rem] leading-[1.15] font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl sm:leading-[1.1]"
            >
              用交互动画理解
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">
                {' '}JavaScript 算法
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 max-w-xl text-base leading-7 text-gray-500 dark:text-gray-400 sm:text-lg sm:leading-7"
            >
              从数组排序到图最短路，每一步操作都同步展示数据状态、伪代码高亮和复杂度信息，适合学习、教学和面试复盘。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/sorting"
                className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/25 active:scale-[0.98]"
              >
                从排序算法开始
              </Link>
              <Link
                to="/pathfinding"
                className="rounded-xl border border-gray-300/80 bg-white/80 px-5 py-2.5 text-sm font-semibold text-gray-700 backdrop-blur-sm transition-all hover:bg-gray-50 hover:border-gray-400/60 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                体验迷宫寻路
              </Link>
            </motion.div>
          </div>

          {/* Feature panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-2xl border border-gray-200/80 bg-white/90 p-5 shadow-xl shadow-gray-200/40 backdrop-blur-sm dark:border-gray-800/80 dark:bg-gray-900/80 dark:shadow-black/20"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Platform Highlights
                </p>
                <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                  可视化学习闭环
                </h2>
              </div>
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
            </div>

            <div className="space-y-2">
              {[
                '统一步骤快照驱动动画，算法逻辑与 UI 解耦',
                '支持播放、暂停、步进、倍速与进度拖拽',
                '覆盖排序、搜索、图、树、DP 与路径查找',
              ].map((point, index) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 p-3.5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-[11px] font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            六大算法模块
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            每个模块都提供交互输入、逐步动画与伪代码同步高亮
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CATEGORIES.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
            >
              <AlgorithmCard category={category} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
