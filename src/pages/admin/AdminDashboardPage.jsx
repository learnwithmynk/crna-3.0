/**
 * AdminDashboardPage
 *
 * Central hub for admin functionality with navigation cards to all admin sections.
 * Route: /admin
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { useModules } from '@/hooks/useModules';
import { useDownloads } from '@/hooks/useDownloads';
import { useCategories } from '@/hooks/useCategories';
import { useEntitlements } from '@/hooks/useEntitlements';
import {
  BookOpen,
  Download,
  Tag,
  Shield,
  Trophy,
  ChevronRight,
  Settings,
  Store,
  GraduationCap,
  Flag,
  Lock,
} from 'lucide-react';
import { useAdminCourseSubmissions } from '@/hooks/useAdminCourseSubmissions';

function AdminCard({ to, icon: Icon, title, description, count, pendingCount, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    pink: 'bg-pink-50 text-pink-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <Link to={to}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-right">
              {count !== undefined && (
                <span className="text-2xl font-bold text-gray-900">{count}</span>
              )}
              {pendingCount > 0 && (
                <div className="text-xs text-orange-600 font-medium mt-1">
                  {pendingCount} pending
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
              {title}
              <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function AdminDashboardPage() {
  const { modules } = useModules({ adminMode: true });
  const { downloads } = useDownloads();
  const { categories } = useCategories();
  const { entitlements } = useEntitlements();
  const { counts: prerequisiteCounts } = useAdminCourseSubmissions('all');

  // Mock count for user reports - TODO: Replace with real hook
  const userReportsPendingCount = 2;

  const adminSections = [
    {
      to: '/admin/modules',
      icon: BookOpen,
      title: 'Modules',
      description: 'Manage learning modules, sections, and lessons',
      count: modules?.length || 0,
      color: 'blue',
    },
    {
      to: '/admin/downloads',
      icon: Download,
      title: 'Downloads',
      description: 'Manage downloadable resources and files',
      count: downloads?.length || 0,
      color: 'green',
    },
    {
      to: '/admin/categories',
      icon: Tag,
      title: 'Categories',
      description: 'Organize content with categories',
      count: categories?.length || 0,
      color: 'purple',
    },
    {
      to: '/admin/entitlements',
      icon: Shield,
      title: 'Entitlements',
      description: 'Control who can access what content',
      count: entitlements?.length || 0,
      color: 'orange',
    },
    {
      to: '/admin/access-control',
      icon: Lock,
      title: 'Access Control',
      description: 'Manage resource protection and access rules',
      color: 'orange',
    },
    {
      to: '/admin/points',
      icon: Trophy,
      title: 'Points Config',
      description: 'Configure gamification points and promotions',
      color: 'pink',
    },
    {
      to: '/admin/marketplace',
      icon: Store,
      title: 'Marketplace',
      description: 'Manage providers, bookings, and disputes',
      color: 'purple',
    },
    {
      to: '/admin/prerequisite-courses',
      icon: GraduationCap,
      title: 'Prerequisites',
      description: 'Moderate user-submitted prerequisite courses',
      count: prerequisiteCounts?.total || 0,
      pendingCount: prerequisiteCounts?.pending || 0,
      color: 'yellow',
    },
    {
      to: '/admin/user-reports',
      icon: Flag,
      title: 'School Data',
      description: 'Review school corrections and event suggestions',
      pendingCount: userReportsPendingCount,
      color: 'red',
    },
  ];

  const breadcrumbs = [{ label: 'Admin' }];

  return (
    <PageWrapper
      title="Admin Dashboard"
      description="Manage your CRNA Club content and settings"
      breadcrumbs={breadcrumbs}
    >
      {/* Welcome Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Admin Control Panel</h2>
        </div>
        <p className="text-blue-100">
          Manage learning content, downloads, access control, and gamification settings.
        </p>
      </div>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => (
          <AdminCard key={section.to} {...section} />
        ))}
      </div>

      {/* Quick Tips */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl border">
        <h3 className="font-medium text-gray-900 mb-2">Quick Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Create <strong>Entitlements</strong> first, then assign them to Modules and Downloads</li>
          <li>• <strong>Categories</strong> help organize content and are shared across modules and downloads</li>
          <li>• Use <strong>Points Config</strong> to set up gamification rewards and promotional multipliers</li>
        </ul>
      </div>
    </PageWrapper>
  );
}

export default AdminDashboardPage;
