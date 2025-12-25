/**
 * TrackerTabs - Tab navigation for tracker pages
 * Provides navigation between Clinical, EQ Tracker, Shadow Days, and Events
 */

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Brain, Calendar, Users } from 'lucide-react';

export function TrackerTabs({ activeTab, onTabChange }) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full grid grid-cols-4 h-auto">
        <TabsTrigger value="clinical" className="flex items-center gap-2 py-2">
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Clinical</span>
        </TabsTrigger>
        <TabsTrigger value="eq" className="flex items-center gap-2 py-2">
          <Brain className="h-4 w-4" />
          <span className="hidden sm:inline">EQ Tracker</span>
        </TabsTrigger>
        <TabsTrigger value="shadow" className="flex items-center gap-2 py-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Shadow Days</span>
        </TabsTrigger>
        <TabsTrigger value="events" className="flex items-center gap-2 py-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Events</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
