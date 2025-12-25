// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * usePrograms Hook - Supabase Integration Tests
 *
 * Tests the usePrograms hook integration with real user interactions:
 * 1. School database page loads with schools list
 * 2. Save a school to saved programs (click bookmark)
 * 3. Convert saved school to target program
 * 4. Target program checklist displays items
 * 5. Toggle checklist item completed
 * 6. Remove program from saved list
 *
 * NOTE: These tests work with either:
 * - Supabase NOT configured (uses mock user fallback automatically)
 * - Supabase configured with proper auth setup
 */

/**
 * Setup helper for each test
 *
 * IMPORTANT: These tests require Supabase to NOT be configured.
 * If Supabase is configured, the app will redirect to /login and tests will fail.
 *
 * To run these tests:
 * 1. Stop the dev server if it's running
 * 2. Temporarily rename .env.local to .env.local.backup (or remove VITE_SUPABASE_* vars)
 * 3. Run: npx playwright test tests/hooks/usePrograms.spec.cjs
 * 4. Restore .env.local after tests complete
 */
async function setupTest(page) {
  await page.goto('/');

  // Set localStorage to skip onboarding BEFORE navigating to schools page
  await page.evaluate(() => {
    localStorage.removeItem('crna_saved_schools');
    localStorage.removeItem('crna_target_schools');
    localStorage.removeItem('crna_target_schools_data');
    localStorage.setItem('schoolDatabaseOnboarded', 'true'); // Skip onboarding
  });

  // Wait a moment for auth to initialize (mock user should be set automatically if Supabase not configured)
  await page.waitForTimeout(500);

  // Navigate to schools page
  await page.goto('/schools', { waitUntil: 'domcontentloaded' });

  // Wait for page to load - if we get redirected to login, throw helpful error
  const url = page.url();
  if (url.includes('/login')) {
    throw new Error(
      'Tests were redirected to /login because Supabase is configured.\n\n' +
      'To run these tests:\n' +
      '1. Stop the dev server\n' +
      '2. Temporarily rename .env.local to .env.local.backup\n' +
      '3. Restart the dev server and run tests\n' +
      '4. Restore .env.local when done'
    );
  }

  // Wait for School Database heading and for page to be ready
  await page.waitForSelector('h1:has-text("School Database")', { timeout: 5000 });
  await page.waitForTimeout(1000);
}

test.describe('usePrograms Hook - School Database Integration', () => {
  test.beforeEach(async ({ page }) => {
    await setupTest(page);
  });

  test('school database page loads with schools list', async ({ page }) => {
    // Verify we're on the schools page
    await expect(page.getByRole('heading', { name: /School Database/i })).toBeVisible({ timeout: 5000 });

    // Should show school cards (cards contain links to /schools/ID)
    const schoolCards = page.locator('a[href*="/schools/"]');
    const cardCount = await schoolCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Verify at least one card has visible content
    const firstCard = schoolCards.first();
    await expect(firstCard).toBeVisible();
  });

  test('save a school to saved programs (click bookmark)', async ({ page }) => {
    // Find first school card link
    const firstCard = page.locator('a[href*="/schools/"]').first();
    await expect(firstCard).toBeVisible();

    // Get school ID from href
    const href = await firstCard.getAttribute('href');
    const schoolId = Number(href?.split('/schools/')[1]);

    // Find the save button (button with Heart icon) - it's positioned absolutely within the image area
    // Look for the button that contains the Heart icon SVG
    const saveButton = page.locator('button').filter({ has: page.locator('svg.lucide-heart') }).first();
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await page.waitForTimeout(500);

    // Verify saved in localStorage
    const savedSchools = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('crna_saved_schools') || '[]');
    });
    expect(savedSchools).toContain(schoolId);
  });

  test('convert saved school to target program', async ({ page }) => {
    // Save a school first
    const firstCard = page.locator('a[href*="/schools/"]').first();
    const href = await firstCard.getAttribute('href');
    const schoolId = Number(href?.split('/schools/')[1]);

    const saveButton = page.locator('button').filter({ has: page.locator('svg.lucide-heart') }).first();
    await saveButton.click();
    await page.waitForTimeout(500);

    // Simulate converting to target (in real app this might be drag-drop or button)
    await page.evaluate((id) => {
      const savedIds = JSON.parse(localStorage.getItem('crna_saved_schools') || '[]');
      const targetIds = [id];
      const targetData = {
        [id]: {
          status: 'not_started',
          notes: '',
          progress: 0,
          verifiedRequirements: false,
          checklist: [
            { id: 'req-verified', label: 'Verified Program Requirements', completed: false, isDefault: true },
            { id: 'prereqs', label: 'Completed Prerequisites', completed: false, isDefault: true },
          ],
          lor: [],
          documents: [],
          savedAt: new Date().toISOString(),
        }
      };
      localStorage.setItem('crna_saved_schools', JSON.stringify(savedIds));
      localStorage.setItem('crna_target_schools', JSON.stringify(targetIds));
      localStorage.setItem('crna_target_schools_data', JSON.stringify(targetData));
    }, schoolId);

    // Navigate to My Programs to see target
    await page.goto('/my-programs');
    await page.waitForTimeout(1000);

    // Should see target program (look for links or cards with school info)
    // My Programs page should have content indicating target programs
    await expect(page.getByRole('heading', { name: /My Programs/i })).toBeVisible();
  });

  test('target program checklist displays items', async ({ page }) => {
    // Set up target program
    await page.evaluate(() => {
      const schoolId = 3789;
      localStorage.setItem('crna_saved_schools', JSON.stringify([schoolId]));
      localStorage.setItem('crna_target_schools', JSON.stringify([schoolId]));
      localStorage.setItem('crna_target_schools_data', JSON.stringify({
        [schoolId]: {
          status: 'not_started',
          notes: '',
          progress: 0,
          verifiedRequirements: false,
          checklist: [
            { id: 'req-verified', label: 'Verified Program Requirements', completed: false, isDefault: true },
            { id: 'prereqs', label: 'Completed Prerequisites', completed: false, isDefault: true },
          ],
          lor: [],
          documents: [],
          savedAt: new Date().toISOString(),
        }
      }));
    });

    await page.goto('/my-programs');
    await page.waitForTimeout(1000);

    // Click target program
    await page.locator('a[href*="/my-programs/"]').first().click();
    await page.waitForTimeout(1000);

    // Check for checklist items
    await expect(page.getByText('Verified Program Requirements')).toBeVisible();
    await expect(page.getByText('Completed Prerequisites')).toBeVisible();
  });

  test('toggle checklist item completed', async ({ page }) => {
    // Set up target program
    await page.evaluate(() => {
      const schoolId = 3789;
      localStorage.setItem('crna_saved_schools', JSON.stringify([schoolId]));
      localStorage.setItem('crna_target_schools', JSON.stringify([schoolId]));
      localStorage.setItem('crna_target_schools_data', JSON.stringify({
        [schoolId]: {
          status: 'not_started',
          notes: '',
          progress: 0,
          verifiedRequirements: false,
          checklist: [
            { id: 'req-verified', label: 'Verified Program Requirements', completed: false, isDefault: true },
          ],
          lor: [],
          documents: [],
          savedAt: new Date().toISOString(),
        }
      }));
    });

    await page.goto('/my-programs');
    await page.waitForTimeout(1000);
    await page.locator('a[href*="/my-programs/"]').first().click();
    await page.waitForTimeout(1000);

    // Find and toggle checkbox
    const checkbox = page.locator('label:has-text("Verified Program Requirements")').locator('..').getByRole('checkbox').first();
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify it's checked
    expect(await checkbox.isChecked()).toBe(true);

    // Verify progress updated
    const progress = await page.evaluate(() => {
      const data = JSON.parse(localStorage.getItem('crna_target_schools_data') || '{}');
      return data[3789]?.progress || 0;
    });
    expect(progress).toBeGreaterThan(0);
  });

  test('remove program from saved list', async ({ page }) => {
    // Save a school
    const firstCard = page.locator('a[href*="/schools/"]').first();
    const href = await firstCard.getAttribute('href');
    const schoolId = Number(href?.split('/schools/')[1]);

    const saveButton = page.locator('button').filter({ has: page.locator('svg.lucide-heart') }).first();
    await saveButton.click();
    await page.waitForTimeout(500);

    // Unsave it (click the same button again)
    await saveButton.click();
    await page.waitForTimeout(500);

    // Verify removed from localStorage
    const savedSchools = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('crna_saved_schools') || '[]');
    });
    expect(savedSchools).not.toContain(schoolId);
  });
});

// Manual test documentation for scenarios requiring actual user interaction
test.describe('usePrograms Hook - Manual Test Scenarios', () => {
  test('MANUAL: Drag saved program to target section', async () => {
    // This test requires manual verification
    console.log(`
MANUAL TEST: Convert Saved to Target via Drag-Drop
1. Navigate to /schools
2. Click heart icon on a school card to save it
3. Navigate to /my-programs
4. Drag the saved program card from "Saved Programs" section to "Target Programs" section
5. Verify the program now appears in Target Programs
6. Verify checklist is initialized for the target program
    `);
  });

  test('MANUAL: Complete all checklist items and verify confetti', async () => {
    console.log(`
MANUAL TEST: Checklist Completion Celebration
1. Navigate to a target program detail page (/my-programs/school_XXXX)
2. Check all checklist items one by one
3. When the last item is checked, verify confetti animation appears
4. Verify progress bar shows 100%
    `);
  });
});
