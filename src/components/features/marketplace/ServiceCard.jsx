/**
 * ServiceCard Component
 *
 * Displays a service offering from a mentor.
 * Shows service details, price, and appropriate CTA based on booking model.
 */

import { Link } from 'react-router-dom';
import { Clock, FileText, Video, MessageSquare, Zap, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Get service type config
 */
const SERVICE_CONFIG = {
  mock_interview: {
    icon: Video,
    label: 'Mock Interview',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Practice your interview skills with real-time feedback'
  },
  essay_review: {
    icon: FileText,
    label: 'Essay Review',
    color: 'bg-green-50 text-green-700 border-green-200',
    description: 'Get detailed feedback on your personal statement'
  },
  strategy_session: {
    icon: MessageSquare,
    label: 'Coaching Session',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'One-on-one guidance for your application journey'
  },
  school_qa: {
    icon: Calendar,
    label: 'Q&A Call',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    description: 'Ask questions about programs and the application process'
  }
};

export function ServiceCard({
  service,
  provider,
  isUnavailable = false,
  variant = 'default',
  className
}) {
  const config = SERVICE_CONFIG[service.type] || SERVICE_CONFIG.school_qa;
  const Icon = config.icon;

  const canInstantBook = provider?.instantBookEnabled && service.instantBookEnabled;
  const isAsync = service.type === 'essay_review' && !service.duration;

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center justify-between p-3 rounded-xl border bg-white',
          className
        )}
        data-testid="service-card"
      >
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-xl', config.color)}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-sm">{service.title || config.label}</p>
            {service.duration && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {service.duration} min
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold">${service.price}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)} data-testid="service-card">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn('p-2.5 rounded-xl', config.color)}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {service.title || config.label}
              </h4>
              <Badge variant="secondary" className="mt-1 text-xs">
                {config.label}
              </Badge>
            </div>
          </div>

          {/* Instant Book Badge */}
          {canInstantBook && !isUnavailable && (
            <Badge variant="default" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Instant
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          {service.description || config.description}
        </p>

        {/* Details Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          {service.duration ? (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {service.duration} minutes
            </span>
          ) : isAsync ? (
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {service.deliveryDays || 3} day turnaround
            </span>
          ) : null}
        </div>

        {/* Footer: Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">${service.price}</span>
            {service.duration && (
              <span className="text-sm text-gray-500 ml-1">
                / {service.duration}min
              </span>
            )}
          </div>

          {isUnavailable ? (
            <Button variant="outline" disabled>
              Currently Unavailable
            </Button>
          ) : (
            <Link to={`/marketplace/book/${service.id}`}>
              <Button variant={canInstantBook ? 'default' : 'outline'}>
                {canInstantBook ? 'Book Now' : 'Request Booking'}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ServiceCard;
