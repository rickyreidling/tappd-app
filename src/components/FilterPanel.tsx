import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterPanelProps {
  onApplyFilters: (filters: any) => void;
  isPremium: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onApplyFilters, isPremium }) => {
  const [filters, setFilters] = useState({
    ageRange: [18, 50],
    distance: [5],
    onlineOnly: false,
    withPhotosOnly: false,
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim() && !filters.tags.includes(newTag.trim())) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const clearFilters = () => {
    setFilters({
      ageRange: [18, 50],
      distance: [5],
      onlineOnly: false,
      withPhotosOnly: false,
      tags: []
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Filters
          {!isPremium && (
            <Badge variant="outline" className="text-xs">
              Limited
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}</Label>
          <Slider
            value={filters.ageRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, ageRange: value }))}
            min={18}
            max={80}
            step={1}
            className="mt-2"
          />
        </div>
        
        <div>
          <Label>Distance: {filters.distance[0]} km</Label>
          <Slider
            value={filters.distance}
            onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value }))}
            min={1}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label>Online Now</Label>
          <Switch
            checked={filters.onlineOnly}
            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, onlineOnly: checked }))}
            disabled={!isPremium}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label>With Photos Only</Label>
          <Switch
            checked={filters.withPhotosOnly}
            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, withPhotosOnly: checked }))}
          />
        </div>
        
        <div>
          <Label>Interests/Tags</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add interest"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              disabled={!isPremium && filters.tags.length >= 2}
            />
            <Button type="button" onClick={addTag} size="sm" disabled={!isPremium && filters.tags.length >= 2}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {filters.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
          {!isPremium && filters.tags.length >= 2 && (
            <p className="text-xs text-muted-foreground mt-1">
              Upgrade to Premium for unlimited tags
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;