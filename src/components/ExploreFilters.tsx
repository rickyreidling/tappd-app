import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

interface ExploreFiltersProps {
  onAgeRangeChange: (min: number, max: number) => void;
  onOnlineToggle: (online: boolean) => void;
  onPhotoToggle: (hasPhoto: boolean) => void;
  onlineOnly: boolean;
  photoOnly: boolean;
}

const ageRanges = [
  { label: '18–25', min: 18, max: 25 },
  { label: '26–30', min: 26, max: 30 },
  { label: '31–35', min: 31, max: 35 },
  { label: '36+', min: 36, max: 99 }
];

export function ExploreFilters({
  onAgeRangeChange,
  onOnlineToggle,
  onPhotoToggle,
  onlineOnly,
  photoOnly
}: ExploreFiltersProps) {
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>('');

  const handleAgeRangeClick = (range: typeof ageRanges[0], label: string) => {
    if (selectedAgeRange === label) {
      setSelectedAgeRange('');
      onAgeRangeChange(18, 99);
    } else {
      setSelectedAgeRange(label);
      onAgeRangeChange(range.min, range.max);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 space-y-4">
      {/* Age Range */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Age Range</Label>
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {ageRanges.map((range) => (
              <Badge
                key={range.label}
                variant={selectedAgeRange === range.label ? 'default' : 'outline'}
                className={`cursor-pointer whitespace-nowrap transition-all duration-200 hover:scale-105 rounded-full px-4 py-2 text-sm font-medium ${
                  selectedAgeRange === range.label
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md'
                    : 'hover:bg-gray-100 border-gray-300 text-gray-700'
                }`}
                onClick={() => handleAgeRangeClick(range, range.label)}
              >
                {range.label}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="online-toggle"
            checked={onlineOnly}
            onCheckedChange={onOnlineToggle}
          />
          <Label htmlFor="online-toggle" className="text-sm text-gray-700">
            Online Now
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="photo-toggle"
            checked={photoOnly}
            onCheckedChange={onPhotoToggle}
          />
          <Label htmlFor="photo-toggle" className="text-sm text-gray-700">
            Only show with photo
          </Label>
        </div>
      </div>
    </div>
  );
}