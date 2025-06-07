import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const AdvancedFilters: React.FC = () => {
  const { isPremium } = useAppContext();
  const [ageRange, setAgeRange] = useState([18, 35]);
  const [distance, setDistance] = useState([25]);
  const [thirstModeOnly, setThirstModeOnly] = useState(false);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);

  const bodyTypeOptions = ['Slim', 'Athletic', 'Average', 'Muscular', 'Curvy', 'Plus Size'];
  const orientationOptions = ['Gay', 'Bi', 'Curious', 'Trans', 'Queer'];

  if (!isPremium) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">PRO Feature</h3>
          <p className="text-gray-600">Upgrade to PRO for advanced filtering options</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-2 block">Age Range: {ageRange[0]} - {ageRange[1]}</Label>
          <Slider value={ageRange} onValueChange={setAgeRange} max={60} min={18} step={1} className="w-full" />
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-2 block">Distance: {distance[0]} miles</Label>
          <Slider value={distance} onValueChange={setDistance} max={100} min={1} step={1} className="w-full" />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="thirst-mode" checked={thirstModeOnly} onCheckedChange={setThirstModeOnly} />
          <Label htmlFor="thirst-mode">Thirst Mode Only</Label>
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-2 block">Body Types</Label>
          <div className="grid grid-cols-2 gap-2">
            {bodyTypeOptions.map((type) => (
              <Button
                key={type}
                variant={bodyTypes.includes(type) ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setBodyTypes(prev => 
                    prev.includes(type) 
                      ? prev.filter(t => t !== type)
                      : [...prev, type]
                  );
                }}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        
        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;