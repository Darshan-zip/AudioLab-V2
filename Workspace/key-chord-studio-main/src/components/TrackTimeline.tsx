
import React, { useMemo } from 'react';
import { Layer, pianoKeys } from '@/utils/audioUtils';
import { cn } from '@/lib/utils';

interface TrackTimelineProps {
  layers: Layer[];
  duration: number;
  playProgress: number;
  isPlaying: boolean;
  selectedLayerIndex: number | null;
}

const TrackTimeline: React.FC<TrackTimelineProps> = ({
  layers,
  duration,
  playProgress,
  isPlaying,
  selectedLayerIndex,
}) => {
  // Calculate the effective max duration to avoid division by zero
  const effectiveDuration = Math.max(duration, 100);
  
  const renderLayer = (layer: Layer, index: number) => {
    const isSelected = selectedLayerIndex === index;
    const isPlayingThisLayer = isPlaying && (selectedLayerIndex === index || selectedLayerIndex === null);
    
    return (
      <div 
        key={layer.id}
        className={cn(
          "relative h-16 my-2 rounded-md overflow-hidden transition-all",
          "border border-gray-200",
          isSelected ? "shadow-md" : "shadow-sm"
        )}
        style={{
          backgroundColor: `${layer.color}15`, // Very light version of the color
          borderColor: isSelected ? layer.color : undefined
        }}
      >
        <div className="absolute top-0 left-0 h-full px-2 py-1 bg-gray-100 border-r border-gray-200 z-10 flex items-center">
          <span className="text-xs font-medium truncate w-20">{layer.name}</span>
        </div>
        
        <div className="absolute left-24 right-0 top-0 bottom-0">
          {layer.notes.map((note, i) => {
            const noteIndex = pianoKeys.findIndex(k => k.note === note.note);
            // Distribute notes vertically based on pitch
            const verticalPosition = 16 - (noteIndex / pianoKeys.length) * 16;
            
            return (
              <div
                key={i}
                className="absolute h-3 rounded-sm"
                style={{
                  backgroundColor: layer.color,
                  left: `${(note.time / effectiveDuration) * 100}%`,
                  top: `${verticalPosition}px`,
                  width: "6px",
                  opacity: 0.8,
                }}
                title={`${note.note} at ${note.time}ms`}
              />
            );
          })}
          
          {/* Play position indicator */}
          {isPlayingThisLayer && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
              style={{
                left: `${(playProgress / effectiveDuration) * 100}%`,
                transition: "left 100ms linear"
              }}
            />
          )}
        </div>
      </div>
    );
  };
  
  // Time markers
  const timeMarkers = useMemo(() => {
    if (duration <= 0) return [];
    
    const markers = [];
    const interval = Math.max(500, Math.floor(duration / 10)); // Adjust based on duration
    
    for (let time = 0; time <= duration; time += interval) {
      markers.push({
        time,
        position: (time / effectiveDuration) * 100
      });
    }
    
    return markers;
  }, [duration, effectiveDuration]);
  
  return (
    <div className="w-full mb-6 animate-slide-up">
      <div className="relative text-sm text-gray-500 mb-1 h-5">
        <div className="absolute left-24 right-0 h-full">
          {timeMarkers.map((marker, i) => (
            <div 
              key={i}
              className="absolute top-0 bottom-0 text-xs flex flex-col items-center"
              style={{ left: `${marker.position}%` }}
            >
              <span className="font-mono">{(marker.time / 1000).toFixed(1)}s</span>
              <div className="h-2 w-px bg-gray-300 mt-0.5"></div>
            </div>
          ))}
        </div>
      </div>
      
      {layers.map((layer, i) => renderLayer(layer, i))}
      
      {layers.length === 0 && (
        <div className="h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-400 text-sm">
          No recorded tracks yet. Click "Add Track" to start recording!
        </div>
      )}
      
      <div className="text-xs text-center text-gray-500 mt-2">
        Timeline: higher pitch notes are displayed higher on each track
      </div>
    </div>
  );
};

export default TrackTimeline;
