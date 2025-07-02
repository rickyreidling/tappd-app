import React, { useEffect, useState } from 'react';
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

export const MessagesList: React.FC<MessagesListProps> = ({
  currentUserId,
  onSelectChat
}) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [lastMessages, setLastMessages] = useState<{ [key: string]: any }>({});
  const { mutualTaps, tapBacks, isPremium } = useAppContext();

  useEffect(() => {
    loadLastMessages();
  }, [currentUserId, mutualTaps, tapBacks]);

  const loadLastMessages = async () => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      const msgMap: { [key: string]: any } = {};
      const userSet = new Set<string>();

      data?.forEach(msg => {
        const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
        if (!msgMap[otherUserId]) msgMap[otherUserId] = msg;
        userSet.add(otherUserId);
      });

      const chatableUsers = mockUsers.filter(user => userSet.has(user.id));
      setConversations(chatableUsers);
      setLastMessages(msgMap);
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
      <div className="flex flex-col items-center mt-12">
        <MessageCircle className="h-16 w-16 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-600 mt-2">
          No messages yet
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Start tapping and get mutual taps to unlock chat!
        </p>
        {!isPremium && (
          <Badge variant="outline" className="bg-gradient-to-r from-pink-300 to-yellow-300 mt-3">
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
        <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        <div className="space-y-2 mt-2">
          {conversations.map((user) => {
            const lastMsg = lastMessages[user.id];
            if (!lastMsg) return null;

            return (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full p-4 justify-start text-left"
                onClick={() => onSelectChat(user)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="relative">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                    {Math.random() > 0.5 && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">
                      {user.name}
                      <span className="ml-2 text-xs text-gray-400">
                        {formatTime(lastMsg.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {lastMsg.message_type === 'text' ? lastMsg.content : '📷 Photo'}
                    </p>
                  </div>
                  {user.premium && (
                    <Crown className="h-4 w-4 text-yellow-500 ml-2" />
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
