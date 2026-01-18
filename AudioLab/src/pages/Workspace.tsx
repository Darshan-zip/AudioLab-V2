
import React, { useEffect } from "react";

const WorkspacePage = () => {
  useEffect(() => {
    // Load your custom HTML content
    const iframe = document.createElement("iframe");
    iframe.src = "http://localhost:8081"; // Path to your custom HTML file
    iframe.style.width = "100%";
    iframe.style.height = "calc(100vh - 70px)"; // Adjust height as needed
    iframe.style.border = "none";
    
    const container = document.getElementById("workspace-container");
    if (container) {
      container.appendChild(iframe);
    }

    return () => {
      // Clean up on unmount
      if (container && container.contains(iframe)) {
        container.removeChild(iframe);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Workspace</h1>
        </div>
        <div id="workspace-container" className="flex-1"></div>
      </div>
    </div>
  );
};

export default WorkspacePage;
