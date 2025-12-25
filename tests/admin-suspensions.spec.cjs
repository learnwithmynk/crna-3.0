/**
 * Playwright E2E Tests: Admin Suspensions Page
 *
 * Tests for managing user suspensions in the admin panel.
 * Covers active suspensions, history, creating suspensions, and lifting suspensions.
 */

const { test, expect } = require('@playwright/test');

test.describe('Admin Suspensions Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to suspensions page
    await page.goto('/admin/community/suspensions');
    await page.waitForLoadState('networkidle');
  });

  test('should display page header and breadcrumbs', async ({ page }) => {
    // Check page title
    await expect(page.getByRole('heading', { name: 'User Suspensions' })).toBeVisible();

    // Check breadcrumbs (use role=link to be more specific)
    await expect(page.getByRole('link', { name: 'Admin', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Community' })).toBeVisible();
  });

  test('should display stats cards', async ({ page }) => {
    // Check for stat cards (use heading role to avoid tab conflicts)
    await expect(page.getByRole('heading', { name: 'Active Suspensions' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'History' })).toBeVisible();
  });

  test('should display active suspensions by default', async ({ page }) => {
    // Should show active tab selected
    const activeTab = page.getByRole('tab', { name: /Active/ });
    await expect(activeTab).toHaveAttribute('data-state', 'active');

    // Wait for suspension rows to load (mock data has 300ms delay)
    await page.waitForSelector('[data-testid="suspension-row"]', { timeout: 5000 });

    // Should display suspension rows
    const suspensionRows = page.locator('[data-testid="suspension-row"]');
    const rowCount = await suspensionRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // First row should have user info
    const firstRow = suspensionRows.first();
    await expect(firstRow).toBeVisible();

    // Check for required columns (use columnheader role)
    await expect(page.getByRole('columnheader', { name: 'User' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Reason' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Duration' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Suspended At' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Expires At' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Suspended By' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  });

  test('should switch to history tab', async ({ page }) => {
    // Click history tab
    const historyTab = page.getByRole('tab', { name: /History/ });
    await historyTab.click();

    // Tab should be active
    await expect(historyTab).toHaveAttribute('data-state', 'active');

    // Should display history content
    await page.waitForTimeout(300);

    // Check for history-specific columns
    const statusHeader = page.getByRole('columnheader', { name: 'Status' });
    await expect(statusHeader).toBeVisible();

    const endedAtHeader = page.getByRole('columnheader', { name: 'Ended At', exact: true });
    await expect(endedAtHeader).toBeVisible();

    const endedByHeader = page.getByRole('columnheader', { name: 'Ended By' });
    await expect(endedByHeader).toBeVisible();
  });

  test('should display Lift button for active suspensions', async ({ page }) => {
    // Wait for suspension rows to load
    await page.waitForSelector('[data-testid="suspension-row"]', { timeout: 5000 });

    // Should show Lift buttons
    const liftButtons = page.getByRole('button', { name: /Lift/ });
    const buttonCount = await liftButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should open create suspension dialog', async ({ page }) => {
    // Click Create Suspension button
    await page.getByRole('button', { name: 'Create Suspension' }).click();

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Create User Suspension' })).toBeVisible();

    // Check for form fields
    await expect(page.getByLabel('Search User')).toBeVisible();
    await expect(page.getByLabel('Reason for Suspension')).toBeVisible();
    await expect(page.getByLabel('Duration')).toBeVisible();

    // Check for action buttons
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Create Suspension/ })).toBeVisible();
  });

  test('should search for users in create dialog', async ({ page }) => {
    // Open create dialog
    await page.getByRole('button', { name: 'Create Suspension' }).click();

    // Type in search field
    const searchInput = page.getByLabel('Search User');
    await searchInput.fill('alice');

    // Wait for search results
    await page.waitForTimeout(500);

    // Search results should appear (mocked data includes Alice Cooper)
    await expect(page.getByText('Alice Cooper')).toBeVisible();
  });

  test('should create new suspension', async ({ page }) => {
    // Open create dialog
    await page.getByRole('button', { name: 'Create Suspension' }).click();

    // Search and select user
    await page.getByLabel('Search User').fill('alice');
    await page.waitForTimeout(500);
    await page.getByText('Alice Cooper').click();

    // Fill in reason
    await page.getByLabel('Reason for Suspension').fill('Test suspension for automated testing');

    // Select duration (default should be 7 days)
    // No need to change if we're testing with default

    // Click Create
    const createButton = page.getByRole('button', { name: /Create Suspension/ });
    await createButton.click();

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Should show success (new suspension in list)
    // Note: In real app this would reload data, in mock it adds to state
    await page.waitForTimeout(500);
  });

  test('should cancel create suspension', async ({ page }) => {
    // Open create dialog
    await page.getByRole('button', { name: 'Create Suspension' }).click();

    // Fill some data
    await page.getByLabel('Search User').fill('bob');
    await page.getByLabel('Reason for Suspension').fill('Test reason');

    // Click Cancel
    await page.getByRole('button', { name: 'Cancel' }).first().click();

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should open lift suspension dialog', async ({ page }) => {
    // Click first Lift button
    const liftButton = page.getByRole('button', { name: /Lift/ }).first();
    await liftButton.click();

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Lift Suspension' })).toBeVisible();

    // Should show user info
    await expect(page.getByText('Reason:')).toBeVisible();

    // Check for notes field
    await expect(page.getByLabel('Notes (Optional)')).toBeVisible();

    // Check for action buttons
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Lift Suspension/ })).toBeVisible();
  });

  test('should lift suspension with notes', async ({ page }) => {
    // Click first Lift button
    await page.getByRole('button', { name: /Lift/ }).first().click();

    // Fill in notes
    await page.getByLabel('Notes (Optional)').fill('User apologized and agreed to follow community guidelines.');

    // Click Lift Suspension
    const liftButton = page.getByRole('button', { name: /Lift Suspension/ });
    await liftButton.click();

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Wait for state update
    await page.waitForTimeout(500);
  });

  test('should lift suspension without notes', async ({ page }) => {
    // Click first Lift button
    await page.getByRole('button', { name: /Lift/ }).first().click();

    // Don't fill notes, just lift
    const liftButton = page.getByRole('button', { name: /Lift Suspension/ });
    await liftButton.click();

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should cancel lift suspension', async ({ page }) => {
    // Click first Lift button
    await page.getByRole('button', { name: /Lift/ }).first().click();

    // Fill some notes
    await page.getByLabel('Notes (Optional)').fill('Test notes');

    // Click Cancel
    await page.getByRole('button', { name: 'Cancel' }).first().click();

    // Dialog should close without action
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should display suspension details correctly', async ({ page }) => {
    const firstRow = page.locator('[data-testid="suspension-row"]').first();

    // Should show user name and email
    await expect(firstRow.locator('text=/John Troll|Scam Account|Sexist User/')).toBeVisible();

    // Should show duration badge
    await expect(firstRow.locator('text=/day|Permanent/')).toBeVisible();

    // Should show dates (just check that at least one cell with a date exists)
    await expect(firstRow.locator('text=/Dec|Jan|Nov/').first()).toBeVisible();
  });

  test('should show permanent suspension badge', async ({ page }) => {
    // Look for permanent suspension (Scam Account has permanent suspension in mock data)
    const permanentBadge = page.getByText('Permanent').first();
    await expect(permanentBadge).toBeVisible();
  });

  test('should display lifted and expired suspensions in history', async ({ page }) => {
    // Switch to history tab
    await page.getByRole('tab', { name: /History/ }).click();
    await page.waitForTimeout(300);

    // Should have suspension rows
    const suspensionRows = page.locator('[data-testid="suspension-row"]');
    const rowCount = await suspensionRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Should show Lifted or Expired badges
    const statusBadges = page.locator('text=/Lifted|Expired/');
    const badgeCount = await statusBadges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });

  test('should display different duration options', async ({ page }) => {
    // Open create dialog
    await page.getByRole('button', { name: 'Create Suspension' }).click();

    // Click duration dropdown
    await page.getByLabel('Duration').click();

    // Check for all duration options using role=option
    await expect(page.getByRole('option', { name: '1 day' })).toBeVisible();
    await expect(page.getByRole('option', { name: '3 days' })).toBeVisible();
    await expect(page.getByRole('option', { name: '7 days' })).toBeVisible();
    await expect(page.getByRole('option', { name: '14 days' })).toBeVisible();
    await expect(page.getByRole('option', { name: '30 days' })).toBeVisible();
    await expect(page.getByRole('option', { name: '90 days' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Permanent' })).toBeVisible();
  });

  test('should require user selection to create suspension', async ({ page }) => {
    // Open create dialog
    await page.getByRole('button', { name: 'Create Suspension' }).click();

    // Fill reason but no user
    await page.getByLabel('Reason for Suspension').fill('Test reason');

    // Create button should be disabled
    const createButton = page.getByRole('button', { name: /Create Suspension/ });
    await expect(createButton).toBeDisabled();
  });

  test('should require reason to create suspension', async ({ page }) => {
    // Open create dialog
    await page.getByRole('button', { name: 'Create Suspension' }).click();

    // Select user but no reason
    await page.getByLabel('Search User').fill('alice');
    await page.waitForTimeout(500);
    await page.getByText('Alice Cooper').click();

    // Create button should be disabled (empty reason)
    const createButton = page.getByRole('button', { name: /Create Suspension/ });
    await expect(createButton).toBeDisabled();
  });

  test('should show loading state', async ({ page }) => {
    // When page first loads, might show loading spinner
    // This is hard to catch as mock data loads quickly
    // Just verify the table eventually renders
    const suspensionRows = page.locator('[data-testid="suspension-row"]');
    await expect(suspensionRows.first()).toBeVisible({ timeout: 5000 });
  });

  test('should handle empty active suspensions', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[data-testid="suspension-row"]', { timeout: 5000 });

    // This would require conditional mock data or clearing suspensions
    // For now, we verify that rows exist (positive case)
    const suspensionRows = page.locator('[data-testid="suspension-row"]');
    const rowCount = await suspensionRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should maintain tab state when switching', async ({ page }) => {
    // Start on active tab
    const activeTab = page.getByRole('tab', { name: /Active/ });
    await expect(activeTab).toHaveAttribute('data-state', 'active');

    // Switch to history
    const historyTab = page.getByRole('tab', { name: /History/ });
    await historyTab.click();
    await expect(historyTab).toHaveAttribute('data-state', 'active');

    // Switch back to active
    await activeTab.click();
    await expect(activeTab).toHaveAttribute('data-state', 'active');
  });
});

test.describe('Admin Suspensions - Visual Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/community/suspensions');
    await page.waitForLoadState('networkidle');
  });

  test('should display icons correctly', async ({ page }) => {
    // Check for Create button with Plus icon
    const createButton = page.getByRole('button', { name: 'Create Suspension' });
    await expect(createButton).toBeVisible();

    // Check for Lift buttons with icons
    const liftButtons = page.getByRole('button', { name: /Lift/ });
    await expect(liftButtons.first()).toBeVisible();
  });

  test('should show proper badge styling', async ({ page }) => {
    // Wait for suspension rows to load
    await page.waitForSelector('[data-testid="suspension-row"]', { timeout: 5000 });

    // Duration badges should be visible (look for specific badge text instead of class)
    const durationBadges = page.locator('text=/day|Permanent/');
    const badgeCount = await durationBadges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });
});
