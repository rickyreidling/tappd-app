import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MessageNotificationProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  message: string;
  onReply: () => void;
  onClose: () => void;
}

export const MessageNotification: React.FC<MessageNotificationProps> = ({
  user,
  message,
  onReply,
  onClose
}) => {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg p-4 mx-auto max-w-sm">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-white text-purple-600">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">👀</span>
              <span className="font-semibold text-sm">You've been Tappd!</span>
            </div>
            <p className="text-sm opacity-90 truncate">
              Someone couldn't resist...
            </p>
            <p className="text-xs opacity-75 mt-1 truncate">
              "{message}"
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          onClick={onReply}
          className="w-full mt-3 bg-white text-purple-600 hover:bg-gray-100 font-medium"
          size="sm"
        >
          Tap to Reply
        </Button>
      </div>
    </div>
  );
};