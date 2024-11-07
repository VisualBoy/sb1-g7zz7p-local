/// <reference types="vite/client" />

interface Navigator {
  requestMIDIAccess(): Promise<WebMidi.MIDIAccess>;
}

declare namespace WebMidi {
  interface MIDIAccess extends EventTarget {
    inputs: Map<string, MIDIInput>;
    outputs: Map<string, MIDIOutput>;
    addEventListener(
      type: 'statechange',
      listener: (event: MIDIConnectionEvent) => void
    ): void;
  }

  interface MIDIPort {
    id: string;
    name: string;
    state: 'connected' | 'disconnected';
    type: 'input' | 'output';
  }

  interface MIDIInput extends MIDIPort {
    onmidimessage: (event: MIDIMessageEvent) => void;
  }

  interface MIDIOutput extends MIDIPort {
    send(data: number[]): void;
  }

  interface MIDIMessageEvent {
    data: Uint8Array;
  }

  interface MIDIConnectionEvent {
    port: MIDIPort;
  }
}