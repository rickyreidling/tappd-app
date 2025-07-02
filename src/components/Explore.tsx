import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Crown, 
  Eye, 
  EyeOff, 
  Bell, 
  Shield, 
  Heart,
  MessageCircle,
  Filter,
  Palette,
  Star,
  User,
  LogOut
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface SettingsOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  isPro?: boolean;
  value: boolean;
  onChange: (value: boolean) => void;
}

const SettingsScreen: React.FC = () => {
  const { isPremium, user } = useAppContext();
  const { toast } = useToast();

  // Settings state
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [priorityNotifications, setPriorityNotifications] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [enableAdvancedFilters, setEnableAdvancedFilters] = useState(true);
  const [autoThemeChange, setAutoThemeChange] = useState(false);
  const [priorityMessaging, setPriorityMessaging] = useState(true);
  const [unlimitedTaps, setUnlimitedTaps] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const loadSetting = (key: string, defaultValue: boolean) => {
      const saved = localStorage.getItem(key);
      return saved !== null ? saved === 'true' : defaultValue;
    };

    setIncognitoMode(loadSetting('incognitoMode', false));
    setPushNotifications(loadSetting('pushNotifications', true));
    setPriorityNotifications(loadSetting('priorityNotifications', true));
    setShowOnlineStatus(loadSetting('showOnlineStatus', true));
    setEnableAdvancedFilters(loadSetting('enableAdvancedFilters', true));
    setAutoThemeChange(loadSetting('autoThemeChange', false));
    setPriorityMessaging(loadSetting('priorityMessaging', true));
    setUnlimitedTaps(loadSetting('unlimitedTaps', true));
  }, []);

  const handleSettingChange = (key: string, value: boolean, setter: (value: boolean) => void, isPro = false) => {
    if (isPro && !isPremium) {
      toast({
        title: "PRO Feature",
        description: "Upgrade to PRO to access this setting!",
        variant: "destructive"
      });
      return;
    }

    setter(value);
    localStorage.setItem(key, value.toString());
    
    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`
    });
  };

  const settingsGroups = [
    {
      title: "Privacy & Security",
      icon: Shield,
      settings: [
        {
          id: 'incognitoMode',
          title: 'Incognito Mode',
          description: 'Browse profiles without being seen in their "Who Viewed Me" list',
          icon: incognitoMode ? EyeOff : Eye,
          isPro: true,
          value: incognitoMode,
          onChange: (value: boolean) => handleSettingChange('incognitoMode', value, setIncognitoMode, true)
        },
        {
          id: 'showOnlineStatus',
          title: 'Show Online Status',
          description: 'Let others see when you\'re online and active',
          icon: User,
          value: showOnlineStatus,
          onChange: (value: boolean) => handleSettingChange('showOnlineStatus', value, setShowOnlineStatus)
        }
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      settings: [
        {
          id: 'pushNotifications',
          title: 'Push Notifications',
          description: 'Receive notifications for new matches and messages',
          icon: Bell,
          value: pushNotifications,
          onChange: (value: boolean) => handleSettingChange('pushNotifications', value, setPushNotifications)
        },
        {
          id: 'priorityNotifications',
          title: 'Priority Message Alerts',
          description: 'Get special notifications for priority messages',
          icon: Star,
          isPro: true,
          value: priorityNotifications,
          onChange: (value: boolean) => handleSettingChange('priorityNotifications', value, setPriorityNotifications, true)
        }
      ]
    },
    {
      title: "Discovery & Matching",
      icon: Heart,
      settings: [
        {
          id: 'enableAdvancedFilters',
          title: 'Advanced Filters',
          description: 'Use height, education, occupation and interest filters',
          icon: Filter,
          isPro: true,
          value: enableAdvancedFilters,
          onChange: (value: boolean) => handleSettingChange('enableAdvancedFilters', value, setEnableAdvancedFilters, true)
        },
        {
          id: 'unlimitedTaps',
          title: 'Unlimited Taps',
          description: 'Remove daily tap limits and tap as much as you want',
          icon: Heart,
          isPro: true,
          value: unlimitedTaps,
          onChange: (value: boolean) => handleSettingChange('unlimitedTaps', value, setUnlimitedTaps, true)
        }
      ]
    },
    {
      title: "Messaging & Communication",
      icon: MessageCircle,
      settings: [
        {
          id: 'priorityMessaging',
          title: 'Priority Messaging',
          description: 'Send messages that appear at the top of inboxes',
          icon: Star,
          isPro: true,
          value: priorityMessaging,
          onChange: (value: boolean) => handleSettingChange('priorityMessaging', value, setPriorityMessaging, true)
        }
      ]
    },
    {
      title: "Appearance & Themes",
      icon: Palette,
      settings: [
        {
          id: 'autoThemeChange',
          title: 'Auto Theme Rotation',
          description: 'Automatically rotate through your custom themes weekly',
          icon: Palette,
          isPro: true,
          value: autoThemeChange,
          onChange: (value: boolean) => handleSettingChange('autoThemeChange', value, setAutoThemeChange, true)
        }
      ]
    }
  ];

  const getProFeatureCount = () => {
    return settingsGroups.reduce((count, group) => 
      count + group.settings.filter(setting => setting.isPro).length, 0
    );
  };

  const getActiveProFeatures = () => {
    return settingsGroups.reduce((count, group) => 
      count + group.settings.filter(setting => setting.isPro && setting.value).length, 0
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600">Customize your app experience</p>
        </div>
        
        {isPremium && (
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <Crown className="w-4 h-4 mr-2" />
            PRO Active ({getActiveProFeatures()}/{getProFeatureCount()} features enabled)
          </Badge>
        )}
      </div>

      {/* PRO Status Card */}
      {!isPremium && (
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Unlock PRO Features</h3>
                  <p className="text-gray-600">
                    Get access to {getProFeatureCount()} premium settings and enhanced privacy controls
                  </p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600">
                Upgrade to PRO
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Groups */}
      {settingsGroups.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <group.icon className="w-5 h-5" />
              {group.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <setting.icon className={`w-5 h-5 ${setting.isPro && !isPremium ? 'text-gray-400' : 'text-gray-700'}`} />
                  <div className={setting.isPro && !isPremium ? 'opacity-50' : ''}>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{setting.title}</h4>
                      {setting.isPro && (
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          PRO
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                </div>
                
                <Switch
                  checked={setting.value && (setting.isPro ? isPremium : true)}
                  onCheckedChange={setting.onChange}
                  disabled={setting.isPro && !isPremium}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-700" />
              <div>
                <h4 className="font-medium">Profile Information</h4>
                <p className="text-sm text-gray-600">Update your profile details and photos</p>
              </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-700" />
              <div>
                <h4 className="font-medium">Account Settings</h4>
                <p className="text-sm text-gray-600">Manage your account preferences and data</p>
              </div>
            </div>
            <Button variant="outline">Manage</Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg border-red-200">
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="font-medium text-red-700">Sign Out</h4>
                <p className="text-sm text-gray-600">Sign out of your account</p>
              </div>
            </div>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <Card className="bg-gray-50">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">
            App Version 2.1.0 • {isPremium ? 'PRO Subscriber' : 'Free User'} • 
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsScreen;