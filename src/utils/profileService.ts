import { supabase } from './supabaseClient';

export const getProfilesNearby = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, age, bio, location, photos')
    .order('updated_at', { ascending: false }) // show recently updated first
    .limit(60); // show up to 60 free profiles

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return data;
};
