import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/contexts/AppContext';
import { mockUsers } from '@/data/mockUsers';

interface MessagesListProps {
  currentUserId: string;
  onSelectChat: (user: any) => void;
}

export const MessagesList: React.FC<MessagesListProps> = ({ currentUserId, onSelectChat }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [lastMessages, setLastMessages] = useState<{[key: string]: any}>({});
  const { mutualTaps, tapBacks, isPremium } = useAppContext();

  useEffect(() => {
    loadConversations();
    loadLastMessages();
  }, [currentUserId, mutualTaps, tapBacks]);

  const loadConversations = async () => {
    const chatableUserIds = new Set([...mutualTaps, ...tapBacks]);
    
    if (isPremium) {
      mockUsers.forEach(user => chatableUserIds.add(user.id));
    }

    const chatableUsers = mockUsers.filter(user => 
      chatableUserIds.has(user.id) && user.id !== currentUserId
    );

    setConversations(chatableUsers);
  };

  const loadLastMessages = async () => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      const messageMap: {[key: string]: any} = {};
      data?.forEach(msg => {
        const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
        if (!messageMap[otherUserId]) {
          messageMap[otherUserId] = msg;
        }
      });
      
      setLastMessages(messageMap);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
  };

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Chats Yet</h3>
        <p className="text-gray-500 mb-4">
          Start tapping and get mutual taps to unlock conversations!
        </p>
        {!isPremium && (
          <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <Crown className="h-3 w-3 mr-1" />
            PRO users can message anyone
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
        <div className="space-y-2">
          {conversations.map((user) => {
            const lastMsg = lastMessages[user.id];
            return (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full p-4 h-auto justify-start hover:bg-gray-50"
                onClick={() => onSelectChat({...user, isOnline: Math.random() > 0.5})}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    {Math.random() > 0.5 && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <span className="text-xs text-gray-500">
                        {lastMsg ? formatTime(lastMsg.created_at) : 'now'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {lastMsg ? 
                        (lastMsg.message_type === 'tap' ? '🔥 Sent a tap!' : lastMsg.content) : 
                        'Tap to start chatting!'
                      }
                    </p>
                  </div>
                  
                  {user.premium && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};