
import React from "react";

interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
  };
  preview: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface MessageCardProps {
  message: Message;
  onClick: () => void;
}

const MessageCard = ({ message, onClick }: MessageCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={`p-3 border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
        !message.read ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex gap-3">
        <img 
          src={message.sender.avatar} 
          alt={message.sender.name} 
          className="h-10 w-10 rounded-full"
        />
        <div className="min-w-0 flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className={`text-sm ${!message.read ? "font-medium" : ""}`}>
              {message.sender.name}
            </h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">
              {message.timestamp}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {message.preview}
          </p>
        </div>
        {!message.read && (
          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
        )}
      </div>
    </div>
  );
};

export default MessageCard;
