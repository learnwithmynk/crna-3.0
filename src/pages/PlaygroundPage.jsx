/**
 * Component Playground Page
 *
 * A development page to view and test all UI components.
 * This helps ensure consistent styling and behavior across the app.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { BookOpen, Heart, Calendar, Users, Target } from 'lucide-react';

export default function PlaygroundPage() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [selectedState, setSelectedState] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Component Playground</h1>
          <p className="text-gray-600">Testing and reference for all UI components</p>
        </div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Different button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button>Default (Yellow)</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Cards</CardTitle>
            <CardDescription>Card component with different sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Simple Card</CardTitle>
                  <CardDescription>With header and content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    This is a simple card with basic content.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md hover:border-gray-200 transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>Hover to see effect</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    This card has hover effects for interactive elements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Card with Footer</CardTitle>
                  <CardDescription>Including action buttons</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Card content goes here.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badges & Status</CardTitle>
            <CardDescription>Status badges and tags</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Standard Badge variants */}
            <div>
              <p className="text-sm font-medium mb-2">Standard Badges</p>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            {/* Application Status Badges */}
            <div>
              <p className="text-sm font-medium mb-2">Application Workflow Statuses</p>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="not_started" />
                <StatusBadge status="in_progress" />
                <StatusBadge status="submitted" />
                <StatusBadge status="interview_invite" />
                <StatusBadge status="interview_complete" />
                <StatusBadge status="waitlisted" />
                <StatusBadge status="denied" />
                <StatusBadge status="accepted" />
              </div>
            </div>

            {/* Generic Statuses */}
            <div>
              <p className="text-sm font-medium mb-2">Generic Statuses</p>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="completed" />
                <StatusBadge status="pending" />
                <StatusBadge status="confirmed" />
                <StatusBadge status="cancelled" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Form Inputs</CardTitle>
            <CardDescription>Input fields and form controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Text Input</label>
              <Input placeholder="Enter your email..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password Input</label>
              <Input type="password" placeholder="Enter password..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Disabled Input</label>
              <Input disabled value="Disabled field" />
            </div>
          </CardContent>
        </Card>

        {/* Checkbox */}
        <Card>
          <CardHeader>
            <CardTitle>Checkboxes</CardTitle>
            <CardDescription>Checkbox component examples</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkbox1"
                checked={checkboxChecked}
                onCheckedChange={setCheckboxChecked}
              />
              <label
                htmlFor="checkbox1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Accept terms and conditions
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="checkbox2" defaultChecked />
              <label
                htmlFor="checkbox2"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Already checked
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="checkbox3" disabled />
              <label
                htmlFor="checkbox3"
                className="text-sm font-medium leading-none opacity-70"
              >
                Disabled checkbox
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Select */}
        <Card>
          <CardHeader>
            <CardTitle>Select Dropdown</CardTitle>
            <CardDescription>Dropdown select component</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select a state</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="fl">Florida</SelectItem>
                  <SelectItem value="il">Illinois</SelectItem>
                  <SelectItem value="pa">Pennsylvania</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedState && (
              <p className="text-sm text-gray-600">
                Selected: <strong>{selectedState.toUpperCase()}</strong>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>Tab navigation component</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="clinical">
              <TabsList className="w-full">
                <TabsTrigger value="clinical">Clinical</TabsTrigger>
                <TabsTrigger value="eq">EQ Tracker</TabsTrigger>
                <TabsTrigger value="shadow">Shadow Days</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              <TabsContent value="clinical" className="space-y-2">
                <h3 className="font-semibold">Clinical Experience</h3>
                <p className="text-sm text-gray-600">
                  Track your ICU clinical hours and patient populations here.
                </p>
              </TabsContent>
              <TabsContent value="eq" className="space-y-2">
                <h3 className="font-semibold">EQ Tracker</h3>
                <p className="text-sm text-gray-600">
                  Monitor your emotional intelligence development and practice.
                </p>
              </TabsContent>
              <TabsContent value="shadow" className="space-y-2">
                <h3 className="font-semibold">Shadow Days</h3>
                <p className="text-sm text-gray-600">
                  Log your CRNA shadowing experiences and reflections.
                </p>
              </TabsContent>
              <TabsContent value="events" className="space-y-2">
                <h3 className="font-semibold">Events</h3>
                <p className="text-sm text-gray-600">
                  View and register for AANA meetings and conferences.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Empty States */}
        <Card>
          <CardHeader>
            <CardTitle>Empty States</CardTitle>
            <CardDescription>Empty state component examples</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={BookOpen}
              title="No programs saved yet"
              description="Start by exploring the school database to find programs that match your goals."
            />
          </CardContent>
        </Card>

        {/* Skeletons */}
        <Card>
          <CardHeader>
            <CardTitle>Loading Skeletons</CardTitle>
            <CardDescription>Skeleton loaders for content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>

        {/* Icons */}
        <Card>
          <CardHeader>
            <CardTitle>Icons</CardTitle>
            <CardDescription>Common icons used in the app (Lucide React)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col items-center gap-2">
                <Heart className="w-8 h-8 text-gray-700" />
                <span className="text-xs text-gray-600">Heart</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <BookOpen className="w-8 h-8 text-gray-700" />
                <span className="text-xs text-gray-600">BookOpen</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Calendar className="w-8 h-8 text-gray-700" />
                <span className="text-xs text-gray-600">Calendar</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Users className="w-8 h-8 text-gray-700" />
                <span className="text-xs text-gray-600">Users</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Target className="w-8 h-8 text-gray-700" />
                <span className="text-xs text-gray-600">Target</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>The CRNA Club brand colors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-xl bg-yellow-400 border-2 border-gray-200"></div>
                <p className="text-xs font-medium">Yellow 400</p>
                <p className="text-xs text-gray-500">#f6ff88</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-xl bg-green-500 border-2 border-gray-200"></div>
                <p className="text-xs font-medium">Green 500</p>
                <p className="text-xs text-gray-500">#10B981</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-xl bg-orange-500 border-2 border-gray-200"></div>
                <p className="text-xs font-medium">Orange 500</p>
                <p className="text-xs text-gray-500">#F59E0B</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-xl bg-gray-900 border-2 border-gray-200"></div>
                <p className="text-xs font-medium">Gray 900</p>
                <p className="text-xs text-gray-500">#1A1A1A</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
