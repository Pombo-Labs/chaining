'use client';

import { Button } from '@/components/ui/button';
import { useTimer } from '@/lib/hooks/use-timer';

interface SimpleTimerProps {
  initialTime?: number;
  onTimeChange?: (time: number) => void;
  className?: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function SimpleTimer({ initialTime = 0, onTimeChange, className = '' }: SimpleTimerProps) {
  const { time, isRunning, isPaused, start, pause, stop, reset } = useTimer({
    initialTime,
    onTimeChange
  });

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="font-mono text-lg font-semibold">
          {formatTime(time)}
        </span>
        {isRunning && !isPaused && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
        {isPaused && (
          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
        )}
      </div>
      
      <div className="flex space-x-2">
        {!isRunning ? (
          <Button onClick={start} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            Start
          </Button>
        ) : isPaused ? (
          <Button onClick={start} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            Resume
          </Button>
        ) : (
          <Button onClick={pause} size="sm" variant="outline">
            Pause
          </Button>
        )}
        
        {isRunning && (
          <Button onClick={stop} size="sm" variant="outline">
            Stop
          </Button>
        )}
        
        <Button onClick={reset} size="sm" variant="outline" disabled={isRunning && !isPaused}>
          Reset
        </Button>
      </div>
    </div>
  );
}
