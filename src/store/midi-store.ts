import { create } from 'zustand';
import { midiController } from '@/lib/midi';

interface MIDIState {
  isInitialized: boolean;
  outputs: WebMidi.MIDIOutput[];
  inputs: WebMidi.MIDIInput[];
  selectedOutputId: string | null;
  initialize: () => Promise<void>;
  selectOutput: (id: string) => void;
  sendControlChange: (controller: number, value: number, channel?: number) => void;
}

export const useMIDIStore = create<MIDIState>((set) => ({
  isInitialized: false,
  outputs: [],
  inputs: [],
  selectedOutputId: null,

  initialize: async () => {
    const success = await midiController.initialize();
    if (success) {
      set({
        isInitialized: true,
        outputs: midiController.getOutputs(),
        inputs: midiController.getInputs(),
      });
    }
  },

  selectOutput: (id: string) => {
    midiController.selectOutput(id);
    set({ selectedOutputId: id });
  },

  sendControlChange: (controller: number, value: number, channel = 1) => {
    midiController.sendControlChange(controller, value, channel);
  },
}));
