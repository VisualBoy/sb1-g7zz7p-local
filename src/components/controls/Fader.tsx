import { Slider } from '@/components/ui/slider';
import { useMIDIStore } from '@/store/midi-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FaderProps {
  controller: number;
  channel?: number;
  label: string;
  defaultValue?: number;
}

export function Fader({ controller, channel = 1, label, defaultValue = 64 }: FaderProps) {
  const sendControlChange = useMIDIStore((state) => state.sendControlChange);

  const handleValueChange = (values: number[]) => {
    sendControlChange(controller, values[0], channel);
  };

  return (
    <Card className="w-24">
      <CardHeader className="p-2">
        <CardTitle className="text-sm text-center">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Slider
          defaultValue={[defaultValue]}
          max={127}
          min={0}
          orientation="vertical"
          className="h-[200px]"
          onValueChange={handleValueChange}
        />
      </CardContent>
    </Card>
  );
}