
import React, { useState } from "react";
import { Upload, RefreshCw, Download, PlayCircle, PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

const LyricsRemover = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processComplete, setProcessComplete] = useState(false);
  const [vocalReduction, setVocalReduction] = useState([75]);
  const [instrumentalPreservation, setInstrumentalPreservation] = useState([85]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setProcessComplete(false);
    }
  };

  const handleProcess = () => {
    if (!file) return;
    
    setProcessing(true);
    setProcessProgress(0);
    setProcessComplete(false);
    
    // Simulate processing with intervals
    const interval = setInterval(() => {
      setProcessProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setProcessComplete(true);
          return 100;
        }
        
        return newProgress;
      });
    }, 500);
  };

  const togglePlayPreview = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="animate-fade-in tool-card flex flex-col h-full">
      <h2 className="text-xl font-medium mb-4">Lyrics Remover</h2>
      
      <div className="flex-1">
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Upload Audio File</h3>
          
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
            file ? "border-primary" : "border-border"
          }`}>
            {!file ? (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your audio file here, or click to browse
                </p>
                <Button size="sm" variant="secondary" className="relative">
                  Browse Files
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="audio/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"></path>
                    <path d="M14 2v6h6"></path>
                    <circle cx="8" cy="16" r="6"></circle>
                    <path d="M9.5 17.5 8 16.25 8 13"></path>
                  </svg>
                </div>
                <p className="font-medium mb-1">{file.name}</p>
                <p className="text-xs text-muted-foreground mb-3">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.split("/")[1]}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="relative"
                  onClick={() => setFile(null)}
                >
                  Change File
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {file && (
          <>
            <div className="space-y-6 mb-6">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium">Vocal Reduction</label>
                  <span className="text-xs text-muted-foreground">{vocalReduction[0]}%</span>
                </div>
                <Slider
                  value={vocalReduction}
                  max={100}
                  step={1}
                  onValueChange={setVocalReduction}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Higher values will remove more of the vocal content
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium">Instrumental Preservation</label>
                  <span className="text-xs text-muted-foreground">{instrumentalPreservation[0]}%</span>
                </div>
                <Slider
                  value={instrumentalPreservation}
                  max={100}
                  step={1}
                  onValueChange={setInstrumentalPreservation}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Higher values will preserve more of the instrumental content
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleProcess}
              disabled={processing}
              className="w-full mb-4"
            >
              {processing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : processComplete ? (
                "Process Again"
              ) : (
                "Remove Lyrics"
              )}
            </Button>
            
            {processing && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1.5">
                  <span>Processing...</span>
                  <span>{processProgress}%</span>
                </div>
                <Progress value={processProgress} />
              </div>
            )}
            
            {processComplete && (
              <div className="mt-6 border rounded-lg p-4 bg-secondary/30">
                <h3 className="text-sm font-medium mb-3">Result</h3>
                
                <div className="h-16 bg-secondary rounded-md mb-3 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={togglePlayPreview}
                      className="z-10"
                    >
                      {isPlaying ? (
                        <PauseCircle className="h-8 w-8 text-primary" />
                      ) : (
                        <PlayCircle className="h-8 w-8 text-primary" />
                      )}
                    </button>
                  </div>
                  
                  <div className="absolute inset-x-0 bottom-0 h-full flex items-end">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="equalizer-bar mx-[1px]"
                        style={{
                          height: `${isPlaying ? Math.random() * 70 + 10 : 2}%`,
                          opacity: isPlaying ? 1 : 0.3,
                          "--i": i,
                          "--speed": "0.5s",
                        } as React.CSSProperties}
                      ></div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Instrumental
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LyricsRemover;
