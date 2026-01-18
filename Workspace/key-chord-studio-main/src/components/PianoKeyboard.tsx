
import React, { useState } from 'react';
import { pianoKeys, noteFrequencies } from '@/utils/audioUtils';
import { cn } from '@/lib/utils';

interface PianoKeyboardProps {
  onNotePlay: (note: string) => void;
  activeNotes?: string[];
}

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ onNotePlay, activeNotes = [] }) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  
  const handleKeyPress = (note: string) => {
    setActiveKey(note);
    onNotePlay(note);
    
    // Reset active key after a short delay
    setTimeout(() => {
      setActiveKey(null);
    }, 300);
  };
  
  // Separate white and black keys for proper rendering order
  const whiteKeys = pianoKeys.filter(key => key.type === "white");
  const blackKeys = pianoKeys.filter(key => key.type === "black");

  // Black key positions based on white key width
  const getBlackKeyPosition = (note: string): number => {
    const positions: Record<string, number> = {
      "C#": 0,
      "D#": 1,
      "F#": 3,
      "G#": 4,
      "A#": 5,
    };
    return positions[note] || 0;
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto h-48 md:h-56">
      {/* White keys */}
      <div className="relative h-full flex items-end justify-center">
        {whiteKeys.map((key) => (
          <button
            key={`white-${key.note}`}
            onClick={() => handleKeyPress(key.note)}
            onTouchStart={() => handleKeyPress(key.note)}
            className={cn(
              "relative z-10 bg-keysWhite border border-gray-300 h-full w-12 md:w-14",
              "transition-all duration-100 rounded-b-md shadow-piano-key active:shadow-piano-key-pressed",
              "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-musicPrimary focus:ring-opacity-50",
              activeKey === key.note || activeNotes.includes(key.note) ? 
                "bg-gray-100 shadow-piano-key-pressed translate-y-1" : ""
            )}
            aria-label={`Note ${key.note}`}
          >
            <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500">
              {key.note}
            </span>
          </button>
        ))}
        
        {/* Black keys */}
        {blackKeys.map((key) => {
          const position = getBlackKeyPosition(key.note);
          return (
            <button
              key={`black-${key.note}`}
              onClick={() => handleKeyPress(key.note)}
              onTouchStart={() => handleKeyPress(key.note)}
              className={cn(
                "absolute z-20 bg-keysBlack h-2/3 w-7 md:w-8",
                "top-0 rounded-b-md shadow-md transition-all duration-100",
                "active:shadow-sm active:translate-y-0.5 focus:outline-none",
                "focus:ring-2 focus:ring-musicPrimary focus:ring-opacity-50",
                activeKey === key.note || activeNotes.includes(key.note) ? 
                  "bg-gray-800 shadow-sm translate-y-0.5" : ""
              )}
              style={{ left: `${position * 48 + 36}px` }}
              aria-label={`Note ${key.note}`}
            >
              <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white opacity-70">
                {key.note}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PianoKeyboard;
