import React, { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TypingIndicator } from '@/components/TypingIndicator';

interface ChatHeaderProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    distance?: number;
    isOnline?: boolean;
  };
  onBack: () => void;
  isTyping?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user, onBack, isTyping }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 h-4 w-4 border-2 border-white rounded-full ${
            user.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-purple-700">{user.name}</h3>

          {isTyping ? (
            <TypingIndicator />
          ) : (
            user.distance && (
              <p className="text-sm text-gray-500">{user.distance} miles away</p>
            )
          )}
        </div>
      </div>
      
      <Button variant="ghost" size="sm" className="p-2">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
};