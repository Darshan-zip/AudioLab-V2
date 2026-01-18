
import React from "react";
import { FileMusic, Mic, Sliders, Headphones } from "lucide-react";

interface Project {
  id: string;
  title: string;
  date: string;
  type: "lyrics" | "equalizer" | "remover" | "workspace";
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const getIcon = () => {
    switch (project.type) {
      case "lyrics":
        return <Mic className="h-4 w-4 text-blue-500" />;
      case "equalizer":
        return <Sliders className="h-4 w-4 text-purple-500" />;
      case "remover":
        return <FileMusic className="h-4 w-4 text-red-500" />;
      case "workspace":
        return <Headphones className="h-4 w-4 text-green-500" />;
      default:
        return <FileMusic className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 hover:bg-sidebar-accent/50 rounded-md cursor-pointer transition-colors group">
      <div className="w-8 h-8 rounded-md bg-sidebar-accent/70 flex items-center justify-center">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-sidebar-foreground truncate">{project.title}</h4>
        <p className="text-xs text-sidebar-foreground/60">{project.date}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 rounded-md hover:bg-sidebar-accent">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sidebar-foreground/60">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
