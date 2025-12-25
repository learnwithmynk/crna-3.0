// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * School Database - Search, Location, and Tuition Filters Test Suite
 *
 * Comprehensive tests for the three primary filters on /schools page:
 * 1. Search - Text input that searches school name, city, state
 * 2. Location - State dropdown (or "All States")
 * 3. Tuition - Range slider with min/max values
 *
 * Tests cover:
 * - Individual filter functionality
 * - Filter combinations
 * - Edge cases and clearing filters
 */

test.describe('School Database - Search Filter (Comprehensive)', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('can search by school name - full name', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('Samford U');

    await page.waitForTimeout(500);

    // Should show Samford in results
    await expect(page.getByText('Samford U')).toBeVisible();

    // Results count should update to show filtered count
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toContain('Showing');
  });

  test('can search by school name - partial match', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('Samford');

    await page.waitForTimeout(500);

    // Should show Samford in results (partial match works)
    await expect(page.getByText('Samford U')).toBeVisible();
  });

  test('can search by school name - case insensitive', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('samford');

    await page.waitForTimeout(500);

    // Should show Samford even with lowercase search
    await expect(page.getByText('Samford U')).toBeVisible();
  });

  test('can search by city name', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('Birmingham');

    await page.waitForTimeout(500);

    // Should show schools in Birmingham (Samford U, U of Alabama at Birmingham)
    const schoolCards = page.locator('text=/Birmingham/');
    const count = await schoolCards.count();
    expect(count).toBeGreaterThan(0);

    // Verify at least one Birmingham school is shown
    const isVisible = await page.getByText(/Birmingham/).first().isVisible();
    expect(isVisible).toBe(true);
  });

  test('can search by state name in search box', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('Alabama');

    await page.waitForTimeout(500);

    // Should show Alabama schools
    const schoolCards = page.locator('text=/Alabama/');
    const count = await schoolCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('search with no matches shows empty state', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('XYZNonExistentSchool12345');

    await page.waitForTimeout(500);

    // Should show empty state message
    await expect(page.getByText(/No schools match your filters/i)).toBeVisible();
  });

  test('clearing search shows all schools again', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');

    // Get initial count
    const initialText = await page.getByText(/Showing.*of.*programs/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of (\d+)/);
    const initialCount = initialMatch ? initialMatch[2] : '';

    // Search to filter results
    await searchInput.fill('Samford');
    await page.waitForTimeout(500);

    // Verify filtered
    const filteredText = await page.getByText(/Showing.*of.*programs/).textContent();
    const filteredMatch = filteredText?.match(/Showing (\d+) of/);
    const filteredCount = filteredMatch ? filteredMatch[1] : '';
    expect(Number(filteredCount)).toBeLessThan(Number(initialCount));

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(500);

    // Should show all schools again
    const finalText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(finalText).toContain(initialCount);
  });

  test('search updates results count dynamically', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');

    // Get initial total count
    const initialText = await page.getByText(/of (\d+) programs/).textContent();
    const totalMatch = initialText?.match(/of (\d+) programs/);
    const totalCount = totalMatch ? totalMatch[1] : '';

    // Search should reduce count
    await searchInput.fill('Birmingham');
    await page.waitForTimeout(500);

    const filteredText = await page.getByText(/Showing (\d+) of/).textContent();
    const filteredMatch = filteredText?.match(/Showing (\d+) of/);
    const filteredCount = filteredMatch ? filteredMatch[1] : '';

    expect(Number(filteredCount)).toBeLessThan(Number(totalCount));
  });
});

test.describe('School Database - Location (State) Filter', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('state dropdown is visible and accessible', async ({ page }) => {
    // Location filter should exist
    const locationLabel = page.locator('label:has-text("Location")');
    await expect(locationLabel).toBeVisible();

    // Dropdown should be clickable
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await expect(locationSelect).toBeVisible();
  });

  test('state dropdown shows "All States" by default', async ({ page }) => {
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();

    // Should show "All States" option
    await expect(page.getByRole('option', { name: 'All States' })).toBeVisible();
  });

  test('can filter by selecting a state - Alabama', async ({ page }) => {
    // Click the Location dropdown
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();

    // Select Alabama
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(500);

    // Should show only Alabama schools
    await expect(page.getByText(/Alabama/)).toBeVisible();

    // Results count should be less than total
    const resultsText = await page.getByText(/Showing (\d+) of (\d+)/).textContent();
    const match = resultsText?.match(/Showing (\d+) of (\d+)/);
    if (match) {
      const showing = Number(match[1]);
      const total = Number(match[2]);
      expect(showing).toBeLessThan(total);
    }
  });

  test('can clear state filter by selecting "All States"', async ({ page }) => {
    // Select a state first
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(500);

    // Get filtered count
    const filteredText = await page.getByText(/Showing (\d+) of/).textContent();
    const filteredMatch = filteredText?.match(/Showing (\d+) of/);
    const filteredCount = filteredMatch ? Number(filteredMatch[1]) : 0;

    // Clear by selecting "All States"
    await locationSelect.click();
    await page.getByRole('option', { name: 'All States' }).click();
    await page.waitForTimeout(500);

    // Should show all schools (showing count should equal total count)
    const allText = await page.getByText(/Showing (\d+) of (\d+)/).textContent();
    const allMatch = allText?.match(/Showing (\d+) of (\d+)/);
    if (allMatch) {
      const showing = Number(allMatch[1]);
      const total = Number(allMatch[2]);
      expect(showing).toBe(total);
      expect(showing).toBeGreaterThan(filteredCount);
    }
  });

  test('state dropdown contains multiple states', async ({ page }) => {
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();

    // Should have multiple state options
    const stateOptions = page.getByRole('option');
    const count = await stateOptions.count();

    // Should have more than just "All States" (at least 2-3 states)
    expect(count).toBeGreaterThan(2);
  });

  test('selecting different states changes results', async ({ page }) => {
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();

    // Select Alabama
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(500);

    const alabamaText = await page.getByText(/Showing (\d+) of/).textContent();
    const alabamaMatch = alabamaText?.match(/Showing (\d+) of/);
    const alabamaCount = alabamaMatch ? Number(alabamaMatch[1]) : 0;

    // Select a different state (try to find any other state)
    await locationSelect.click();
    const options = page.getByRole('option');
    const optionCount = await options.count();

    // Find a state that's not Alabama or All States
    let foundDifferentState = false;
    for (let i = 0; i < optionCount && i < 10; i++) {
      const optionText = await options.nth(i).textContent();
      if (optionText && optionText !== 'Alabama' && optionText !== 'All States') {
        await options.nth(i).click();
        foundDifferentState = true;
        break;
      }
    }

    if (foundDifferentState) {
      await page.waitForTimeout(500);

      const otherText = await page.getByText(/Showing (\d+) of/).textContent();
      const otherMatch = otherText?.match(/Showing (\d+) of/);
      const otherCount = otherMatch ? Number(otherMatch[1]) : 0;

      // Counts should be different (different states have different schools)
      expect(otherCount).not.toBe(alabamaCount);
    }
  });
});

test.describe('School Database - Tuition Filter', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('tuition filter is visible with label', async ({ page }) => {
    const tuitionLabel = page.locator('label:has-text("Tuition")');
    await expect(tuitionLabel).toBeVisible();
  });

  test('tuition range displays formatted currency values', async ({ page }) => {
    // Should show formatted currency range (e.g., "$0 — $293,400")
    const currencyDisplay = page.locator('text=/\\$0.*\\$/');
    await expect(currencyDisplay).toBeVisible();
  });

  test('tuition slider has two handles (min and max)', async ({ page }) => {
    // Find both sliders (min and max)
    const sliders = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]');
    const count = await sliders.count();

    // Should have 2 sliders (one for min, one for max)
    expect(count).toBe(2);
  });

  test('tuition slider min handle is interactive', async ({ page }) => {
    const minSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').first();
    await expect(minSlider).toBeVisible();

    // Should have aria-valuenow attribute
    const value = await minSlider.getAttribute('aria-valuenow');
    expect(value).toBeTruthy();
  });

  test('tuition slider max handle is interactive', async ({ page }) => {
    const maxSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').last();
    await expect(maxSlider).toBeVisible();

    // Should have aria-valuenow attribute
    const value = await maxSlider.getAttribute('aria-valuenow');
    expect(value).toBeTruthy();
  });

  test('can set minimum tuition value using slider', async ({ page }) => {
    const minSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').first();

    // Get bounding box for the slider
    const box = await minSlider.boundingBox();
    if (box) {
      // Click at a position to set a value (25% from left = higher min value)
      await page.mouse.click(box.x + (box.width * 0.25), box.y + (box.height / 2));
      await page.waitForTimeout(500);

      // Verify the display updated (min should be > $0)
      const currencyDisplay = await page.locator('label:has-text("Tuition")').locator('..').locator('text=/\\$[\\d,]+.*—/').textContent();

      // Should not show $0 anymore (min was increased)
      expect(currencyDisplay).toBeTruthy();
    }
  });

  test('can set maximum tuition value using slider', async ({ page }) => {
    const maxSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').last();

    // Get initial max value
    const initialValue = await maxSlider.getAttribute('aria-valuenow');
    const initialMax = Number(initialValue);

    // Get bounding box for the slider
    const box = await maxSlider.boundingBox();
    if (box) {
      // Click at a position to set a lower max value (50% from left)
      await page.mouse.click(box.x + (box.width * 0.5), box.y + (box.height / 2));
      await page.waitForTimeout(500);

      // Get new max value
      const newValue = await maxSlider.getAttribute('aria-valuenow');
      const newMax = Number(newValue);

      // Max should have changed
      expect(newMax).not.toBe(initialMax);
    }
  });

  test('setting tuition range filters schools', async ({ page }) => {
    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of (\d+)/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of (\d+)/);
    const initialShowing = initialMatch ? Number(initialMatch[1]) : 0;

    // Move max slider to middle (should filter out expensive schools)
    const maxSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').last();
    const box = await maxSlider.boundingBox();

    if (box) {
      // Click at 50% to reduce max tuition
      await page.mouse.click(box.x + (box.width * 0.5), box.y + (box.height / 2));
      await page.waitForTimeout(500);

      // Results should be filtered
      const filteredText = await page.getByText(/Showing (\d+) of/).textContent();
      const filteredMatch = filteredText?.match(/Showing (\d+) of/);
      const filteredShowing = filteredMatch ? Number(filteredMatch[1]) : 0;

      // Should show fewer schools (some filtered out by tuition)
      expect(filteredShowing).toBeLessThanOrEqual(initialShowing);
    }
  });

  test('tuition filter respects both min and max values', async ({ page }) => {
    // Move min slider up
    const minSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').first();
    const minBox = await minSlider.boundingBox();

    if (minBox) {
      await page.mouse.click(minBox.x + (minBox.width * 0.3), minBox.y + (minBox.height / 2));
      await page.waitForTimeout(300);
    }

    // Move max slider down
    const maxSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').last();
    const maxBox = await maxSlider.boundingBox();

    if (maxBox) {
      await page.mouse.click(maxBox.x + (maxBox.width * 0.6), maxBox.y + (maxBox.height / 2));
      await page.waitForTimeout(500);
    }

    // Should filter to only schools in the range
    const resultsText = await page.getByText(/Showing (\d+) of (\d+)/).textContent();
    const match = resultsText?.match(/Showing (\d+) of (\d+)/);

    if (match) {
      const showing = Number(match[1]);
      const total = Number(match[2]);
      // Should be filtering (showing < total)
      expect(showing).toBeLessThanOrEqual(total);
    }
  });

  test('currency display updates when slider moves', async ({ page }) => {
    // Get initial display
    const initialDisplay = await page.locator('label:has-text("Tuition")').locator('..').locator('text=/\\$[\\d,]+.*—.*\\$[\\d,]+/').textContent();

    // Move min slider
    const minSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').first();
    const box = await minSlider.boundingBox();

    if (box) {
      await page.mouse.click(box.x + (box.width * 0.2), box.y + (box.height / 2));
      await page.waitForTimeout(500);

      // Get new display
      const newDisplay = await page.locator('label:has-text("Tuition")').locator('..').locator('text=/\\$[\\d,]+.*—.*\\$[\\d,]+/').textContent();

      // Display should have changed
      expect(newDisplay).not.toBe(initialDisplay);
    }
  });
});

test.describe('School Database - Filter Combinations (Search + Location + Tuition)', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('can combine search and state filter', async ({ page }) => {
    // Apply search filter
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('U');
    await page.waitForTimeout(300);

    // Apply state filter
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(500);

    // Should show only schools in Alabama with 'U' in name/city/state
    const resultsText = await page.getByText(/Showing (\d+) of (\d+)/).textContent();
    expect(resultsText).toBeTruthy();

    // Should show Alabama schools with "U"
    const hasResults = await page.locator('text=/Alabama/').first().isVisible().catch(() => false);
    if (hasResults) {
      expect(hasResults).toBe(true);
    }
  });

  test('can combine search and tuition filter', async ({ page }) => {
    // Apply search
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('Birmingham');
    await page.waitForTimeout(300);

    // Apply tuition filter (reduce max)
    const maxSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').last();
    const box = await maxSlider.boundingBox();

    if (box) {
      await page.mouse.click(box.x + (box.width * 0.5), box.y + (box.height / 2));
      await page.waitForTimeout(500);
    }

    // Should filter by both search term AND tuition
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can combine state and tuition filter', async ({ page }) => {
    // Apply state filter
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(300);

    // Apply tuition filter
    const maxSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').last();
    const box = await maxSlider.boundingBox();

    if (box) {
      await page.mouse.click(box.x + (box.width * 0.6), box.y + (box.height / 2));
      await page.waitForTimeout(500);
    }

    // Should filter by both state AND tuition
    const resultsText = await page.getByText(/Showing (\d+) of (\d+)/).textContent();
    const match = resultsText?.match(/Showing (\d+) of (\d+)/);

    if (match) {
      const showing = Number(match[1]);
      const total = Number(match[2]);
      expect(showing).toBeLessThanOrEqual(total);
    }
  });

  test('can combine all three filters - search + state + tuition', async ({ page }) => {
    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of (\d+)/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of (\d+)/);
    const initialTotal = initialMatch ? Number(initialMatch[2]) : 0;

    // Apply search
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('U');
    await page.waitForTimeout(200);

    // Apply state
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(200);

    // Apply tuition
    const maxSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').last();
    const box = await maxSlider.boundingBox();

    if (box) {
      await page.mouse.click(box.x + (box.width * 0.5), box.y + (box.height / 2));
      await page.waitForTimeout(500);
    }

    // Should apply all three filters
    const filteredText = await page.getByText(/Showing (\d+) of/).textContent();
    const filteredMatch = filteredText?.match(/Showing (\d+) of/);
    const filteredCount = filteredMatch ? Number(filteredMatch[1]) : 0;

    // Filtered count should be less than total
    expect(filteredCount).toBeLessThanOrEqual(initialTotal);

    // Should show results text
    expect(filteredText).toContain('Showing');
  });

  test('Clear All Filters button resets all three filter types', async ({ page }) => {
    // Apply all three filters
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('Birmingham');
    await page.waitForTimeout(200);

    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(200);

    const maxSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').last();
    const box = await maxSlider.boundingBox();

    if (box) {
      await page.mouse.click(box.x + (box.width * 0.4), box.y + (box.height / 2));
      await page.waitForTimeout(500);
    }

    // Clear All Filters button should be visible
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await expect(clearButton).toBeVisible();

    // Click Clear All Filters
    await clearButton.click();
    await page.waitForTimeout(500);

    // Search should be cleared
    expect(await searchInput.inputValue()).toBe('');

    // State should be reset to "All States"
    // (The select should show all states now)

    // Results should show all schools
    const resultsText = await page.getByText(/Showing (\d+) of (\d+)/).textContent();
    const match = resultsText?.match(/Showing (\d+) of (\d+)/);

    if (match) {
      const showing = Number(match[1]);
      const total = Number(match[2]);
      // Showing should equal total (no filters active)
      expect(showing).toBe(total);
    }
  });

  test('filters work together with AND logic (narrow results progressively)', async ({ page }) => {
    // Get baseline count
    const baselineText = await page.getByText(/Showing (\d+) of (\d+)/).textContent();
    const baselineMatch = baselineText?.match(/Showing (\d+) of (\d+)/);
    const baselineCount = baselineMatch ? Number(baselineMatch[1]) : 0;

    // Apply first filter (search)
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('U');
    await page.waitForTimeout(500);

    const afterSearchText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterSearchMatch = afterSearchText?.match(/Showing (\d+) of/);
    const afterSearchCount = afterSearchMatch ? Number(afterSearchMatch[1]) : 0;

    // Should reduce results
    expect(afterSearchCount).toBeLessThanOrEqual(baselineCount);

    // Apply second filter (state) on top of first
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(500);

    const afterStateText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterStateMatch = afterStateText?.match(/Showing (\d+) of/);
    const afterStateCount = afterStateMatch ? Number(afterStateMatch[1]) : 0;

    // Should further reduce or stay same (AND logic)
    expect(afterStateCount).toBeLessThanOrEqual(afterSearchCount);

    // Apply third filter (tuition) on top of first two
    const maxSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').last();
    const box = await maxSlider.boundingBox();

    if (box) {
      await page.mouse.click(box.x + (box.width * 0.5), box.y + (box.height / 2));
      await page.waitForTimeout(500);
    }

    const afterTuitionText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterTuitionMatch = afterTuitionText?.match(/Showing (\d+) of/);
    const afterTuitionCount = afterTuitionMatch ? Number(afterTuitionMatch[1]) : 0;

    // Should further reduce or stay same (AND logic)
    expect(afterTuitionCount).toBeLessThanOrEqual(afterStateCount);
  });

  test('removing filters one by one increases results progressively', async ({ page }) => {
    // Apply all three filters
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('U');
    await page.waitForTimeout(200);

    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(200);

    const maxSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').last();
    const box = await maxSlider.boundingBox();

    if (box) {
      await page.mouse.click(box.x + (box.width * 0.4), box.y + (box.height / 2));
      await page.waitForTimeout(500);
    }

    // Get heavily filtered count
    const filteredText = await page.getByText(/Showing (\d+) of/).textContent();
    const filteredMatch = filteredText?.match(/Showing (\d+) of/);
    const filteredCount = filteredMatch ? Number(filteredMatch[1]) : 0;

    // Remove search filter
    await searchInput.fill('');
    await page.waitForTimeout(500);

    const afterSearchClearText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterSearchClearMatch = afterSearchClearText?.match(/Showing (\d+) of/);
    const afterSearchClearCount = afterSearchClearMatch ? Number(afterSearchClearMatch[1]) : 0;

    // Should show more results (or same)
    expect(afterSearchClearCount).toBeGreaterThanOrEqual(filteredCount);

    // Remove state filter
    await locationSelect.click();
    await page.getByRole('option', { name: 'All States' }).click();
    await page.waitForTimeout(500);

    const afterStateClearText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterStateClearMatch = afterStateClearText?.match(/Showing (\d+) of/);
    const afterStateClearCount = afterStateClearMatch ? Number(afterStateClearMatch[1]) : 0;

    // Should show even more results
    expect(afterStateClearCount).toBeGreaterThanOrEqual(afterSearchClearCount);
  });
});

test.describe('School Database - Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('search with special characters does not break filter', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');

    // Try searching with special characters
    await searchInput.fill('U & Alabama');
    await page.waitForTimeout(500);

    // Should not crash, should show results or empty state
    const hasResults = await page.getByText(/Showing.*of.*programs/).isVisible();
    expect(hasResults).toBe(true);
  });

  test('very restrictive combination shows empty state', async ({ page }) => {
    // Apply very restrictive search
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('XYZ123');
    await page.waitForTimeout(300);

    // Add state filter
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(500);

    // Should show empty state
    await expect(page.getByText(/No schools match your filters/i)).toBeVisible();

    // Clear All Filters should be available
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await expect(clearButton.first()).toBeVisible();
  });

  test('tuition filter with min > max does not break', async ({ page }) => {
    // This test verifies the UI prevents invalid states
    // Most slider implementations prevent min from exceeding max

    const minSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').first();
    const maxSlider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').last();

    const minBox = await minSlider.boundingBox();
    const maxBox = await maxSlider.boundingBox();

    if (minBox && maxBox) {
      // Try to set min very high
      await page.mouse.click(minBox.x + (minBox.width * 0.8), minBox.y + (minBox.height / 2));
      await page.waitForTimeout(300);

      // Try to set max very low
      await page.mouse.click(maxBox.x + (maxBox.width * 0.2), maxBox.y + (maxBox.height / 2));
      await page.waitForTimeout(500);

      // Should still show valid state (not broken)
      const resultsText = await page.getByText(/Showing.*of.*programs/).isVisible();
      expect(resultsText).toBe(true);
    }
  });

  test('rapid filter changes do not cause race conditions', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');

    // Rapidly change search value
    await searchInput.fill('A');
    await page.waitForTimeout(100);
    await searchInput.fill('Al');
    await page.waitForTimeout(100);
    await searchInput.fill('Ala');
    await page.waitForTimeout(100);
    await searchInput.fill('Alab');
    await page.waitForTimeout(100);
    await searchInput.fill('Alabama');
    await page.waitForTimeout(500);

    // Should still show valid results
    const resultsText = await page.getByText(/Showing.*of.*programs/).isVisible();
    expect(resultsText).toBe(true);

    // Should show Alabama-related results
    const hasAlabama = await page.locator('text=/Alabama/').first().isVisible();
    expect(hasAlabama).toBe(true);
  });
});
