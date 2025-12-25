/**
 * CRNANetworkCard Component
 *
 * Displays the user's CRNA network built through shadowing:
 * - List of CRNAs met
 * - Relationship status tracking
 * - LOR status
 * - Quick actions (email, LinkedIn, request LOR)
 */

import { useState } from 'react';
import {
  Users,
  Mail,
  Linkedin,
  FileText,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  GraduationCap,
  Check,
  Send,
  Star,
  UserPlus,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Relationship status configuration
const RELATIONSHIP_STATUS = {
  just_met: {
    label: 'Just Met',
    color: 'bg-gray-100 text-gray-700',
    description: 'Connected during shadowing',
  },
  connected: {
    label: 'Connected',
    color: 'bg-blue-100 text-blue-700',
    description: 'Exchanged contact info, LinkedIn connected',
  },
  mentor: {
    label: 'Mentor',
    color: 'bg-purple-100 text-purple-700',
    description: 'Regular contact, providing guidance',
  },
  lor_source: {
    label: 'LOR Source',
    color: 'bg-green-100 text-green-700',
    description: 'Will provide letter of recommendation',
  },
};

const LOR_STATUS = {
  requested: {
    label: 'Requested',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Send,
  },
  received: {
    label: 'Received',
    color: 'bg-green-100 text-green-700',
    icon: Check,
  },
  declined: {
    label: 'Declined',
    color: 'bg-red-100 text-red-700',
    icon: null,
  },
};

/**
 * Individual CRNA contact card
 */
function CRNAContactCard({ crna, onRequestLOR, onUpdateStatus }) {
  const relationshipInfo = RELATIONSHIP_STATUS[crna.relationshipStatus] || RELATIONSHIP_STATUS.just_met;
  const lorInfo = crna.lorStatus ? LOR_STATUS[crna.lorStatus] : null;

  return (
    <div className="p-4 bg-white border rounded-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{crna.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={cn('text-xs', relationshipInfo.color)}>
              {relationshipInfo.label}
            </Badge>
            {lorInfo && (
              <Badge variant="outline" className={cn('text-xs', lorInfo.color)}>
                {lorInfo.icon && <lorInfo.icon className="w-3 h-3 mr-1" />}
                LOR {lorInfo.label}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{crna.totalHoursShadowed}h</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{crna.facility}</span>
        </div>
        {crna.specialty && (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-gray-400" />
            <span className="capitalize">{crna.specialty} specialty</span>
          </div>
        )}
        {crna.program && (
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <span>{crna.program} grad</span>
          </div>
        )}
      </div>

      {/* Notes */}
      {crna.notes && (
        <p className="text-sm text-gray-500 italic mb-3">"{crna.notes}"</p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {crna.email && (
          <a
            href={`mailto:${crna.email}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Mail className="w-3 h-3" />
            Email
          </a>
        )}
        {crna.linkedin && (
          <a
            href={`https://${crna.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
          >
            <Linkedin className="w-3 h-3" />
            LinkedIn
          </a>
        )}
        {crna.totalHoursShadowed >= 8 && !crna.lorStatus && (
          <button
            onClick={() => onRequestLOR(crna)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
          >
            <FileText className="w-3 h-3" />
            Request LOR
          </button>
        )}
      </div>

      {/* Last contact */}
      {crna.lastContact && (
        <p className="text-xs text-gray-400 mt-3">
          Last contact: {new Date(crna.lastContact).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

/**
 * Empty state for network
 */
function EmptyNetworkState() {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <UserPlus className="w-8 h-8 text-gray-400" />
      </div>
      <h4 className="font-medium text-gray-900 mb-2">Build Your CRNA Network</h4>
      <p className="text-sm text-gray-600 max-w-sm mx-auto">
        When you log shadow days, save the CRNAs to your network. They can become
        mentors, LOR sources, and valuable connections for your career.
      </p>
    </div>
  );
}

/**
 * Main CRNANetworkCard component
 *
 * @param {boolean} collapsed - If true, starts collapsed showing only stats (default false)
 */
export function CRNANetworkCard({
  network = [],
  onRequestLOR,
  onUpdateStatus,
  collapsed = false,
  className,
}) {
  const [expanded, setExpanded] = useState(!collapsed);

  // Calculate network stats
  const stats = {
    total: network.length,
    lorSources: network.filter(c => c.lorStatus === 'received').length,
    potentialLORs: network.filter(c => c.totalHoursShadowed >= 8 && !c.lorStatus).length,
    uniqueFacilities: new Set(network.map(c => c.facility)).size,
  };

  return (
    <Card className={cn('p-4', className)}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">My CRNA Network</h3>
          {network.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {network.length} {network.length === 1 ? 'contact' : 'contacts'}
            </Badge>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Preview when collapsed */}
      {!expanded && network.length > 0 && (
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
          <span>{stats.total} CRNAs met</span>
          {stats.lorSources > 0 && (
            <span className="text-green-600">
              {stats.lorSources} LOR{stats.lorSources > 1 ? 's' : ''} secured
            </span>
          )}
          {stats.potentialLORs > 0 && (
            <span className="text-purple-600">
              {stats.potentialLORs} potential LOR source{stats.potentialLORs > 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div className="mt-4 space-y-4">
          {network.length === 0 ? (
            <EmptyNetworkState />
          ) : (
            <>
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-600">CRNAs Met</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">{stats.lorSources}</p>
                  <p className="text-xs text-green-700">LORs Secured</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">{stats.potentialLORs}</p>
                  <p className="text-xs text-purple-700">Potential LORs</p>
                </div>
              </div>

              {/* Contact list */}
              <div className="space-y-3">
                {network.map((crna) => (
                  <CRNAContactCard
                    key={crna.id}
                    crna={crna}
                    onRequestLOR={onRequestLOR}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </div>

              {/* LOR tip */}
              {stats.potentialLORs > 0 && stats.lorSources < 3 && (
                <div className="p-3 bg-purple-50 rounded-xl text-sm text-purple-700">
                  <p className="font-medium mb-1">LOR Tip:</p>
                  <p>
                    Most programs require 2-3 letters. You have {stats.potentialLORs} CRNA
                    {stats.potentialLORs > 1 ? 's' : ''} you could ask!
                    Aim to request after 8+ hours of shadowing together.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  );
}

export default CRNANetworkCard;
