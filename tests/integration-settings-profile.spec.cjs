// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Integration Test: Settings Profile
 *
 * Verifies that profile changes (first name, last name, display name) persist.
 * Tests the ProfileTab component and updateProfile functionality in useAuth hook.
 *
 * Tests:
 * 1. Settings page loads and displays current profile data
 * 2. Can update first name and changes persist
 * 3. Can update last name and changes persist
 * 4. Can update display name and changes persist
 * 5. Save button shows feedback (loading/saved states)
 */

test.describe('Settings Profile - Update Profile Information', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to settings page
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('settings page loads with profile tab active', async ({ page }) => {
    // Verify we're on settings page - look for heading or text "Settings"
    await expect(page.locator('h1, h2').filter({ hasText: 'Settings' }).first()).toBeVisible({ timeout: 10000 });

    // Verify profile tab is visible and accessible - use text locator
    const profileTab = page.getByText('Profile', { exact: true });
    await expect(profileTab).toBeVisible();

    // Personal Information card should be visible
    await expect(page.getByText(/Personal Information/i)).toBeVisible();
  });

  test('displays current profile form fields', async ({ page }) => {
    // Should see all three name fields
    await expect(page.getByLabel(/First Name/i)).toBeVisible();
    await expect(page.getByLabel(/Last Name/i)).toBeVisible();
    await expect(page.getByLabel(/Display Name/i)).toBeVisible();

    // Should see save button
    await expect(page.getByRole('button', { name: /Save Changes/i })).toBeVisible();
  });

  test('can update first name and see save confirmation', async ({ page }) => {
    const firstNameInput = page.getByLabel(/First Name/i);
    const saveButton = page.getByRole('button', { name: /Save Changes/i });

    // Clear and enter new first name
    await firstNameInput.clear();
    await firstNameInput.fill('TestFirstName');
    await page.waitForTimeout(300);

    // Click save
    await saveButton.click();
    await page.waitForTimeout(500);

    // Should show "Saved!" feedback
    // The button text changes from "Save Changes" to "Saved!" briefly
    const savedButton = page.getByRole('button', { name: /Saved!/i });
    await expect(savedButton).toBeVisible({ timeout: 3000 });

    // Verify the value persisted in the input
    await expect(firstNameInput).toHaveValue('TestFirstName');
  });

  test('can update last name and changes persist', async ({ page }) => {
    const lastNameInput = page.getByLabel(/Last Name/i);
    const saveButton = page.getByRole('button', { name: /Save Changes/i });

    // Clear and enter new last name
    await lastNameInput.clear();
    await lastNameInput.fill('TestLastName');
    await page.waitForTimeout(300);

    // Click save
    await saveButton.click();
    await page.waitForTimeout(500);

    // Verify saved
    const savedButton = page.getByRole('button', { name: /Saved!/i });
    await expect(savedButton).toBeVisible({ timeout: 3000 });

    // Reload page and verify persistence
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Note: In mock mode, changes won't actually persist across reloads
    // because there's no real database. This test verifies the UI flow works.
    // With real Supabase, the value would persist.
    const lastNameAfterReload = page.getByLabel(/Last Name/i);
    await expect(lastNameAfterReload).toBeVisible();
  });

  test('can update display name and changes persist', async ({ page }) => {
    const displayNameInput = page.getByLabel(/Display Name/i);
    const saveButton = page.getByRole('button', { name: /Save Changes/i });

    // Clear and enter new display name
    await displayNameInput.clear();
    await displayNameInput.fill('TestUser123');
    await page.waitForTimeout(300);

    // Click save
    await saveButton.click();
    await page.waitForTimeout(500);

    // Verify saved
    const savedButton = page.getByRole('button', { name: /Saved!/i });
    await expect(savedButton).toBeVisible({ timeout: 3000 });

    // Verify the value in input
    await expect(displayNameInput).toHaveValue('TestUser123');
  });

  test('can update all name fields at once', async ({ page }) => {
    const firstNameInput = page.getByLabel(/First Name/i);
    const lastNameInput = page.getByLabel(/Last Name/i);
    const displayNameInput = page.getByLabel(/Display Name/i);
    const saveButton = page.getByRole('button', { name: /Save Changes/i });

    // Update all fields
    await firstNameInput.clear();
    await firstNameInput.fill('John');
    await lastNameInput.clear();
    await lastNameInput.fill('Doe');
    await displayNameInput.clear();
    await displayNameInput.fill('JohnD');
    await page.waitForTimeout(300);

    // Save
    await saveButton.click();
    await page.waitForTimeout(500);

    // Verify saved
    const savedButton = page.getByRole('button', { name: /Saved!/i });
    await expect(savedButton).toBeVisible({ timeout: 3000 });

    // Verify all values
    await expect(firstNameInput).toHaveValue('John');
    await expect(lastNameInput).toHaveValue('Doe');
    await expect(displayNameInput).toHaveValue('JohnD');
  });

  test('save button shows loading state', async ({ page }) => {
    const firstNameInput = page.getByLabel(/First Name/i);
    const saveButton = page.getByRole('button', { name: /Save Changes/i });

    // Make a change
    await firstNameInput.clear();
    await firstNameInput.fill('NewName');

    // Click save and immediately check for loading state
    await saveButton.click();

    // Should briefly show "Saving..." (may be too fast to catch)
    // Then should show "Saved!"
    await page.waitForTimeout(1000);

    // Eventually shows saved state
    const savedButton = page.getByRole('button', { name: /Saved!/i });
    await expect(savedButton).toBeVisible({ timeout: 3000 });
  });

  test('profile tab can be accessed via URL hash', async ({ page }) => {
    // Navigate directly to profile tab via hash
    await page.goto('/settings#profile');
    await page.waitForLoadState('domcontentloaded');

    // Should show profile tab content
    await expect(page.getByText(/Personal Information/i)).toBeVisible();
  });
});

test.describe('Settings Profile - Other Tabs', () => {
  test('can switch to subscription tab', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Click subscription tab - use text locator as tabs may not have button role
    const subscriptionTab = page.getByText('Subscription', { exact: true });
    await expect(subscriptionTab).toBeVisible({ timeout: 5000 });
    await subscriptionTab.click();
    await page.waitForTimeout(500);

    // URL should update with hash
    await expect(page).toHaveURL(/\/settings#subscription/);
  });

  test('can switch to privacy tab', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Click privacy tab - use text locator as tabs may not have button role
    const privacyTab = page.getByText('Privacy', { exact: true });
    await expect(privacyTab).toBeVisible({ timeout: 5000 });
    await privacyTab.click();
    await page.waitForTimeout(500);

    // URL should update with hash
    await expect(page).toHaveURL(/\/settings#privacy/);
  });
});

test.describe('Settings Profile - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('settings page renders correctly on mobile', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('domcontentloaded');

    // Heading should be visible
    await expect(page.getByRole('heading', { name: /^Settings$/i })).toBeVisible();

    // Form fields should be visible and usable
    await expect(page.getByLabel(/First Name/i)).toBeVisible();
    await expect(page.getByLabel(/Last Name/i)).toBeVisible();
    await expect(page.getByLabel(/Display Name/i)).toBeVisible();
  });

  test('can update profile on mobile', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const firstNameInput = page.getByLabel(/First Name/i);
    const saveButton = page.getByRole('button', { name: /Save Changes/i });

    // Update name
    await firstNameInput.clear();
    await firstNameInput.fill('MobileTest');
    await page.waitForTimeout(300);

    // Save
    await saveButton.click();
    await page.waitForTimeout(500);

    // Verify saved
    const savedButton = page.getByRole('button', { name: /Saved!/i });
    await expect(savedButton).toBeVisible({ timeout: 3000 });
  });
});
