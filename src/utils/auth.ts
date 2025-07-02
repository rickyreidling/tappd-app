export const isUserPro = (profile: any): boolean => {
  // Adjust this logic based on how you track paid status
  return profile?.isPaid === true || profile?.subscription === 'pro';
};
