
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Music, Mic, Sliders, FileMusic, Save, PlusCircle, 
  Play, Pause, SkipBack, SkipForward, Volume2, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Mock track data
const tracks = [
  { id: 1, name: "Drums", color: "#4f46e5", muted: false, solo: false, volume: 80, pan: 0 },
  { id: 2, name: "Bass", color: "#0ea5e9", muted: false, solo: false, volume: 75, pan: -15 },
  { id: 3, name: "Synth", color: "#8b5cf6", muted: false, solo: false, volume: 65, pan: 10 },
  { id: 4, name: "Vocals", color: "#ec4899", muted: false, solo: false, volume: 85, pan: 0 },
];

const Workspace = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [masterVolume, setMasterVolume] = useState([85]);
  const [activeTracks, setActiveTracks] = useState(tracks);
  
  // Toggle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // Toggle track mute
  const toggleMute = (trackId: number) => {
    setActiveTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId ? { ...track, muted: !track.muted, solo: false } : track
      )
    );
  };

  // Toggle track solo
  const toggleSolo = (trackId: number) => {
    setActiveTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId ? { ...track, solo: !track.solo, muted: false } : track
      )
    );
  };

  // Update track volume
  const updateTrackVolume = (trackId: number, newVolume: number[]) => {
    setActiveTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId ? { ...track, volume: newVolume[0] } : track
      )
    );
  };

  // Update track pan
  const updateTrackPan = (trackId: number, newPan: number[]) => {
    setActiveTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId ? { ...track, pan: newPan[0] } : track
      )
    );
  };

  return (
    <div className="animate-fade-in tool-card flex flex-col h-full">
      <h2 className="text-xl font-medium mb-4">Workspace</h2>
      
      <Tabs defaultValue="mixer" className="flex-1">
        <TabsList className="mb-6 grid grid-cols-4">
          <TabsTrigger value="mixer" className="flex items-center gap-1.5">
            <Sliders className="h-4 w-4" />
            <span>Mixer</span>
          </TabsTrigger>
          <TabsTrigger value="arrangement" className="flex items-center gap-1.5">
            <Music className="h-4 w-4" />
            <span>Arrangement</span>
          </TabsTrigger>
          <TabsTrigger value="recording" className="flex items-center gap-1.5">
            <Mic className="h-4 w-4" />
            <span>Recording</span>
          </TabsTrigger>
          <TabsTrigger value="mastering" className="flex items-center gap-1.5">
            <FileMusic className="h-4 w-4" />
            <span>Mastering</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="mixer" className="flex-1 flex flex-col">
          <div className="flex justify-between mb-6">
            <h3 className="text-lg font-medium">Track Mixer</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button size="sm">
                <Share2 className="h-4 w-4 mr-1" /> Export
              </Button>
            </div>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-4 mb-6">
            <div className="h-2 bg-secondary rounded-full relative mb-3">
              <div 
                className="absolute h-full bg-primary rounded-full"
                style={{ width: `${(currentTime / 180) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                  <SkipBack className="h-4 w-4 text-muted-foreground" />
                </button>
                <button 
                  className="p-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                  onClick={togglePlayback}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                  <SkipForward className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              
              <div className="text-sm">
                {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 3:00
              </div>
              
              <div className="flex items-center gap-2 w-32">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={masterVolume}
                  max={100}
                  step={1}
                  onValueChange={setMasterVolume}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {activeTracks.map(track => (
              <div key={track.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-8 rounded-sm" 
                      style={{ backgroundColor: track.color }}
                    ></div>
                    <span className="font-medium">{track.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                        track.muted 
                          ? "bg-red-100 text-red-600" 
                          : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
                      }`}
                      onClick={() => toggleMute(track.id)}
                    >
                      M
                    </button>
                    <button 
                      className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                        track.solo 
                          ? "bg-green-100 text-green-600" 
                          : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
                      }`}
                      onClick={() => toggleSolo(track.id)}
                    >
                      S
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Volume</span>
                      <span>{track.volume}%</span>
                    </div>
                    <Slider
                      value={[track.volume]}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateTrackVolume(track.id, value)}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Pan</span>
                      <span>{track.pan === 0 ? "C" : track.pan < 0 ? `L${Math.abs(track.pan)}` : `R${track.pan}`}</span>
                    </div>
                    <Slider
                      value={[track.pan]}
                      min={-50}
                      max={50}
                      step={1}
                      onValueChange={(value) => updateTrackPan(track.id, value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all cursor-pointer">
              <PlusCircle className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Add Track</span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="arrangement">
          <div className="flex items-center justify-center h-64 bg-secondary/30 rounded-lg border border-dashed">
            <div className="text-center">
              <Music className="h-12 w-12 text-muted-foreground mb-3 mx-auto" />
              <h3 className="text-lg font-medium mb-1">Arrangement View</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Arrange your tracks, add automation, and visualize your project timeline
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recording">
          <div className="flex items-center justify-center h-64 bg-secondary/30 rounded-lg border border-dashed">
            <div className="text-center">
              <Mic className="h-12 w-12 text-muted-foreground mb-3 mx-auto" />
              <h3 className="text-lg font-medium mb-1">Recording Studio</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Record vocals, instruments, and create new audio tracks
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mastering">
          <div className="flex items-center justify-center h-64 bg-secondary/30 rounded-lg border border-dashed">
            <div className="text-center">
              <FileMusic className="h-12 w-12 text-muted-foreground mb-3 mx-auto" />
              <h3 className="text-lg font-medium mb-1">Mastering Tools</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Apply final touches, master your mix, and prepare for distribution
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Workspace;
