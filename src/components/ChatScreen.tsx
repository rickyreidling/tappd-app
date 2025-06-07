import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Image, Smile, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  type: 'text' | 'image';
  imageUrl?: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface ChatScreenProps {
  user: User;
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ user, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! How are you doing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isOwn: false,
      type: 'text'
    },
    {
      id: '2',
      text: 'Hi! I\'m doing great, thanks for asking! How about you?',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      isOwn: true,
      type: 'text'
    },
    {
      id: '3',
      text: 'Pretty good! Love your profile pics btw 😊',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isOwn: false,
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date(),
        isOwn: true,
        type: 'text'
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate typing indicator and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          'That\'s awesome!',
          'Tell me more about that',
          'Interesting! 🤔',
          'I totally agree',
          'Haha, that\'s funny!'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          timestamp: new Date(),
          isOwn: false,
          type: 'text'
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-xs text-gray-500">
              {user.isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md`}>
              <div
                className={`px-4 py-2 rounded-2xl ${
                  message.isOwn
                    ? 'bg-purple-500 text-white rounded-br-md'
                    : 'bg-white text-gray-900 rounded-bl-md border'
                }`}
              >
                {message.type === 'text' ? (
                  <p>{message.text}</p>
                ) : (
                  <img 
                    src={message.imageUrl} 
                    alt="Shared image" 
                    className="rounded-lg max-w-full h-auto"
                  />
                )}
              </div>
              <p className={`text-xs text-gray-500 mt-1 ${
                message.isOwn ? 'text-right' : 'text-left'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md">
              <div className="bg-white text-gray-900 rounded-2xl rounded-bl-md border px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {user.name} is typing...
              </p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Image className="w-5 h-5 text-gray-500" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-10"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;