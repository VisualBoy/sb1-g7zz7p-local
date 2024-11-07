import { useState } from 'react';
import { useMIDIStore } from '@/store/midi-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KnobProps {
  controller: number;
  channel?: number;
  label: string;
  defaultValue?: number;
  className?: string;
}

export function Knob({ controller, channel = 1, label, defaultValue = 64, className }: KnobProps) {
  const [value, setValue] = useState(defaultValue);
  const [lastY, setLastY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sendControlChange = useMIDIStore((state) => state.sendControlChange);

  const handleMove = (clientY: number) => {
    if (!isDragging) return;

    const delta = lastY - clientY;
    const newValue = Math.max(0, Math.min(127, value + delta));

    setValue(newValue);
    setLastY(clientY);
    sendControlChange(controller, newValue, channel);
  };

  const rotation = (value / 127) * 270 - 135; // -135 to 135 degrees

  return (
    <Card className={cn('w-24 bg-card/50 backdrop-blur-sm', className)}>
      <CardHeader className="p-2">
        <CardTitle className="text-sm font-medium text-center">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div
          className="relative w-20 h-20 mx-auto cursor-pointer"
          onMouseDown={(e) => {
            setIsDragging(true);
            setLastY(e.clientY);
          }}
          onMouseMove={(e) => handleMove(e.clientY)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={(e) => {
            setIsDragging(true);
            setLastY(e.touches[0].clientY);
          }}
          onTouchMove={(e) => handleMove(e.touches[0].clientY)}
          onTouchEnd={() => setIsDragging(false)}
        >
          <div className="absolute inset-0 rounded-full border border-primary/20 bg-black/50" />
          <div
            className="absolute top-0 left-1/2 w-1 h-8 bg-primary origin-bottom -translate-x-1/2 shadow-lg shadow-primary/20"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-primary/80">{value}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}