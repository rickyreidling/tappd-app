import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Crown, 
  Bell, 
  Moon, 
  LogOut, 
  Trash2, 
  HelpCircle,
  ArrowLeft 
} from 'lucide-react';

interface SettingsScreenProps {
  onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
  const { currentUser, userProfile, isPremium } = useAppContext();
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [isUpgrading, setIsUpgrading] = React.useState(false);

  const handleUpgrade = async () => {
    if (isUpgrading) return;
    setIsUpgrading(true);
    
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        toast({ title: "Please sign in first", variant: "destructive" });
        return;
      }

      const response = await fetch(
        'https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/45785200-a879-4b5f-8db6-d160e67743dc',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            priceId: 'monthly',
            userId: currentUser?.id,
            successUrl: `${window.location.origin}?upgrade=success`,
            cancelUrl: `${window.location.origin}?upgrade=cancelled`
          })
        }
      );

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast({ 
        title: "Upgrade failed", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({ title: "Signed out successfully" });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({ title: "Error signing out", variant: "destructive" });
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        toast({ title: "Account deletion requested", description: "Contact support to complete" });
      } catch (error) {
        toast({ title: "Error deleting account", variant: "destructive" });
      }
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
        </div>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{currentUser?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Display Name</p>
              <p className="font-medium">{userProfile?.display_name || 'Not set'}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Subscription Plan</p>
                <p className="font-medium flex items-center gap-2">
                  {isPremium ? (
                    <>
                      <Crown className="w-4 h-4 text-yellow-500" />
                      Tappd PRO
                    </>
                  ) : (
                    'Free Plan'
                  )}
                </p>
              </div>
              {!isPremium && (
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                >
                  <Crown className="w-4 h-4 mr-1" />
                  {isUpgrading ? 'Processing...' : 'Upgrade'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
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
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Help</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <Separator />
            <Button 
              onClick={handleDeleteAccount}
              variant="destructive" 
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};