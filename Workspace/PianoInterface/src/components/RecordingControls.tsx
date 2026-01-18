import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { instruments, InstrumentType, Layer } from '@/utils/audioUtils';
import { 
  Play, Pause, Square, Mic, Plus, Download, Trash2,
  Volume2, Music
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordingControlsProps {
  recording: boolean;
  playing: boolean;
  onRecord: () => void;
  onStop: () => void;
  onPlay: () => void;
  onPause: () => void;
  onAddTrack: () => void;
  onClear: () => void;
  onDownload: () => void;
  playbackSpeed: number;
  onPlaybackSpeedChange: (speed: number) => void;
  selectedInstrument: InstrumentType;
  onInstrumentChange: (instrument: InstrumentType) => void;
  layers: Layer[];
  selectedLayerIndex: number | null;
  onLayerSelect: (index: number | null) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  recording,
  playing,
  onRecord,
  onStop,
  onPlay,
  onPause,
  onAddTrack,
  onClear,
  onDownload,
  playbackSpeed,
  onPlaybackSpeedChange,
  selectedInstrument,
  onInstrumentChange,
  layers,
  selectedLayerIndex,
  onLayerSelect,
  volume,
  onVolumeChange
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 justify-center mb-6">
        {/* Main control buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          <Button 
            onClick={onRecord} 
            disabled={playing}
            className={cn(
              "flex items-center gap-1.5",
              recording ? "bg-recordRed text-white hover:bg-red-700" : "bg-recordRed text-white hover:bg-red-700"
            )}
            size="sm"
          >
            <Mic size={16} className={recording ? "animate-pulse-gently" : ""} />
            {recording ? "Recording..." : "Record"}
          </Button>
          
          <Button 
            onClick={onAddTrack}
            disabled={recording || playing}
            className="bg-musicPrimary hover:bg-musicSecondary text-white flex items-center gap-1.5"
            size="sm"
          >
            <Plus size={16} />
            Add Track
          </Button>
          
          <Button
            onClick={playing ? onPause : onPlay}
            disabled={recording || layers.length === 0}
            className={cn(
              "flex items-center gap-1.5",
              playing ? "bg-amber-500 hover:bg-amber-600" : "bg-playGreen hover:bg-green-600"
            )}
            size="sm"
          >
            {playing ? (
              <>
                <Pause size={16} />
                Pause
              </>
            ) : (
              <>
                <Play size={16} />
                Play {selectedLayerIndex !== null ? `Track ${selectedLayerIndex + 1}` : "All"}
              </>
            )}
          </Button>
          
          <Button
            onClick={onStop}
            disabled={!recording}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1.5"
            size="sm"
          >
            <Square size={16} />
            Stop
          </Button>
          
          <Button
            onClick={onClear}
            disabled={recording || playing || layers.length === 0}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center gap-1.5"
            size="sm"
          >
            <Trash2 size={16} />
            Clear
          </Button>
          
          <Button
            onClick={onDownload}
            disabled={recording || playing || layers.length === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1.5"
            size="sm"
          >
            <Download size={16} />
            Download
          </Button>
        </div>
      </div>
      
      {/* Settings row */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-2">
        {/* Instrument selector */}
        <div className="flex items-center gap-2">
          <Music size={16} className="text-gray-500" />
          <label htmlFor="instrument-select" className="text-sm font-medium text-gray-700">
            Instrument:
          </label>
          <Select 
            value={selectedInstrument}
            onValueChange={(value) => onInstrumentChange(value as InstrumentType)}
          >
            <SelectTrigger id="instrument-select" className="w-28 h-8 text-sm">
              <SelectValue placeholder="Select instrument" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(instruments).map((inst) => (
                <SelectItem key={inst} value={inst} className="text-sm">
                  {inst.charAt(0).toUpperCase() + inst.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Playback speed control */}
        <div className="flex items-center gap-2">
          <label htmlFor="speed-select" className="text-sm font-medium text-gray-700">
            Speed:
          </label>
          <Select
            value={playbackSpeed.toString()}
            onValueChange={(value) => onPlaybackSpeedChange(parseFloat(value))}
          >
            <SelectTrigger id="speed-select" className="w-20 h-8 text-sm">
              <SelectValue placeholder="Speed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.25" className="text-sm">0.25x</SelectItem>
              <SelectItem value="0.5" className="text-sm">0.5x</SelectItem>
              <SelectItem value="1" className="text-sm">1x</SelectItem>
              <SelectItem value="1.5" className="text-sm">1.5x</SelectItem>
              <SelectItem value="2" className="text-sm">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Volume slider */}
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-gray-500" />
          <Slider
            className="w-24"
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={(vals) => onVolumeChange(vals[0])}
          />
        </div>
      </div>
      
      {/* Layer selector */}
      {layers.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <label htmlFor="layer-select" className="text-sm font-medium text-gray-700">
            Select Track:
          </label>
          <Select
            value={selectedLayerIndex !== null ? selectedLayerIndex.toString() : "all"}
            onValueChange={(value) => {
              onLayerSelect(value === "all" ? null : parseInt(value));
            }}
          >
            <SelectTrigger id="layer-select" className="w-32 h-8 text-sm">
              <SelectValue placeholder="Select track" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">All Tracks</SelectItem>
              {layers.map((layer, idx) => (
                <SelectItem key={layer.id} value={idx.toString()} className="text-sm">
                  {layer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
