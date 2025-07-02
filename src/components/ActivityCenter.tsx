import React, { useState, useEffect } from 'react';

const TappdActivityCenter = () => {
  const [activeTab, setActiveTab] = useState('views');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [tappedBack, setTappedBack] = useState(new Set());
  const [showNotification, setShowNotification] = useState('');
  const [activityData, setActivityData] = useState({
    views: [],
    tappds: [],
    matches: [],
    recent: []
  });

  // Load persisted activity data and tapped back status
  useEffect(() => {
    try {
      const savedActivity = localStorage.getItem('activityData');
      const savedTappedBack = localStorage.getItem('tappedBackProfiles');
      
      if (savedActivity) {
        setActivityData(JSON.parse(savedActivity));
      } else {
        // Initialize with some sample data if none exists
        const initialData = {
          views: [
            { 
              id: 1, 
              name: 'Alex M.', 
              age: 28, 
              distance: '2 miles', 
              avatar: '🧑‍💼', 
              time: '2h ago', 
              thirst: '🔥',
              bio: 'Marketing manager who loves hiking and craft beer. Looking for someone to explore the city with!',
              interests: ['Hiking', 'Beer', 'Travel', 'Photography']
            },
            { 
              id: 2, 
              name: 'Jordan K.', 
              age: 25, 
              distance: '1 mile', 
              avatar: '👩‍🎨', 
              time: '4h ago', 
              thirst: '⚡',
              bio: 'Artist and coffee enthusiast. Let\'s grab a latte and talk about life!',
              interests: ['Art', 'Coffee', 'Museums', 'Yoga']
            },
            { 
              id: 3, 
              name: 'Sam P.', 
              age: 30, 
              distance: '3 miles', 
              avatar: '🧑‍🍳', 
              time: '6h ago', 
              thirst: '🌶️',
              bio: 'Chef by day, foodie by night. Always down to try new restaurants!',
              interests: ['Cooking', 'Dining', 'Wine', 'Travel']
            }
          ],
          tappds: [
            { 
              id: 4, 
              name: 'Morgan L.', 
              age: 27, 
              distance: '1 mile', 
              avatar: '👩‍⚕️', 
              time: '1h ago', 
              thirst: '⚡', 
              status: 'pending',
              bio: 'Doctor with a heart for helping others. Love weekend hikes and good books!',
              interests: ['Medicine', 'Reading', 'Hiking', 'Volunteering']
            },
            { 
              id: 5, 
              name: 'Riley C.', 
              age: 24, 
              distance: '2 miles', 
              avatar: '🧑‍🎭', 
              time: '3h ago', 
              thirst: '🌶️', 
              status: 'pending',
              bio: 'Theater performer who lives for the spotlight. Let\'s create our own drama!',
              interests: ['Theater', 'Acting', 'Music', 'Drama']
            }
          ],
          matches: [
            { 
              id: 6, 
              name: 'Blake T.', 
              age: 26, 
              distance: '1.2 miles', 
              avatar: '👩‍🎤', 
              time: '30m ago', 
              thirst: '🔥', 
              lastMessage: 'Hey! How\'s your day going?',
              bio: 'Singer-songwriter with a passion for indie music. Let\'s make beautiful music together!',
              interests: ['Music', 'Singing', 'Guitar', 'Concerts']
            },
            { 
              id: 7, 
              name: 'Drew M.', 
              age: 28, 
              distance: '0.8 miles', 
              avatar: '🧑‍🏊', 
              time: '2h ago', 
              thirst: '⚡', 
              lastMessage: 'That coffee shop looks amazing!',
              bio: 'Professional swimmer and fitness coach. Dive into adventure with me!',
              interests: ['Swimming', 'Fitness', 'Health', 'Competition']
            }
          ],
          recent: [
            { 
              id: 8, 
              type: 'match', 
              name: 'Blake T.', 
              age: 26,
              distance: '1.2 miles',
              time: '30m ago', 
              avatar: '👩‍🎤',
              thirst: '🔥',
              bio: 'Singer-songwriter with a passion for indie music.',
              interests: ['Music', 'Singing', 'Guitar', 'Concerts']
            },
            { 
              id: 9, 
              type: 'view', 
              name: 'Alex M.', 
              age: 28,
              distance: '2 miles',
              time: '2h ago', 
              avatar: '🧑‍💼',
              thirst: '🔥',
              bio: 'Marketing manager who loves hiking and craft beer.',
              interests: ['Hiking', 'Beer', 'Travel', 'Photography']
            }
          ]
        };
        setActivityData(initialData);
        localStorage.setItem('activityData', JSON.stringify(initialData));
      }
      
      if (savedTappedBack) {
        setTappedBack(new Set(JSON.parse(savedTappedBack)));
      }
    } catch (error) {
      console.error('❌ Error loading activity data:', error);
    }
  }, []);

  // Save tapped back status to localStorage
  const saveTappedBack = (newTappedBack) => {
    localStorage.setItem('tappedBackProfiles', JSON.stringify([...newTappedBack]));
  };

  // Add new activity (can be called from other parts of the app)
  const addActivity = (type, profileData) => {
    setActivityData(prev => {
      const updated = {
        ...prev,
        [type]: [profileData, ...prev[type]],
        recent: [{ ...profileData, type }, ...prev.recent].slice(0, 10) // Keep only latest 10
      };
      localStorage.setItem('activityData', JSON.stringify(updated));
      return updated;
    });
  };

  // Expose the addActivity function globally so other components can use it
  useEffect(() => {
    window.addActivityItem = addActivity;
    return () => {
      delete window.addActivityItem;
    };
  }, []);

  const handleTappBack = (profileId, profileName) => {
    const newTappedBack = new Set([...tappedBack, profileId]);
    setTappedBack(newTappedBack);
    saveTappedBack(newTappedBack);
    setShowNotification(`You tapped back on ${profileName}! 💖`);
    setTimeout(() => setShowNotification(''), 3000);
    
    // Add to recent activity
    const profile = [...activityData.views, ...activityData.tappds, ...activityData.matches]
      .find(p => p.id === profileId);
    if (profile) {
      addActivity('recent', { ...profile, type: 'tapp' });
    }
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  };

  const handleMessage = (profile) => {
    // Use the global chat function if available, otherwise show notification
    if (window.openChatFromMessages) {
      // Convert profile to user format for chat
      const user = {
        id: profile.id.toString(),
        name: profile.name,
        photos: [profile.avatar], // Using emoji as photo for now
        isOnline: true,
        lastOnline: 'Online now'
      };
      
      // Create a conversation if it doesn't exist
      const conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
      if (!conversations[user.id]) {
        const conversationData = {
          id: user.id,
          name: user.name,
          avatar: user.photos[0],
          lastMessage: 'Say hello! 👋',
          timestamp: new Date().toISOString(),
          timeDisplay: new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          unread: false,
          messages: []
        };
        conversations[user.id] = conversationData;
        localStorage.setItem('conversations', JSON.stringify(conversations));
        window.dispatchEvent(new CustomEvent('conversationUpdated'));
      }
      
      window.openChatFromMessages(user.id);
    } else {
      setShowNotification(`Opening chat with ${profile.name}... 💬`);
      setTimeout(() => setShowNotification(''), 3000);
    }
  };

  // Profile Modal
  const ProfileModal = ({ profile, onClose }) => {
    if (!profile) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div 
          className="rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: 'white', color: '#111827' }}
        >
          <div className="relative">
            <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-t-2xl flex items-center justify-center">
              <span className="text-6xl">{profile.avatar}</span>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 rounded-full p-2 text-white text-xl"
            >
              ×
            </button>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-2xl font-bold" style={{ color: '#111827' }}>{profile.name}, {profile.age}</h2>
                <span className="text-2xl">{profile.thirst}</span>
              </div>
              <p style={{ color: '#6B7280' }}>{profile.distance} away</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#111827' }}>About</h3>
              <p style={{ color: '#374151' }}>{profile.bio}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#111827' }}>Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: '#E5E7EB', color: '#7C2D12' }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              {activeTab === 'views' && (
                <button 
                  onClick={() => {
                    handleTappBack(profile.id, profile.name);
                    onClose();
                  }}
                  disabled={tappedBack.has(profile.id)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold ${
                    tappedBack.has(profile.id)
                      ? 'cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                  style={tappedBack.has(profile.id) ? { backgroundColor: '#D1D5DB', color: '#6B7280' } : {}}
                >
                  {tappedBack.has(profile.id) ? '✓ Tapped!' : 'Tapp Back'}
                </button>
              )}
              
              <button 
                onClick={() => {
                  handleMessage(profile);
                  onClose();
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold"
              >
                💬 Message
              </button>
              
              <button 
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-xl font-semibold"
                style={{ backgroundColor: '#D1D5DB', color: '#374151' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === 'views') {
      return (
        <div className="space-y-4">
          {activityData.views.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👀</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>No profile views yet</h3>
              <p style={{ color: '#6B7280' }}>People who view your profile will appear here</p>
            </div>
          ) : (
            activityData.views.map((profile) => (
              <div 
                key={profile.id} 
                className="rounded-xl p-4 flex items-center gap-4 transition-colors cursor-pointer"
                style={{ backgroundColor: '#F3F4F6' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              >
                <div 
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleProfileClick(profile)}
                >
                  {profile.avatar}
                </div>
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleProfileClick(profile)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg" style={{ color: '#111827' }}>{profile.name}, {profile.age}</h3>
                    <span className="text-xl">{profile.thirst}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{ color: '#6B7280' }}>
                    <span>{profile.distance}</span>
                    <span>{profile.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleTappBack(profile.id, profile.name)}
                    disabled={tappedBack.has(profile.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      tappedBack.has(profile.id)
                        ? 'cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                    style={tappedBack.has(profile.id) ? { backgroundColor: '#D1D5DB', color: '#6B7280' } : {}}
                  >
                    {tappedBack.has(profile.id) ? '✓ Tapped!' : 'Tapp Back'}
                  </button>
                  <button
                    onClick={() => handleMessage(profile)}
                    className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors"
                  >
                    💬
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      );
    }

    if (activeTab === 'tappds') {
      return (
        <div className="space-y-4">
          {activityData.tappds.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💖</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>No tappds sent yet</h3>
              <p style={{ color: '#6B7280' }}>Your sent tappds will appear here</p>
            </div>
          ) : (
            activityData.tappds.map((profile) => (
              <div 
                key={profile.id} 
                className="rounded-xl p-4 flex items-center gap-4 transition-colors"
                style={{ backgroundColor: '#F3F4F6' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              >
                <div 
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleProfileClick(profile)}
                >
                  {profile.avatar}
                </div>
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleProfileClick(profile)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg" style={{ color: '#111827' }}>{profile.name}, {profile.age}</h3>
                    <span className="text-xl">{profile.thirst}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{ color: '#6B7280' }}>
                    <span>{profile.distance}</span>
                    <span>{profile.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className={`px-3 py-1 rounded-full text-xs font-semibold`}
                    style={profile.status === 'pending' 
                      ? { backgroundColor: '#FEF3C7', color: '#92400E' }
                      : { backgroundColor: '#D1FAE5', color: '#065F46' }
                    }
                  >
                    {profile.status === 'pending' ? 'Pending' : 'Seen'}
                  </div>
                  <button
                    onClick={() => handleMessage(profile)}
                    className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors"
                  >
                    💬
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      );
    }

    if (activeTab === 'matches') {
      return (
        <div className="space-y-4">
          {activityData.matches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>No matches yet</h3>
              <p style={{ color: '#6B7280' }}>Your matches will appear here</p>
            </div>
          ) : (
            activityData.matches.map((profile) => (
              <div 
                key={profile.id} 
                className="rounded-xl p-4 flex items-center gap-4 transition-colors"
                style={{ backgroundColor: '#F3F4F6' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              >
                <div 
                  className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleProfileClick(profile)}
                >
                  {profile.avatar}
                </div>
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleProfileClick(profile)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg" style={{ color: '#111827' }}>{profile.name}, {profile.age}</h3>
                    <span className="text-xl">{profile.thirst}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-2" style={{ color: '#6B7280' }}>
                    <span>{profile.distance}</span>
                    <span>{profile.time}</span>
                  </div>
                  <p className="text-sm italic" style={{ color: '#374151' }}>"{profile.lastMessage}"</p>
                </div>
                <button
                  onClick={() => handleMessage(profile)}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors"
                >
                  💬
                </button>
              </div>
            ))
          )}
        </div>
      );
    }

    if (activeTab === 'recent') {
      return (
        <div className="space-y-4">
          {activityData.recent.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>No recent activity</h3>
              <p style={{ color: '#6B7280' }}>Your recent activity will appear here</p>
            </div>
          ) : (
            activityData.recent.map((activity) => (
              <div 
                key={activity.id} 
                className="rounded-xl p-4 flex items-center gap-4 transition-colors"
                style={{ backgroundColor: '#F3F4F6' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              >
                <div 
                  className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleProfileClick(activity)}
                >
                  {activity.avatar}
                </div>
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleProfileClick(activity)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      activity.type === 'match' ? 'bg-green-500' :
                      activity.type === 'view' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}></span>
                    <p style={{ color: '#111827' }}>
                      <span className="font-semibold">{activity.name}</span>
                      <span className="ml-1" style={{ color: '#6B7280' }}>
                        {activity.type === 'match' ? 'matched with you' :
                         activity.type === 'view' ? 'viewed your profile' :
                         'you tapped them'}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{activity.time}</p>
                </div>
                {activity.type === 'match' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessage(activity);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors"
                  >
                    💬
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      );
    }

    return <div className="text-center py-8" style={{ color: '#6B7280' }}>No activity yet</div>;
  };

  const tabs = [
    { id: 'views', label: 'Views', count: activityData.views.length },
    { id: 'tappds', label: 'Tappds', count: activityData.tappds.length },
    { id: 'matches', label: 'Matches', count: activityData.matches.length },
    { id: 'recent', label: 'Recent', count: activityData.recent.length }
  ];

  return (
    <div 
      className="min-h-screen pb-20"
      style={{ backgroundColor: 'white', color: '#111827' }}
    >
      {/* Header */}
      <div 
        className="p-6 border-b"
        style={{ borderColor: '#E5E7EB' }}
      >
        <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Activity Center</h1>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4">
        <div 
          className="flex rounded-2xl p-2"
          style={{ backgroundColor: '#E5E7EB' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : ''
              }`}
              style={activeTab === tab.id ? {} : { color: '#6B7280' }}
            >
              <span className="text-xs font-semibold">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        {renderContent()}
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        profile={selectedProfile} 
        onClose={() => setSelectedProfile(null)} 
      />

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-40">
          {showNotification}
        </div>
      )}
    </div>
  );
};

export default TappdActivityCenter;