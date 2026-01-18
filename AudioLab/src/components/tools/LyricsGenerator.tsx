
import React, { useState } from "react";
import { Copy, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const LyricsGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [mood, setMood] = useState("Happy");
  const [lyrics, setLyrics] = useState("");
  const [generating, setGenerating] = useState(false);
  const [creativity, setCreativity] = useState([50]);

  // Mock function to generate lyrics
  const generateLyrics = () => {
    if (!prompt) return;
    
    setGenerating(true);
    setLyrics("");
    
    // Simulating API call with timeout
    setTimeout(() => {
      const mockLyrics = `Verse 1:
Sunlight streaming through my window
Another day to find my way
The city's calling out my name
In ways I never thought it would

Chorus:
And I'm rising, rising like the morning tide
No hiding, hiding what I feel inside
This moment, this moment is all we have
So I'm living, I'm living at last

Verse 2:
Memories fade like shadows on the wall
But your voice still echoes in my mind
The streets we walked are changing now
But the stars above remain the same`;

      setLyrics(mockLyrics);
      setGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lyrics);
    // Would add toast notification here
  };

  return (
    <div className="animate-fade-in tool-card flex flex-col h-full">
      <h2 className="text-xl font-medium mb-4">Lyrics Generator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt">What do you want to write about?</Label>
            <Textarea
              id="prompt"
              placeholder="E.g., A song about finding yourself in a new city"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1.5 resize-none h-32"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="genre">Genre</Label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full mt-1.5 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option>Pop</option>
                <option>Rock</option>
                <option>Hip Hop</option>
                <option>R&B</option>
                <option>Country</option>
                <option>Electronic</option>
                <option>Jazz</option>
                <option>Folk</option>
              </select>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="mood">Mood</Label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full mt-1.5 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option>Happy</option>
                <option>Sad</option>
                <option>Energetic</option>
                <option>Romantic</option>
                <option>Angry</option>
                <option>Nostalgic</option>
                <option>Hopeful</option>
                <option>Melancholic</option>
              </select>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label htmlFor="creativity">Creativity Level</Label>
              <span className="text-sm text-muted-foreground">{creativity[0]}%</span>
            </div>
            <Slider
              id="creativity"
              min={0}
              max={100}
              step={1}
              value={creativity}
              onValueChange={setCreativity}
            />
          </div>
          
          <Button 
            onClick={generateLyrics} 
            disabled={!prompt || generating} 
            className="w-full"
          >
            {generating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 
                Generating...
              </>
            ) : (
              "Generate Lyrics"
            )}
          </Button>
        </div>
        
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <Label>Generated Lyrics</Label>
            {lyrics && (
              <div className="flex gap-1">
                <button 
                  onClick={copyToClipboard}
                  className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className={`flex-1 border border-input rounded-md p-3 bg-muted/30 overflow-y-auto whitespace-pre-line ${
            generating ? "animate-pulse" : ""
          }`}>
            {lyrics || "Your generated lyrics will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricsGenerator;
