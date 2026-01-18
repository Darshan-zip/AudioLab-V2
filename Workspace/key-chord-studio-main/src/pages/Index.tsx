
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PianoKeyboard from "@/components/PianoKeyboard";
import TrackTimeline from "@/components/TrackTimeline";
import RecordingControls from "@/components/RecordingControls";
import { toast } from "sonner";
import { 
  noteFrequencies, 
  instruments, 
  InstrumentType,
  NoteEvent,
  Layer,
  generateId,
  layerColors,
  createAudioFile
} from "@/utils/audioUtils";

const Index = () => {
  // State for recording and playback
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [currentLayer, setCurrentLayer] = useState<NoteEvent[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [playProgress, setPlayProgress] = useState(0);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>("piano");
  const [volume, setVolume] = useState(0.7);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  
  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutRefs = useRef<number[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Initialize AudioContext and set up gain node
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
          const gainNode = audioContextRef.current.createGain();
          gainNode.connect(audioContextRef.current.destination);
          gainNode.gain.value = volume;
          gainNodeRef.current = gainNode;
        }
      } catch (error) {
        console.error("Web Audio API is not supported in this browser", error);
        toast.error("Your browser doesn't support Web Audio API");
      }
    }
  }, []);
  
  // Update gain node when volume changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Playback progress tracking
  useEffect(() => {
    let interval: number;
    
    if (playing) {
      const start = Date.now();
      interval = window.setInterval(() => {
        setPlayProgress((Date.now() - start) * playbackSpeed);
      }, 16); // ~60fps
    } else {
      clearInterval(interval);
      setPlayProgress(0);
    }
    
    return () => clearInterval(interval);
  }, [playing, playbackSpeed]);

  // Play a note
  const playNote = (note: string) => {
    if (!audioContextRef.current) return;
    
    try {
      const audioCtx = audioContextRef.current;
      const oscillator = audioCtx.createOscillator();
      oscillator.type = instruments[selectedInstrument] as OscillatorType;
      oscillator.frequency.setValueAtTime(noteFrequencies[note], audioCtx.currentTime);
      
      // Apply simple envelope for better sound
      const noteGain = audioCtx.createGain();
      noteGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.02);
      noteGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      
      oscillator.connect(noteGain);
      noteGain.connect(gainNodeRef.current || audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.8);
      
      // Show visual feedback by adding to active notes
      setActiveNotes(prev => [...prev, note]);
      setTimeout(() => {
        setActiveNotes(prev => prev.filter(n => n !== note));
      }, 300);
    } catch (error) {
      console.error("Error playing note", error);
    }
  };

  // Handle note click
  const handleNotePlay = (note: string) => {
    playNote(note);
    
    if (recording) {
      const time = startTime ? Date.now() - startTime : 0;
      const noteData: NoteEvent = { 
        note, 
        time, 
        duration: 0.8, 
        velocity: 1.0 
      };
      setCurrentLayer((prev) => [...prev, noteData]);
    }
  };

  // Start recording
  const startRecording = () => {
    setStartTime(Date.now());
    setRecording(true);
    toast.success("Recording started");
  };

  // Stop recording
  const stopRecording = () => {
    setRecording(false);
    
    // Only save if there are notes
    if (currentLayer.length > 0) {
      setLayers((prev) => {
        let newLayers = [...prev];
        
        if (selectedLayerIndex !== null && selectedLayerIndex < newLayers.length) {
          // Update existing layer
          newLayers[selectedLayerIndex] = {
            ...newLayers[selectedLayerIndex],
            notes: [...newLayers[selectedLayerIndex].notes, ...currentLayer],
          };
        }
        
        // Calculate new max duration
        const allNotes = newLayers.flatMap(layer => layer.notes);
        const maxTime = allNotes.length > 0 ? Math.max(...allNotes.map(n => n.time)) : 0;
        setDuration(maxTime + 1000); // Add 1 second buffer
        
        return newLayers;
      });
      
      toast.success("Recording saved");
    } else {
      toast.info("No notes were recorded");
    }
    
    setCurrentLayer([]);
  };

  // Add a new track
  const addTrack = () => {
    const newLayerIndex = layers.length;
    const colorIndex = newLayerIndex % layerColors.length;
    
    const newLayer: Layer = {
      id: generateId(),
      notes: [],
      instrument: selectedInstrument,
      color: layerColors[colorIndex],
      name: `Track ${newLayerIndex + 1}`
    };
    
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerIndex(newLayerIndex);
    setCurrentLayer([]);
    setStartTime(Date.now());
    setRecording(true);
    
    toast.success(`New track '${newLayer.name}' added`);
  };

  // Play recording
  const playRecording = () => {
    const targetLayers = selectedLayerIndex !== null 
      ? [layers[selectedLayerIndex]] 
      : layers;
      
    const allNotes = targetLayers.flatMap(layer => 
      layer.notes.map(note => ({ 
        ...note, 
        instrument: layer.instrument 
      }))
    );
    
    if (allNotes.length === 0) {
      toast.info("Nothing to play");
      return;
    }
    
    setPlaying(true);
    const allTimeouts: number[] = [];
    
    allNotes.forEach((noteObj) => {
      const timeout = window.setTimeout(() => {
        // Create a temporary reference to the current instrument
        const currentInstrument = selectedInstrument;
        
        // Temporarily change to the note's recorded instrument
        setSelectedInstrument(noteObj.instrument);
        
        // Play the note
        playNote(noteObj.note);
        
        // Revert back to the selected instrument
        setSelectedInstrument(currentInstrument);
      }, noteObj.time / playbackSpeed);
      
      allTimeouts.push(timeout);
    });
    
    // Calculate when to stop playback
    const maxTime = allNotes.length > 0 
      ? Math.max(...allNotes.map(n => n.time)) 
      : 0;
      
    allTimeouts.push(
      window.setTimeout(
        () => setPlaying(false), 
        maxTime / playbackSpeed + 1000
      )
    );
    
    timeoutRefs.current = allTimeouts;
    toast.success("Playback started");
  };

  // Pause playback
  const pausePlayback = () => {
    timeoutRefs.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    setPlaying(false);
    toast.info("Playback paused");
  };

  // Clear all recordings
  const clearRecordings = () => {
    setLayers([]);
    setCurrentLayer([]);
    setPlayProgress(0);
    setDuration(0);
    setSelectedLayerIndex(null);
    toast.success("All recordings cleared");
  };
  
  // Download recording
  const downloadRecording = async () => {
    if (!audioContextRef.current || layers.length === 0) {
      toast.error("Nothing to download");
      return;
    }
    
    toast.info("Preparing audio for download...");
    
    try {
      const blob = await createAudioFile(layers, duration, audioContextRef.current);
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "piano-recording.wav";
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Download started");
    } catch (error) {
      console.error("Error creating audio file", error);
      toast.error("Failed to create audio file");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-musicPrimary to-blue-500">
          Piano Recorder Studio
        </h1>
        
        <Card className="rounded-2xl shadow-xl bg-white overflow-hidden">
          <CardContent className="p-6">
            {/* Timeline display for recorded tracks */}
            {(recording || layers.length > 0) && (
              <TrackTimeline
                layers={layers}
                duration={duration}
                playProgress={playProgress}
                isPlaying={playing}
                selectedLayerIndex={selectedLayerIndex}
              />
            )}
            
            {/* Recording controls */}
            <RecordingControls
              recording={recording}
              playing={playing}
              onRecord={startRecording}
              onStop={stopRecording}
              onPlay={playRecording}
              onPause={pausePlayback}
              onAddTrack={addTrack}
              onClear={clearRecordings}
              onDownload={downloadRecording}
              playbackSpeed={playbackSpeed}
              onPlaybackSpeedChange={setPlaybackSpeed}
              selectedInstrument={selectedInstrument}
              onInstrumentChange={setSelectedInstrument}
              layers={layers}
              selectedLayerIndex={selectedLayerIndex}
              onLayerSelect={setSelectedLayerIndex}
              volume={volume}
              onVolumeChange={setVolume}
            />
            
            {/* Piano keyboard */}
            <div className="mt-8 rounded-xl border border-gray-200 p-6 bg-gradient-to-br from-white to-gray-50 shadow-inner">
              <PianoKeyboard onNotePlay={handleNotePlay} activeNotes={activeNotes} />
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Click or tap piano keys to play notes. Record multiple tracks and create your composition!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
