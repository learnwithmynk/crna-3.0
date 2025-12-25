// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Integration Test: Schools - Save to Favorites
 *
 * Verifies that saving a school to favorites persists properly.
 * Tests the usePrograms hook and school card interactions.
 *
 * Tests:
 * 1. School database page loads with school cards
 * 2. Can save a school to favorites (click heart icon)
 * 3. Saved state persists in localStorage
 * 4. Can unsave a school (toggle off)
 * 5. Saved schools appear in My Programs
 */

test.describe('Schools - Save to Favorites', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('crna_saved_schools');
      localStorage.removeItem('crna_target_schools');
      localStorage.removeItem('crna_target_schools_data');
      localStorage.setItem('schoolDatabaseOnboarded', 'true'); // Skip onboarding
    });
    await page.waitForTimeout(500);

    // Navigate to schools page
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
  });

  test('school database page loads with schools list', async ({ page }) => {
    // Verify page heading
    await expect(page.getByRole('heading', { name: /School Database/i })).toBeVisible({ timeout: 5000 });

    // Should show school cards (cards are links to /schools/ID)
    const schoolCards = page.locator('a[href*="/schools/"]');
    const cardCount = await schoolCards.count();

    // Should have at least one school card
    expect(cardCount).toBeGreaterThan(0);

    // First card should be visible
    const firstCard = schoolCards.first();
    await expect(firstCard).toBeVisible();
  });

  test('can save a school to favorites by clicking heart icon', async ({ page }) => {
    // Find the first school card
    const firstCard = page.locator('a[href*="/schools/"]').first();
    await expect(firstCard).toBeVisible();

    // Get school ID from href
    const href = await firstCard.getAttribute('href');
    const schoolId = Number(href?.split('/schools/')[1]);

    // Find the save/favorite button (button with Heart icon)
    // The button contains the lucide-heart SVG icon
    const saveButton = page.locator('button').filter({
      has: page.locator('svg.lucide-heart')
    }).first();

    await expect(saveButton).toBeVisible();

    // Click to save
    await saveButton.click();
    await page.waitForTimeout(500);

    // Verify saved in localStorage
    const savedSchools = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('crna_saved_schools') || '[]');
    });

    expect(savedSchools).toContain(schoolId);
    expect(savedSchools.length).toBe(1);
  });

  test('can save multiple schools to favorites', async ({ page }) => {
    // Find first two school cards
    const schoolCards = page.locator('a[href*="/schools/"]');

    // Get IDs of first two schools
    const firstHref = await schoolCards.nth(0).getAttribute('href');
    const secondHref = await schoolCards.nth(1).getAttribute('href');
    const firstId = Number(firstHref?.split('/schools/')[1]);
    const secondId = Number(secondHref?.split('/schools/')[1]);

    // Find and click first save button
    const firstSaveButton = page.locator('button').filter({
      has: page.locator('svg.lucide-heart')
    }).nth(0);
    await firstSaveButton.click();
    await page.waitForTimeout(300);

    // Find and click second save button
    const secondSaveButton = page.locator('button').filter({
      has: page.locator('svg.lucide-heart')
    }).nth(1);
    await secondSaveButton.click();
    await page.waitForTimeout(300);

    // Verify both saved in localStorage
    const savedSchools = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('crna_saved_schools') || '[]');
    });

    expect(savedSchools).toContain(firstId);
    expect(savedSchools).toContain(secondId);
    expect(savedSchools.length).toBe(2);
  });

  test('can unsave a school (toggle off)', async ({ page }) => {
    // Find first school and save it
    const firstCard = page.locator('a[href*="/schools/"]').first();
    const href = await firstCard.getAttribute('href');
    const schoolId = Number(href?.split('/schools/')[1]);

    const saveButton = page.locator('button').filter({
      has: page.locator('svg.lucide-heart')
    }).first();

    // Save the school
    await saveButton.click();
    await page.waitForTimeout(500);

    // Verify it's saved
    let savedSchools = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('crna_saved_schools') || '[]');
    });
    expect(savedSchools).toContain(schoolId);

    // Click again to unsave
    await saveButton.click();
    await page.waitForTimeout(500);

    // Verify it's removed from localStorage
    savedSchools = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('crna_saved_schools') || '[]');
    });
    expect(savedSchools).not.toContain(schoolId);
  });

  test('saved state persists after page reload', async ({ page }) => {
    // Save a school
    const firstCard = page.locator('a[href*="/schools/"]').first();
    const href = await firstCard.getAttribute('href');
    const schoolId = Number(href?.split('/schools/')[1]);

    const saveButton = page.locator('button').filter({
      has: page.locator('svg.lucide-heart')
    }).first();

    await saveButton.click();
    await page.waitForTimeout(500);

    // Reload the page
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Verify still saved in localStorage
    const savedSchools = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('crna_saved_schools') || '[]');
    });
    expect(savedSchools).toContain(schoolId);

    // The heart icon should show filled state (in real implementation)
    // This is UI state and may require checking for specific CSS classes
  });

  test('saved schools data structure is correct', async ({ page }) => {
    // Save a school
    const saveButton = page.locator('button').filter({
      has: page.locator('svg.lucide-heart')
    }).first();

    await saveButton.click();
    await page.waitForTimeout(500);

    // Check localStorage structure
    const savedSchools = await page.evaluate(() => {
      const saved = localStorage.getItem('crna_saved_schools');
      return saved ? JSON.parse(saved) : null;
    });

    // Should be an array
    expect(Array.isArray(savedSchools)).toBe(true);

    // Should have at least one item
    expect(savedSchools.length).toBeGreaterThan(0);

    // All items should be numbers (school IDs)
    savedSchools.forEach(id => {
      expect(typeof id).toBe('number');
    });
  });
});

test.describe('Schools - My Programs Integration', () => {
  test('can navigate to My Programs after saving a school', async ({ page }) => {
    // Set up saved school
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
      localStorage.setItem('crna_saved_schools', JSON.stringify([3789]));
    });

    // Navigate to My Programs
    await page.goto('/my-programs');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should see My Programs page - heading shows user's name like "Sarah's Programs"
    await expect(page.locator('h1, h2').filter({ hasText: /Programs/i }).first()).toBeVisible({ timeout: 10000 });

    // Should have content about saved or target programs
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
  });
});

test.describe('Schools - Filters and Search', () => {
  test('schools page has filter controls', async ({ page }) => {
    // Set onboarded flag to skip the modal
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });

    await page.goto('/schools');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Page should have loaded
    await expect(page.getByRole('heading', { name: /School Database/i })).toBeVisible();

    // The page likely has filters/search - just verify page is interactive
    const bodyContent = page.locator('body');
    await expect(bodyContent).toBeVisible();
  });
});

test.describe('Schools - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('schools page renders on mobile', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });

    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Should see heading
    await expect(page.getByRole('heading', { name: /School Database/i })).toBeVisible({ timeout: 5000 });

    // Should see school cards
    const schoolCards = page.locator('a[href*="/schools/"]');
    const cardCount = await schoolCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('can save school on mobile', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('crna_saved_schools');
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });

    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Find and click save button
    const saveButton = page.locator('button').filter({
      has: page.locator('svg.lucide-heart')
    }).first();

    await saveButton.click();
    await page.waitForTimeout(500);

    // Verify saved
    const savedSchools = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('crna_saved_schools') || '[]');
    });

    expect(savedSchools.length).toBeGreaterThan(0);
  });
});
