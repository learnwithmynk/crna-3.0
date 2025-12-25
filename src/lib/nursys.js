/**
 * Nursys License Verification Helper
 *
 * Integrates with Nursys e-Notify API for real-time RN license verification.
 * This is used to verify provider (SRNA mentor) nursing licenses during
 * the marketplace application process.
 *
 * @see https://www.nursys.com/
 *
 * Note: Nursys e-Notify is free for verification purposes.
 * Requires API key from Nursys (obtained during account setup).
 */

// Configuration
const NURSYS_API_URL = import.meta.env.VITE_NURSYS_API_URL || 'https://api.nursys.com/v1';
const NURSYS_API_KEY = import.meta.env.VITE_NURSYS_API_KEY;

// Mock mode for development
const MOCK_MODE = !NURSYS_API_KEY || import.meta.env.DEV;

/**
 * License status types returned by Nursys
 */
export const LICENSE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended',
  REVOKED: 'revoked',
  PROBATION: 'probation',
  NOT_FOUND: 'not_found',
  ERROR: 'error'
};

/**
 * US State codes for license verification
 */
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
];

/**
 * Verify an RN license using the Nursys API
 *
 * @param {string} licenseNumber - The RN license number
 * @param {string} state - Two-letter state code (e.g., 'CA', 'TX')
 * @returns {Promise<Object>} License verification result
 *
 * @example
 * const result = await verifyLicense('RN123456', 'CA');
 * // Returns:
 * // {
 * //   verified: true,
 * //   status: 'active',
 * //   expirationDate: '2025-12-31',
 * //   discipline: false,
 * //   licenseeInfo: { firstName: 'Jane', lastName: 'Doe', licenseType: 'RN' }
 * // }
 */
export async function verifyLicense(licenseNumber, state) {
  // Input validation
  if (!licenseNumber || typeof licenseNumber !== 'string') {
    return {
      verified: false,
      status: LICENSE_STATUS.ERROR,
      error: 'Invalid license number provided'
    };
  }

  if (!state || !US_STATES.find(s => s.code === state.toUpperCase())) {
    return {
      verified: false,
      status: LICENSE_STATUS.ERROR,
      error: 'Invalid state code provided'
    };
  }

  // Clean up license number (remove spaces, dashes)
  const cleanLicenseNumber = licenseNumber.replace(/[\s-]/g, '').toUpperCase();
  const normalizedState = state.toUpperCase();

  // Use mock mode in development or when no API key is configured
  if (MOCK_MODE) {
    return mockVerifyLicense(cleanLicenseNumber, normalizedState);
  }

  try {
    const response = await fetch(`${NURSYS_API_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NURSYS_API_KEY}`,
        'X-API-Version': '1.0'
      },
      body: JSON.stringify({
        licenseNumber: cleanLicenseNumber,
        state: normalizedState,
        licenseType: 'RN'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 404) {
        return {
          verified: false,
          status: LICENSE_STATUS.NOT_FOUND,
          error: 'License not found in Nursys database'
        };
      }

      return {
        verified: false,
        status: LICENSE_STATUS.ERROR,
        error: errorData.message || `API error: ${response.status}`
      };
    }

    const data = await response.json();

    return {
      verified: data.status === 'active',
      status: mapNursysStatus(data.status),
      expirationDate: data.expirationDate || null,
      discipline: data.discipline || false,
      disciplineDetails: data.disciplineDetails || null,
      licenseeInfo: {
        firstName: data.firstName,
        lastName: data.lastName,
        licenseType: data.licenseType,
        originalIssueDate: data.originalIssueDate
      },
      compactLicense: data.compactLicense || false, // NLC multistate license
      verifiedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Nursys API error:', error);
    return {
      verified: false,
      status: LICENSE_STATUS.ERROR,
      error: 'Failed to verify license. Please try again later.'
    };
  }
}

/**
 * Mock license verification for development/testing
 */
function mockVerifyLicense(licenseNumber, state) {
  console.log(`[MOCK] Verifying license ${licenseNumber} in ${state}`);

  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock scenarios based on license number patterns
      if (licenseNumber.includes('INVALID')) {
        resolve({
          verified: false,
          status: LICENSE_STATUS.NOT_FOUND,
          error: 'License not found in database'
        });
        return;
      }

      if (licenseNumber.includes('EXPIRED')) {
        resolve({
          verified: false,
          status: LICENSE_STATUS.EXPIRED,
          expirationDate: '2023-06-30',
          discipline: false,
          licenseeInfo: {
            firstName: 'Test',
            lastName: 'User',
            licenseType: 'RN',
            originalIssueDate: '2018-01-15'
          },
          verifiedAt: new Date().toISOString()
        });
        return;
      }

      if (licenseNumber.includes('SUSPENDED')) {
        resolve({
          verified: false,
          status: LICENSE_STATUS.SUSPENDED,
          expirationDate: '2025-12-31',
          discipline: true,
          disciplineDetails: 'License suspended pending investigation',
          licenseeInfo: {
            firstName: 'Test',
            lastName: 'User',
            licenseType: 'RN',
            originalIssueDate: '2018-01-15'
          },
          verifiedAt: new Date().toISOString()
        });
        return;
      }

      // Default: Valid active license
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      resolve({
        verified: true,
        status: LICENSE_STATUS.ACTIVE,
        expirationDate: oneYearFromNow.toISOString().split('T')[0],
        discipline: false,
        licenseeInfo: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          licenseType: 'RN',
          originalIssueDate: '2019-05-20'
        },
        compactLicense: ['TX', 'FL', 'AZ', 'CO', 'GA'].includes(state), // NLC states
        verifiedAt: new Date().toISOString()
      });
    }, 800); // Simulate network delay
  });
}

/**
 * Map Nursys API status to our standard status codes
 */
function mapNursysStatus(nursysStatus) {
  const statusMap = {
    'active': LICENSE_STATUS.ACTIVE,
    'inactive': LICENSE_STATUS.INACTIVE,
    'expired': LICENSE_STATUS.EXPIRED,
    'suspended': LICENSE_STATUS.SUSPENDED,
    'revoked': LICENSE_STATUS.REVOKED,
    'probation': LICENSE_STATUS.PROBATION,
    'not_found': LICENSE_STATUS.NOT_FOUND
  };

  return statusMap[nursysStatus?.toLowerCase()] || LICENSE_STATUS.ERROR;
}

/**
 * Check if a license is valid for marketplace provider registration
 *
 * @param {Object} verificationResult - Result from verifyLicense()
 * @returns {Object} Eligibility check result
 */
export function checkProviderEligibility(verificationResult) {
  if (!verificationResult) {
    return {
      eligible: false,
      reason: 'No verification result provided'
    };
  }

  if (!verificationResult.verified) {
    return {
      eligible: false,
      reason: getIneligibilityReason(verificationResult.status)
    };
  }

  // Check if license is expiring soon (within 60 days)
  if (verificationResult.expirationDate) {
    const expirationDate = new Date(verificationResult.expirationDate);
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);

    if (expirationDate < sixtyDaysFromNow) {
      return {
        eligible: true,
        warning: 'Your license expires within 60 days. Please renew before expiration.',
        expiresIn: Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24))
      };
    }
  }

  // Check for discipline (we may still allow with disclosure)
  if (verificationResult.discipline) {
    return {
      eligible: false,
      reason: 'License has disciplinary action. Please contact support for manual review.',
      requiresManualReview: true
    };
  }

  return {
    eligible: true,
    message: 'License verified successfully'
  };
}

/**
 * Get human-readable reason for ineligibility
 */
function getIneligibilityReason(status) {
  const reasons = {
    [LICENSE_STATUS.EXPIRED]: 'Your RN license has expired. Please renew before applying.',
    [LICENSE_STATUS.SUSPENDED]: 'Your license is currently suspended.',
    [LICENSE_STATUS.REVOKED]: 'Your license has been revoked.',
    [LICENSE_STATUS.PROBATION]: 'Your license is on probation. Manual review required.',
    [LICENSE_STATUS.NOT_FOUND]: 'License not found. Please verify the license number and state.',
    [LICENSE_STATUS.INACTIVE]: 'Your license is inactive. Please reactivate before applying.',
    [LICENSE_STATUS.ERROR]: 'Unable to verify license. Please try again.'
  };

  return reasons[status] || 'License verification failed.';
}

/**
 * Format license number for display
 * Different states have different formats
 */
export function formatLicenseNumber(licenseNumber, state) {
  if (!licenseNumber) return '';

  const clean = licenseNumber.replace(/[\s-]/g, '').toUpperCase();

  // State-specific formatting (examples)
  const formats = {
    'CA': (n) => n.length >= 2 ? `${n.slice(0, 2)} ${n.slice(2)}` : n,
    'TX': (n) => n, // Texas doesn't use special formatting
    'NY': (n) => n.length >= 6 ? `${n.slice(0, 6)}-${n.slice(6)}` : n
  };

  const formatter = formats[state?.toUpperCase()];
  return formatter ? formatter(clean) : clean;
}

/**
 * Validate license number format (basic validation before API call)
 */
export function validateLicenseFormat(licenseNumber) {
  if (!licenseNumber || typeof licenseNumber !== 'string') {
    return { valid: false, error: 'License number is required' };
  }

  const clean = licenseNumber.replace(/[\s-]/g, '');

  if (clean.length < 4) {
    return { valid: false, error: 'License number is too short' };
  }

  if (clean.length > 20) {
    return { valid: false, error: 'License number is too long' };
  }

  // Most RN licenses are alphanumeric
  if (!/^[A-Za-z0-9]+$/.test(clean)) {
    return { valid: false, error: 'License number contains invalid characters' };
  }

  return { valid: true };
}

export default {
  verifyLicense,
  checkProviderEligibility,
  formatLicenseNumber,
  validateLicenseFormat,
  LICENSE_STATUS,
  US_STATES
};
