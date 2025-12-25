/**
 * Certification Alert Engine
 *
 * Generates nudges for expiring certifications at 90 and 30 days.
 * Checks ANY certification type (CCRN, ACLS, BLS, PALS, etc.)
 */

import { CERTIFICATION_PROMPTS } from '../promptDefinitions';
import { daysUntil, generateNudgeId } from '../promptUtils';
import { calculatePriority } from '../prioritySystem';

/**
 * Certification types we track
 */
export const CERTIFICATION_TYPES = [
  { id: 'ccrn', name: 'CCRN' },
  { id: 'acls', name: 'ACLS' },
  { id: 'bls', name: 'BLS' },
  { id: 'pals', name: 'PALS' },
  { id: 'nihss', name: 'NIHSS' },
  { id: 'tncc', name: 'TNCC' },
  { id: 'nrp', name: 'NRP' },
  { id: 'other', name: 'Other Certification' },
];

/**
 * Evaluate certification expiration alerts
 */
export function evaluateCertificationAlerts({
  certifications = [],
  dismissedPrompts = {},
  lastNudgeShown = {},
  userStage,
  trackerStats,
  lastLoginAt,
  today = new Date(),
}) {
  const nudges = [];

  for (const cert of certifications) {
    if (!cert.expirationDate || cert.status === 'expired') continue;

    const daysRemaining = daysUntil(cert.expirationDate, today);

    // Skip if already expired or too far out
    if (daysRemaining < 0 || daysRemaining > 90) continue;

    // Determine which prompt to show
    let promptDef = null;

    if (daysRemaining <= 30) {
      promptDef = CERTIFICATION_PROMPTS.CERT_EXPIRING_30;
    } else if (daysRemaining <= 90) {
      promptDef = CERTIFICATION_PROMPTS.CERT_EXPIRING_90;
    }

    if (!promptDef) continue;

    const certName = getCertDisplayName(cert.type);
    const nudgeId = generateNudgeId(promptDef.id, { certType: cert.type });

    const nudge = {
      id: nudgeId,
      promptId: promptDef.id,
      engine: 'certification',
      type: promptDef.type,
      urgency: promptDef.urgency,
      title: interpolate(promptDef.titleTemplate, {
        certName,
        daysRemaining,
      }),
      message: promptDef.messageTemplate,
      actions: promptDef.actions.map(action => ({
        ...action,
        context: { certType: cert.type },
      })),
      dismissible: promptDef.dismissible,
      snoozeable: promptDef.snoozeable,
      context: {
        certType: cert.type,
        certName,
        daysRemaining,
        expirationDate: cert.expirationDate,
      },
      priority: calculatePriority({
        urgency: promptDef.urgency,
        engine: 'certification',
        userStage,
        trackerStats,
        lastLoginAt,
        lastShownAt: lastNudgeShown[nudgeId],
        dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
      }),
    };

    nudges.push(nudge);
  }

  // Sort by days remaining (most urgent first)
  return nudges.sort((a, b) => a.context.daysRemaining - b.context.daysRemaining);
}

/**
 * Get display name for certification type
 */
function getCertDisplayName(certType) {
  const cert = CERTIFICATION_TYPES.find(c => c.id === certType);
  return cert?.name || certType?.toUpperCase() || 'Certification';
}

/**
 * Simple template interpolation
 */
function interpolate(template, values) {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

/**
 * Handle "Mark as Renewed" action
 */
export function handleMarkRenewed(certType, newExpirationDate) {
  return {
    certType,
    newExpirationDate,
    renewedAt: new Date().toISOString(),
  };
}

export default {
  CERTIFICATION_TYPES,
  evaluateCertificationAlerts,
  handleMarkRenewed,
};
