import { useState, useCallback, useRef, useEffect } from 'react';
import type { AnimationStep } from './types';

export interface AnimationController<T = unknown> {
  currentStepIndex: number;
  currentStep: AnimationStep<T> | null;
  isPlaying: boolean;
  speed: number;
  totalSteps: number;
  progress: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stepForward: () => void;
  stepBack: () => void;
  reset: () => void;
  goToStep: (index: number) => void;
  setSpeed: (speed: number) => void;
}

export function useAnimationController<T = unknown>(
  steps: AnimationStep<T>[],
): AnimationController<T> {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepsRef = useRef(steps);
  const indexRef = useRef(currentStepIndex);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    indexRef.current = currentStepIndex;
  }, [currentStepIndex]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();
    const delay = Math.max(50, 500 / speed);
    timerRef.current = setTimeout(() => {
      const next = indexRef.current + 1;
      if (next < stepsRef.current.length) {
        setCurrentStepIndex(next);
        scheduleNext();
      } else {
        setIsPlaying(false);
      }
    }, delay);
  }, [speed, clearTimer]);

  const play = useCallback(() => {
    if (stepsRef.current.length === 0) return;
    if (indexRef.current >= stepsRef.current.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const stepForward = useCallback(() => {
    pause();
    setCurrentStepIndex((prev) =>
      Math.min(prev + 1, stepsRef.current.length - 1),
    );
  }, [pause]);

  const stepBack = useCallback(() => {
    pause();
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, [pause]);

  const reset = useCallback(() => {
    pause();
    setCurrentStepIndex(-1);
  }, [pause]);

  const goToStep = useCallback(
    (index: number) => {
      pause();
      setCurrentStepIndex(Math.max(-1, Math.min(index, stepsRef.current.length - 1)));
    },
    [pause],
  );

  const setSpeed = useCallback((s: number) => {
    setSpeedState(s);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      scheduleNext();
    }
    return clearTimer;
  }, [isPlaying, scheduleNext, clearTimer]);

  useEffect(() => {
    pause();
    setCurrentStepIndex(-1);
  }, [steps.length, pause]);

  const currentStep =
    currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex]
      : null;

  const progress =
    steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return {
    currentStepIndex,
    currentStep,
    isPlaying,
    speed,
    totalSteps: steps.length,
    progress,
    play,
    pause,
    toggle,
    stepForward,
    stepBack,
    reset,
    goToStep,
    setSpeed,
  };
}
