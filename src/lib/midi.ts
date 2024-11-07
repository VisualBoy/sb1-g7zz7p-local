export class MIDIController {
  private midiAccess: WebMidi.MIDIAccess | null = null;
  private outputs: Map<string, WebMidi.MIDIOutput> = new Map();
  private inputs: Map<string, WebMidi.MIDIInput> = new Map();
  private selectedOutput: WebMidi.MIDIOutput | null = null;

  async initialize(): Promise<boolean> {
    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      this.updateDevices();
      this.midiAccess.addEventListener('statechange', () => this.updateDevices());
      return true;
    } catch (error) {
      console.error('MIDI access denied:', error);
      return false;
    }
  }

  private updateDevices() {
    if (!this.midiAccess) return;

    this.outputs = new Map();
    this.inputs = new Map();

    for (const output of this.midiAccess.outputs.values()) {
      this.outputs.set(output.id, output);
    }

    for (const input of this.midiAccess.inputs.values()) {
      this.inputs.set(input.id, input);
    }
  }

  getOutputs(): WebMidi.MIDIOutput[] {
    return Array.from(this.outputs.values());
  }

  getInputs(): WebMidi.MIDIInput[] {
    return Array.from(this.inputs.values());
  }

  selectOutput(id: string) {
    this.selectedOutput = this.outputs.get(id) || null;
  }

  sendControlChange(controller: number, value: number, channel = 1) {
    if (!this.selectedOutput) return;
    
    this.selectedOutput.send([0xB0 + (channel - 1), controller, value]);
  }

  sendNoteOn(note: number, velocity = 127, channel = 1) {
    if (!this.selectedOutput) return;
    
    this.selectedOutput.send([0x90 + (channel - 1), note, velocity]);
  }

  sendNoteOff(note: number, velocity = 0, channel = 1) {
    if (!this.selectedOutput) return;
    
    this.selectedOutput.send([0x80 + (channel - 1), note, velocity]);
  }
}

export const midiController = new MIDIController();