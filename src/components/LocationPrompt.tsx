import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LocationPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  onDecline: () => void;
}

export function LocationPrompt({ isOpen, onClose, onAllow, onDecline }: LocationPromptProps) {
  const handleAllow = () => {
    onAllow();
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
            Tappd wants to see who's nearby 👀
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-4">
            We use your location to show local guys. Your exact address is never shared — just vibes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-6">
          <Button 
            onClick={handleAllow}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
          >
            Allow Location
          </Button>
          <Button 
            onClick={handleDecline}
            variant="outline"
            className="py-3"
          >
            Not Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}