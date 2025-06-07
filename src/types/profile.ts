export interface Profile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  bio?: string;
  location?: string;
  photos: string[];
  is_online: boolean;
  last_seen?: string;
  distance?: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  expires_at?: string;
  created_at: string;
}

export interface UserLimits {
  profiles_viewed: number;
  messages_sent: number;
  max_profiles: number;
  max_messages: number;
}