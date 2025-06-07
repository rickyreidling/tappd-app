import React, { useState } from 'react';
import { MessagesList } from '@/components/MessagesList';
import { ChatScreen } from '@/components/ChatScreen';

interface MessagingAppProps {
  currentUserId: string;
  onBack: () => void;
  isProUser?: boolean;
  onShowUpgrade?: () => void;
}

export const MessagingApp: React.FC<MessagingAppProps> = ({ 
  currentUserId, 
  onBack, 
  isProUser = false,
  onShowUpgrade = () => {}
}) => {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  if (selectedConversation) {
    return (
      <div className="h-full">
        <ChatScreen
          conversationId={selectedConversation.id}
          currentUserId={currentUserId}
          recipientId={selectedConversation.other_user.id}
          recipientName={selectedConversation.other_user.name}
          recipientAvatar={selectedConversation.other_user.avatar}
          recipientDistance={selectedConversation.other_user.distance}
          onBack={() => setSelectedConversation(null)}
          onShowUpgrade={onShowUpgrade}
          isProUser={isProUser}
        />
      </div>
    );
  }

  return (
    <div className="h-full bg-white">
      <div className="border-b border-gray-200 p-4">
        <button 
          onClick={onBack}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          ← Back to Explore
        </button>
      </div>
      <MessagesList
        currentUserId={currentUserId}
        onSelectChat={setSelectedConversation}
      />
    </div>
  );
};