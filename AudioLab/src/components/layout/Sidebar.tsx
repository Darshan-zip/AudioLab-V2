
import React, { useState } from "react";
import { 
  ChevronLeft, ChevronRight, Home, Music, MusicIcon, History, FolderOpen, 
  PlusCircle, Settings, Headphones 
} from "lucide-react";
import ProjectCard from "../ui/ProjectCard";

interface Project {
  id: string;
  title: string;
  date: string;
  type: "lyrics" | "equalizer" | "remover" | "workspace";
}

const mockProjects: Project[] = [
  { id: "1", title: "Summer Vibes", date: "2 hours ago", type: "workspace" },
  { id: "2", title: "New Rap Lyrics", date: "Yesterday", type: "lyrics" },
  { id: "3", title: "Vocal EQ Settings", date: "2 days ago", type: "equalizer" },
  { id: "4", title: "Instrumental Extract", date: "4 days ago", type: "remover" },
  { id: "5", title: "Beat Production", date: "1 week ago", type: "workspace" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("recent");

  return (
    <div 
      className={`h-screen bg-sidebar flex flex-col transition-all duration-300 ease-in-out border-r border-sidebar-border relative ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="absolute -right-3 top-20">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-all duration-200"
        >
          {collapsed ? 
            <ChevronRight className="h-4 w-4 text-sidebar-primary" /> : 
            <ChevronLeft className="h-4 w-4 text-sidebar-primary" />
          }
        </button>
      </div>
      
      <div className="flex items-center justify-center gap-2 p-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="font-semibold text-xl text-white">AudioLab</span>
        )}
        {collapsed ? (
          <MusicIcon className="h-8 w-8 text-primary" />
        ) : (
          <MusicIcon className="h-6 w-6 text-primary" />
        )}
      </div>
      
      <div className="flex flex-col gap-1 p-3">
        <a href="/" className="nav-link-active">
          <Home className={`h-5 w-5 ${collapsed ? "mx-auto" : ""}`} />
          {!collapsed && <span>Home</span>}
        </a>
        <a href="#tools" className="nav-link">
          <Music className={`h-5 w-5 ${collapsed ? "mx-auto" : ""}`} />
          {!collapsed && <span>Tools</span>}
        </a>
        <a href="#workspace" className="nav-link">
          <Headphones className={`h-5 w-5 ${collapsed ? "mx-auto" : ""}`} />
          {!collapsed && <span>Workspace</span>}
        </a>
      </div>
      
      {!collapsed && (
        <div className="px-3 pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sidebar-foreground">Projects</h3>
            <div className="flex gap-1">
              <button 
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  activeTab === "recent" 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                }`}
                onClick={() => setActiveTab("recent")}
              >
                Recent
              </button>
              <button 
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  activeTab === "all" 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={`flex-1 overflow-y-auto ${collapsed ? "px-0" : "px-3"}`}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-4 mt-4">
            <History className="h-5 w-5 text-sidebar-foreground/70" />
            <FolderOpen className="h-5 w-5 text-sidebar-foreground/70" />
          </div>
        ) : (
          <div className="space-y-2 pr-1">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
      
      <div className="p-3 mt-auto border-t border-sidebar-border">
        <button className="w-full flex items-center justify-center gap-2 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-md py-2 transition-colors">
          <PlusCircle className="h-4 w-4" />
          {!collapsed && <span>New Project</span>}
        </button>
        
        {!collapsed && (
          <button className="w-full flex items-center justify-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground mt-2 py-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
