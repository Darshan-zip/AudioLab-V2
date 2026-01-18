
// Audio utilities for piano recorder

// Frequency mapping for musical notes (C4 to B4)
export const noteFrequencies: Record<string, number> = {
  "C": 261.63,
  "C#": 277.18,
  "D": 293.66,
  "D#": 311.13,
  "E": 329.63,
  "F": 349.23,
  "F#": 369.99,
  "G": 392.0,
  "G#": 415.3,
  "A": 440.0,
  "A#": 466.16,
  "B": 493.88,
};

// Instrument waveform types
export const instruments = {
  piano: "sine",
  organ: "square", 
  guitar: "triangle",
  violin: "sawtooth",
  synth: "sawtooth"
};

export type InstrumentType = keyof typeof instruments;

// Piano keyboard key definitions
export const pianoKeys = [
  { note: "C", type: "white" },
  { note: "C#", type: "black" },
  { note: "D", type: "white" },
  { note: "D#", type: "black" },
  { note: "E", type: "white" },
  { note: "F", type: "white" },
  { note: "F#", type: "black" },
  { note: "G", type: "white" },
  { note: "G#", type: "black" },
  { note: "A", type: "white" },
  { note: "A#", type: "black" },
  { note: "B", type: "white" },
];

export interface NoteEvent {
  note: string;
  time: number;
  duration?: number;
  velocity?: number; // For future MIDI-like functionality
}

export interface Layer {
  id: string;
  notes: NoteEvent[];
  instrument: InstrumentType;
  color: string;
  name: string;
}

// Generate a unique ID for layers
export const generateId = () => {
  return Math.random().toString(36).substring(2, 11);
};

// Default layer colors
export const layerColors = [
  "#9b87f5", // Primary purple
  "#6E59A5", // Tertiary purple
  "#33C3F0", // Sky blue
  "#0EA5E9", // Ocean blue
  "#E5DEFF", // Soft purple
  "#D6BCFA", // Light purple
];

// Convert recording to wav format for download
export const createAudioFile = (
  layers: Layer[],
  duration: number,
  audioContext: AudioContext
): Promise<Blob> => {
  return new Promise((resolve) => {
    // 44100 samples per second, 2 channels
    const sampleRate = audioContext.sampleRate;
    const channels = 2;
    const totalSamples = Math.ceil(duration / 1000 * sampleRate);
    
    // Create a buffer with the right length
    const offlineContext = new OfflineAudioContext(
      channels, 
      totalSamples, 
      sampleRate
    );

    // Schedule all notes in all layers
    layers.forEach(layer => {
      layer.notes.forEach(note => {
        const oscillator = offlineContext.createOscillator();
        oscillator.type = instruments[layer.instrument] as OscillatorType;
        oscillator.frequency.value = noteFrequencies[note.note];

        // Apply simple envelope for better sound
        const gainNode = offlineContext.createGain();
        gainNode.gain.setValueAtTime(0.0001, note.time / 1000);
        gainNode.gain.linearRampToValueAtTime(0.7, note.time / 1000 + 0.02);
        gainNode.gain.linearRampToValueAtTime(0.5, note.time / 1000 + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, note.time / 1000 + (note.duration || 1));

        oscillator.connect(gainNode);
        gainNode.connect(offlineContext.destination);

        oscillator.start(note.time / 1000);
        oscillator.stop(note.time / 1000 + (note.duration || 1));
      });
    });

    // Render the audio
    offlineContext.startRendering().then(renderedBuffer => {
      // Convert the buffer to a WAV file
      const wavBytes = audioBufferToWav(renderedBuffer);
      const blob = new Blob([wavBytes], { type: 'audio/wav' });
      resolve(blob);
    });
  });
};

// Convert AudioBuffer to WAV format
// This is a simplified version that works for basic cases
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numOfChannels = buffer.numberOfChannels;
  const length = buffer.length * numOfChannels * 2;
  const sampleRate = buffer.sampleRate;
  
  const wav = new ArrayBuffer(44 + length);
  const view = new DataView(wav);
  
  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // File length
  view.setUint32(4, 32 + length, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // Format chunk identifier
  writeString(view, 12, 'fmt ');
  // Format chunk length
  view.setUint32(16, 16, true);
  // Sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // Number of channels
  view.setUint16(22, numOfChannels, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 4, true);
  // Block align (channel count * bytes per sample)
  view.setUint16(32, numOfChannels * 2, true);
  // Bits per sample
  view.setUint16(34, 16, true);
  // Data chunk identifier
  writeString(view, 36, 'data');
  // Data chunk length
  view.setUint32(40, length, true);
  
  // Write the PCM samples
  const channelData = [];
  for (let i = 0; i < numOfChannels; i++) {
    channelData.push(buffer.getChannelData(i));
  }
  
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
      // Convert float audio data to 16-bit PCM
      const sample = channelData[channel][i];
      let val = sample < 0 ? sample * 32768 : sample * 32767;
      val = Math.max(-32768, Math.min(32767, val)); // Clamp
      view.setInt16(offset, val, true);
      offset += 2;
    }
  }
  
  return wav;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
