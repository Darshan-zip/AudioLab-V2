
import React, { useState, useEffect } from "react";
import { Save, RotateCcw, Play, Pause, FastForward, Rewind, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const frequencies = [
  { freq: "32Hz", value: 0 },
  { freq: "64Hz", value: 0 },
  { freq: "125Hz", value: 0 },
  { freq: "250Hz", value: 0 },
  { freq: "500Hz", value: 0 },
  { freq: "1kHz", value: 0 },
  { freq: "2kHz", value: 0 },
  { freq: "4kHz", value: 0 },
  { freq: "8kHz", value: 0 },
  { freq: "16kHz", value: 0 },
];

const Equalizer = () => {
  const [eqSettings, setEqSettings] = useState(frequencies);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(217); // 3:37 in seconds
  const [audioVisualization, setAudioVisualization] = useState<number[]>([]);

  // Simulate animation of audio visualization
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setAudioVisualization(
          Array.from({ length: 40 }, () => Math.floor(Math.random() * 50) + 10)
        );
        setCurrentTime((prevTime) => (prevTime < duration ? prevTime + 1 : prevTime));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  // Reset EQ settings to flat
  const resetEq = () => {
    setEqSettings(frequencies);
  };

  // Update an individual EQ band
  const updateEQBand = (index: number, newValue: number[]) => {
    const newSettings = [...eqSettings];
    newSettings[index] = { ...newSettings[index], value: newValue[0] };
    setEqSettings(newSettings);
  };

  // Format time display (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="animate-fade-in tool-card flex flex-col h-full">
      <h2 className="text-xl font-medium mb-4">Equalizer</h2>
      
      <div className="mb-6 bg-secondary/50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">Midnight Waves.mp3</div>
          <div className="text-xs text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        
        <div className="h-20 flex items-end gap-0.5 mb-3 px-2">
          {audioVisualization.map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/80 rounded-sm"
              style={{ height: `${height}%` }}
            ></div>
          ))}
        </div>
        
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={(value) => setCurrentTime(value[0])}
          className="mb-4"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <Rewind className="h-5 w-5 text-muted-foreground" />
            </button>
            <button 
              className="p-3 mx-1 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <FastForward className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-32">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={volume}
              max={100}
              step={1}
              onValueChange={setVolume}
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">EQ Settings</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={resetEq}>
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-1" /> Save Preset
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-10 gap-2">
          {eqSettings.map((band, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <Slider
                orientation="vertical"
                className="h-44"
                min={-12}
                max={12}
                step={0.5}
                value={[band.value]}
                onValueChange={(value) => updateEQBand(index, value)}
              />
              <div className="text-xs text-center">{band.freq}</div>
              <div className="text-xs text-muted-foreground">
                {band.value > 0 ? "+" : ""}{band.value} dB
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-4 gap-2">
        <Button variant="outline" className="text-sm h-auto py-3">
          Acoustic
        </Button>
        <Button variant="outline" className="text-sm h-auto py-3">
          Bass Boost
        </Button>
        <Button variant="outline" className="text-sm h-auto py-3">
          Electronic
        </Button>
        <Button variant="outline" className="text-sm h-auto py-3">
          Vocal Boost
        </Button>
      </div>
    </div>
  );
};

export default Equalizer;
