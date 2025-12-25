/**
 * Certifications Card
 *
 * Displays certification status with:
 * - Status badges (Passed/Studying/Expired)
 * - Earned and expiration dates
 * - Expiration warnings
 * - Program requirement insights
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Award, CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { programRequirementBenchmarks } from '@/data/mockStatsPage';

// Certification display names
const CERT_LABELS = {
  ccrn: 'CCRN',
  bls: 'BLS',
  acls: 'ACLS',
  pals: 'PALS',
  tncc: 'TNCC',
  nihss: 'NIHSS',
  'ccrn-k': 'CCRN-K',
};

// Status configuration
const STATUS_CONFIG = {
  passed: {
    label: 'Passed',
    icon: CheckCircle2,
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    iconClass: 'text-green-600',
  },
  studying: {
    label: 'Studying',
    icon: Clock,
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    iconClass: 'text-blue-600',
  },
  expired: {
    label: 'Expired',
    icon: XCircle,
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    iconClass: 'text-red-600',
  },
  not_started: {
    label: 'Not Started',
    icon: Clock,
    badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
    iconClass: 'text-gray-400',
  },
};

export function CertificationsCard({ clinicalProfile, onEdit, isEditable = true }) {
  const certifications = clinicalProfile?.certifications || [];
  const requiredCerts = programRequirementBenchmarks.certifications.required;

  // Check which required certs are missing
  const earnedCertTypes = certifications
    .filter(c => c.status === 'passed')
    .map(c => c.type);

  const missingRequired = requiredCerts.filter(c => !earnedCertTypes.includes(c));

  // Calculate days until expiration
  const getDaysUntilExpiration = (expiresDate) => {
    if (!expiresDate) return null;
    const now = new Date();
    const expiry = new Date(expiresDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Award className="w-4 h-4" />
          Certifications
        </CardTitle>
        {isEditable && (
          <button
            onClick={() => onEdit?.('certifications')}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Certifications List */}
        {certifications.length > 0 ? (
          <div className="space-y-3">
            {certifications.map((cert, index) => {
              const config = STATUS_CONFIG[cert.status] || STATUS_CONFIG.not_started;
              const StatusIcon = config.icon;
              const daysUntil = getDaysUntilExpiration(cert.expiresDate);
              const isExpiringSoon = daysUntil !== null && daysUntil > 0 && daysUntil <= 180;
              const isExpired = daysUntil !== null && daysUntil <= 0;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-5 h-5 ${config.iconClass}`} />
                    <div>
                      <p className="font-medium text-sm">
                        {CERT_LABELS[cert.type] || cert.type.toUpperCase()}
                      </p>
                      {cert.earnedDate && (
                        <p className="text-xs text-gray-500">
                          Earned {formatDate(cert.earnedDate)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Expiration Warning */}
                    {isExpiringSoon && !isExpired && (
                      <span className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {daysUntil}d left
                      </span>
                    )}
                    {isExpired && (
                      <span className="text-xs text-red-600 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Expired
                      </span>
                    )}

                    {/* Status Badge */}
                    <Badge variant="outline" className={`text-xs ${config.badgeClass}`}>
                      {config.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            <p>No certifications recorded</p>
          </div>
        )}

        {/* Missing Required Certs Warning */}
        {missingRequired.length > 0 && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">Missing required certifications:</p>
              <p className="text-xs mt-0.5">
                {missingRequired.map(c => CERT_LABELS[c] || c.toUpperCase()).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {missingRequired.length === 0 && certifications.length > 0 && (
          <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-700">
              You have all commonly required certifications!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CertificationsCard;
