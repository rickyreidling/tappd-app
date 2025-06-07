import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, ArrowLeft } from 'lucide-react';
import { Message } from '@/types/profile';

interface ChatWindowProps {
  recipientId: string;
  recipientName: string;
  recipientPhoto?: string;
  onBack: () => void;
  isPremium: boolean;
  messagesSentToday: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  recipientId,
  recipientName,
  recipientPhoto,
  onBack,
  isPremium,
  messagesSentToday
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const canSendMessage = isPremium || messagesSentToday < 3;

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !canSendMessage) return;
    
    setLoading(true);
    
    // Mock message sending - replace with actual Supabase call
    const message: Message = {
      id: Date.now().toString(),
      sender_id: 'current-user',
      receiver_id: recipientId,
      content: newMessage,
      created_at: new Date().toISOString(),
      read: false
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setLoading(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center space-y-0 pb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={recipientPhoto} />
          <AvatarFallback>{recipientName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{recipientName}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Start your conversation with {recipientName}
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === 'current-user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender_id === 'current-user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
        </div>
        
        {!canSendMessage && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Daily message limit reached
                </p>
                <p className="text-xs text-yellow-600">
                  Upgrade to Premium for unlimited messaging
                </p>
              </div>
              <Badge variant="outline">3/3 used</Badge>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={canSendMessage ? "Type a message..." : "Upgrade for unlimited messages"}
            disabled={!canSendMessage || loading}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!canSendMessage || !newMessage.trim() || loading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;