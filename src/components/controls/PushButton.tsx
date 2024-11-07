import { useState } from 'react';
import { useMIDIStore } from '@/store/midi-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PushButtonProps {
  controller: number;
  channel?: number;
  label: string;
  className?: string;
}

export function PushButton({ controller, channel = 1, label, className }: PushButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const sendControlChange = useMIDIStore((state) => state.sendControlChange);

  const handlePress = () => {
    setIsPressed(true);
    sendControlChange(controller, 127, channel);
  };

  const handleRelease = () => {
    setIsPressed(false);
    sendControlChange(controller, 0, channel);
  };

  return (
    <Card className={cn('w-24', className)}>
      <CardHeader className="p-2">
        <CardTitle className="text-sm text-center">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Button
          className={cn('w-full h-12', isPressed && 'brightness-75')}
          onMouseDown={handlePress}
          onMouseUp={handleRelease}
          onMouseLeave={() => isPressed && handleRelease()}
          onTouchStart={handlePress}
          onTouchEnd={handleRelease}
        >
          Push
        </Button>
      </CardContent>
    </Card>
  );
}