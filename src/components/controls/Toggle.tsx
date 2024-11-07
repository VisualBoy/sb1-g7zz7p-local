import { useState } from 'react';
import { useMIDIStore } from '@/store/midi-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface ToggleProps {
  controller: number;
  channel?: number;
  label: string;
  className?: string;
}

export function Toggle({ controller, channel = 1, label, className }: ToggleProps) {
  const [isOn, setIsOn] = useState(false);
  const sendControlChange = useMIDIStore((state) => state.sendControlChange);

  const handleToggle = (checked: boolean) => {
    setIsOn(checked);
    sendControlChange(controller, checked ? 127 : 0, channel);
  };

  return (
    <Card className={cn('w-24', className)}>
      <CardHeader className="p-2">
        <CardTitle className="text-sm text-center">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex justify-center">
        <Switch checked={isOn} onCheckedChange={handleToggle} />
      </CardContent>
    </Card>
  );
}