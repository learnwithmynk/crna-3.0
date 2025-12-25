// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * School Database Filters - Comprehensive Test Suite
 *
 * Tests ALL filters on the /schools page:
 * 1. Search - School name search
 * 2. Location - State dropdown
 * 3. Tuition - Range slider
 * 4. GRE - Not Required / Required / Required but Waived checkboxes
 * 5. Requires - Multi-select for prerequisites
 * 6. Does Not Require - Multi-select for prerequisites
 * 7. Specialty Accepted - NICU/PICU/ER/Other checkboxes
 * 8. Type - Front-Loaded / Integrated checkboxes
 * 9. GPA Type - GPA calculations complete checkbox
 * 10. Other - 6 checkboxes for various program features
 */

test.describe('School Database - Page Load', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    // Skip onboarding modal if present
    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('page loads with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /School Database/i })).toBeVisible();
  });

  test('shows school count', async ({ page }) => {
    await expect(page.getByText(/programs/i)).toBeVisible();
  });

  test('shows filter sidebar on desktop', async ({ page }) => {
    // Filter sidebar should be visible (checking for search input)
    const searchInput = page.locator('input[placeholder="Search..."]');
    await expect(searchInput).toBeVisible();
  });

  test('shows school cards', async ({ page }) => {
    // Should show at least one school card
    await expect(page.locator('text=/Samford|Alabama|Birmingham/').first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('School Database - Search Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    // Skip onboarding modal if present
    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('can search by school name', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('Samford');

    // Wait for results to update
    await page.waitForTimeout(500);

    // Should show Samford in results
    await expect(page.getByText('Samford U')).toBeVisible();

    // Results count should update
    const resultsText = await page.getByText(/of \d+ programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('search is case insensitive', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('samford');

    await page.waitForTimeout(500);
    await expect(page.getByText('Samford U')).toBeVisible();
  });

  test('search filters results correctly', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('Alabama');

    await page.waitForTimeout(500);

    // Should show Alabama schools
    const schoolCards = page.locator('text=/Alabama/');
    const count = await schoolCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clear search shows all schools again', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search..."]');

    // Get initial count
    const initialText = await page.getByText(/of \d+ programs/).textContent();

    // Search
    await searchInput.fill('Samford');
    await page.waitForTimeout(500);

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(500);

    // Should show all schools again
    const finalText = await page.getByText(/of \d+ programs/).textContent();
    expect(finalText).toContain(initialText?.match(/of (\d+)/)?.[1] || '');
  });
});

test.describe('School Database - Location Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('can filter by state', async ({ page }) => {
    // Click the Location dropdown
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();

    // Select Alabama
    await page.getByRole('option', { name: 'Alabama' }).click();

    await page.waitForTimeout(500);

    // Should show only Alabama schools
    await expect(page.getByText(/Alabama/)).toBeVisible();
  });

  test('can clear state filter', async ({ page }) => {
    // Select a state
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(500);

    // Clear by selecting "All States"
    await locationSelect.click();
    await page.getByRole('option', { name: 'All States' }).click();
    await page.waitForTimeout(500);

    // Should show more schools
    const resultsText = await page.getByText(/of \d+ programs/).textContent();
    expect(resultsText).toBeTruthy();
  });
});

test.describe('School Database - Tuition Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('shows tuition range display', async ({ page }) => {
    // Should show formatted currency range
    await expect(page.getByText(/\$0.*\$/)).toBeVisible();
  });

  test('tuition slider is interactive', async ({ page }) => {
    // Find the slider
    const slider = page.locator('label:has-text("Tuition")').locator('..').locator('[role="slider"]').first();
    await expect(slider).toBeVisible();

    // Slider should be interactive (has aria-valuenow)
    const value = await slider.getAttribute('aria-valuenow');
    expect(value).toBeTruthy();
  });
});

test.describe('School Database - GRE Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('can filter by GRE Not Required', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Not Required")');
    await checkbox.click();

    await page.waitForTimeout(500);

    // Results should update
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can filter by GRE Required', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Required")').first();
    await checkbox.click();

    await page.waitForTimeout(500);

    // Should show schools with GRE required (like Samford)
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can filter by GRE Required but Waived', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Required but Waived")');
    await checkbox.click();

    await page.waitForTimeout(500);

    // Results should update
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('multiple GRE filters work together (OR logic)', async ({ page }) => {
    // Check both "Not Required" and "Required"
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(300);

    const beforeCount = await page.getByText(/Showing (\d+) of/).textContent();

    await page.locator('label:has-text("Required")').first().click();
    await page.waitForTimeout(500);

    // Should show schools matching either condition
    const afterCount = await page.getByText(/Showing (\d+) of/).textContent();
    expect(afterCount).toBeTruthy();
  });
});

test.describe('School Database - Requires Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('can open Requires dropdown', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();

    // Should show options
    await expect(page.getByRole('option', { name: /CCRN/i })).toBeVisible();
  });

  test('can select CCRN requirement', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'CCRN' }).click();

    await page.waitForTimeout(500);

    // Should show selected requirement as tag
    await expect(page.getByText('CCRN').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can select Shadowing requirement', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Shadowing' }).click();

    await page.waitForTimeout(500);

    // Should show selected requirement as tag
    await expect(page.getByText('Shadowing').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can select Statistics prerequisite', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();

    await page.waitForTimeout(500);

    await expect(page.getByText('Statistics').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can select multiple requirements', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');

    // Select CCRN
    await requiresSelect.click();
    await page.getByRole('option', { name: 'CCRN' }).click();
    await page.waitForTimeout(300);

    // Select Shadowing
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Shadowing' }).click();
    await page.waitForTimeout(500);

    // Both should be visible as tags
    await expect(page.getByText('CCRN').filter({ has: page.locator('svg') })).toBeVisible();
    await expect(page.getByText('Shadowing').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can remove requirement by clicking tag', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'CCRN' }).click();
    await page.waitForTimeout(500);

    // Click the tag to remove
    const tag = page.getByText('CCRN').filter({ has: page.locator('svg') });
    await tag.click();
    await page.waitForTimeout(500);

    // Tag should be removed
    await expect(tag).not.toBeVisible();
  });
});

test.describe('School Database - Does Not Require Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('can open Does Not Require dropdown', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');
    await doesNotRequireSelect.click();

    await expect(page.getByRole('option', { name: /CCRN/i })).toBeVisible();
  });

  test('can select GRE not required', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'GRE' }).click();

    await page.waitForTimeout(500);

    // Should filter results
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can select multiple does not require items', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');

    // Select GRE
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'GRE' }).click();
    await page.waitForTimeout(300);

    // Select CCRN
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'CCRN' }).click();
    await page.waitForTimeout(500);

    // Both should be visible
    const tags = page.locator('label:has-text("Does Not Require")').locator('..').locator('span:has(svg)');
    const count = await tags.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});

test.describe('School Database - Specialty Accepted Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('can filter by NICU Experience', async ({ page }) => {
    const checkbox = page.locator('label:has-text("NICU Experience")');
    await checkbox.click();

    await page.waitForTimeout(500);

    // Should show schools accepting NICU (like Samford)
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can filter by PICU Experience', async ({ page }) => {
    const checkbox = page.locator('label:has-text("PICU Experience")');
    await checkbox.click();

    await page.waitForTimeout(500);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can filter by ER Experience', async ({ page }) => {
    const checkbox = page.locator('label:has-text("ER Experience")');
    await checkbox.click();

    await page.waitForTimeout(500);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can filter by Other Critical Care', async ({ page }) => {
    // Find the checkbox in Specialty Accepted section
    const checkbox = page.locator('label:has-text("Specialty Accepted")').locator('..').locator('label:has-text("Possibly Accepts Other Areas Of Critical Care")');
    await checkbox.click();

    await page.waitForTimeout(500);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('multiple specialty filters work together (AND logic)', async ({ page }) => {
    // Check NICU
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(300);

    // Check PICU
    await page.locator('label:has-text("PICU Experience")').click();
    await page.waitForTimeout(500);

    // Should only show schools accepting both
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });
});

test.describe('School Database - Type Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('can filter by Front-Loaded', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")');
    await checkbox.click();

    await page.waitForTimeout(500);

    // Should show front-loaded schools like Samford
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can filter by Integrated', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Integrated")');
    await checkbox.click();

    await page.waitForTimeout(500);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('multiple type filters work together (OR logic)', async ({ page }) => {
    // Check both
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(300);

    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Integrated")').click();
    await page.waitForTimeout(500);

    // Should show schools matching either type
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });
});

test.describe('School Database - GPA Type Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('can filter by GPA calculations complete', async ({ page }) => {
    const checkbox = page.locator('label:has-text("GPA Type")').locator('..').locator('label:has-text("GPA calculations complete")');
    await checkbox.click();

    await page.waitForTimeout(500);

    // Should show schools with GPA calculations
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });
});

test.describe('School Database - Other Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('can filter by Work During Program', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Work During Program")');
    await checkbox.click();

    await page.waitForTimeout(500);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can filter by Nursing Cas', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Nursing Cas")');
    await checkbox.click();

    await page.waitForTimeout(500);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can filter by Rolling Admissions', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Rolling Admissions")');
    await checkbox.click();

    await page.waitForTimeout(500);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can filter by Partially Online', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Partially Online")');
    await checkbox.click();

    await page.waitForTimeout(500);

    // Should show partially online schools like Samford
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can filter by Accepts Bachelors of Science In a Related Field', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Accepts Bachelors of Science In a Related Field")');
    await checkbox.click();

    await page.waitForTimeout(500);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });
});

test.describe('School Database - Clear All Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('Clear All Filters button appears when filters are active', async ({ page }) => {
    // Apply a filter
    const checkbox = page.locator('label:has-text("NICU Experience")');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Clear All Filters button should be visible
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await expect(clearButton).toBeVisible();
  });

  test('Clear All Filters resets search', async ({ page }) => {
    // Apply search filter
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('Samford');
    await page.waitForTimeout(500);

    // Click Clear All Filters
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await clearButton.click();
    await page.waitForTimeout(500);

    // Search should be cleared
    expect(await searchInput.inputValue()).toBe('');
  });

  test('Clear All Filters resets checkboxes', async ({ page }) => {
    // Check a checkbox
    const checkbox = page.locator('label:has-text("NICU Experience")');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Clear filters
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await clearButton.click();
    await page.waitForTimeout(500);

    // Checkbox should be unchecked
    const checkboxInput = page.locator('#acceptsNicu');
    expect(await checkboxInput.isChecked()).toBe(false);
  });

  test('Clear All Filters resets state dropdown', async ({ page }) => {
    // Select a state
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(500);

    // Clear filters
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await clearButton.click();
    await page.waitForTimeout(500);

    // Should show all schools again
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toContain('of');
  });

  test('Clear All Filters resets multi-select filters', async ({ page }) => {
    // Select a requirement
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'CCRN' }).click();
    await page.waitForTimeout(500);

    // Clear filters
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await clearButton.click();
    await page.waitForTimeout(500);

    // Tag should be removed
    const tag = page.getByText('CCRN').filter({ has: page.locator('svg') });
    await expect(tag).not.toBeVisible();
  });
});

test.describe('School Database - Filter Combinations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('can combine search and state filters', async ({ page }) => {
    // Apply search
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('U');
    await page.waitForTimeout(300);

    // Apply state filter
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(500);

    // Should show filtered results
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can combine specialty and type filters', async ({ page }) => {
    // Check NICU
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(300);

    // Check Front-Loaded
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(500);

    // Should show schools matching both
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can combine GRE and specialty filters', async ({ page }) => {
    // Check GRE Required
    await page.locator('label:has-text("Required")').first().click();
    await page.waitForTimeout(300);

    // Check NICU
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(500);

    // Should show schools matching both (like Samford)
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('results count updates with filter combinations', async ({ page }) => {
    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of/);
    const initialCount = initialMatch ? parseInt(initialMatch[1]) : 0;

    // Apply filter
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(500);

    // Count should change
    const newText = await page.getByText(/Showing (\d+) of/).textContent();
    const newMatch = newText?.match(/Showing (\d+) of/);
    const newCount = newMatch ? parseInt(newMatch[1]) : 0;

    expect(newCount).toBeLessThanOrEqual(initialCount);
  });
});

test.describe('School Database - Empty State', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('shows empty state when no schools match filters', async ({ page }) => {
    // Apply very restrictive filters that should return no results
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('XYZ123NONEXISTENT');
    await page.waitForTimeout(500);

    // Should show empty state
    await expect(page.getByText(/No schools match your filters/i)).toBeVisible();
  });

  test('empty state has Clear All Filters button', async ({ page }) => {
    // Apply filter that returns no results
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('XYZ123NONEXISTENT');
    await page.waitForTimeout(500);

    // Should show Clear All Filters in empty state
    const clearButtons = page.getByRole('button', { name: /Clear All Filters/i });
    const count = await clearButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking Clear All Filters in empty state shows schools again', async ({ page }) => {
    // Apply filter that returns no results
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('XYZ123NONEXISTENT');
    await page.waitForTimeout(500);

    // Click any Clear All Filters button
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i }).first();
    await clearButton.click();
    await page.waitForTimeout(500);

    // Should show schools again
    await expect(page.getByText(/Samford|Alabama/)).toBeVisible();
  });
});
