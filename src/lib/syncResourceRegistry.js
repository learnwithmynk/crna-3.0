/**
 * Sync Resource Registry to Database
 *
 * This utility syncs the resource registry (src/config/resource-registry.js)
 * to the protected_resources database table.
 *
 * It performs an upsert operation:
 * - If a resource exists in DB: UPDATE metadata (display_name, description, route) but PRESERVE accessible_via
 * - If a resource doesn't exist: CREATE with default protection (active_membership)
 *
 * This should be called from admin UI or as a one-time migration.
 */

import { supabase } from '@/lib/supabase';
import { getAllResources, validateRegistry } from '@/config/resource-registry';

/**
 * Helper to add timeout to a promise
 */
function withTimeout(promise, ms, errorMessage) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    ),
  ]);
}

/**
 * Map resource category to database resource_type
 * @param {string} category - Category from registry (pages, features, widgets, tools)
 * @returns {string} Database resource_type
 */
function mapCategoryToType(category) {
  const singular = {
    pages: 'page',
    features: 'feature',
    widgets: 'widget',
    tools: 'tool',
  };
  return singular[category] || category;
}

/**
 * Sync resource registry to database
 * @param {Object} options - Sync options
 * @param {boolean} options.dryRun - If true, don't actually write to DB (default: false)
 * @param {boolean} options.verbose - If true, log detailed progress (default: false)
 * @returns {Promise<Object>} Sync results
 */
export async function syncResourceRegistry({ dryRun = false, verbose = false } = {}) {
  const results = {
    success: false,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    resources: [],
  };

  try {
    // Step 1: Validate registry
    if (verbose) console.log('[Sync] Validating resource registry...');
    const validation = validateRegistry();

    if (!validation.valid) {
      results.errors.push({
        type: 'validation',
        message: 'Resource registry validation failed',
        details: validation.errors,
      });
      return results;
    }

    if (verbose) {
      console.log('[Sync] Registry validation passed');
      console.log(`[Sync] Total resources: ${validation.totalResources}`);
      console.log('[Sync] By category:', validation.byCategory);
    }

    // Step 2: Get all resources from registry
    const registryResources = getAllResources();

    // Step 3: Get existing resources from database
    if (verbose) console.log('[Sync] Fetching existing resources from database...');

    let existingResources = [];
    let fetchError = null;

    try {
      const response = await withTimeout(
        supabase
          .from('protected_resources')
          .select('id, slug, display_name, description, route_pattern, accessible_via, resource_type, parent_slug, is_public'),
        10000,
        'Database query timed out after 10 seconds'
      );
      existingResources = response.data;
      fetchError = response.error;
    } catch (timeoutError) {
      results.errors.push({
        type: 'timeout',
        message: timeoutError.message,
        details: 'Check if Supabase is accessible and protected_resources table exists',
      });
      return results;
    }

    if (fetchError) {
      results.errors.push({
        type: 'database',
        message: 'Failed to fetch existing resources',
        details: fetchError,
      });
      return results;
    }

    const existingBySlug = new Map(
      (existingResources || []).map(r => [r.slug, r])
    );

    if (verbose) {
      console.log(`[Sync] Found ${existingBySlug.size} existing resources in database`);
    }

    // Step 4: Process each resource
    if (verbose) console.log('[Sync] Processing resources...');

    for (const resource of registryResources) {
      const resourceType = mapCategoryToType(resource.category);
      const existing = existingBySlug.get(resource.slug);

      // Prepare resource data
      const resourceData = {
        slug: resource.slug,
        display_name: resource.displayName,
        description: resource.description || null,
        resource_type: resourceType,
        parent_slug: resource.parent || null,
        route_pattern: resource.route || null,
      };

      if (existing) {
        // UPDATE: Preserve accessible_via, update metadata only
        if (verbose) console.log(`[Sync]   Updating: ${resource.slug}`);

        if (!dryRun) {
          const { error: updateError } = await supabase
            .from('protected_resources')
            .update({
              display_name: resourceData.display_name,
              description: resourceData.description,
              resource_type: resourceData.resource_type,
              parent_slug: resourceData.parent_slug,
              route_pattern: resourceData.route_pattern,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (updateError) {
            results.errors.push({
              type: 'update',
              slug: resource.slug,
              message: 'Failed to update resource',
              details: updateError,
            });
            continue;
          }
        }

        results.updated++;
        results.resources.push({
          action: 'updated',
          slug: resource.slug,
          displayName: resource.displayName,
        });
      } else {
        // CREATE: Insert with default protection (active_membership)
        if (verbose) console.log(`[Sync]   Creating: ${resource.slug}`);

        // Determine default accessible_via based on resource type
        let defaultAccessibleVia = ['active_membership', 'trial_access', 'founding_member'];

        // Admin pages only accessible by admins
        if (resource.slug.startsWith('admin-')) {
          defaultAccessibleVia = [];  // Will use role-based check instead
        }

        // Public pages (legal, etc.)
        const publicPages = [
          'login', 'register', 'signup',
          'terms', 'privacy', 'cookies', 'acceptable-use',
          'dmca', 'accessibility', 'california-privacy'
        ];
        const isPublic = publicPages.includes(resource.slug);

        // Marketplace provider pages require provider role (checked separately)
        if (resource.slug.startsWith('provider-') || resource.slug.includes('provider')) {
          defaultAccessibleVia = ['active_membership', 'trial_access', 'founding_member'];
        }

        if (!dryRun) {
          const { error: insertError } = await supabase
            .from('protected_resources')
            .insert({
              ...resourceData,
              accessible_via: defaultAccessibleVia,
              is_public: isPublic,
              is_active: true,
            });

          if (insertError) {
            results.errors.push({
              type: 'create',
              slug: resource.slug,
              message: 'Failed to create resource',
              details: insertError,
            });
            continue;
          }
        }

        results.created++;
        results.resources.push({
          action: 'created',
          slug: resource.slug,
          displayName: resource.displayName,
          defaultAccessibleVia,
          isPublic,
        });
      }
    }

    // Step 5: Check for orphaned resources (in DB but not in registry)
    if (verbose) console.log('[Sync] Checking for orphaned resources...');

    const registrySlugs = new Set(registryResources.map(r => r.slug));
    const orphaned = Array.from(existingBySlug.keys()).filter(slug => !registrySlugs.has(slug));

    if (orphaned.length > 0) {
      if (verbose) {
        console.log(`[Sync] Found ${orphaned.length} orphaned resources (in DB but not in registry):`);
        orphaned.forEach(slug => console.log(`[Sync]   - ${slug}`));
      }

      results.orphaned = orphaned;
    }

    // Success
    results.success = true;

    if (verbose) {
      console.log('[Sync] ✓ Sync completed successfully');
      console.log(`[Sync]   Created: ${results.created}`);
      console.log(`[Sync]   Updated: ${results.updated}`);
      console.log(`[Sync]   Skipped: ${results.skipped}`);
      console.log(`[Sync]   Errors: ${results.errors.length}`);
      if (results.orphaned) {
        console.log(`[Sync]   Orphaned: ${results.orphaned.length}`);
      }
      if (dryRun) {
        console.log('[Sync] (DRY RUN - no changes were written to database)');
      }
    }
  } catch (error) {
    results.errors.push({
      type: 'system',
      message: 'Unexpected error during sync',
      details: error.message,
    });
  }

  return results;
}

/**
 * Sync a single resource to database
 * @param {string} slug - Resource slug
 * @param {Object} options - Sync options
 * @returns {Promise<Object>} Sync result
 */
export async function syncSingleResource(slug, { dryRun = false, verbose = false } = {}) {
  const results = {
    success: false,
    action: null,
    error: null,
  };

  try {
    // Get resource from registry
    const registryResources = getAllResources();
    const resource = registryResources.find(r => r.slug === slug);

    if (!resource) {
      results.error = `Resource not found in registry: ${slug}`;
      return results;
    }

    // Check if exists in DB
    const { data: existing, error: fetchError } = await supabase
      .from('protected_resources')
      .select('*')
      .eq('slug', slug)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
      results.error = fetchError.message;
      return results;
    }

    const resourceType = mapCategoryToType(resource.category);
    const resourceData = {
      slug: resource.slug,
      display_name: resource.displayName,
      description: resource.description || null,
      resource_type: resourceType,
      parent_slug: resource.parent || null,
      route_pattern: resource.route || null,
    };

    if (existing) {
      // Update
      if (verbose) console.log(`Updating resource: ${slug}`);

      if (!dryRun) {
        const { error: updateError } = await supabase
          .from('protected_resources')
          .update({
            display_name: resourceData.display_name,
            description: resourceData.description,
            resource_type: resourceData.resource_type,
            parent_slug: resourceData.parent_slug,
            route_pattern: resourceData.route_pattern,
            updated_at: new Date().toISOString(),
          })
          .eq('slug', slug);

        if (updateError) {
          results.error = updateError.message;
          return results;
        }
      }

      results.action = 'updated';
    } else {
      // Create
      if (verbose) console.log(`Creating resource: ${slug}`);

      let defaultAccessibleVia = ['active_membership', 'trial_access', 'founding_member'];
      if (slug.startsWith('admin-')) {
        defaultAccessibleVia = [];
      }

      const publicPages = [
        'login', 'register', 'signup',
        'terms', 'privacy', 'cookies', 'acceptable-use',
        'dmca', 'accessibility', 'california-privacy'
      ];
      const isPublic = publicPages.includes(slug);

      if (slug.startsWith('provider-') || slug.includes('provider')) {
        defaultAccessibleVia = ['active_membership', 'trial_access', 'founding_member'];
      }

      if (!dryRun) {
        const { error: insertError } = await supabase
          .from('protected_resources')
          .insert({
            ...resourceData,
            accessible_via: defaultAccessibleVia,
            is_public: isPublic,
            is_active: true,
          });

        if (insertError) {
          results.error = insertError.message;
          return results;
        }
      }

      results.action = 'created';
    }

    results.success = true;
  } catch (error) {
    results.error = error.message;
  }

  return results;
}

/**
 * Preview sync without writing to database
 * @returns {Promise<Object>} Preview results
 */
export async function previewSync() {
  return await syncResourceRegistry({ dryRun: true, verbose: true });
}
