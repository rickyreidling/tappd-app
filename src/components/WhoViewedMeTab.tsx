import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, MapPin } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface ProfileViewer {
  id: string;
  name: string;
  age: number;
  photo: string;
  location: string;
  viewedAt: Date;
  isOnline: boolean;
}

const WhoViewedMeTab: React.FC = () => {
  const { isPremium } = useAppContext();
  const [viewers, setViewers] = useState<ProfileViewer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockViewers: ProfileViewer[] = [
      {
        id: '1',
        name: 'Alex',
        age: 28,
        photo: '/placeholder.svg',
        location: 'Downtown',
        viewedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isOnline: true
      },
      {
        id: '2',
        name: 'Jordan',
        age: 25,
        photo: '/placeholder.svg',
        location: 'Midtown',
        viewedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isOnline: false
      },
      {
        id: '3',
        name: 'Casey',
        age: 30,
        photo: '/placeholder.svg',
        location: 'Uptown',
        viewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isOnline: true
      }
    ];

    setTimeout(() => {
      setViewers(mockViewers);
      setLoading(false);
    }, 1000);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  if (!isPremium) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">PRO Feature</h3>
          <p className="text-gray-600">Upgrade to PRO to see who viewed your profile</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Profile Viewers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Profile Viewers ({viewers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {viewers.length === 0 ? (
          <div className="text-center py-8">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No profile views yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {viewers.map((viewer) => (
              <div key={viewer.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={viewer.photo} alt={viewer.name} />
                    <AvatarFallback>{viewer.name[0]}</AvatarFallback>
                  </Avatar>
                  {viewer.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{viewer.name}, {viewer.age}</h4>
                    {viewer.isOnline && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Online
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {viewer.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(viewer.viewedAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhoViewedMeTab;