import React from 'react';
import { Badge } from '@/components/ui/badge';

interface InterestTagsProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const INTEREST_TAGS = [
  'Brunch Bitch', 'Dog Dad', 'Astrology Gay', 'Drag Race Fan', 'Bravo Babe',
  'Meme Lord', 'Bookworm', 'Netflix & Chill', 'Theater Kid', 'Cuddler',
  'Twink', 'Daddy', 'Gym Rat', 'Otter', 'Bear', 'Masc4Masc', 'Femboy',
  'Thick & Juicy', 'Soft Top', 'Service Sub', 'Poolside Vibes', 'Beach Bum',
  'Desert Daddy', 'Circuit King', 'Low-Key Introvert', 'Flirty AF',
  'Romantic at Heart', 'Voyeur Curious', 'Monogamish', 'Just Here for the Drama'
];

const InterestTags: React.FC<InterestTagsProps> = ({ selectedTags, onTagToggle }) => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2 min-w-max">
          {INTEREST_TAGS.map(tag => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Badge
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`
                  cursor-pointer transition-all duration-200 whitespace-nowrap
                  px-4 py-2 rounded-full font-medium text-sm
                  ${isSelected 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105' 
                    : 'bg-white border-2 border-purple-200 text-purple-700 hover:border-purple-400 hover:bg-purple-50'
                  }
                `}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InterestTags;