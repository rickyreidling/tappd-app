import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Image, MoreVertical, Flag, Block } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Message, User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

interface EnhancedMessagingProps {
  currentUser: User;
  otherUser: User;
  messages: Message[];
  onSendMessage: (content: string, type: 'text' | 'image') => void;
  onBlockUser?: () => void;
  onReportUser?: () => void;
}

const EnhancedMessaging: React.FC<EnhancedMessagingProps> = ({
  currentUser,
  otherUser,
  messages,
  onSendMessage,
  onBlockUser,
  onReportUser
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim(), 'text');
      setNewMessage('');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate image upload
      const imageUrl = URL.createObjectURL(file);
      onSendMessage(imageUrl, 'image');
      toast({
        title: "Image sent!",
        description: "Your image has been shared.",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{otherUser.name}</h3>
            <p className="text-sm text-gray-500">
              {otherUser.isOnline ? 'Online now' : `Last seen ${otherUser.lastSeen}`}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onReportUser}>
              <Flag className="w-4 h-4 mr-2" />
              Report User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBlockUser} className="text-red-600">
              <Block className="w-4 h-4 mr-2" />
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUser.id;
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isCurrentUser
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {message.type === 'image' ? (
                  <img
                    src={message.imageUrl}
                    alt="Shared image"
                    className="rounded-lg max-w-full h-auto"
                  />
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <div className={`flex items-center justify-between mt-1 text-xs ${
                  isCurrentUser ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {isCurrentUser && (
                    <span className="ml-2">
                      {message.read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Typing Indicator */}
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="p-2"
          >
            <Image className="w-4 h-4" />
          </Button>
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </Card>
  );
};

export default EnhancedMessaging;