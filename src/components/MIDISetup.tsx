import { useEffect } from 'react';
import { useMIDIStore } from '@/store/midi-store';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Usb } from 'lucide-react';

export function MIDISetup() {
  const { isInitialized, outputs, initialize, selectOutput, selectedOutputId } = useMIDIStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <Button 
        onClick={() => initialize()}
        variant="outline"
        className="bg-card hover:bg-card/80"
      >
        <Usb className="w-4 h-4 mr-2" />
        Initialize MIDI
      </Button>
    );
  }

  return (
    <Select value={selectedOutputId || ''} onValueChange={selectOutput}>
      <SelectTrigger className="w-[200px] bg-card border-primary/20">
        <SelectValue placeholder="Select MIDI Output" />
      </SelectTrigger>
      <SelectContent>
        {outputs.map((output) => (
          <SelectItem key={output.id} value={output.id}>
            {output.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}