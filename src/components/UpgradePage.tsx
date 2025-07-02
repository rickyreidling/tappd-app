import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, Eye, Filter, Image, MessageCircle, Zap } from 'lucide-react';
import PricingPlans from '@/components/PricingPlans'; // adjust path if needed

const UpgradePage: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: <Heart />, title: 'Unlimited Taps & Likes', description: 'No daily limits – tap and like as much as you want', tag: 'Popular' },
    { icon: <Filter />, title: 'Advanced Filters', description: 'Filter by body type, age, distance, orientation & thirst mode', tag: 'Premium' },
    { icon: <Eye />, title: 'Incognito Mode', description: 'Browse privately without showing online status', tag: 'Stealth' },
    { icon: <MessageCircle />, title: 'Priority Messaging', description: 'Appear at the top of inboxes and bypass message limits', tag: 'VIP' },
    { icon: <Zap />, title: 'Custom Thirst Badge', description: 'Choose your thirst icon: 🔥 🍑 🍆 🎯 or 🧃', tag: 'Fun' },
    { icon: <Image />, title: 'Profile Themes', description: 'Customize your profile with premium color themes', tag: 'Style' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 text-purple-600 font-semibold">&larr; Back</button>

      <div className="bg-yellow-50 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-center mb-4">
          👑 PRO Features
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Unlock premium features and supercharge your connections
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="text-purple-600">{item.icon}</div>
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
                {item.tag && <span className="text-xs text-white bg-purple-500 px-2 py-1 rounded-full inline-block mt-1">{item.tag}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-xl font-bold text-center mb-4">Choose Your Plan</h3>
      <PricingPlans />
    </div>
  );
};

export default UpgradePage;
