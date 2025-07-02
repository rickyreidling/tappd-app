export const isUserPro = () => {
  const subData = window?.profileData?.subscription || null;
  return subData?.status === 'active';
};
