// useConversations.js - Custom hook for localStorage conversations
import { useSyncExternalStore } from 'react';

// Storage key
const CONVERSATIONS_KEY = 'conversations';

// Subscribe function - listens for custom events
const subscribe = (callback) => {
  const handleStorageChange = () => {
    console.log('🔄 useConversations: Storage change detected');
    callback();
  };
  
  const handleCustomEvent = () => {
    console.log('🔄 useConversations: Custom conversation event detected');
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
};

// Get snapshot function - reads current state from localStorage
const getSnapshot = () => {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    console.log('📸 useConversations: getSnapshot called, found', Object.keys(parsed).length, 'conversations');
    return JSON.stringify(parsed); // Return as string for stable comparison
  } catch (error) {
    console.error('❌ useConversations: Error reading conversations:', error);
    return '{}';
  }
};

// Server snapshot - for SSR (returns empty object)
const getServerSnapshot = () => {
  return '{}';
};

// Custom hook
export const useConversations = () => {
  // Use useSyncExternalStore to sync with localStorage
  const conversationsJson = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Parse the JSON string back to object
  try {
    const conversations = JSON.parse(conversationsJson);
    const conversationList = Object.values(conversations);
    
    console.log('🎯 useConversations: Returning', conversationList.length, 'conversations');
    
    return {
      conversations,
      conversationList,
      count: conversationList.length
    };
  } catch (error) {
    console.error('❌ useConversations: Error parsing conversations:', error);
    return {
      conversations: {},
      conversationList: [],
      count: 0
    };
  }
};

// Function to save a conversation (call this from ChatModal)
export const saveConversation = (userId, conversationData) => {
  try {
    const conversations = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '{}');
    conversations[userId] = conversationData;
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    
    console.log('💾 saveConversation: Saved conversation for user', userId);
    
    // Dispatch events to trigger updates
    window.dispatchEvent(new CustomEvent('conversationUpdated', { 
      detail: { userId, conversation: conversationData }
    }));
    window.dispatchEvent(new CustomEvent('localStorageUpdate'));
    
    // Force storage event for cross-tab sync
    const storageEvent = new StorageEvent('storage', {
      key: CONVERSATIONS_KEY,
      newValue: JSON.stringify(conversations),
      url: window.location.href
    });
    window.dispatchEvent(storageEvent);
    
  } catch (error) {
    console.error('❌ saveConversation: Error saving conversation:', error);
  }
};