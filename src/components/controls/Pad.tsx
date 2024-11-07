import { Button } from '@/components/ui/button';
import { useMIDIStore } from '@/store/midi-store';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PadProps {
  note: number;
  channel?: number;
  color?: string;
  label?: string;
}

export function Pad({ note, channel = 1, color = 'bg-primary', label }: PadProps) {
  const [activeTouches, setActiveTouches] = useState<Set<number>>(new Set());
  const { sendControlChange } = useMIDIStore();

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const newTouches = new Set(activeTouches);
    
    Array.from(e.touches).forEach((touch) => {
      if (!activeTouches.has(touch.identifier)) {
        newTouches.add(touch.identifier);
        // Use a different channel for each touch point
        const touchChannel = (channel + touch.identifier) % 16 || 16;
        sendControlChange(note, 127, touchChannel);
      }
    });
    
    setActiveTouches(newTouches);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const newTouches = new Set<number>();
    
    // Keep track of remaining touches
    Array.from(e.touches).forEach((touch) => {
      newTouches.add(touch.identifier);
    });

    // Send note off for removed touches
    activeTouches.forEach((id) => {
      if (!newTouches.has(id)) {
        const touchChannel = (channel + id) % 16 || 16;
        sendControlChange(note, 0, touchChannel);
      }
    });
    
    setActiveTouches(newTouches);
  };

  return (
    <Button
      className={cn(
        'w-24 h-24 rounded-lg transition-all touch-none',
        color,
        activeTouches.size > 0 && 'brightness-150 scale-95'
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {label}
      {activeTouches.size > 0 && (
        <span className="absolute top-1 right-1 text-xs bg-black/20 px-1 rounded">
          {activeTouches.size}
        </span>
      )}
    </Button>
  );
}