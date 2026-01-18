
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MicIcon, SlidersIcon, FileMusic, Headphones, PieChart, GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Inbox from "../components/layout/Inbox";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [inboxOpen, setInboxOpen] = useState(false);
  
  const toggleInbox = () => {
    setInboxOpen(!inboxOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header 
          toggleInbox={toggleInbox} 
          inboxOpen={inboxOpen} 
          notificationCount={3} 
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Hero section */}
            <div className="mb-10 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl shadow-sm">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0">
                  <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Welcome to AudioLab Studio</h1>
                  <p className="text-muted-foreground text-lg mb-4">
                    Your all-in-one music production platform. Create lyrics, adjust your tracks, and manage your musical workspace with professional tools.
                  </p>
                  <Button size="lg" className="group">
                    Explore all features <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute inset-8 bg-gradient-to-r from-primary/40 to-purple-500/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Headphones className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main features section */}
            <h2 className="text-2xl font-semibold mb-4">Audio Production Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <Card className="hover:shadow-md transition-shadow group hover:border-primary/50">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                      <MicIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Lyrics Generator</h2>
                    <p className="text-muted-foreground mb-6">
                      Create original lyrics for your songs with our AI-powered generator.
                    </p>
                    <Button asChild className="w-full group">
                      <Link to="/lyrics-generator">
                        Get Started <MicIcon className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow group hover:border-primary/50">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                      <SlidersIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Equalizer</h2>
                    <p className="text-muted-foreground mb-6">
                      Fine-tune your audio with our professional-grade equalizer.
                    </p>
                    <Button asChild className="w-full group">
                      <Link to="/equalizer">
                        Adjust Audio <SlidersIcon className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow group hover:border-primary/50">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                      <FileMusic className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Lyrics Remover</h2>
                    <p className="text-muted-foreground mb-6">
                      Extract instrumentals by removing vocals from any track.
                    </p>
                    <Button asChild className="w-full group">
                      <Link to="/lyrics-remover">
                        Remove Lyrics <FileMusic className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow group hover:border-primary/50">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                      <Headphones className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Workspace</h2>
                    <p className="text-muted-foreground mb-6">
                      Your creative hub to manage all your music production projects.
                    </p>
                    <Button asChild className="w-full group">
                      <Link to="/workspace">
                        Open Workspace <Headphones className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional features section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <PieChart className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Analytics</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Track your music's performance and get insights on listener engagement.
                </p>
                <Button variant="ghost" size="sm" className="mt-4 w-full justify-between">
                  Learn more <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Tutorials</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Learn music production techniques with our comprehensive guides.
                </p>
                <Button variant="ghost" size="sm" className="mt-4 w-full justify-between">
                  View tutorials <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">AI Assistant</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Get AI-powered recommendations to enhance your music production.
                </p>
                <Button variant="ghost" size="sm" className="mt-4 w-full justify-between">
                  Try now <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats section */}
            <div className="bg-card p-6 rounded-lg border shadow-sm mb-10">
              <h3 className="text-xl font-semibold mb-4 text-center">AudioLab Community</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">10k+</p>
                  <p className="text-muted-foreground">Musicians</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">50k+</p>
                  <p className="text-muted-foreground">Projects Created</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">98%</p>
                  <p className="text-muted-foreground">Satisfaction Rate</p>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">Ready to create your next hit?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of musicians who use AudioLab Studio to produce professional tracks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary">
                  Get Started for Free
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {inboxOpen && (
        <Inbox onClose={() => setInboxOpen(false)} />
      )}
    </div>
  );
};

export default Index;
