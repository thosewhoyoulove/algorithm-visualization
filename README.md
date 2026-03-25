<div align="center">

# AlgoViz

**交互式算法可视化平台**

用动画理解每一步操作，从数组排序到图最短路径。

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## Overview

AlgoViz 是一个基于 Web 的综合算法可视化平台，将抽象的算法执行过程转化为直观的交互动画。每个算法的每一步操作都会同步展示数据状态变化、伪代码行高亮和复杂度信息，适用于自学、教学演示和面试复盘。

核心架构采用 **算法逻辑与可视化分离** 的设计：算法函数产出步骤快照序列（`AnimationStep[]`），通用动画控制器消费快照驱动渲染，实现了算法引擎、播放控制和 UI 渲染三层解耦。

## Features

**六大算法模块，20+ 算法实现**

| 模块 | 算法 | 可视化方式 |
|------|------|-----------|
| 排序 | 冒泡、选择、插入、快速、归并 | 柱状图动态交换 |
| 搜索 | 线性搜索、二分查找 | 数组元素高亮与范围收缩 |
| 路径查找 | BFS、DFS | 网格地图探索动画 |
| 图算法 | BFS、DFS、Dijkstra | SVG 节点-边图遍历 |
| 树结构 | BST 插入/搜索、前/中/后序遍历 | 层次树形布局 |
| 动态规划 | 斐波那契、0/1 背包、LCS | DP 表格逐格填充 |

**通用交互能力**

- 播放 / 暂停 / 单步前进后退 / 速度调节 (0.5x ~ 4x) / 进度拖拽
- 伪代码面板逐行高亮，步骤文字实时说明
- 时间复杂度（最优 / 平均 / 最差）与空间复杂度展示
- 深色 / 浅色主题切换，响应式适配
- 自定义输入数据（排序数组、搜索目标、路径查找墙壁绘制、随机迷宫生成）

## Tech Stack

| 层面 | 技术选型 |
|------|---------|
| 构建 | Vite 8 |
| 语言 | TypeScript 5.9 |
| UI 框架 | React 19 |
| 样式 | Tailwind CSS 4 |
| 路由 | React Router 7 |
| 动画 | Framer Motion |
| 可视化 | Canvas API + SVG |

## Project Structure

```
src/
  core/                     # 核心引擎
    types.ts                # AnimationStep 统一类型、分类定义
    useAnimationController  # 通用动画播放控制 Hook
    ThemeContext.tsx         # 深色/浅色主题上下文
  algorithms/               # 纯算法逻辑（零 UI 依赖）
    sorting/                # 冒泡、选择、插入、快速、归并
    searching/              # 线性搜索、二分查找
    pathfinding/            # BFS/DFS 寻路
    graph/                  # 图 BFS/DFS/Dijkstra
    tree/                   # BST 操作、三种遍历
    dp/                     # 斐波那契、背包、LCS
  visualizers/              # 可视化渲染组件
    BarChart.tsx            # 排序柱状图
    ArrayView.tsx           # 搜索数组视图
    GridBoard.tsx           # 路径查找网格
    GraphCanvas.tsx         # 图算法 SVG 画布
    TreeView.tsx            # 树结构层次布局
    DPTable.tsx             # DP 表格
  components/               # 通用 UI 组件
    layout/                 # Navbar、AppLayout
    controls/               # PlaybackBar
    CodePanel.tsx           # 伪代码面板
    AlgorithmCard.tsx       # 首页分类卡片
  pages/                    # 页面路由组件
```

## Getting Started

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview
```

## Architecture

```
算法函数(inputData)  →  AnimationStep[]  →  useAnimationController  →  Visualizer
                                                    ↑
                                            PlaybackBar (播放控制)
```

每个算法函数是纯函数，接收输入数据，返回步骤快照数组。`useAnimationController` Hook 管理播放状态（当前步骤索引、播放/暂停、速度），可视化组件根据当前步骤的 `data`、`indices`、`type` 字段渲染对应的动画帧。这种设计使得新增算法只需编写一个返回 `AnimationStep[]` 的函数，无需关心 UI 和动画逻辑。

## License

MIT
