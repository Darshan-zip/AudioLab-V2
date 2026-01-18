
import React, { useState } from "react";
import { X, Edit, Archive, Send } from "lucide-react";
import MessageCard from "../ui/MessageCard";

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

const mockMessages: Message[] = [
  {
    id: "1",
    sender: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?img=32"
    },
    preview: "I loved your new track! Would you be interested in a collaboration on a new project?",
    content: "Hey Alex, I've been listening to your latest release and I'm really impressed with your production style. I think our sounds would blend well together. I'm working on a new EP and would love to have you onboard for one of the tracks. Let me know if you'd be interested in discussing this further.",
    timestamp: "10 min ago",
    read: false
  },
  {
    id: "2",
    sender: {
      name: "Music Festival Team",
      avatar: "https://i.pravatar.cc/150?img=68"
    },
    preview: "Your submission for the Summer Music Festival has been received.",
    content: "Dear Alex, Thank you for submitting your music to the Summer Music Festival 2023. We've received your tracks and they are currently under review by our selection committee. We'll get back to you with the results within the next two weeks. Best regards, The Festival Team",
    timestamp: "2 hours ago",
    read: false
  },
  {
    id: "3",
    sender: {
      name: "Thomas Wright",
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    preview: "Feedback on your latest track 'Midnight Waves'",
    content: "Hey there! Just listened to 'Midnight Waves' and wanted to share some thoughts. The bass line is exceptional and the overall mix sounds very clean. I think you could push the vocals a bit more in the chorus to give it that extra punch. Let me know if you want me to share some EQ settings that might help. Cheers, Thomas",
    timestamp: "Yesterday",
    read: true
  }
];

interface InboxProps {
  onClose: () => void;
}

const Inbox = ({ onClose }: InboxProps) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [composing, setComposing] = useState(false);
  const [newMessage, setNewMessage] = useState({ recipient: "", subject: "", content: "" });

  const handleMessageSelect = (message: Message) => {
    setSelectedMessage(message);
    setComposing(false);
  };

  const handleComposeClick = () => {
    setSelectedMessage(null);
    setComposing(true);
  };

  const handleSend = () => {
    // Logic to send message would go here
    setComposing(false);
    setNewMessage({ recipient: "", subject: "", content: "" });
    // Add success notification
  };

  return (
    <div className="h-full border-l border-border bg-white w-80 sm:w-96 flex flex-col animate-slide-in-right shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-medium text-lg">Inbox</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {!selectedMessage && !composing && (
        <>
          <div className="p-3 border-b border-border">
            <button 
              onClick={handleComposeClick}
              className="w-full bg-primary text-white rounded-md py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-primary/90 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>New Message</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {mockMessages.map((message) => (
              <MessageCard 
                key={message.id} 
                message={message} 
                onClick={() => handleMessageSelect(message)} 
              />
            ))}
          </div>
        </>
      )}

      {selectedMessage && !composing && (
        <div className="flex flex-col h-full animate-fade-in">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={selectedMessage.sender.avatar} 
                alt={selectedMessage.sender.name} 
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h3 className="font-medium">{selectedMessage.sender.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedMessage.timestamp}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-md hover:bg-secondary transition-colors">
                <Archive className="h-4 w-4 text-muted-foreground" />
              </button>
              <button 
                className="p-2 rounded-md hover:bg-secondary transition-colors"
                onClick={() => {
                  setComposing(true);
                  setNewMessage({
                    recipient: selectedMessage.sender.name,
                    subject: `Re: ${selectedMessage.preview.substring(0, 30)}...`,
                    content: ""
                  });
                }}
              >
                <Send className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <p className="whitespace-pre-line text-sm">{selectedMessage.content}</p>
          </div>
        </div>
      )}

      {composing && (
        <div className="flex flex-col h-full animate-fade-in">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium mb-3">New Message</h3>
            <input
              type="text"
              placeholder="Recipient"
              value={newMessage.recipient}
              onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
              className="w-full border-b border-border p-2 mb-2 text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="Subject"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
              className="w-full border-b border-border p-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="flex-1 p-4">
            <textarea
              placeholder="Write your message here..."
              value={newMessage.content}
              onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
              className="w-full h-full resize-none border-none focus:outline-none text-sm"
            />
          </div>
          
          <div className="p-4 border-t border-border">
            <div className="flex justify-between">
              <button 
                onClick={() => setComposing(false)}
                className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSend}
                className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
