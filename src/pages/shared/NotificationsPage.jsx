/**
 * NotificationsPage
 *
 * Full notifications page showing all user notifications.
 * Supports filtering by type, marking as read, and navigation.
 * Route: /notifications
 */

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Filter,
  Calendar,
  MessageSquare,
  Star,
  CreditCard,
  AlertCircle,
  Settings,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  useNotifications,
  useNotificationActions,
  useNotificationHelpers,
  NOTIFICATION_TYPES
} from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

/**
 * Notification type categories for filtering
 */
const NOTIFICATION_CATEGORIES = [
  { value: 'all', label: 'All', icon: Bell },
  { value: 'bookings', label: 'Bookings', icon: Calendar },
  { value: 'messages', label: 'Messages', icon: MessageSquare },
  { value: 'reviews', label: 'Reviews', icon: Star },
  { value: 'payments', label: 'Payments', icon: CreditCard }
];

/**
 * Map notification types to categories
 */
function getNotificationCategory(type) {
  const categoryMap = {
    [NOTIFICATION_TYPES.BOOKING_REQUEST]: 'bookings',
    [NOTIFICATION_TYPES.BOOKING_CONFIRMED]: 'bookings',
    [NOTIFICATION_TYPES.BOOKING_DECLINED]: 'bookings',
    [NOTIFICATION_TYPES.BOOKING_CANCELLED]: 'bookings',
    [NOTIFICATION_TYPES.BOOKING_REMINDER]: 'bookings',
    [NOTIFICATION_TYPES.BOOKING_COMPLETED]: 'bookings',
    [NOTIFICATION_TYPES.NEW_INQUIRY]: 'messages',
    [NOTIFICATION_TYPES.INQUIRY_REPLY]: 'messages',
    [NOTIFICATION_TYPES.REVIEW_REQUEST]: 'reviews',
    [NOTIFICATION_TYPES.REVIEW_RECEIVED]: 'reviews',
    [NOTIFICATION_TYPES.PAYOUT_PROCESSED]: 'payments',
    [NOTIFICATION_TYPES.PROVIDER_APPROVED]: 'system'
  };
  return categoryMap[type] || 'system';
}

/**
 * Get icon component for notification type
 */
function getNotificationIcon(type) {
  const iconMap = {
    [NOTIFICATION_TYPES.BOOKING_REQUEST]: Calendar,
    [NOTIFICATION_TYPES.BOOKING_CONFIRMED]: Calendar,
    [NOTIFICATION_TYPES.BOOKING_DECLINED]: Calendar,
    [NOTIFICATION_TYPES.BOOKING_CANCELLED]: Calendar,
    [NOTIFICATION_TYPES.BOOKING_REMINDER]: Calendar,
    [NOTIFICATION_TYPES.BOOKING_COMPLETED]: Calendar,
    [NOTIFICATION_TYPES.NEW_INQUIRY]: MessageSquare,
    [NOTIFICATION_TYPES.INQUIRY_REPLY]: MessageSquare,
    [NOTIFICATION_TYPES.REVIEW_REQUEST]: Star,
    [NOTIFICATION_TYPES.REVIEW_RECEIVED]: Star,
    [NOTIFICATION_TYPES.PAYOUT_PROCESSED]: CreditCard,
    [NOTIFICATION_TYPES.PROVIDER_APPROVED]: Bell
  };
  return iconMap[type] || Bell;
}

/**
 * Get background color for notification type
 */
function getNotificationColor(type) {
  const colorMap = {
    [NOTIFICATION_TYPES.BOOKING_CONFIRMED]: 'bg-green-100 text-green-600',
    [NOTIFICATION_TYPES.BOOKING_COMPLETED]: 'bg-green-100 text-green-600',
    [NOTIFICATION_TYPES.BOOKING_DECLINED]: 'bg-red-100 text-red-600',
    [NOTIFICATION_TYPES.BOOKING_CANCELLED]: 'bg-red-100 text-red-600',
    [NOTIFICATION_TYPES.BOOKING_REQUEST]: 'bg-yellow-100 text-yellow-600',
    [NOTIFICATION_TYPES.BOOKING_REMINDER]: 'bg-yellow-100 text-yellow-600',
    [NOTIFICATION_TYPES.NEW_INQUIRY]: 'bg-blue-100 text-blue-600',
    [NOTIFICATION_TYPES.INQUIRY_REPLY]: 'bg-blue-100 text-blue-600',
    [NOTIFICATION_TYPES.REVIEW_REQUEST]: 'bg-purple-100 text-purple-600',
    [NOTIFICATION_TYPES.REVIEW_RECEIVED]: 'bg-purple-100 text-purple-600',
    [NOTIFICATION_TYPES.PAYOUT_PROCESSED]: 'bg-green-100 text-green-600',
    [NOTIFICATION_TYPES.PROVIDER_APPROVED]: 'bg-primary/10 text-primary'
  };
  return colorMap[type] || 'bg-gray-100 text-gray-600';
}

/**
 * Single notification item
 */
function NotificationItem({ notification, onMarkRead, onNavigate }) {
  const { formatTime } = useNotificationHelpers();
  const Icon = getNotificationIcon(notification.type);
  const colorClass = getNotificationColor(notification.type);
  const isUnread = !notification.readAt;

  const handleClick = () => {
    if (isUnread) {
      onMarkRead(notification.id);
    }
    onNavigate(notification.link);
  };

  return (
    <div
      onClick={handleClick}
      data-testid="notification-item"
      className={cn(
        'flex gap-4 p-4 rounded-xl cursor-pointer transition-colors border',
        isUnread
          ? 'bg-primary/5 border-primary/20 hover:bg-primary/10'
          : 'bg-white border-gray-100 hover:bg-gray-50'
      )}
    >
      {/* Icon */}
      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', colorClass)}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn('font-medium truncate', isUnread && 'text-primary')}>
            {notification.title}
          </h4>
          <span className="text-xs text-gray-500 shrink-0">
            {formatTime(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
          {notification.body}
        </p>
      </div>

      {/* Unread indicator */}
      {isUnread && (
        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
      )}

      {/* Chevron */}
      <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 self-center" />
    </div>
  );
}

/**
 * Loading skeleton for notifications
 */
function NotificationSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex gap-4 p-4 border rounded-xl">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Empty state
 */
function EmptyState({ category }) {
  const messages = {
    all: "You don't have any notifications yet.",
    bookings: "No booking notifications.",
    messages: "No message notifications.",
    reviews: "No review notifications.",
    payments: "No payment notifications."
  };

  return (
    <Card className="p-8 text-center">
      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">{messages[category] || messages.all}</p>
    </Card>
  );
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  // TODO: Get actual user ID from auth context
  const userId = 'user_001';

  // Fetch notifications
  const { notifications, unreadCount, loading } = useNotifications({
    userId,
    limit: 50
  });

  const { markAsRead, markAllAsRead, loading: actionLoading } = useNotificationActions();

  // Filter notifications by category
  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'all') return notifications;

    return notifications.filter(n =>
      getNotificationCategory(n.type) === activeCategory
    );
  }, [notifications, activeCategory]);

  // Count unread per category
  const unreadByCategory = useMemo(() => {
    const counts = { all: 0, bookings: 0, messages: 0, reviews: 0, payments: 0 };

    notifications.forEach(n => {
      if (!n.readAt) {
        counts.all++;
        const cat = getNotificationCategory(n.type);
        if (counts[cat] !== undefined) {
          counts[cat]++;
        }
      }
    });

    return counts;
  }, [notifications]);

  // Handle mark as read
  const handleMarkRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  // Handle navigation
  const handleNavigate = (link) => {
    if (link) {
      navigate(link);
    }
  };

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    await markAllAsRead(userId);
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Notifications' }
  ];

  return (
    <PageWrapper breadcrumbs={breadcrumbs}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mark all as read button */}
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={actionLoading}
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}

            {/* Settings dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/settings/notifications">
                    <Settings className="w-4 h-4 mr-2" />
                    Notification settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Category tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            {NOTIFICATION_CATEGORIES.map(cat => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="relative"
              >
                <cat.icon className="w-4 h-4 mr-1.5" />
                {cat.label}
                {unreadByCategory[cat.value] > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-1.5 h-5 min-w-[20px] px-1.5 text-xs"
                  >
                    {unreadByCategory[cat.value]}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Notifications list */}
        {loading ? (
          <NotificationSkeleton />
        ) : filteredNotifications.length === 0 ? (
          <EmptyState category={activeCategory} />
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        )}

        {/* Load more (if needed in future) */}
        {filteredNotifications.length >= 50 && (
          <div className="text-center mt-6">
            <Button variant="outline" disabled>
              Load more notifications
            </Button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default NotificationsPage;
