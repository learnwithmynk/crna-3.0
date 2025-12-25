/**
 * Auth Types
 *
 * TypeScript type definitions for authentication and user objects.
 * Used by useAuth hook and other auth-related components.
 */

import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

/**
 * User role type
 */
export type UserRole = 'user' | 'admin' | 'provider';

/**
 * Entitlement source type
 */
export type EntitlementSource =
  | 'subscription'
  | 'purchase'
  | 'trial'
  | 'manual'
  | 'promo'
  | 'founding';

/**
 * Common entitlement slugs
 */
export type KnownEntitlementSlug =
  | 'active_membership'
  | 'trial_access'
  | 'founding_member'
  | 'plan_apply_toolkit'
  | 'interviewing_toolkit';

/**
 * Enriched user object returned by useAuth
 * Extends Supabase User with role and entitlements
 */
export interface EnrichedUser extends SupabaseUser {
  /**
   * User role from user_profiles.role
   * @default 'user'
   */
  role: UserRole;

  /**
   * Array of active entitlement slugs from user_entitlements
   * Only includes active, non-expired entitlements
   * @default []
   */
  entitlements: string[];
}

/**
 * Auth context value returned by useAuth hook
 */
export interface AuthContextValue {
  /**
   * Enriched user object with role and entitlements
   * Null if not authenticated
   */
  user: EnrichedUser | null;

  /**
   * Supabase session object
   * Null if not authenticated
   */
  session: Session | null;

  /**
   * Whether authentication state is currently being loaded
   */
  isLoading: boolean;

  /**
   * Whether user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * Authentication error message
   * Null if no error
   */
  error: string | null;

  /**
   * Sign in with email and password
   */
  signIn: (email: string, password: string) => Promise<{
    data: { user: EnrichedUser } | null;
    error: string | null;
  }>;

  /**
   * Sign up with email and password
   */
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => Promise<{
    data: { user: EnrichedUser } | null;
    error: string | null;
  }>;

  /**
   * Sign out current user
   */
  signOut: () => Promise<{ error: string | null }>;

  /**
   * Reset password for email
   */
  resetPassword: (email: string) => Promise<{
    data: any;
    error: string | null;
  }>;
}

/**
 * Entitlement object from database
 */
export interface Entitlement {
  /**
   * Unique slug identifier
   */
  slug: string;

  /**
   * Human-readable display name
   */
  display_name: string;

  /**
   * Description of what this entitlement grants
   */
  description?: string;

  /**
   * Whether this entitlement is currently active
   */
  is_active: boolean;

  /**
   * Timestamp when entitlement was created
   */
  created_at: string;

  /**
   * Timestamp when entitlement was last updated
   */
  updated_at: string;
}

/**
 * User entitlement assignment from database
 */
export interface UserEntitlement {
  /**
   * Unique ID for this assignment
   */
  id: string;

  /**
   * User ID (UUID)
   */
  user_id: string;

  /**
   * Entitlement slug
   */
  entitlement_slug: string;

  /**
   * When entitlement was granted
   */
  granted_at: string;

  /**
   * When entitlement expires
   * NULL means never expires
   */
  expires_at: string | null;

  /**
   * How the entitlement was granted
   */
  source: EntitlementSource;

  /**
   * Reference ID from source system (e.g., Stripe subscription ID)
   */
  source_id?: string;

  /**
   * Admin notes (for manual grants)
   */
  notes?: string;

  /**
   * User who granted this entitlement (for manual grants)
   */
  granted_by?: string;

  /**
   * Timestamp when record was created
   */
  created_at: string;

  /**
   * Timestamp when record was last updated
   */
  updated_at: string;
}

/**
 * Entitlement with details (from RPC function)
 */
export interface EntitlementWithDetails {
  /**
   * Entitlement slug
   */
  entitlement_slug: string;

  /**
   * Display name
   */
  display_name: string;

  /**
   * When it expires (null = never)
   */
  expires_at: string | null;

  /**
   * How it was granted
   */
  source: EntitlementSource;

  /**
   * Whether it expires within 7 days
   */
  is_expiring_soon: boolean;
}
