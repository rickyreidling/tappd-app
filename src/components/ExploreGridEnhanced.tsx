import { useState, useMemo, useEffect } from 'react';
import { User, FilterOptions } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { UserCard } from './UserCard';
import AdvancedFilters from './AdvancedFilters';
import ThirstModeToggle from './ThirstModeToggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProfileView } from './ProfileView';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import MessagesScreen from './MessagesScreen';

interface ExploreGridProps {
  currentUser?: User;
}

const ExploreGrid = ({ currentUser }: ExploreGridProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [thirstMode, setThirstMode] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'online' | 'new'>('distance');
  const [showChat, setShowChat] = useState(false);
  const [chatUser, setChatUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterOptions>({
    ageRange: [18, 99],
    distance: 50,
    bodyTypes: [],
    tribes: [],
    onlineOnly: false,
    newMembers: false,
    thirstMode: false,
    traveling: false
  });

  const filteredUsers = useMemo(() => {
    let users = mockUsers.filter(user => {
      if (user.age < filters.ageRange[0] || user.age > filters.ageRange[1]) return false;
      if (user.distance > filters.distance) return false;
      if (filters.onlineOnly && !user.isOnline) return false;
      if (filters.thirstMode && !user.thirstMode) return false;
      if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(user.bodyType || '')) return false;
      if (filters.tribes.length > 0 && !filters.tribes.includes(user.tribe || '')) return false;
      return true;
    });

    users.sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'online') return (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0);
      if (sortBy === 'new') return parseInt(b.id) - parseInt(a.id);
      return 0;
    });

    return users;
  }, [filters, sortBy]);

  const handleInteraction = (userId: string, type: string) => {
    console.log(`${type} interaction with user ${userId}`);
    const user = mockUsers.find(u => u.id === userId);

    let message = '';
    switch (type) {
      case 'tap':
        message = `👋 Tapped ${user?.name}!`;
        break;
      case 'like':
        message = `❤️ Liked ${user?.name}!`;
        break;
      case 'woof':
        message = `🐺 Woofed at ${user?.name}!`;
        break;
      case 'flame':
        message = `🔥 Sent flame to ${user?.name}!`;
        break;
      default:
        message = `Sent ${type} to ${user?.name}!`;
    }

    toast({ title: message });
  };

  const handleProfileTap = (user: User) => {
    setSelectedUser(user);
  };

  const handleStartChat = (user: User) => {
    setChatUser(user);
    setShowChat(true);
  };

  const thirstModeUsers = filteredUsers.filter(user => user.thirstMode);

  if (showChat && chatUser) {
    return <MessagesScreen />;
  }

  if (selectedUser) {
    return (
      <ProfileView
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
        onStartChat={() => handleStartChat(selectedUser)}
        isFavorited={favorites.has(selectedUser.id)}
        onFavoriteToggle={() => {
          const newFavorites = new Set(favorites);
          if (newFavorites.has(selectedUser.id)) {
            newFavorites.delete(selectedUser.id);
          } else {
            newFavorites.add(selectedUser.id);
          }
          setFavorites(newFavorites);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Explore</h2>
        <Badge variant="secondary">{filteredUsers.length} nearby</Badge>
      </div>

      <div className="flex justify-center gap-2">
        <Button
          variant={sortBy === 'distance' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('distance')}
          className="flex items-center gap-1"
        >
          📍 Distance
        </Button>
        <Button
          variant={sortBy === 'online' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('online')}
          className="flex items-center gap-1"
        >
          🟢 Online
        </Button>
        <Button
          variant={sortBy === 'new' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('new')}
          className="flex items-center gap-1"
        >
          ✨ New
        </Button>
      </div>

      <ThirstModeToggle
        isActive={thirstMode}
        onToggle={setThirstMode}
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="thirst">🔥 Thirst ({thirstModeUsers.length})</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onClick={() => handleProfileTap(user)}
                onInteraction={handleInteraction}
                showInteractions={true}
                nameClassName="text-xl font-bold"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="thirst" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {thirstModeUsers.length > 0 ? (
              thirstModeUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onClick={() => handleProfileTap(user)}
                  onInteraction={handleInteraction}
                  showInteractions={true}
                  nameClassName="text-xl font-bold"
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No one's feeling frisky right now 😔</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="filters" className="mt-4">
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            isPremium={currentUser?.premium || false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const ExploreGrid: React.FC<ExploreGridProps> = ({ ... }) => {
  ...
};
