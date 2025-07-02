import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { supabase, Message } from '@/lib/supabaseClient';

interface ChatWindowProps {
  recipientId: string;
  recipientName: string;
  recipientPhoto?: string;
  onBack: () => void;
  isPremium: boolean;
  messagesSentToday: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  recipientId,
  recipientName,
  recipientPhoto,
  onBack,
  isPremium,
  messagesSentToday
}) => {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const canSendMessage = isPremium || messagesSentToday < 3;

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing messages when component mounts
  useEffect(() => {
    if (currentUser?.id && recipientId) {
      loadMessages();
    }
  }, [currentUser, recipientId]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!currentUser?.id || !recipientId) return;

    const messageSubscription = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `and(sender_id.eq.${recipientId},receiver_id.eq.${currentUser.id})`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          toast({
            title: "New Message",
            description: `${recipientName} sent you a message`
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [currentUser, recipientId, recipientName, toast]);

  const loadMessages = async () => {
    if (!currentUser?.id || !recipientId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load message history",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !canSendMessage || !currentUser?.id) return;
    
    setLoading(true);
    
    try {
      // Save message to Supabase database
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: currentUser.id,
            receiver_id: recipientId,
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

      toast({
        title: "Message sent!",
        description: `Your message to ${recipientName} was delivered`
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center space-y-0 pb-4">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={recipientPhoto} />
          <AvatarFallback>{recipientName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{recipientName}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Start your conversation with {recipientName}
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="max-w-xs">
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      message.sender_id === currentUser?.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.sender_id === currentUser?.id ? 'text-right' : 'text-left'
                  } text-gray-500`}>
                    {formatTime(message.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {!canSendMessage && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Daily message limit reached
                </p>
                <p className="text-xs text-yellow-600">
                  Upgrade to Premium for unlimited messaging
                </p>
              </div>
              <Badge variant="outline">3/3 used</Badge>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={canSendMessage ? "Type a message..." : "Upgrade for unlimited messages"}
            disabled={!canSendMessage || loading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!canSendMessage || !newMessage.trim() || loading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;