import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface NotificationPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable: () => void;
  onDecline: () => void;
}

export function NotificationPrompt({ isOpen, onClose, onEnable, onDecline }: NotificationPromptProps) {
  const handleEnable = () => {
    onEnable();
    onClose();
  };

  const handleDecline = () => {
    onDecline();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Don't miss a tap 🔔
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-4">
            Turn on notifications to know when someone messages, taps you, or favorites your profile.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-6">
          <Button 
            onClick={handleEnable}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
          >
            Enable Notifications
          </Button>
          <Button 
            onClick={handleDecline}
            variant="outline"
            className="py-3"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}