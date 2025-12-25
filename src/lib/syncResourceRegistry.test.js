/**
 * Test script for resource registry sync
 *
 * Run this to validate the resource registry and preview sync operations.
 *
 * Usage:
 *   node src/lib/syncResourceRegistry.test.js
 */

import { validateRegistry, getAllResources, getResourceBySlug, getChildResources } from '../config/resource-registry.js';

console.log('='.repeat(60));
console.log('RESOURCE REGISTRY VALIDATION');
console.log('='.repeat(60));

// Validate registry
const validation = validateRegistry();

console.log('\nValidation Result:', validation.valid ? '✓ PASSED' : '✗ FAILED');
console.log('\nTotal Resources:', validation.totalResources);
console.log('\nBy Category:');
console.log('  Pages:   ', validation.byCategory.pages);
console.log('  Features:', validation.byCategory.features);
console.log('  Widgets: ', validation.byCategory.widgets);
console.log('  Tools:   ', validation.byCategory.tools);

if (!validation.valid) {
  console.log('\nErrors:');
  validation.errors.forEach(err => {
    console.log('  ✗', err);
  });
  process.exit(1);
}

console.log('\n' + '='.repeat(60));
console.log('SAMPLE QUERIES');
console.log('='.repeat(60));

// Get a specific resource
const dashboard = getResourceBySlug('dashboard');
console.log('\nGet Resource by Slug (dashboard):');
console.log(JSON.stringify(dashboard, null, 2));

// Get child resources
const dashboardChildren = getChildResources('dashboard');
console.log('\nChild Resources of Dashboard:');
dashboardChildren.forEach(child => {
  console.log(`  - ${child.slug} (${child.category}): ${child.displayName}`);
});

// Get all pages
const allResources = getAllResources();
const pages = allResources.filter(r => r.category === 'pages');
console.log('\nAll Pages (first 10):');
pages.slice(0, 10).forEach(page => {
  console.log(`  - ${page.slug}: ${page.route}`);
});

console.log('\n' + '='.repeat(60));
console.log('REGISTRY STATISTICS');
console.log('='.repeat(60));

// Analyze resources
const resourcesWithParents = allResources.filter(r => r.parent).length;
const resourcesWithRoutes = allResources.filter(r => r.route).length;
const adminResources = allResources.filter(r => r.slug.startsWith('admin-')).length;
const marketplaceResources = allResources.filter(r =>
  r.slug.includes('marketplace') || r.slug.includes('mentor') || r.slug.includes('provider')
).length;

console.log('\nHierarchy:');
console.log(`  Resources with parents: ${resourcesWithParents}`);
console.log(`  Resources with routes:  ${resourcesWithRoutes}`);

console.log('\nBy Domain:');
console.log(`  Admin resources:       ${adminResources}`);
console.log(`  Marketplace resources: ${marketplaceResources}`);

console.log('\n' + '='.repeat(60));
console.log('✓ All tests passed!');
console.log('='.repeat(60));
console.log('\nNext steps:');
console.log('1. Run database migration: supabase/migrations/20251220300000_protected_resources.sql');
console.log('2. Import syncResourceRegistry in admin UI to sync registry to database');
console.log('3. Use can_access_resource() function to check user access');
console.log('='.repeat(60));
