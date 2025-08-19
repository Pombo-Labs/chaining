import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  initialTime?: number;
  onTimeChange?: (time: number) => void;
}

export function useTimer({ initialTime = 0, onTimeChange }: UseTimerProps = {}) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const setManualTime = useCallback((newTime: number) => {
    setTime(newTime);
  }, []);

  // Timer interval effect
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  // Notify parent of time changes - use ref to avoid dependency loop
  const onTimeChangeRef = useRef(onTimeChange);
  onTimeChangeRef.current = onTimeChange;

  useEffect(() => {
    onTimeChangeRef.current?.(time);
  }, [time]);

  return {
    time,
    isRunning,
    isPaused,
    start,
    pause,
    stop,
    reset,
    setManualTime
  };
}
