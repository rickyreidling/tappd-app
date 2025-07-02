import React, { useState, useEffect } from 'react';
import { Eye, Heart, Zap, Clock, Users, MapPin, MessageCircle, X } from 'lucide-react';

// Complete fake data with all profiles - FIXED with unique IDs
const mockViewers = [
  { 
    id: 'alex_m', 
    name: 'Alex M.', 
    age: 28, 
    distance: '2 miles', 
    avatar: '🧑‍💼', 
    time: '2h ago', 
    thirst: '🔥',
    bio: 'Marketing manager who loves hiking and craft beer. Looking for someone to explore the city with!',
    interests: ['Hiking', 'Beer', 'Travel', 'Photography'],
    height: '6\'0"',
    build: 'Athletic',
    tribe: 'Jock',
    pronouns: 'he/him',
    lookingFor: ['Dates', 'LTR', 'Friends'],
    relationshipType: 'Single',
    ethnicity: 'White',
    bodyHair: 'Some',
    role: 'Versatile',
    smoking: 'No',
    drinking: 'Socially',
    drugs: 'Never',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Marketing Manager',
    education: 'Bachelor\'s Degree'
  },
  { 
    id: 'jordan_k', 
    name: 'Jordan K.', 
    age: 25, 
    distance: '1 mile', 
    avatar: '👩‍🎨', 
    time: '4h ago', 
    thirst: '⚡',
    bio: 'Artist and coffee enthusiast. Let\'s grab a latte and talk about life!',
    interests: ['Art', 'Coffee', 'Museums', 'Yoga'],
    height: '5\'7"',
    build: 'Slim',
    tribe: 'Twink',
    pronouns: 'she/her',
    lookingFor: ['Dates', 'Friends', 'Art Partners'],
    relationshipType: 'Single',
    ethnicity: 'Asian',
    bodyHair: 'Smooth',
    role: 'Bottom',
    smoking: 'No',
    drinking: 'Occasionally',
    drugs: 'Never',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Graphic Artist',
    education: 'Art School'
  },
  { 
    id: 'sam_p', 
    name: 'Sam P.', 
    age: 30, 
    distance: '3 miles', 
    avatar: '🧑‍🍳', 
    time: '6h ago', 
    thirst: '🌶️',
    bio: 'Chef by day, foodie by night. Always down to try new restaurants!',
    interests: ['Cooking', 'Dining', 'Wine', 'Travel'],
    height: '5\'11"',
    build: 'Average',
    tribe: 'Bear',
    pronouns: 'he/him',
    lookingFor: ['Hookups', 'Dates', 'Food Adventures'],
    relationshipType: 'Single',
    ethnicity: 'Latino',
    bodyHair: 'Hairy',
    role: 'Versatile Top',
    smoking: 'No',
    drinking: 'Yes',
    drugs: 'Sometimes',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Head Chef',
    education: 'Culinary Institute'
  },
  { 
    id: 'casey_r', 
    name: 'Casey R.', 
    age: 26, 
    distance: '1.5 miles', 
    avatar: '👩‍💻', 
    time: '8h ago', 
    thirst: '🍑',
    bio: 'Software developer who codes by day and dances by night. Let\'s debug life together!',
    interests: ['Tech', 'Dancing', 'Gaming', 'Music'],
    height: '5\'5"',
    build: 'Slim',
    tribe: 'Geek',
    pronouns: 'they/them',
    lookingFor: ['Dates', 'LTR', 'Gaming Partners'],
    relationshipType: 'Single',
    ethnicity: 'Mixed',
    bodyHair: 'Trimmed',
    role: 'Versatile',
    smoking: 'No',
    drinking: 'Socially',
    drugs: 'Never',
    hivPrepStatus: 'Negative, Not on PrEP',
    occupation: 'Software Developer',
    education: 'Computer Science Degree'
  },
  { 
    id: 'taylor_w', 
    name: 'Taylor W.', 
    age: 29, 
    distance: '2.5 miles', 
    avatar: '🧑‍🚀', 
    time: '1d ago', 
    thirst: '🔥',
    bio: 'Aerospace engineer with a passion for stargazing and adventure. Ready to launch into love!',
    interests: ['Space', 'Science', 'Adventure', 'Fitness'],
    height: '6\'2"',
    build: 'Muscular',
    tribe: 'Jock',
    pronouns: 'he/him',
    lookingFor: ['LTR', 'Adventure Partners', 'Fitness Buddies'],
    relationshipType: 'Single',
    ethnicity: 'Black',
    bodyHair: 'Some',
    role: 'Top',
    smoking: 'No',
    drinking: 'Rarely',
    drugs: 'Never',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Aerospace Engineer',
    education: 'Master\'s in Engineering'
  }
];

const mockTappds = [
  { 
    id: 'morgan_l', 
    name: 'Morgan L.', 
    age: 27, 
    distance: '1 mile', 
    avatar: '👩‍⚕️', 
    time: '1h ago', 
    thirst: '⚡', 
    status: 'pending',
    bio: 'Doctor with a heart for helping others. Love weekend hikes and good books!',
    interests: ['Medicine', 'Reading', 'Hiking', 'Volunteering'],
    height: '5\'8"',
    build: 'Athletic',
    tribe: 'Professional',
    pronouns: 'she/her',
    lookingFor: ['LTR', 'Friends', 'Hiking Partners'],
    relationshipType: 'Single',
    ethnicity: 'Asian',
    bodyHair: 'Smooth',
    role: 'Versatile',
    smoking: 'No',
    drinking: 'Rarely',
    drugs: 'Never',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Doctor',
    education: 'Medical School'
  },
  { 
    id: 'riley_c', 
    name: 'Riley C.', 
    age: 24, 
    distance: '2 miles', 
    avatar: '🧑‍🎭', 
    time: '3h ago', 
    thirst: '🌶️', 
    status: 'pending',
    bio: 'Theater performer who lives for the spotlight. Let\'s create our own drama!',
    interests: ['Theater', 'Acting', 'Music', 'Drama'],
    height: '5\'10"',
    build: 'Slim',
    tribe: 'Twink',
    pronouns: 'he/him',
    lookingFor: ['Hookups', 'Fun', 'Creative Partners'],
    relationshipType: 'Single',
    ethnicity: 'White',
    bodyHair: 'Smooth',
    role: 'Bottom',
    smoking: 'Socially',
    drinking: 'Yes',
    drugs: 'Sometimes',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Actor',
    education: 'Drama School'
  },
  { 
    id: 'avery_d', 
    name: 'Avery D.', 
    age: 31, 
    distance: '1.8 miles', 
    avatar: '👩‍🏫', 
    time: '5h ago', 
    thirst: '🍑', 
    status: 'seen',
    bio: 'Teacher by profession, learner by nature. Always curious about the world!',
    interests: ['Education', 'Travel', 'Languages', 'Culture'],
    height: '5\'6"',
    build: 'Average',
    tribe: 'Professional',
    pronouns: 'she/her',
    lookingFor: ['Dates', 'LTR', 'Travel Partners'],
    relationshipType: 'Single',
    ethnicity: 'Latina',
    bodyHair: 'Trimmed',
    role: 'Versatile',
    smoking: 'No',
    drinking: 'Socially',
    drugs: 'Never',
    hivPrepStatus: 'Negative, Not on PrEP',
    occupation: 'Teacher',
    education: 'Master\'s in Education'
  },
  { 
    id: 'quinn_s', 
    name: 'Quinn S.', 
    age: 23, 
    distance: '3.2 miles', 
    avatar: '🧑‍🔬', 
    time: '12h ago', 
    thirst: '🔥', 
    status: 'pending',
    bio: 'Research scientist exploring the mysteries of life. Want to be my lab partner?',
    interests: ['Science', 'Research', 'Innovation', 'Discovery'],
    height: '5\'9"',
    build: 'Slim',
    tribe: 'Geek',
    pronouns: 'they/them',
    lookingFor: ['Dates', 'LTR', 'Science Partners'],
    relationshipType: 'Single',
    ethnicity: 'Mixed',
    bodyHair: 'Some',
    role: 'Versatile',
    smoking: 'No',
    drinking: 'Rarely',
    drugs: 'Never',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Research Scientist',
    education: 'PhD in Biology'
  }
];

const mockMatches = [
  { 
    id: 'blake_t', 
    name: 'Blake T.', 
    age: 26, 
    distance: '1.2 miles', 
    avatar: '👩‍🎤', 
    time: '30m ago', 
    thirst: '🔥', 
    lastMessage: 'Hey! How\'s your day going?',
    bio: 'Singer-songwriter with a passion for indie music. Let\'s make beautiful music together!',
    interests: ['Music', 'Singing', 'Guitar', 'Concerts'],
    height: '5\'7"',
    build: 'Slim',
    tribe: 'Artist',
    pronouns: 'she/her',
    lookingFor: ['Dates', 'Creative Partners', 'Music Lovers'],
    relationshipType: 'Single',
    ethnicity: 'White',
    bodyHair: 'Smooth',
    role: 'Bottom',
    smoking: 'No',
    drinking: 'Socially',
    drugs: 'Sometimes',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Singer-Songwriter',
    education: 'Music Conservatory'
  },
  { 
    id: 'drew_m', 
    name: 'Drew M.', 
    age: 28, 
    distance: '0.8 miles', 
    avatar: '🧑‍🏊', 
    time: '2h ago', 
    thirst: '⚡', 
    lastMessage: 'That coffee shop looks amazing!',
    bio: 'Professional swimmer and fitness coach. Dive into adventure with me!',
    interests: ['Swimming', 'Fitness', 'Health', 'Competition'],
    height: '6\'1"',
    build: 'Athletic',
    tribe: 'Jock',
    pronouns: 'he/him',
    lookingFor: ['Dates', 'Fitness Partners', 'Adventure'],
    relationshipType: 'Single',
    ethnicity: 'Latino',
    bodyHair: 'Trimmed',
    role: 'Versatile Top',
    smoking: 'No',
    drinking: 'Rarely',
    drugs: 'Never',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Fitness Coach',
    education: 'Sports Science Degree'
  },
  { 
    id: 'sage_k', 
    name: 'Sage K.', 
    age: 25, 
    distance: '2.1 miles', 
    avatar: '👩‍🌾', 
    time: '1d ago', 
    thirst: '🌶️', 
    lastMessage: 'Would love to check out that art gallery together',
    bio: 'Environmental scientist who loves nature and sustainability. Let\'s grow together!',
    interests: ['Environment', 'Gardening', 'Sustainability', 'Nature'],
    height: '5\'8"',
    build: 'Average',
    tribe: 'Hippie',
    pronouns: 'she/her',
    lookingFor: ['LTR', 'Nature Lovers', 'Eco Warriors'],
    relationshipType: 'Single',
    ethnicity: 'Mixed',
    bodyHair: 'Natural',
    role: 'Versatile',
    smoking: 'No',
    drinking: 'Occasionally',
    drugs: 'Socially',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Environmental Scientist',
    education: 'Master\'s in Environmental Science'
  }
];

const mockRecent = [
  { 
    id: 'blake_t_recent', 
    type: 'match', 
    name: 'Blake T.', 
    age: 26,
    distance: '1.2 miles',
    time: '30m ago', 
    avatar: '👩‍🎤',
    thirst: '🔥',
    bio: 'Singer-songwriter with a passion for indie music.',
    interests: ['Music', 'Singing', 'Guitar', 'Concerts'],
    height: '5\'7"',
    build: 'Slim',
    tribe: 'Artist',
    pronouns: 'she/her',
    lookingFor: ['Dates', 'Creative Partners', 'Music Lovers'],
    relationshipType: 'Single',
    ethnicity: 'White',
    bodyHair: 'Smooth',
    role: 'Bottom',
    smoking: 'No',
    drinking: 'Socially',
    drugs: 'Sometimes',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Singer-Songwriter',
    education: 'Music Conservatory'
  },
  { 
    id: 'alex_m_recent', 
    type: 'view', 
    name: 'Alex M.', 
    age: 28,
    distance: '2 miles',
    time: '2h ago', 
    avatar: '🧑‍💼',
    thirst: '🔥',
    bio: 'Marketing manager who loves hiking and craft beer.',
    interests: ['Hiking', 'Beer', 'Travel', 'Photography'],
    height: '6\'0"',
    build: 'Athletic',
    tribe: 'Jock',
    pronouns: 'he/him',
    lookingFor: ['Dates', 'LTR', 'Friends'],
    relationshipType: 'Single',
    ethnicity: 'White',
    bodyHair: 'Some',
    role: 'Versatile',
    smoking: 'No',
    drinking: 'Socially',
    drugs: 'Never',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Marketing Manager',
    education: 'Bachelor\'s Degree'
  },
  { 
    id: 'morgan_l_recent', 
    type: 'tappd', 
    name: 'Morgan L.', 
    age: 27,
    distance: '1 mile',
    time: '1h ago', 
    avatar: '👩‍⚕️',
    thirst: '⚡',
    bio: 'Doctor with a heart for helping others.',
    interests: ['Medicine', 'Reading', 'Hiking', 'Volunteering'],
    height: '5\'8"',
    build: 'Athletic',
    tribe: 'Professional',
    pronouns: 'she/her',
    lookingFor: ['LTR', 'Friends', 'Hiking Partners'],
    relationshipType: 'Single',
    ethnicity: 'Asian',
    bodyHair: 'Smooth',
    role: 'Versatile',
    smoking: 'No',
    drinking: 'Rarely',
    drugs: 'Never',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Doctor',
    education: 'Medical School'
  },
  { 
    id: 'drew_m_recent', 
    type: 'match', 
    name: 'Drew M.', 
    age: 28,
    distance: '0.8 miles',
    time: '2h ago', 
    avatar: '🧑‍🏊',
    thirst: '⚡',
    bio: 'Professional swimmer and fitness coach.',
    interests: ['Swimming', 'Fitness', 'Health', 'Competition'],
    height: '6\'1"',
    build: 'Athletic',
    tribe: 'Jock',
    pronouns: 'he/him',
    lookingFor: ['Dates', 'Fitness Partners', 'Adventure'],
    relationshipType: 'Single',
    ethnicity: 'Latino',
    bodyHair: 'Trimmed',
    role: 'Versatile Top',
    smoking: 'No',
    drinking: 'Rarely',
    drugs: 'Never',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Fitness Coach',
    education: 'Sports Science Degree'
  },
  { 
    id: 'jordan_k_recent', 
    type: 'view', 
    name: 'Jordan K.', 
    age: 25,
    distance: '1 mile',
    time: '4h ago', 
    avatar: '👩‍🎨',
    thirst: '⚡',
    bio: 'Artist and coffee enthusiast.',
    interests: ['Art', 'Coffee', 'Museums', 'Yoga'],
    height: '5\'7"',
    build: 'Slim',
    tribe: 'Twink',
    pronouns: 'she/her',
    lookingFor: ['Dates', 'Friends', 'Art Partners'],
    relationshipType: 'Single',
    ethnicity: 'Asian',
    bodyHair: 'Smooth',
    role: 'Bottom',
    smoking: 'No',
    drinking: 'Occasionally',
    drugs: 'Never',
    hivPrepStatus: 'Negative, On PrEP',
    occupation: 'Graphic Artist',
    education: 'Art School'
  }
];

const TappdActivityCenter = () => {
  const [activeTab, setActiveTab] = useState('viewers');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [tappedBack, setTappedBack] = useState(new Set());
  const [showNotification, setShowNotification] = useState('');
  const [showChatModal, setShowChatModal] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Check dark mode setting on mount
  useEffect(() => {
    const dark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(dark);
    
    // Clear old conversations with numeric IDs and initialize fresh ones
    const conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
    const hasNumericIds = Object.keys(conversations).some(key => !isNaN(key));
    
    if (hasNumericIds || Object.keys(conversations).length === 0) {
      console.log('🧹 Clearing old conversations and initializing fresh ones');
      const sampleConversations = {
        'blake_t': {
          id: 'blake_t',
          name: 'Blake T.',
          avatar: '👩‍🎤',
          lastMessage: 'Hey! How\'s your day going?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          timeDisplay: '1:30 PM',
          unread: false,
          messages: [
            {
              id: 1,
              text: 'Hey! How\'s your day going?',
              sender: 'them',
              timestamp: '1:30 PM'
            }
          ],
          isPriority: false
        },
        'drew_m': {
          id: 'drew_m',
          name: 'Drew M.',
          avatar: '🧑‍🏊',
          lastMessage: 'That coffee shop looks amazing!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          timeDisplay: '11:30 AM',
          unread: false,
          messages: [
            {
              id: 1,
              text: 'That coffee shop looks amazing!',
              sender: 'them',
              timestamp: '11:30 AM'
            }
          ],
          isPriority: false
        }
      };
      localStorage.setItem('conversations', JSON.stringify(sampleConversations));
      console.log('✅ Initialized fresh conversations with string IDs');
    }
    
    // Listen for dark mode changes from other parts of the app
    const handleStorageChange = (e) => {
      if (e.key === 'darkMode') {
        setDarkMode(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const tabs = [
    { id: 'viewers', label: 'Views', icon: Eye, count: mockViewers.length },
    { id: 'tappds', label: 'Tappds', icon: Heart, count: mockTappds.length },
    { id: 'matches', label: 'Matches', icon: Zap, count: mockMatches.length },
    { id: 'recent', label: 'Recent', icon: Clock, count: mockRecent.length }
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'viewers': return mockViewers;
      case 'tappds': return mockTappds;
      case 'matches': return mockMatches;
      case 'recent': return mockRecent;
      default: return [];
    }
  };

  // Handle tapping back on a profile
  const handleTappBack = (profileId, profileName) => {
    setTappedBack(prev => new Set([...prev, profileId]));
    setShowNotification(`You tapped back on ${profileName}! 💖`);
    setTimeout(() => setShowNotification(''), 3000);
  };

  // Handle clicking on a profile to view details
  const handleProfileClick = (e, profile) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔍 Profile clicked:', profile.name);
    setSelectedProfile(profile);
  };

  // Handle messaging a match - CONNECT TO MAIN APP'S MESSAGE SYSTEM
  const handleMessage = (e, profile) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('💬 Message clicked:', profile.name);
    
    // Check if global chat function exists (from main app)
    if (window.openChatFromMessages) {
      console.log('🔗 Using global chat system');
      // Convert our profile to the format expected by main app
      const conversation = {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar,
        lastMessage: profile.lastMessage || '',
        timestamp: new Date().toISOString(),
        timeDisplay: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        unread: false,
        messages: [],
        isPriority: false
      };
      
      // Save to conversations if not exists
      const conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
      if (!conversations[profile.id]) {
        conversations[profile.id] = conversation;
        localStorage.setItem('conversations', JSON.stringify(conversations));
      }
      
      // Use global chat system
      window.openChatFromMessages(profile.id);
    } else {
      // Fallback to local chat modal
      console.log('📱 Using local chat modal');
      setShowChatModal(profile);
    }
  };

  // Chat Modal Component
  const ChatModal = ({ profile, onClose }) => {
    if (!profile) return null;

    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    // Load existing conversation on mount
    useEffect(() => {
      const conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
      const existing = conversations[profile.id]?.messages || [];
      
      if (existing.length > 0) {
        setChatMessages(existing);
      } else {
        // Initialize with a welcome message if no conversation exists
        const initialMessage = {
          id: Date.now(),
          text: profile.lastMessage || "Hey! How's it going?",
          sender: 'them',
          timestamp: new Date().toLocaleTimeString()
        };
        setChatMessages([initialMessage]);
      }
    }, [profile.id, profile.lastMessage]);

    // Save conversation to localStorage (same format as main app)
    const saveConversationData = (userId, userData, messageList) => {
      const conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      const conversationData = {
        id: userId,
        name: userData.name,
        avatar: userData.avatar || '',
        lastMessage: messageList[messageList.length - 1]?.text || '',
        timestamp: now.toISOString(),
        timeDisplay: timeString,
        unread: false,
        messages: messageList,
        isPriority: false
      };
      
      conversations[userId] = conversationData;
      localStorage.setItem('conversations', JSON.stringify(conversations));
      
      console.log('💾 SAVED CONVERSATION from Activity Center:', conversationData);
      
      // Dispatch events to notify other parts of app
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('conversationUpdated'));
        const storageEvent = new StorageEvent('storage', {
          key: 'conversations',
          newValue: JSON.stringify(conversations),
          url: window.location.href
        });
        window.dispatchEvent(storageEvent);
        
        if (window.refreshMessages) {
          window.refreshMessages();
        }
      }, 100);
      
      return conversations;
    };

    const sendMessage = () => {
      if (message.trim()) {
        const newMsg = {
          id: Date.now(),
          text: message,
          sender: 'me',
          timestamp: new Date().toLocaleTimeString()
        };
        
        const updated = [...chatMessages, newMsg];
        setChatMessages(updated);
        setMessage('');
        
        // Save to localStorage
        saveConversationData(profile.id, profile, updated);
        
        // Simulate response after 2 seconds
        setTimeout(() => {
          const reply = {
            id: Date.now() + 1,
            text: "That sounds great! When would be good for you?",
            sender: 'them',
            timestamp: new Date().toLocaleTimeString()
          };
          const final = [...updated, reply];
          setChatMessages(final);
          
          // Save the reply too
          saveConversationData(profile.id, profile, final);
        }, 2000);
      }
    };

    // Add profile viewing from chat
    const handleViewProfile = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔍 Viewing profile from chat:', profile.name);
      setSelectedProfile(profile);
      setShowChatModal(null);
    };

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl max-w-md w-full h-[600px] flex flex-col`}>
          {/* Chat Header */}
          <div className={`flex items-center gap-3 p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div 
              className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={handleViewProfile}
              title="Click to view profile"
            >
              {profile.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 
                  className={`${darkMode ? 'text-white' : 'text-gray-800'} font-semibold cursor-pointer hover:underline`}
                  onClick={handleViewProfile}
                  title="Click to view profile"
                >
                  {profile.name}
                </h3>
                <button
                  onClick={handleViewProfile}
                  className="text-purple-500 hover:text-purple-600 text-sm"
                  title="View full profile"
                >
                  👤
                </button>
              </div>
              <p className="text-green-400 text-sm">Online</p>
            </div>
            <button onClick={onClose} className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl ${
                  msg.sender === 'me' 
                    ? 'bg-purple-600 text-white' 
                    : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                }`}>
                  <p>{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.timestamp || msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className={`flex-1 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              <button
                onClick={sendMessage}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Profile Modal Component - ENHANCED with full profile details and scrolling
  const ProfileModal = ({ profile, onClose }) => {
    if (!profile) return null;

    console.log('🎭 Rendering ProfileModal for:', profile.name);

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[80] p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
          {/* Header */}
          <div className="relative">
            <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-t-2xl flex items-center justify-center">
              <span className="text-6xl">{profile.avatar}</span>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Profile Info - ENHANCED with full details */}
          <div className="p-6 space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.name}, {profile.age}</h2>
                <span className="text-2xl">{profile.thirst}</span>
              </div>
              <div className={`flex items-center justify-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <MapPin className="w-4 h-4" />
                <span>{profile.distance} away</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>About</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{profile.bio}</p>
            </div>

            {/* Basic Stats */}
            <div className="grid grid-cols-3 gap-4 py-3 bg-purple-50 dark:bg-gray-700 rounded-lg px-3">
              <div className="text-center">
                <div className="text-purple-600 font-semibold">{profile.height}</div>
                <div className="text-xs text-gray-500">Height</div>
              </div>
              <div className="text-center">
                <div className="text-purple-600 font-semibold">{profile.build}</div>
                <div className="text-xs text-gray-500">Build</div>
              </div>
              <div className="text-center">
                <div className="text-purple-600 font-semibold">{profile.relationshipType}</div>
                <div className="text-xs text-gray-500">Status</div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((interest, index) => (
                  <span 
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tribe:</span>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.tribe}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pronouns:</span>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.pronouns}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Looking For:</span>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.lookingFor?.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ethnicity:</span>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.ethnicity}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Body Hair:</span>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.bodyHair}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Role:</span>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.role}</span>
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Lifestyle</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Smoking:</span>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.smoking}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Drinking:</span>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.drinking}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Drugs:</span>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.drugs}</span>
                </div>
              </div>
            </div>

            {/* Health & Safety */}
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Health & Safety</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>HIV/PrEP Status:</span>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.hivPrepStatus}</span>
                </div>
              </div>
            </div>

            {/* Work & Education */}
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Work & Education</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Occupation:</span>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.occupation}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Education:</span>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.education}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {activeTab === 'viewers' && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTappBack(profile.id, profile.name);
                    onClose();
                  }}
                  disabled={tappedBack.has(profile.id)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-colors ${
                    tappedBack.has(profile.id)
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {tappedBack.has(profile.id) ? '✓ Tapped!' : 'Tapp Back'}
                </button>
              )}
              
              {/* Message button for ALL profiles */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMessage(e, profile);
                  onClose();
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Message
              </button>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfileCard = (user) => {
    return (
      <div key={user.id} className={`${darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-white/20 hover:bg-white/25'} backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 transition-colors shadow-sm`}>
        <div 
          className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-105 transition-transform"
          onClick={(e) => handleProfileClick(e, user)}
          title="Click to view full profile"
        >
          {user.avatar}
        </div>
        <div 
          className="flex-1 cursor-pointer"
          onClick={(e) => handleProfileClick(e, user)}
          title="Click to view full profile"
        >
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold text-lg">{user.name}, {user.age}</h3>
            <span className="text-xl">{user.thirst}</span>
          </div>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            {user.distance && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.distance}
              </span>
            )}
            <span>{user.time}</span>
          </div>
          {user.lastMessage && (
            <p className="text-white/80 text-sm italic mt-1">"{user.lastMessage}"</p>
          )}
          {user.type && (
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-3 h-3 rounded-full ${
                user.type === 'match' ? 'bg-green-500' :
                user.type === 'view' ? 'bg-blue-500' :
                'bg-purple-500'
              }`}></span>
              <span className="text-white/70 text-sm">
                {user.type === 'match' ? 'matched with you' :
                 user.type === 'view' ? 'viewed your profile' :
                 'you tapped them'}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'viewers' && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleTappBack(user.id, user.name);
              }}
              disabled={tappedBack.has(user.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                tappedBack.has(user.id)
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {tappedBack.has(user.id) ? '✓ Tapped!' : 'Tapp Back'}
            </button>
          )}
          {activeTab === 'tappds' && user.status && (
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              user.status === 'pending' 
                ? 'bg-yellow-500/20 text-yellow-400' 
                : 'bg-green-500/20 text-green-400'
            }`}>
              {user.status === 'pending' ? 'Pending' : 'Seen'}
            </div>
          )}
          <button
            onClick={(e) => handleMessage(e, user)}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors"
            title="Send message"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700'} text-white pb-20`}>
      {/* Header */}
      <div className={`p-6 border-b ${darkMode ? 'border-white/20' : 'border-white/30'}`}>
        <h2 className="text-2xl font-bold text-white">Activity Center</h2>
        <p className="text-white/70 text-sm mt-1">Click on profiles to view details • Green button to message • Messages are saved • Fixed profile matching!</p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4">
        <div className={`flex ${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm rounded-2xl p-2 shadow-sm`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        {getCurrentData().length > 0 ? (
          <div className="space-y-4">
            {getCurrentData().map((user) => renderProfileCard(user))}
          </div>
        ) : (
          <div className="text-white/70 text-center py-8">No activity yet</div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <ChatModal 
          profile={showChatModal} 
          onClose={() => setShowChatModal(null)} 
        />
      )}

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-40 animate-bounce">
          {showNotification}
        </div>
      )}
    </div>
  );
};

export default TappdActivityCenter;