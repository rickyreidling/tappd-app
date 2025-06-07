import React, { useState } from 'react';
import { Search, MessageCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ChatScreen from './ChatScreen';

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: Date;
    isRead: boolean;
  };
  unreadCount: number;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Alex',
      avatar: '/placeholder.svg',
      isOnline: true
    },
    lastMessage: {
      text: 'Hey! How are you doing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false
    },
    unreadCount: 2
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Jordan',
      avatar: '/placeholder.svg',
      isOnline: false
    },
    lastMessage: {
      text: 'Thanks for the chat!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true
    },
    unreadCount: 0
  }
];

const MessagesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations] = useState<Conversation[]>(mockConversations);

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  if (selectedConversation) {
    const conversation = conversations.find(c => c.id === selectedConversation);
    if (conversation) {
      return (
        <ChatScreen
          user={conversation.user}
          onBack={() => setSelectedConversation(null)}
        />
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Badge variant="secondary">{conversations.length}</Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchQuery ? 'No conversations found' : 'No messages yet'}
              </h3>
              <p className="text-gray-500 text-center">
                {searchQuery 
                  ? 'Try a different search term'
                  : 'Start chatting by tapping on profiles in Explore'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredConversations.map((conversation) => (
            <Card 
              key={conversation.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.user.avatar} />
                      <AvatarFallback>
                        {conversation.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.user.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-purple-500 text-white text-xs px-2 py-1">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm truncate ${
                      conversation.lastMessage.isRead ? 'text-gray-500' : 'text-gray-900 font-medium'
                    }`}>
                      {conversation.lastMessage.text}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesScreen;