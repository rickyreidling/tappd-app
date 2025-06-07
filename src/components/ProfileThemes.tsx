import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const ProfileThemes: React.FC = () => {
  const { isPremium } = useAppContext();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState('sunset');

  const themes = [
    { id: 'sunset', name: 'Sunset', colors: 'from-orange-400 to-pink-400' },
    { id: 'ocean', name: 'Ocean', colors: 'from-blue-400 to-cyan-400' },
    { id: 'forest', name: 'Forest', colors: 'from-green-400 to-emerald-400' }
  ];

  const handleSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem('profileTheme', themeId);
    toast({ title: "Theme Updated!", description: `Applied ${themes.find(t => t.id === themeId)?.name} theme` });
  };

  if (!isPremium) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">PRO Feature</h3>
          <p className="text-gray-600">Upgrade to PRO to customize your profile theme</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Profile Themes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Choose a theme for your profile:</p>
          <div className="grid grid-cols-1 gap-3">
            {themes.map((theme) => (
              <Button
                key={theme.id}
                onClick={() => handleSelect(theme.id)}
                variant={selectedTheme === theme.id ? 'default' : 'outline'}
                className="h-16 justify-start p-4"
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.colors} mr-3`} />
                <span className="font-semibold">{theme.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileThemes;