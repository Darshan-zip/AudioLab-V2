
import React, { useState } from "react";
import { Bell, MessageCircle, Search, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  toggleInbox: () => void;
  inboxOpen: boolean;
  notificationCount: number;
}

const Header = ({ toggleInbox, inboxOpen, notificationCount }: HeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6 animate-fade-in">
      {searchOpen ? (
        <div className="flex items-center gap-2 flex-1 max-w-xl animate-fade-in">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects, tools, or songs..."
            className="flex-1 border-none outline-none text-foreground"
            autoFocus
          />
          <button onClick={() => setSearchOpen(false)}>
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-md hover:bg-secondary transition-colors"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-xl font-medium ml-2">AudioLab Studio</h1>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-md hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center animate-scale-in">
              {notificationCount}
            </span>
          )}
        </button>
        
        <button 
          className={`relative p-2 rounded-md transition-colors ${
            inboxOpen ? "bg-secondary" : "hover:bg-secondary"
          }`}
          onClick={toggleInbox}
        >
          <MessageCircle className={`h-5 w-5 ${inboxOpen ? "text-primary" : "text-muted-foreground"}`} />
          <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center animate-scale-in">
            3
          </span>
        </button>
        
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">Anirudh Ravichandran</div>
            <div className="text-xs text-muted-foreground">Premium</div>
          </div>
          
          <Avatar className="h-9 w-9 transition-transform hover:scale-105">
            <AvatarImage src="C:\Users\Darsh\Downloads\SEP_AI\melody-workspace-main\src\components\layout\WhatsApp Image 2025-04-07 at 10.05.58.jpeg" />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
