import { MIDISetup } from "./components/MIDISetup";
import { Fader } from "./components/controls/Fader";
import { Pad } from "./components/controls/Pad";
import { XYPad } from "./components/controls/XYPad";
import { Knob } from "./components/controls/Knob";
import { Toggle } from "./components/controls/Toggle";
import { PushButton } from "./components/controls/PushButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Music, Move, Settings, SlidersVerticalIcon } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            MIDI Controller
          </h1>
          <MIDISetup />
        </header>
        
        <Tabs defaultValue="faders" className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-4 p-2 bg-card">
            <TabsTrigger value="faders" className="data-[state=active]:bg-primary">
              <SlidersVerticalIcon className="w-4 h-4 mr-2" />
              Faders
            </TabsTrigger>
            <TabsTrigger value="pads" className="data-[state=active]:bg-primary">
              <Music className="w-4 h-4 mr-2" />
              Pads
            </TabsTrigger>
            <TabsTrigger value="xy" className="data-[state=active]:bg-primary">
              <Move className="w-4 h-4 mr-2" />
              XY
            </TabsTrigger>
            <TabsTrigger value="misc" className="data-[state=active]:bg-primary">
              <Settings className="w-4 h-4 mr-2" />
              Misc
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faders" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Fader
                  key={i}
                  controller={i}
                  label={`Fader ${i}`}
                  defaultValue={64}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pads" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Pad
                  key={i}
                  note={35 + i}
                  label={`Pad ${i}`}
                  color={i % 2 === 0 ? 'bg-primary hover:bg-primary/90' : 'bg-accent hover:bg-accent/90'}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="xy" className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <XYPad
                controllerX={20}
                controllerY={21}
                label="XY Pad 1"
              />
              <XYPad
                controllerX={22}
                controllerY={23}
                label="XY Pad 2"
              />
            </div>
          </TabsContent>

          <TabsContent value="misc" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Knob
                controller={30}
                label="Knob 1"
              />
              <Knob
                controller={31}
                label="Knob 2"
              />
              <Toggle
                controller={40}
                label="Toggle 1"
              />
              <Toggle
                controller={41}
                label="Toggle 2"
              />
              <PushButton
                controller={50}
                label="Push 1"
              />
              <PushButton
                controller={51}
                label="Push 2"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
