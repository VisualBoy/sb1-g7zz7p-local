import { useEffect, useRef, useState } from 'react';
import { useMIDIStore } from '@/store/midi-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TouchPoint {
  id: number;
  x: number;
  y: number;
}

interface XYPadProps {
  controllerX: number;
  controllerY: number;
  channel?: number;
  label: string;
  className?: string;
}

export function XYPad({ controllerX, controllerY, channel = 1, label, className }: XYPadProps) {
  const padRef = useRef<HTMLDivElement>(null);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const sendControlChange = useMIDIStore((state) => state.sendControlChange);

  const updatePosition = (touch: Touch) => {
    if (!padRef.current) return;

    const rect = padRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(127, Math.round(((touch.clientX - rect.left) / rect.width) * 127)));
    const y = Math.max(0, Math.min(127, Math.round(((touch.clientY - rect.top) / rect.height) * 127)));

    return { id: touch.identifier, x, y };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const newTouchPoints = Array.from(e.touches).map(updatePosition);
    setTouchPoints(newTouchPoints);

    // Send MIDI for each touch point
    newTouchPoints.forEach((point, index) => {
      const touchChannel = (channel + index) % 16 || 16; // Distribute across channels 1-16
      sendControlChange(controllerX, point.x, touchChannel);
      sendControlChange(controllerY, point.y, touchChannel);
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const newTouchPoints = Array.from(e.touches).map(updatePosition);
    setTouchPoints(newTouchPoints);

    // Update MIDI for each touch point
    newTouchPoints.forEach((point, index) => {
      const touchChannel = (channel + index) % 16 || 16;
      sendControlChange(controllerX, point.x, touchChannel);
      sendControlChange(controllerY, point.y, touchChannel);
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    // Remove ended touch points
    const remainingTouches = Array.from(e.touches).map(updatePosition);
    setTouchPoints(remainingTouches);

    // Clear MIDI for removed touch points
    const removedCount = touchPoints.length - remainingTouches.length;
    for (let i = remainingTouches.length; i < touchPoints.length; i++) {
      const touchChannel = (channel + i) % 16 || 16;
      sendControlChange(controllerX, 0, touchChannel);
      sendControlChange(controllerY, 0, touchChannel);
    }
  };

  return (
    <Card className={cn('w-full bg-card/50 backdrop-blur-sm', className)}>
      <CardHeader className="p-2">
        <CardTitle className="text-sm font-medium text-center">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div
          ref={padRef}
          className="relative w-full h-[300px] bg-black/50 rounded-lg cursor-crosshair border border-primary/10"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-primary/5" />
            ))}
          </div>
          {touchPoints.map((point) => (
            <div
              key={point.id}
              className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg shadow-primary/20 transition-transform scale-75"
              style={{
                left: `${(point.x / 127) * 100}%`,
                top: `${(point.y / 127) * 100}%`,
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}