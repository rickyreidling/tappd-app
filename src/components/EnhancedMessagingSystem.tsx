import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppContext } from '@/contexts/AppContext';
import { mockUsers } from '@/data/mockUsers';
import { ArrowLeft, Send, MoreVertical, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

interface EnhancedMessagingSystemProps {
  selectedUserId?: string;
  onBack?: () => void;
}

export const EnhancedMessagingSystem: React.FC<EnhancedMessagingSystemProps> = ({
  selectedUserId,
  onBack
}) => {
  const { currentUser, isPremium } = useAppContext();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeConversation, setActiveConversation] = useState<string | null>(selectedUserId || null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Mock conversations data
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participants: [currentUser?.id || 'user1', 'user2'],
        lastMessage: {
          id: 'm1',
          senderId: 'user2',
          receiverId: currentUser?.id || 'user1',
          content: 'Hey! How are you doing?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: false
        },
        unreadCount: 2
      },
      {
        id: '2', 
        participants: [currentUser?.id || 'user1', 'user3'],
        lastMessage: {
          id: 'm2',
          senderId: currentUser?.id || 'user1',
          receiverId: 'user3',
          content: 'Thanks for the chat!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: true
        },
        unreadCount: 0
      },
      {
        id: '3',
        participants: [currentUser?.id || 'user1', 'user4'],
        lastMessage: {
          id: 'm3',
          senderId: 'user4',
          receiverId: currentUser?.id || 'user1',
          content: 'Would love to meet up sometime!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
          read: false
        },
        unreadCount: 1
      }
    ];
    setConversations(mockConversations);
  }, [currentUser]);

  // Mock messages for active conversation
  useEffect(() => {
    if (activeConversation) {
      const mockMessages: Message[] = [
        {
          id: 'm1',
          senderId: activeConversation,
          receiverId: currentUser?.id || 'user1',
          content: 'Hey! How are you doing?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: true
        },
        {
          id: 'm2',
          senderId: activeConversation,
          receiverId: currentUser?.id || 'user1', 
          content: 'Would love to chat more!',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          read: false
        },
        {
          id: 'm3',
          senderId: currentUser?.id || 'user1',
          receiverId: activeConversation,
          content: 'Sure! I\'d love to chat too',
          timestamp: new Date(Date.now() - 1000 * 60 * 20),
          read: true
        }
      ];
      setMessages(mockMessages);
    }
  }, [activeConversation, currentUser]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    // Check if free user has reached message limit
    if (!isPremium && messages.filter(m => m.senderId === currentUser?.id).length >= 3) {
      setShowUpgradePrompt(true);
      return;
    }
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser?.id || 'user1',
      receiverId: activeConversation,
      content: newMessage,
      timestamp: new Date(),
      read: false
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast({ title: "Message sent!" });
  };

  const getOtherUser = (conversation: Conversation) => {
    const otherUserId = conversation.participants.find(p => p !== currentUser?.id);
    return mockUsers.find(u => u.id === otherUserId);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const UpgradePrompt = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center space-y-4">
          <Crown className="w-12 h-12 text-yellow-500 mx-auto" />
          <h3 className="text-xl font-bold">Message Limit Reached</h3>
          <p className="text-gray-600">
            Free users can send 3 messages per conversation. Upgrade to PRO for unlimited messaging!
          </p>
          <div className="space-y-2">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to PRO
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowUpgradePrompt(false)}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (activeConversation) {
    const otherUser = mockUsers.find(u => u.id === activeConversation);
    const userMessages = messages.filter(m => m.senderId === currentUser?.id);
    const canSendMessage = isPremium || userMessages.length < 3;
    
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-white">
          <Button onClick={() => setActiveConversation(null)} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherUser?.avatar_url} />
            <AvatarFallback>{otherUser?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{otherUser?.name}</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
          {isPremium && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400">
              <Crown className="w-3 h-3 mr-1" />
              PRO
            </Badge>
          )}
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.senderId === currentUser?.id;
              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`text-xs mt-1 ${
                      isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                      {isOwn && <span className="ml-1">✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {!isPremium && userMessages.length >= 3 && (
              <div className="text-center py-4">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Message limit reached - Upgrade to PRO for unlimited messaging
                </Badge>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={canSendMessage ? "Type a message..." : "Upgrade to PRO to continue messaging"}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
              disabled={!canSendMessage}
            />
            <Button 
              onClick={handleSendMessage} 
              size="sm"
              disabled={!canSendMessage || !newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {!isPremium && (
            <p className="text-xs text-gray-500 mt-2">
              {userMessages.length}/3 messages sent (Free plan)
            </p>
          )}
        </div>
        
        {showUpgradePrompt && <UpgradePrompt />}
      </div>
    );
  }

  // Conversations List
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Messages</h2>
        {onBack && (
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {conversations.map((conversation) => {
          const otherUser = getOtherUser(conversation);
          if (!otherUser) return null;
          
          return (
            <Card 
              key={conversation.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveConversation(otherUser.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={otherUser.avatar_url} />
                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{otherUser.name}</h3>
                      <div className="flex items-center gap-2">
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-blue-500 text-white text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {conversations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No conversations yet</p>
          <p className="text-sm">Start chatting with someone from Explore!</p>
        </div>
      )}
    </div>
  );
};