/**
 * MentorRecommendationsPreview
 *
 * Preview page to demonstrate the Smart Mentor Recommendations widget.
 * Access at: /preview/mentor-recommendations
 */

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MentorAvatarStack } from '@/components/features/marketplace/MentorAvatarStack';
import { MentorRecommendationsPopup } from '@/components/features/marketplace/MentorRecommendationsPopup';
import { MentorRecommendationCard } from '@/components/features/marketplace/MentorRecommendationCard';
import { RecommendedMentorsWidget } from '@/components/features/marketplace/RecommendedMentorsWidget';
import { Users, Eye, Sparkles } from 'lucide-react';

// Mock mentors for preview (since we may not have real data)
const MOCK_MENTORS = [
  {
    id: 'preview_1',
    name: 'Sarah Chen',
    program: 'Duke University',
    programName: 'Duke University',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 4.9,
    reviewCount: 23,
    specializations: ['mock_interview', 'essay_review'],
    availableThisWeek: true,
    previousIcuType: 'cvicu',
    responseTimeMinutes: 120,
  },
  {
    id: 'preview_2',
    name: 'Marcus Johnson',
    program: 'Emory University',
    programName: 'Emory University',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 4.7,
    reviewCount: 15,
    specializations: ['strategy_session', 'resume_review'],
    availableThisWeek: true,
    previousIcuType: 'micu',
    responseTimeMinutes: 90,
  },
  {
    id: 'preview_3',
    name: 'Jessica Martinez',
    program: 'UCSF',
    programName: 'UCSF',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5.0,
    reviewCount: 42,
    specializations: ['essay_review', 'mock_interview'],
    availableThisWeek: false,
    previousIcuType: 'neuro_icu',
    responseTimeMinutes: 180,
  },
];

const MOCK_MATCH_DATA = [
  { provider: MOCK_MENTORS[0], score: 85, reasons: ['Available this week', '4.9★ rating'] },
  { provider: MOCK_MENTORS[1], score: 72, reasons: ['Quick responder', 'Also MICU'] },
  { provider: MOCK_MENTORS[2], score: 65, reasons: ['5.0★ rating', 'Essay expert'] },
];

export function MentorRecommendationsPreview() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [widgetPopupOpen, setWidgetPopupOpen] = useState(false);

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">Preview</Badge>
          <h1 className="text-2xl font-bold mb-2">Smart Mentor Recommendations</h1>
          <p className="text-muted-foreground">
            Preview of the mentor recommendation widget that shows 3 overlapping avatars.
            Click anywhere on the avatars to see the popup.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Components */}
          <div className="space-y-6">
            {/* Avatar Stack Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Avatar Stack (Standalone)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl">
                  <MentorAvatarStack
                    mentors={MOCK_MENTORS}
                    onClick={() => setPopupOpen(true)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  Click the avatars to open the popup →
                </p>
              </CardContent>
            </Card>

            {/* Widget Demo (Card Style) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Full Widget (as shown in sidebar)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Card className="p-3 bg-gray-50">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Get mentor help</span>
                    </div>
                    <MentorAvatarStack
                      mentors={MOCK_MENTORS}
                      onClick={() => setWidgetPopupOpen(true)}
                    />
                  </div>
                </Card>
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  This is how it appears in the Dashboard sidebar
                </p>
              </CardContent>
            </Card>

            {/* Live Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Live Widget (using real hook)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecommendedMentorsWidget
                  context="dashboard"
                  title="Mentors who can help"
                />
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  Uses real useRecommendedMentors hook - may be hidden if no providers
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Cards */}
          <div className="space-y-6">
            {/* Individual Cards Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recommendation Cards (Popup Content)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_MENTORS.map((mentor, i) => (
                  <MentorRecommendationCard
                    key={mentor.id}
                    mentor={mentor}
                    reasons={MOCK_MATCH_DATA[i]?.reasons || []}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Matching Algorithm</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• Focus area alignment (40 pts)</li>
                <li>• Availability (30 pts)</li>
                <li>• Rating quality (20 pts)</li>
                <li>• ICU background (15 pts)</li>
                <li>• Target program (25 pts)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Placement</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• Dashboard sidebar</li>
                <li>• School Profile sidebar</li>
                <li>• Hidden if no mentors</li>
                <li>• Always shows 3 avatars</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Behavior</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• Click opens popup sheet</li>
                <li>• Shows match reasons</li>
                <li>• Links to profile & message</li>
                <li>• Never shows empty state</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popups */}
      <MentorRecommendationsPopup
        open={popupOpen}
        onOpenChange={setPopupOpen}
        mentors={MOCK_MENTORS}
        matchData={MOCK_MATCH_DATA}
        title="Mentors who can help"
        description="Based on your focus areas and goals"
      />

      <MentorRecommendationsPopup
        open={widgetPopupOpen}
        onOpenChange={setWidgetPopupOpen}
        mentors={MOCK_MENTORS}
        matchData={MOCK_MATCH_DATA}
        title="Mentors who can help"
      />
    </PageWrapper>
  );
}

export default MentorRecommendationsPreview;
