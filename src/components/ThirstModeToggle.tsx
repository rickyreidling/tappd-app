import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface ThirstModeToggleProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
  className?: string;
}

const ThirstModeToggle: React.FC<ThirstModeToggleProps> = ({ isActive, onToggle, className = '' }) => {
  return (
    <Card className={`p-4 ${isActive ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' : 'bg-gray-50'} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🔥</div>
          <div>
            <Label className="text-base font-semibold flex items-center gap-2">
              Thirst Mode
              {isActive && (
                <Badge variant="destructive" className="text-xs px-2 py-1">
                  Feeling Frisky
                </Badge>
              )}
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              {isActive 
                ? "You're glowing with high visibility! 🌟" 
                : "Activate to show you're feeling frisky"}
            </p>
          </div>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-red-500"
        />
      </div>
      {isActive && (
        <div className="mt-3 p-3 bg-white/50 rounded-lg border border-red-100">
          <div className="flex items-center gap-2 text-sm text-red-700">
            <span className="animate-pulse">✨</span>
            <span>Your profile will glow and appear in the "Thirst Mode" filter</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ThirstModeToggle;