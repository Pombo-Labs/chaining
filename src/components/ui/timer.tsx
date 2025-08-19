'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TimerProps {
  initialTime?: number; // in seconds
  estimatedTime?: number; // in seconds
  onTimeChange?: (time: number) => void;
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onEstimatedTimeChange?: (time: number) => void;
  className?: string;
  showEstimatedTime?: boolean;
  showControls?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Timer({
  initialTime = 0,
  estimatedTime = 0,
  onTimeChange,
  onStart,
  onPause,
  onStop,
  onEstimatedTimeChange,
  className = '',
  showEstimatedTime = true,
  showControls = true,
  size = 'md'
}: TimerProps) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEstimated, setEditingEstimated] = useState(false);
  const [tempTime, setTempTime] = useState('');
  const [tempEstimated, setTempEstimated] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Parse time string MM:SS to seconds
  const parseTime = (timeString: string): number => {
    const parts = timeString.split(':');
    if (parts.length !== 2) return 0;
    const mins = parseInt(parts[0]) || 0;
    const secs = parseInt(parts[1]) || 0;
    return mins * 60 + secs;
  };

  // Timer effect
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          return newTime;
        });
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

  // Separate effect for onTimeChange to avoid setState during render
  useEffect(() => {
    onTimeChange?.(time);
  }, [time, onTimeChange]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    onStart?.();
  };

  const handlePause = () => {
    setIsPaused(true);
    onPause?.();
  };

  const handleResume = () => {
    setIsPaused(false);
    onStart?.();
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    onStop?.();
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setIsPaused(false);
    onTimeChange?.(0);
  };

  const handleTimeEdit = () => {
    setTempTime(formatTime(time));
    setIsEditing(true);
  };

  const handleTimeSave = () => {
    const newTime = parseTime(tempTime);
    setTime(newTime);
    setIsEditing(false);
    onTimeChange?.(newTime);
  };

  const handleTimeCancel = () => {
    setIsEditing(false);
    setTempTime('');
  };

  const handleEstimatedEdit = () => {
    setTempEstimated(formatTime(estimatedTime));
    setEditingEstimated(true);
  };

  const handleEstimatedSave = () => {
    const newEstimated = parseTime(tempEstimated);
    setEditingEstimated(false);
    onEstimatedTimeChange?.(newEstimated);
  };

  const handleEstimatedCancel = () => {
    setEditingEstimated(false);
    setTempEstimated('');
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const buttonSizes = {
    sm: 'sm',
    md: 'sm',
    lg: 'default'
  } as const;

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {/* Main Timer Display */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 text-sm font-medium">Time:</span>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                value={tempTime}
                onChange={(e) => setTempTime(e.target.value)}
                placeholder="MM:SS"
                className="w-20 text-center text-sm"
              />
              <Button onClick={handleTimeSave} size="sm" variant="outline">
                ✓
              </Button>
              <Button onClick={handleTimeCancel} size="sm" variant="outline">
                ✕
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span 
                className={`font-mono font-semibold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded ${sizeClasses[size]} ${
                  isRunning && !isPaused ? 'text-green-600' : 'text-gray-900'
                }`}
                onClick={handleTimeEdit}
                title="Click to edit time"
              >
                {formatTime(time)}
              </span>
              {isRunning && !isPaused && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
              {isPaused && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Estimated Time */}
      {showEstimatedTime && (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm font-medium">Estimated:</span>
            {editingEstimated ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={tempEstimated}
                  onChange={(e) => setTempEstimated(e.target.value)}
                  placeholder="MM:SS"
                  className="w-20 text-center text-sm"
                />
                <Button onClick={handleEstimatedSave} size="sm" variant="outline">
                  ✓
                </Button>
                <Button onClick={handleEstimatedCancel} size="sm" variant="outline">
                  ✕
                </Button>
              </div>
            ) : (
              <span 
                className={`font-mono text-gray-500 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded ${sizeClasses[size]}`}
                onClick={handleEstimatedEdit}
                title="Click to edit estimated time"
              >
                {formatTime(estimatedTime)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Timer Controls */}
      {showControls && (
        <div className="flex items-center space-x-2">
          {!isRunning ? (
            <Button 
              onClick={handleStart} 
              size={buttonSizes[size]}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Start
            </Button>
          ) : isPaused ? (
            <Button 
              onClick={handleResume} 
              size={buttonSizes[size]}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Resume
            </Button>
          ) : (
            <Button 
              onClick={handlePause} 
              size={buttonSizes[size]}
              variant="outline"
            >
              Pause
            </Button>
          )}
          
          {isRunning && (
            <Button 
              onClick={handleStop} 
              size={buttonSizes[size]}
              variant="outline"
            >
              Stop
            </Button>
          )}
          
          <Button 
            onClick={handleReset} 
            size={buttonSizes[size]}
            variant="outline"
            disabled={isRunning && !isPaused}
          >
            Reset
          </Button>
        </div>
      )}

      {/* Progress indicator if estimated time is set */}
      {showEstimatedTime && estimatedTime > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              time > estimatedTime ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ 
              width: `${Math.min((time / estimatedTime) * 100, 100)}%` 
            }}
          />
        </div>
      )}
    </div>
  );
}
