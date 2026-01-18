
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LyricsGeneratorPage from "./pages/LyricsGenerator";
import EqualizerPage from "./pages/Equalizer";
import LyricsRemoverPage from "./pages/LyricsRemover";
import WorkspacePage from "./pages/Workspace";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lyrics-generator" element={<LyricsGeneratorPage />} />
          <Route path="/equalizer" element={<EqualizerPage />} />
          <Route path="/lyrics-remover" element={<LyricsRemoverPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
