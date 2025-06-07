import React from 'react';
import { Button } from '@/components/ui/button';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😊', '😍', '🥰', '😘',
  '😉', '😋', '😎', '🤗', '🤔', '😏', '😌', '😔',
  '❤️', '💕', '💖', '💗', '💓', '💘', '💝', '💟',
  '🔥', '✨', '💫', '⭐', '🌟', '💥', '💯', '👍',
  '👏', '🙌', '👋', '🤝', '💪', '🎉', '🎊', '🥳'
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  return (
    <div className="grid grid-cols-8 gap-1 p-2 max-w-xs">
      {EMOJIS.map((emoji, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-lg hover:bg-purple-100"
          onClick={() => onEmojiSelect(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
};