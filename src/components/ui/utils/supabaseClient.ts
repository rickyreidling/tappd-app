import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppContext } from '@/contexts/AppContext';
import { Send, MoreVertical, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase, Message, Profile } from '@/lib/supabaseClient';

interface EnhancedMessagingSystemProps {
  selectedUserId?: string;
  onBack?: () => void;
}

export const EnhancedMessagingSystem: React.FC<EnhancedMessagingSystemProps> = ({
  selectedUserId,
  onBack
}) => {
  const { currentUser, isPremium } = useAppContext();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeConversation, setActiveConversation] = useState<string | null>(selectedUserId || null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load users/profiles
  useEffect(() => {
    loadUsers();
  }, []);

  // Load conversations when component mounts
  useEffect(() => {
    if (currentUser?.id) {
      loadConversations();
    }
  }, [currentUser]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessages();
    }
  }, [activeConversation]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!currentUser?.id) return;

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUser.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          // Update conversations list
          loadConversations();
          
          // Show toast notification
          toast({
            title: "New Message",
            description: `New message received`
          });
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [currentUser, toast]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadConversations = async () => {
    if (!currentUser?.id) return;

    try {
      // Get all messages involving current user
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(*),
          receiver:profiles!receiver_id(*)
        `)
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation (other user)
      const conversationMap = new Map();
      
      messagesData?.forEach((message: any) => {
        const otherUserId = message.sender_id === currentUser.id ? message.receiver_id : message.sender_id;
        const otherUser = message.sender_id === currentUser.id ? message.receiver : message.sender;
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            id: otherUserId,
            otherUser,
            lastMessage: message,
            unreadCount: 0
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    }
  };

  const loadMessages = async () => {
    if (!currentUser?.id || !activeConversation) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${activeConversation}),and(sender_id.eq.${activeConversation},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !currentUser?.id) return;
    
    // Check if free user has reached message limit
    const userMessages = messages.filter(m => m.sender_id === currentUser.id);
    if (!isPremium && userMessages.length >= 3) {
      setShowUpgradePrompt(true);
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: currentUser.id,
            receiver_id: activeConversation,
            content: newMessage.trim(),
            message_type: 'text'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, data]);
      setNewMessage('');
      
      // Update conversations list
      loadConversations();
      
      toast({ title: "Message sent!" });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const UpgradePrompt = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center space-y-4">
          <Crown className="w-12 h-12 text-yellow-500 mx-auto" />
          <h3 className="text-xl font-bold">Message Limit Reached</h3>
          <p className="text-gray-600">
            Free users can send 3 messages per conversation. Upgrade to PRO for unlimited messaging!
          </p>
          <div className="space-y-2">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to PRO
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowUpgradePrompt(false)}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (activeConversation) {
    const otherUser = users.find(u => u.id === activeConversation);
    const userMessages = messages.filter(m => m.sender_id === currentUser?.id);
    const canSendMessage = isPremium || userMessages.length < 3;
    
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-white">
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherUser?.avatar_url} />
            <AvatarFallback>{otherUser?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{otherUser?.name || 'Unknown User'}</h3>
            <p className="text-sm text-gray-500">
              {otherUser?.is_online ? 'Online' : 'Offline'}
            </p>
          </div>
          {isPremium && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400">
              <Crown className="w-3 h-3 mr-1" />
              PRO
            </Badge>
          )}
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.sender_id === currentUser?.id;
              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`text-xs mt-1 ${
                      isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.created_at)}
                      {isOwn && <span className="ml-1">✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {!isPremium && userMessages.length >= 3 && (
              <div className="text-center py-4">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Message limit reached - Upgrade to PRO for unlimited messaging
                </Badge>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={canSendMessage ? "Type a message..." : "Upgrade to PRO to continue messaging"}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="flex-1"
              disabled={!canSendMessage || loading}
            />
            <Button 
              onClick={handleSendMessage} 
              size="sm"
              disabled={!canSendMessage || !newMessage.trim() || loading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {!isPremium && (
            <p className="text-xs text-gray-500 mt-2">
              {userMessages.length}/3 messages sent (Free plan)
            </p>
          )}
        </div>
        
        {showUpgradePrompt && <UpgradePrompt />}
      </div>
    );
  }

  // Conversations List
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>

      <div className="space-y-2">
        {conversations.map((conversation) => {
          const otherUser = conversation.otherUser;
          
          return (
            <Card 
              key={conversation.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveConversation(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={otherUser?.avatar_url} />
                    <AvatarFallback>{otherUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{otherUser?.name || 'Unknown User'}</h3>
                      <div className="flex items-center gap-2">
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessage.created_at)}
                          </span>
                        )}
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-blue-500 text-white text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {conversations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No conversations yet</p>
          <p className="text-sm">Start chatting with someone from Explore!</p>
        </div>
      )}
    </div>
  );
};