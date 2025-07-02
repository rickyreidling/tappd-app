// MessagesScreen.tsx - Replace your entire MessagesScreen file with this
import React, { useSyncExternalStore } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';

const MessagesScreen = () => {
  // Subscribe function - listens for custom events
  const subscribe = React.useCallback((callback) => {
    const handleStorageChange = () => {
      console.log('🔄 MessagesScreen: Storage change detected');
      callback();
    };
    
    const handleCustomEvent = () => {
      console.log('🔄 MessagesScreen: Custom conversation event detected');
      callback();
    };

    // Listen for both storage events and custom events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('conversationUpdated', handleCustomEvent);
    window.addEventListener('localStorageUpdate', handleCustomEvent);

    // Return cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('conversationUpdated', handleCustomEvent);
      window.removeEventListener('localStorageUpdate', handleCustomEvent);
    };
  }, []);

  // Get snapshot function - reads current state from localStorage
  const getSnapshot = React.useCallback(() => {
    try {
      const stored = localStorage.getItem('conversations');
      const parsed = stored ? JSON.parse(stored) : {};
      console.log('📸 MessagesScreen: getSnapshot called, found', Object.keys(parsed).length, 'conversations');
      return JSON.stringify(parsed); // Return as string for stable comparison
    } catch (error) {
      console.error('❌ MessagesScreen: Error reading conversations:', error);
      return '{}';
    }
  }, []);

  // Server snapshot - for SSR (returns empty object)
  const getServerSnapshot = React.useCallback(() => {
    return '{}';
  }, []);

  // Use useSyncExternalStore to sync with localStorage
  const conversationsJson = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Helper function to format time
  const formatTime = (conversation) => {
    // Use timeDisplay if available (from new messages), otherwise generate from timestamp
    if (conversation.timeDisplay) {
      return conversation.timeDisplay;
    }
    
    try {
      const date = new Date(conversation.timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return '';
    }
  };

  // Helper function to format date
  const formatDate = (conversation) => {
    try {
      const date = new Date(conversation.timestamp);
      return date.toLocaleDateString('en-US', { 
        month: 'numeric', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Parse the JSON string back to object
  const { conversationList, count } = React.useMemo(() => {
    try {
      const conversations = JSON.parse(conversationsJson);
      const conversationList = Object.values(conversations);
      
      console.log('🎯 MessagesScreen: Rendering', conversationList.length, 'conversations');
      
      return {
        conversationList,
        count: conversationList.length
      };
    } catch (error) {
      console.error('❌ MessagesScreen: Error parsing conversations:', error);
      return {
        conversationList: [],
        count: 0
      };
    }
  }, [conversationsJson]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-white/70 text-sm">{count} conversations</p>
        </div>
      </div>



      {count === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No conversations yet</h3>
          <p className="text-white/70 mb-4">
            Start chatting with people from Explore to see conversations here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversationList
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer"
                onClick={() => {
                  console.log('📱 Clicked on conversation:', conversation.name);
                  if (window.openChatFromMessages) {
                    window.openChatFromMessages(conversation.id);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback className="bg-purple-500 text-white">
                      {conversation.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-white truncate">
                        {conversation.name}
                      </h3>
                      {/* UPDATED: Show both date and time */}
                      <div className="text-right text-white/60 text-xs ml-2 flex-shrink-0">
                        <div>{formatDate(conversation)}</div>
                        <div className="font-medium">{formatTime(conversation)}</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-white/80 truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-white/60">
                        {conversation.messages?.length || 0} messages
                      </span>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MessagesScreen;