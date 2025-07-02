
import NearbyProfilesGrid from '@/components/NearbyProfilesGrid';
import React, { useEffect, useState } from 'react';




const ProfileGrid = () => {
  const [profiles, setProfiles] = useState([]);
  const [blurRest, setBlurRest] = useState(false);

  const fetchProfiles = async () => {
    const realProfiles = await getProfilesNearby();
const fakeProfiles = Array.from({ length: 94 }, (_, i) => ({
  id: `fake-${i}`,
  name: `TestUser${i + 1}`,
  age: 30,
  bio: 'Fake profile for testing',
  location: 'Test City',
  avatar_url: '/placeholder.svg',
  isFake: true,
}));
const allProfiles = [...realProfiles, ...fakeProfiles];

const isPro = isUserPro();
if (!isPro && allProfiles.length > 60) {
  setBlurRest(true);
}

setProfiles(allProfiles);

  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {profiles.map((profile, index) => (
        <div key={profile.id} className="relative">
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className={`w-full h-40 object-cover rounded-lg ${blurRest && index >= 60 ? 'blur-sm' : ''}`}
          />
          <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
            {profile.distance} miles away
          </div>
        </div>
      ))}
      {!isUserPro() && blurRest && (
        <div className="col-span-full text-center text-sm text-gray-600">
          You've viewed 60 profiles. <br />
          <button className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600" onClick={() => window.location.href = '/pro'}>
            Upgrade to Tappd PRO
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileGrid;
