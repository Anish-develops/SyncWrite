import React, { useState, useEffect } from 'react';
import { EditEvent } from '@syncwrite/shared';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';

interface MergePlaybackProps {
  events: EditEvent[];
  onSeek: (eventIndex: number) => void;
  onClose: () => void;
}

export const MergePlayback: React.FC<MergePlaybackProps> = ({ events, onSeek, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(events.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setCurrentIndex(events.length - 1);
  }, [events.length]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= events.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        const next = prev + 1;
        onSeek(next);
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, events.length, onSeek]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    setCurrentIndex(idx);
    onSeek(idx);
  };

  const currentEvent = events[currentIndex];

  return (
    <div className="h-12 bg-surface-raised border-t border-border px-4 flex items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setCurrentIndex(0);
            onSeek(0);
          }}
          disabled={events.length === 0}
          className="p-1 text-text-secondary hover:text-text-primary rounded"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={events.length === 0}
          className="p-1 bg-accent text-white rounded hover:bg-accent-hover"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={() => {
            const last = events.length - 1;
            setCurrentIndex(last);
            onSeek(last);
          }}
          disabled={events.length === 0}
          className="p-1 text-text-secondary hover:text-text-primary rounded"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={Math.max(0, events.length - 1)}
          value={currentIndex >= 0 ? currentIndex : 0}
          onChange={handleSliderChange}
          disabled={events.length === 0}
          className="w-full accent-accent cursor-pointer"
        />
        <span className="text-xs font-mono text-text-tertiary whitespace-nowrap">
          {events.length > 0 ? `${currentIndex + 1}/${events.length}` : '0/0'}
        </span>
      </div>

      {currentEvent && (
        <span className="text-xs text-text-secondary truncate max-w-xs">
          By <strong style={{ color: currentEvent.user?.avatarColor }}>{currentEvent.user?.username}</strong> ({currentEvent.eventType} on L{currentEvent.line})
        </span>
      )}

      <button onClick={onClose} className="text-text-tertiary hover:text-text-primary p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
