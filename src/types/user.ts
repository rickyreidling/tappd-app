export interface User {
  id: string;
  name: string;
  age: number;
  avatar: string;
  distance: number;
  isOnline: boolean;
  lastSeen?: string;
  bio?: string;
  interests: string[];
  photos: string[];
  verified: boolean;
  premium: boolean;
  pronouns?: string;
  bodyType?: string;
  orientation?: string;
  relationshipStatus?: string;
  lookingFor: string[];
  tribe?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    snapchat?: string;
  };
  location?: {
    lat: number;
    lng: number;
    city?: string;
  };
  privacy?: {
    hideDistance?: boolean;
    hideLocation?: boolean;
    incognitoMode?: boolean;
  };
  thirstMode?: boolean;
  isBlocked?: boolean;
  isFavorite?: boolean;
  hasViewedMe?: boolean;
  mutualMatch?: boolean;
}

export interface UserProfile extends User {
  height?: string;
  weight?: string;
  ethnicity?: string;
  relationship?: string;
}

export interface PlanType {
  name: string;
  price: number;
  features: string[];
  maxProfiles: number;
  unlimitedLikes: boolean;
  seeWhoLiked: boolean;
  boosts: number;
}

export interface TapInteraction {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: 'tap' | 'like' | 'woof' | 'flame';
  timestamp: Date;
  mutual?: boolean;
}

export interface FilterOptions {
  ageRange: [number, number];
  distance: number;
  bodyTypes: string[];
  tribes: string[];
  onlineOnly: boolean;
  newMembers: boolean;
  thirstMode: boolean;
  traveling: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image';
  imageUrl?: string;
}