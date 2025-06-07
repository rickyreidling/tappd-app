import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface HeaderProps {
  onShowPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowPricing }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Tappd</h1>
          <span className="text-sm opacity-90">Tap in. Find out. 😉</span>
        </div>
        <div className="flex items-center gap-2">
          {onShowPricing && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowPricing}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Crown className="h-4 w-4 mr-1" />
              PRO
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};