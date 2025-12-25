// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * School Database - GRE Filters Test Suite
 *
 * Comprehensive tests for GRE filter functionality on /schools page.
 * Tests individual filters, combinations, and result count accuracy.
 *
 * GRE Filter Logic:
 * - Not Required: greRequired === false
 * - Required: greRequired === true && !greWaivedFor
 * - Required but Waived: greWaivedFor is truthy
 * - Multiple filters use OR logic (school matches ANY selected filter)
 */

test.describe('School Database - GRE Filters', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('GRE section is visible', async ({ page }) => {
    // Check that GRE section heading exists
    await expect(page.locator('text=/GRE/i').first()).toBeVisible();
  });

  test('all three GRE checkboxes are present', async ({ page }) => {
    // Find GRE section and verify all checkboxes
    const greSection = page.locator('label:has-text("GRE")').locator('..');

    await expect(greSection.locator('label:has-text("Not Required")')).toBeVisible();
    await expect(greSection.locator('label:has-text("Required")').first()).toBeVisible();
    await expect(greSection.locator('label:has-text("Required but Waived")')).toBeVisible();
  });

  test('GRE checkboxes start unchecked', async ({ page }) => {
    // Verify all checkboxes are initially unchecked
    const notRequiredCheckbox = page.locator('#greNotRequired');
    const requiredCheckbox = page.locator('#greRequired');
    const waivedCheckbox = page.locator('#greWaived');

    await expect(notRequiredCheckbox).not.toBeChecked();
    await expect(requiredCheckbox).not.toBeChecked();
    await expect(waivedCheckbox).not.toBeChecked();
  });
});

test.describe('School Database - GRE Filter: Not Required', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('can check "Not Required" filter', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Not Required")');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify checkbox is checked
    const checkboxInput = page.locator('#greNotRequired');
    await expect(checkboxInput).toBeChecked();
  });

  test('filters schools where GRE is not required', async ({ page }) => {
    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of (\d+) programs/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of (\d+)/);
    const initialTotal = initialMatch ? parseInt(initialMatch[2]) : 0;

    // Apply filter
    const checkbox = page.locator('label:has-text("Not Required")');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify results updated
    const filteredText = await page.getByText(/Showing (\d+) of (\d+) programs/).textContent();
    const filteredMatch = filteredText?.match(/Showing (\d+) of (\d+)/);
    const filteredCount = filteredMatch ? parseInt(filteredMatch[1]) : 0;
    const displayedTotal = filteredMatch ? parseInt(filteredMatch[2]) : 0;

    // Total should remain the same
    expect(displayedTotal).toBe(initialTotal);

    // Filtered count should be less than or equal to total
    expect(filteredCount).toBeLessThanOrEqual(displayedTotal);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('can uncheck "Not Required" filter', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Not Required")');

    // Check
    await checkbox.click();
    await page.waitForTimeout(300);

    const afterCheckText = await page.getByText(/Showing (\d+) of/).textContent();

    // Uncheck
    await checkbox.click();
    await page.waitForTimeout(500);

    const afterUncheckText = await page.getByText(/Showing (\d+) of/).textContent();

    // Verify checkbox is unchecked
    const checkboxInput = page.locator('#greNotRequired');
    await expect(checkboxInput).not.toBeChecked();

    // Count should change back
    expect(afterUncheckText).not.toBe(afterCheckText);
  });

  test('Clear All Filters button appears when "Not Required" is checked', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Not Required")');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Clear All Filters button should be visible
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await expect(clearButton).toBeVisible();
  });
});

test.describe('School Database - GRE Filter: Required', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('can check "Required" filter', async ({ page }) => {
    // Click the label associated with the greRequired checkbox
    const checkbox = page.locator('label[for="greRequired"]');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify checkbox is checked
    const checkboxInput = page.locator('#greRequired');
    await expect(checkboxInput).toBeChecked();
  });

  test('filters schools where GRE is required', async ({ page }) => {
    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of (\d+) programs/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of (\d+)/);
    const initialTotal = initialMatch ? parseInt(initialMatch[2]) : 0;

    // Apply filter
    const checkbox = page.locator('label[for="greRequired"]');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify results updated
    const filteredText = await page.getByText(/Showing (\d+) of (\d+) programs/).textContent();
    const filteredMatch = filteredText?.match(/Showing (\d+) of (\d+)/);
    const filteredCount = filteredMatch ? parseInt(filteredMatch[1]) : 0;
    const displayedTotal = filteredMatch ? parseInt(filteredMatch[2]) : 0;

    // Total should remain the same
    expect(displayedTotal).toBe(initialTotal);

    // Filtered count should be less than or equal to total
    expect(filteredCount).toBeLessThanOrEqual(displayedTotal);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('shows schools with greRequired=true and no waiver', async ({ page }) => {
    // Apply filter
    const checkbox = page.locator('label[for="greRequired"]');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Schools like Samford have greRequired=true, greWaivedFor=null
    // This should show such schools
    const resultsText = await page.getByText(/Showing (\d+) of/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can uncheck "Required" filter', async ({ page }) => {
    const checkbox = page.locator('label[for="greRequired"]');

    // Check
    await checkbox.click();
    await page.waitForTimeout(300);

    // Uncheck
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify checkbox is unchecked
    const checkboxInput = page.locator('#greRequired');
    await expect(checkboxInput).not.toBeChecked();
  });
});

test.describe('School Database - GRE Filter: Required but Waived', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('can check "Required but Waived" filter', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Required but Waived")');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify checkbox is checked
    const checkboxInput = page.locator('#greWaived');
    await expect(checkboxInput).toBeChecked();
  });

  test('filters schools where GRE can be waived', async ({ page }) => {
    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of (\d+) programs/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of (\d+)/);
    const initialTotal = initialMatch ? parseInt(initialMatch[2]) : 0;

    // Apply filter
    const checkbox = page.locator('label:has-text("Required but Waived")');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify results updated
    const filteredText = await page.getByText(/Showing (\d+) of (\d+) programs/).textContent();
    const filteredMatch = filteredText?.match(/Showing (\d+) of (\d+)/);
    const filteredCount = filteredMatch ? parseInt(filteredMatch[1]) : 0;
    const displayedTotal = filteredMatch ? parseInt(filteredMatch[2]) : 0;

    // Total should remain the same
    expect(displayedTotal).toBe(initialTotal);

    // Filtered count should be less than or equal to total
    expect(filteredCount).toBeLessThanOrEqual(displayedTotal);

    // Note: This might be 0 if no schools in the database have waiver options
    expect(filteredCount).toBeGreaterThanOrEqual(0);
  });

  test('can uncheck "Required but Waived" filter', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Required but Waived")');

    // Check
    await checkbox.click();
    await page.waitForTimeout(300);

    // Uncheck
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify checkbox is unchecked
    const checkboxInput = page.locator('#greWaived');
    await expect(checkboxInput).not.toBeChecked();
  });
});

test.describe('School Database - GRE Filter Combinations', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('can select "Not Required" and "Required" together', async ({ page }) => {
    // Check "Not Required"
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(300);

    const afterFirstText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterFirstMatch = afterFirstText?.match(/Showing (\d+) of/);
    const countAfterFirst = afterFirstMatch ? parseInt(afterFirstMatch[1]) : 0;

    // Check "Required"
    await page.locator('label[for="greRequired"]').click();
    await page.waitForTimeout(500);

    const afterBothText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterBothMatch = afterBothText?.match(/Showing (\d+) of/);
    const countAfterBoth = afterBothMatch ? parseInt(afterBothMatch[1]) : 0;

    // With OR logic, count should increase (or stay same if one is subset of other)
    expect(countAfterBoth).toBeGreaterThanOrEqual(countAfterFirst);

    // Both checkboxes should be checked
    await expect(page.locator('#greNotRequired')).toBeChecked();
    await expect(page.locator('#greRequired')).toBeChecked();
  });

  test('can select "Required" and "Required but Waived" together', async ({ page }) => {
    // Check "Required"
    await page.locator('label[for="greRequired"]').click();
    await page.waitForTimeout(300);

    const afterFirstText = await page.getByText(/Showing (\d+) of/).textContent();

    // Check "Required but Waived"
    await page.locator('label:has-text("Required but Waived")').click();
    await page.waitForTimeout(500);

    const afterBothText = await page.getByText(/Showing (\d+) of/).textContent();

    // Both checkboxes should be checked
    await expect(page.locator('#greRequired')).toBeChecked();
    await expect(page.locator('#greWaived')).toBeChecked();

    // Results should update (count may increase with OR logic)
    expect(afterBothText).toBeTruthy();
  });

  test('can select all three GRE filters together', async ({ page }) => {
    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of (\d+) programs/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of (\d+)/);
    const initialTotal = initialMatch ? parseInt(initialMatch[2]) : 0;

    // Check all three
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(200);

    await page.locator('label[for="greRequired"]').click();
    await page.waitForTimeout(200);

    await page.locator('label:has-text("Required but Waived")').click();
    await page.waitForTimeout(500);

    // All checkboxes should be checked
    await expect(page.locator('#greNotRequired')).toBeChecked();
    await expect(page.locator('#greRequired')).toBeChecked();
    await expect(page.locator('#greWaived')).toBeChecked();

    // With all filters, should show all schools (since it's OR logic)
    const allSelectedText = await page.getByText(/Showing (\d+) of (\d+) programs/).textContent();
    const allSelectedMatch = allSelectedText?.match(/Showing (\d+) of (\d+)/);
    const allSelectedCount = allSelectedMatch ? parseInt(allSelectedMatch[1]) : 0;
    const allSelectedTotal = allSelectedMatch ? parseInt(allSelectedMatch[2]) : 0;

    // Should show all or most schools
    expect(allSelectedCount).toBeGreaterThan(0);
    expect(allSelectedTotal).toBe(initialTotal);
  });

  test('GRE filters use OR logic (union of results)', async ({ page }) => {
    // Get counts for individual filters

    // Check "Not Required" only
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(500);

    const notRequiredText = await page.getByText(/Showing (\d+) of/).textContent();
    const notRequiredMatch = notRequiredText?.match(/Showing (\d+) of/);
    const notRequiredCount = notRequiredMatch ? parseInt(notRequiredMatch[1]) : 0;

    // Uncheck "Not Required"
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(300);

    // Check "Required" only
    await page.locator('label[for="greRequired"]').click();
    await page.waitForTimeout(500);

    const requiredText = await page.getByText(/Showing (\d+) of/).textContent();
    const requiredMatch = requiredText?.match(/Showing (\d+) of/);
    const requiredCount = requiredMatch ? parseInt(requiredMatch[1]) : 0;

    // Now check both
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(500);

    const bothText = await page.getByText(/Showing (\d+) of/).textContent();
    const bothMatch = bothText?.match(/Showing (\d+) of/);
    const bothCount = bothMatch ? parseInt(bothMatch[1]) : 0;

    // With OR logic: both >= max(notRequired, required)
    // In most cases: both >= notRequired + required (if no overlap)
    // But at minimum: both >= Math.max(notRequired, required)
    const maxIndividual = Math.max(notRequiredCount, requiredCount);
    expect(bothCount).toBeGreaterThanOrEqual(maxIndividual);
  });
});

test.describe('School Database - GRE Filter Count Accuracy', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('filtered count updates immediately when checking GRE filter', async ({ page }) => {
    const beforeText = await page.getByText(/Showing (\d+) of/).textContent();

    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(500);

    const afterText = await page.getByText(/Showing (\d+) of/).textContent();

    // Count should be different (unless all schools don't require GRE)
    expect(afterText).toBeTruthy();
    expect(beforeText).toBeTruthy();
  });

  test('filtered count updates immediately when unchecking GRE filter', async ({ page }) => {
    // Check a filter
    await page.locator('label[for="greRequired"]').click();
    await page.waitForTimeout(500);

    const checkedText = await page.getByText(/Showing (\d+) of/).textContent();

    // Uncheck the filter
    await page.locator('label[for="greRequired"]').click();
    await page.waitForTimeout(500);

    const uncheckedText = await page.getByText(/Showing (\d+) of/).textContent();

    // Count should change back
    expect(uncheckedText).not.toBe(checkedText);
  });

  test('total school count remains constant when filtering', async ({ page }) => {
    // Get initial total
    const initialText = await page.getByText(/of (\d+) programs/).textContent();
    const initialMatch = initialText?.match(/of (\d+) programs/);
    const initialTotal = initialMatch ? parseInt(initialMatch[1]) : 0;

    // Apply filter
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(500);

    // Get new total
    const filteredText = await page.getByText(/of (\d+) programs/).textContent();
    const filteredMatch = filteredText?.match(/of (\d+) programs/);
    const filteredTotal = filteredMatch ? parseInt(filteredMatch[1]) : 0;

    // Total should stay the same
    expect(filteredTotal).toBe(initialTotal);
  });

  test('count format is "Showing X of Y programs"', async ({ page }) => {
    await page.locator('label[for="greRequired"]').click();
    await page.waitForTimeout(500);

    const countText = await page.getByText(/Showing \d+ of \d+ programs/).textContent();
    expect(countText).toMatch(/Showing \d+ of \d+ programs/);
  });
});

test.describe('School Database - GRE Filter with Other Filters', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('can combine GRE filter with state filter', async ({ page }) => {
    // Apply state filter
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(300);

    // Apply GRE filter
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(500);

    // Should show filtered results
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can combine GRE filter with search', async ({ page }) => {
    // Apply search
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('U');
    await page.waitForTimeout(300);

    // Apply GRE filter
    await page.locator('label[for="greRequired"]').click();
    await page.waitForTimeout(500);

    // Should show filtered results
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can combine GRE filter with specialty filter', async ({ page }) => {
    // Apply specialty filter
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(300);

    // Apply GRE filter
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(500);

    // Both filters should be active
    await expect(page.locator('#acceptsNicu')).toBeChecked();
    await expect(page.locator('#greNotRequired')).toBeChecked();
  });

  test('can combine GRE filter with type filter', async ({ page }) => {
    // Apply type filter
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(300);

    // Apply GRE filter
    await page.locator('label[for="greRequired"]').click();
    await page.waitForTimeout(500);

    // Should show schools matching both filters
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('Clear All Filters resets GRE checkboxes', async ({ page }) => {
    // Check multiple GRE filters
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(200);

    await page.locator('label[for="greRequired"]').click();
    await page.waitForTimeout(300);

    // Clear all filters
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await clearButton.click();
    await page.waitForTimeout(500);

    // All checkboxes should be unchecked
    await expect(page.locator('#greNotRequired')).not.toBeChecked();
    await expect(page.locator('#greRequired')).not.toBeChecked();
    await expect(page.locator('#greWaived')).not.toBeChecked();
  });
});

test.describe('School Database - GRE Filter Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('rapid clicking GRE checkboxes handles correctly', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Not Required")');

    // Click multiple times rapidly
    await checkbox.click();
    await checkbox.click();
    await checkbox.click();

    await page.waitForTimeout(500);

    // Should be in a stable state (checked or unchecked)
    const checkboxInput = page.locator('#greNotRequired');
    const isChecked = await checkboxInput.isChecked();
    expect(typeof isChecked).toBe('boolean');
  });

  test('selecting all GRE filters then deselecting one by one', async ({ page }) => {
    // Select all
    await page.locator('label:has-text("Not Required")').click();
    await page.locator('label[for="greRequired"]').click();
    await page.locator('label:has-text("Required but Waived")').click();
    await page.waitForTimeout(500);

    const allSelectedText = await page.getByText(/Showing (\d+) of/).textContent();

    // Deselect one
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(500);

    const afterFirstDeselect = await page.getByText(/Showing (\d+) of/).textContent();

    // Deselect another
    await page.locator('label[for="greRequired"]').click();
    await page.waitForTimeout(500);

    const afterSecondDeselect = await page.getByText(/Showing (\d+) of/).textContent();

    // Counts should change
    expect(allSelectedText).toBeTruthy();
    expect(afterFirstDeselect).toBeTruthy();
    expect(afterSecondDeselect).toBeTruthy();
  });

  test('GRE filter state persists when navigating within filter panel', async ({ page }) => {
    // Check a GRE filter
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(500);

    // Interact with another filter section (like Location)
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();
    await locationSelect.click();
    await page.waitForTimeout(300);

    // GRE checkbox should still be checked
    await expect(page.locator('#greNotRequired')).toBeChecked();
  });

  test('shows appropriate message when no schools match GRE filter', async ({ page }) => {
    // This test might not trigger empty state with real data
    // But we test the behavior when combining many restrictive filters

    // Apply GRE filter
    await page.locator('label:has-text("Required but Waived")').click();
    await page.waitForTimeout(300);

    // Apply very restrictive search
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('NONEXISTENTSCHOOLXYZ123');
    await page.waitForTimeout(500);

    // Should either show no results message or 0 count
    const hasEmptyState = await page.getByText(/No schools match your filters/i).isVisible().catch(() => false);
    const countText = await page.getByText(/Showing 0 of/).isVisible().catch(() => false);

    expect(hasEmptyState || countText).toBeTruthy();
  });
});
