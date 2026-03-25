import type { AnimationController } from '@/core/useAnimationController';

const SPEED_OPTIONS = [0.5, 1, 2, 4];

interface Props {
  controller: AnimationController;
}

export default function PlaybackBar({ controller }: Props) {
  const {
    currentStepIndex,
    isPlaying,
    speed,
    totalSteps,
    progress,
    toggle,
    stepForward,
    stepBack,
    reset,
    goToStep,
    setSpeed,
  } = controller;

  return (
    <div className="shrink-0 border-t border-gray-200/80 dark:border-gray-800/80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2.5">
      <div className="mx-auto max-w-4xl flex flex-col gap-2">
        {/* Progress bar */}
        <div
          className="group relative w-full h-1.5 bg-gray-200 dark:bg-gray-700/80 rounded-full cursor-pointer overflow-hidden"
          onClick={(e) => {
            if (totalSteps === 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            goToStep(Math.round(pct * (totalSteps - 1)));
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-100 ease-out group-hover:shadow-[0_0_8px_rgba(59,130,246,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          {/* Transport buttons */}
          <div className="flex items-center gap-0.5">
            <ControlButton onClick={reset} title="重置">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </ControlButton>

            <ControlButton onClick={stepBack} title="上一步">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" />
              </svg>
            </ControlButton>

            <button
              onClick={toggle}
              className="mx-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white shadow-md shadow-primary-500/25 hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30 active:scale-95 transition-all duration-150"
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              )}
            </button>

            <ControlButton onClick={stepForward} title="下一步">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" />
              </svg>
            </ControlButton>
          </div>

          {/* Step counter */}
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tabular-nums tracking-wide">
            {totalSteps > 0 ? `${currentStepIndex + 1} / ${totalSteps}` : '--'}
          </span>

          {/* Speed options */}
          <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 dark:bg-gray-800/60 p-0.5">
            {SPEED_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                  speed === s
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all duration-150"
    >
      {children}
    </button>
  );
}
