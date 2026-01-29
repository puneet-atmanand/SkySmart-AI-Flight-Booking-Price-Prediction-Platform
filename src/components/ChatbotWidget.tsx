import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

export default function ChatbotWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenFullChat = () => {
    setIsOpen(false);
    navigate('/chat');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg bg-accent hover:bg-accent/90"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <Card className="w-80 sm:w-96 shadow-2xl">
          <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 h-64 overflow-y-auto bg-secondary/20">
            <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
              <p className="text-foreground">
                Hi! I'm your SkySmart AI assistant. I can help you find flights, check prices, and answer travel questions.
              </p>
              <p className="text-muted-foreground mt-2">
                Try asking: "Find me cheap flights to Paris"
              </p>
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button size="icon" className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={handleOpenFullChat}
              variant="link"
              className="w-full mt-2 p-0 h-auto text-primary"
            >
              Open full chat →
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
