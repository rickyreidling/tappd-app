import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import {
  Bell,
  Moon,
  LogOut,
  Trash2,
  ArrowLeft,
  EyeOff,
  Crown
} from 'lucide-react';

interface SettingsScreenProps {
  onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPremium } = useAppContext();

  const [notifications, setNotifications] = useState(true);

  const [incognitoMode, setIncognitoMode] = useState(() => {
    return localStorage.getItem('incognitoMode') === 'true';
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [hiddenUsers, setHiddenUsers] = useState<string[]>([]);

  useEffect(() => {
    const blocked = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
    const hidden = JSON.parse(localStorage.getItem('hiddenUsers') || '[]');
    setBlockedUsers(blocked);
    setHiddenUsers(hidden);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    const newTheme = darkMode ? 'dark' : 'light';
    root.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  }, [darkMode]);

  const handleIncognitoToggle = (checked: boolean) => {
    if (!isPremium) {
      toast({
        title: 'PRO Feature',
        description: 'Upgrade to PRO to use Incognito Mode',
        variant: 'destructive'
      });
      return;
    }

    setIncognitoMode(checked);
    localStorage.setItem('incognitoMode', checked.toString());

    toast({
      title: checked ? 'Incognito Mode Enabled' : 'Incognito Mode Disabled',
      description: checked
        ? 'Your online status is now hidden from other users'
        : 'Your online status is now visible to other users'
    });

    window.dispatchEvent(new CustomEvent('incognitoModeChanged', {
      detail: { incognitoMode: checked }
    }));
  };

  const unblockUser = (userId: string) => {
    const updated = blockedUsers.filter(id => id !== userId);
    setBlockedUsers(updated);
    localStorage.setItem('blockedUsers', JSON.stringify(updated));
    toast({ title: 'User unblocked' });
  };

  const unhideUser = (userId: string) => {
    const updated = hiddenUsers.filter(id => id !== userId);
    setHiddenUsers(updated);
    localStorage.setItem('hiddenUsers', JSON.stringify(updated));
    toast({ title: 'User unhidden' });
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.dispatchEvent(new StorageEvent('storage', { key: 'user' }));
    setTimeout(() => window.location.reload(), 500);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account?')) {
      toast({ title: 'Contact support to delete account' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={onClose} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
          {isPremium && <Badge className="bg-yellow-500 text-white"><Crown className="w-3 h-3 mr-1" />PRO</Badge>}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>Push Notifications</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4" />
                <span>Incognito Mode</span>
                {!isPremium && <Badge variant="outline" className="text-xs">PRO</Badge>}
              </div>
              <Switch
                checked={incognitoMode}
                onCheckedChange={handleIncognitoToggle}
                disabled={!isPremium}
              />
            </div>

            {!isPremium && (
              <div className="pt-2">
                <Button
                  onClick={() => navigate('/upgrade')}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" /> Upgrade to PRO
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blocked Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {blockedUsers.length === 0 && <p className="text-gray-500">No blocked users.</p>}
            {blockedUsers.map(userId => (
              <div key={userId} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">User ID: {userId}</span>
                <Button size="sm" onClick={() => unblockUser(userId)}>Unblock</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hidden Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {hiddenUsers.length === 0 && <p className="text-gray-500">No hidden users.</p>}
            {hiddenUsers.map(userId => (
              <div key={userId} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">User ID: {userId}</span>
                <Button size="sm" onClick={() => unhideUser(userId)}>Unhide</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleSignOut} variant="outline" className="w-full justify-start">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
            <Separator />
            <Button onClick={handleDeleteAccount} variant="destructive" className="w-full justify-start">
              <Trash2 className="w-4 h-4 mr-2" /> Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
