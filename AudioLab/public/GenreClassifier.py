import tensorflow_hub as hub
import numpy as np
import librosa
from pydub import AudioSegment

# 🎵 Step 1: Convert MP3 to WAV
def convert_mp3_to_wav(mp3_path, wav_path):
    audio = AudioSegment.from_mp3(mp3_path)
    audio.export(wav_path, format="wav")
    print(f"✅ Converted {mp3_path} → {wav_path}")

# 🎧 Step 2: Load & Process Audio File (16kHz, Mono)
def load_audio(wav_path, target_sr=16000):
    y, sr = librosa.load(wav_path, sr=target_sr, mono=True)  # Convert to mono, resample
    y = y.astype(np.float32)  # Convert to float32
    return y, sr

# 🔥 Step 3: Load Google's VGGish Model
def load_vggish():
    model = hub.load("https://tfhub.dev/google/vggish/1")
    print("✅ Google's VGGish Model Loaded")
    return model

# 🎼 Step 4: Extract Features & Predict
def extract_vggish_features(mp3_file):
    # Convert MP3 → WAV
    wav_file = mp3_file.replace(".mp3", ".wav")
    convert_mp3_to_wav(mp3_file, wav_file)

    # Load & Process Audio
    waveform, _ = load_audio(wav_file)

    # Reshape for VGGish (1D to 2D array)
 
    waveform = np.squeeze(waveform)  # Removes extra dimension, keeps shape (N,)

    # Load VGGish Model
    model = load_vggish()

    # Extract Embeddings
    embeddings = model(waveform)
    print("🎵 Extracted VGGish Embeddings:", embeddings.shape)

    return embeddings.numpy()

# 🎯 Run Feature Extraction
mp3_file = "no_vocals.mp3"  # Change this to your file
vggish_embeddings = extract_vggish_features(mp3_file)
