import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Smile, Flame } from 'lucide-react';
import { EmojiPicker } from '@/components/EmojiPicker';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  conversationId: string;
  currentUserId: string;
  recipientId: string;
  onMessageSent: () => void;
  onShowUpgrade?: () => void;
  isProUser: boolean;
  messageCount: number;
}

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  currentUserId,
  recipientId,
  onMessageSent,
  onShowUpgrade,
  isProUser,
  messageCount
}) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sending, setSending] = useState(false);

  const canSendMessage = () => {
    if (isProUser) return true;
    return messageCount < 5;
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    if (!canSendMessage()) {
      onShowUpgrade?.();
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          recipient_id: recipientId,
          content: message.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      setMessage('');
      onMessageSent();
      
      toast({
        title: "Message sent! 💕",
        description: "Your message has been delivered"
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendTap = async () => {
    if (sending) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          recipient_id: recipientId,
          content: '🔥 Sent you a tap!',
          message_type: 'tap'
        });

      if (error) throw error;

      onMessageSent();
      
      toast({
        title: "Tap sent! 🔥",
        description: "Your flirty tap has been delivered"
      });
    } catch (error) {
      console.error('Error sending tap:', error);
      toast({
        title: "Error",
        description: "Failed to send tap",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t bg-white p-4">
      {!isProUser && messageCount >= 4 && (
        <div className="mb-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
          ⚠️ You have {5 - messageCount} message{5 - messageCount !== 1 ? 's' : ''} left today
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={canSendMessage() ? "Type a message..." : "Upgrade to PRO for unlimited messages"}
            disabled={!canSendMessage() || sending}
            className="pr-12 resize-none"
            maxLength={500}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
          >
            <Smile className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
        
        <Button
          onClick={handleSendTap}
          disabled={sending}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3"
        >
          <Flame className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || !canSendMessage() || sending}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4 z-10">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default MessageInput;