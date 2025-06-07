import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      <span>typing</span>
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};