import React from 'react';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
  timestamp: string;
  messageType?: 'text' | 'tap';
  showReadReceipt?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  isOwn,
  timestamp,
  messageType = 'text',
  showReadReceipt = false
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isTapMessage = messageType === 'tap';

  return (
    <div className={cn(
      "flex flex-col animate-in slide-in-from-bottom-2 duration-300",
      isOwn ? "items-end" : "items-start"
    )}>
      <div className={cn(
        "max-w-[80%] px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 hover:scale-105",
        isOwn
          ? isTapMessage
            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
            : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          : "bg-white border border-gray-200 text-gray-800",
        isTapMessage && "animate-pulse"
      )}>
        <p className="text-sm leading-relaxed">
          {isTapMessage ? (
            <span className="flex items-center gap-1">
              🔥 {content}
            </span>
          ) : (
            content
          )}
        </p>
      </div>
      
      <div className={cn(
        "flex items-center gap-1 mt-1 text-xs text-gray-500",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}>
        <span>{formatTime(timestamp)}</span>
        {showReadReceipt && isOwn && (
          <div className="flex items-center gap-1 text-gray-400">
            <Eye className="h-3 w-3" />
            <span>Seen</span>
          </div>
        )}
      </div>
    </div>
  );
};