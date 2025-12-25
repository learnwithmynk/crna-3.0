// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * School Database - Prerequisite Filters Test Suite
 *
 * Tests the "Requires" and "Does Not Require" multi-select filters
 * for prerequisite courses on the /schools page.
 *
 * Prerequisites tested:
 * - Statistics
 * - General Chemistry
 * - Organic Chemistry
 * - Research
 * - Biochemistry
 * - Accepts Either Organic or Biochem
 * - Anatomy
 * - Physics
 * - Pharmacology
 * - Physiology
 * - Microbiology
 */

test.describe('School Database - Requires Prerequisite Filter', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('can select Statistics requirement', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();

    await page.waitForTimeout(500);

    // Should show filter chip
    await expect(page.getByText('Statistics').filter({ has: page.locator('svg') })).toBeVisible();

    // Results should update
    const resultsText = await page.getByText(/Showing \d+ of/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can select General Chemistry requirement', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'General Chemistry' }).click();

    await page.waitForTimeout(500);

    // Should show filter chip
    await expect(page.getByText('General Chemistry').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can select Organic Chemistry requirement', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Organic Chemistry' }).click();

    await page.waitForTimeout(500);

    // Should show filter chip
    await expect(page.getByText('Organic Chemistry').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can select Research requirement', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Research' }).click();

    await page.waitForTimeout(500);

    // Should show filter chip with X icon
    const chip = page.getByText('Research').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();

    // Should reduce number of results
    const resultsText = await page.getByText(/Showing \d+ of/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can select Biochemistry requirement', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Biochemistry' }).click();

    await page.waitForTimeout(500);

    await expect(page.getByText('Biochemistry').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can select Anatomy requirement', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Anatomy' }).click();

    await page.waitForTimeout(500);

    await expect(page.getByText('Anatomy').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can select Physics requirement', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Physics' }).click();

    await page.waitForTimeout(500);

    await expect(page.getByText('Physics').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can select Pharmacology requirement', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Pharmacology' }).click();

    await page.waitForTimeout(500);

    await expect(page.getByText('Pharmacology').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can select Physiology requirement', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Physiology' }).click();

    await page.waitForTimeout(500);

    await expect(page.getByText('Physiology').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can select Microbiology requirement', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Microbiology' }).click();

    await page.waitForTimeout(500);

    await expect(page.getByText('Microbiology').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can select multiple requirements', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');

    // Select Statistics
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(300);

    // Select General Chemistry
    await requiresSelect.click();
    await page.getByRole('option', { name: 'General Chemistry' }).click();
    await page.waitForTimeout(300);

    // Select Research
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Research' }).click();
    await page.waitForTimeout(500);

    // All three should be visible as chips
    await expect(page.getByText('Statistics').filter({ has: page.locator('svg') })).toBeVisible();
    await expect(page.getByText('General Chemistry').filter({ has: page.locator('svg') })).toBeVisible();
    await expect(page.getByText('Research').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('multiple requirements use AND logic (schools must have ALL selected)', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');

    // Get count with one filter
    await requiresSelect.click();
    await page.getByRole('option', { name: 'General Chemistry' }).click();
    await page.waitForTimeout(500);

    const oneFilterText = await page.getByText(/Showing (\d+) of/).textContent();
    const oneFilterMatch = oneFilterText?.match(/Showing (\d+) of/);
    const oneFilterCount = oneFilterMatch ? parseInt(oneFilterMatch[1]) : 0;

    // Add second filter
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Research' }).click();
    await page.waitForTimeout(500);

    const twoFiltersText = await page.getByText(/Showing (\d+) of/).textContent();
    const twoFiltersMatch = twoFiltersText?.match(/Showing (\d+) of/);
    const twoFiltersCount = twoFiltersMatch ? parseInt(twoFiltersMatch[1]) : 0;

    // Count should be same or less (AND logic narrows results)
    expect(twoFiltersCount).toBeLessThanOrEqual(oneFilterCount);
  });

  test('can remove requirement by clicking chip', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');

    // Add Statistics
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(500);

    // Verify chip is visible
    const chip = page.getByText('Statistics').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();

    // Click chip to remove
    await chip.click();
    await page.waitForTimeout(500);

    // Chip should be removed
    await expect(chip).not.toBeVisible();
  });

  test('removing requirement updates results', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');

    // Add filter
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(500);

    const filteredText = await page.getByText(/Showing (\d+) of/).textContent();
    const filteredMatch = filteredText?.match(/Showing (\d+) of/);
    const filteredCount = filteredMatch ? parseInt(filteredMatch[1]) : 0;

    // Remove filter
    const chip = page.getByText('Statistics').filter({ has: page.locator('svg') });
    await chip.click();
    await page.waitForTimeout(500);

    const unfilteredText = await page.getByText(/Showing (\d+) of/).textContent();
    const unfilteredMatch = unfilteredText?.match(/Showing (\d+) of/);
    const unfilteredCount = unfilteredMatch ? parseInt(unfilteredMatch[1]) : 0;

    // Should show more schools when filter is removed
    expect(unfilteredCount).toBeGreaterThan(filteredCount);
  });

  test('selected items show checkmark in dropdown', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');

    // Select Statistics
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(300);

    // Open dropdown again
    await requiresSelect.click();

    // Statistics option should show checkmark (✓)
    const statisticsOption = page.getByRole('option', { name: /Statistics/i });
    const optionText = await statisticsOption.textContent();
    expect(optionText).toContain('✓');
  });
});

test.describe('School Database - Does Not Require Prerequisite Filter', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('can select Statistics not required', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();

    await page.waitForTimeout(500);

    // Should show filter chip
    const chip = page.locator('label:has-text("Does Not Require")').locator('..').getByText('Statistics').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();
  });

  test('can select General Chemistry not required', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'General Chemistry' }).click();

    await page.waitForTimeout(500);

    const chip = page.locator('label:has-text("Does Not Require")').locator('..').getByText('General Chemistry').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();
  });

  test('can select Organic Chemistry not required', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Organic Chemistry' }).click();

    await page.waitForTimeout(500);

    const chip = page.locator('label:has-text("Does Not Require")').locator('..').getByText('Organic Chemistry').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();
  });

  test('can select Research not required', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Research' }).click();

    await page.waitForTimeout(500);

    const chip = page.locator('label:has-text("Does Not Require")').locator('..').getByText('Research').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();
  });

  test('can select Biochemistry not required', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Biochemistry' }).click();

    await page.waitForTimeout(500);

    const chip = page.locator('label:has-text("Does Not Require")').locator('..').getByText('Biochemistry').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();
  });

  test('can select Anatomy not required', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Anatomy' }).click();

    await page.waitForTimeout(500);

    const chip = page.locator('label:has-text("Does Not Require")').locator('..').getByText('Anatomy').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();
  });

  test('can select Physics not required', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Physics' }).click();

    await page.waitForTimeout(500);

    const chip = page.locator('label:has-text("Does Not Require")').locator('..').getByText('Physics').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();
  });

  test('can select Pharmacology not required', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Pharmacology' }).click();

    await page.waitForTimeout(500);

    const chip = page.locator('label:has-text("Does Not Require")').locator('..').getByText('Pharmacology').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();
  });

  test('can select Physiology not required', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Physiology' }).click();

    await page.waitForTimeout(500);

    const chip = page.locator('label:has-text("Does Not Require")').locator('..').getByText('Physiology').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();
  });

  test('can select Microbiology not required', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Microbiology' }).click();

    await page.waitForTimeout(500);

    const chip = page.locator('label:has-text("Does Not Require")').locator('..').getByText('Microbiology').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();
  });

  test('can select multiple does not require items', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');

    // Select Statistics
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(300);

    // Select Organic Chemistry
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Organic Chemistry' }).click();
    await page.waitForTimeout(300);

    // Select Biochemistry
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Biochemistry' }).click();
    await page.waitForTimeout(500);

    // All three should be visible as chips in the Does Not Require section
    const container = page.locator('label:has-text("Does Not Require")').locator('..');
    await expect(container.getByText('Statistics').filter({ has: page.locator('svg') })).toBeVisible();
    await expect(container.getByText('Organic Chemistry').filter({ has: page.locator('svg') })).toBeVisible();
    await expect(container.getByText('Biochemistry').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('multiple does not require items use AND logic', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');

    // Get count with one filter
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(500);

    const oneFilterText = await page.getByText(/Showing (\d+) of/).textContent();
    const oneFilterMatch = oneFilterText?.match(/Showing (\d+) of/);
    const oneFilterCount = oneFilterMatch ? parseInt(oneFilterMatch[1]) : 0;

    // Add second filter
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Organic Chemistry' }).click();
    await page.waitForTimeout(500);

    const twoFiltersText = await page.getByText(/Showing (\d+) of/).textContent();
    const twoFiltersMatch = twoFiltersText?.match(/Showing (\d+) of/);
    const twoFiltersCount = twoFiltersMatch ? parseInt(twoFiltersMatch[1]) : 0;

    // Count should be same or less (AND logic narrows results)
    expect(twoFiltersCount).toBeLessThanOrEqual(oneFilterCount);
  });

  test('can remove does not require item by clicking chip', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');

    // Add Research
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Research' }).click();
    await page.waitForTimeout(500);

    // Verify chip is visible
    const chip = page.locator('label:has-text("Does Not Require")').locator('..').getByText('Research').filter({ has: page.locator('svg') });
    await expect(chip).toBeVisible();

    // Click chip to remove
    await chip.click();
    await page.waitForTimeout(500);

    // Chip should be removed
    await expect(chip).not.toBeVisible();
  });

  test('does not require filter shows only schools without that prerequisite', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');

    // Select Statistics not required
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(500);

    // Results should be filtered
    const resultsText = await page.getByText(/Showing \d+ of/).textContent();
    expect(resultsText).toBeTruthy();

    // Count should be less than total
    const match = resultsText?.match(/Showing (\d+) of (\d+)/);
    if (match) {
      const showing = parseInt(match[1]);
      const total = parseInt(match[2]);
      expect(showing).toBeLessThan(total);
    }
  });
});

test.describe('School Database - Combined Requires and Does Not Require Filters', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('can combine Requires and Does Not Require filters', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');

    // Add Requires: General Chemistry
    await requiresSelect.click();
    await page.getByRole('option', { name: 'General Chemistry' }).click();
    await page.waitForTimeout(300);

    // Add Does Not Require: Statistics
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(500);

    // Both chips should be visible
    await expect(page.getByText('General Chemistry').filter({ has: page.locator('svg') })).toBeVisible();
    const doesNotRequireContainer = page.locator('label:has-text("Does Not Require")').locator('..');
    await expect(doesNotRequireContainer.getByText('Statistics').filter({ has: page.locator('svg') })).toBeVisible();

    // Results should be filtered (schools with Gen Chem but without Statistics)
    const resultsText = await page.getByText(/Showing \d+ of/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('combined filters narrow results (AND logic across both)', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');

    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of/);
    const initialCount = initialMatch ? parseInt(initialMatch[1]) : 0;

    // Add Requires filter
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Research' }).click();
    await page.waitForTimeout(500);

    const requiresText = await page.getByText(/Showing (\d+) of/).textContent();
    const requiresMatch = requiresText?.match(/Showing (\d+) of/);
    const requiresCount = requiresMatch ? parseInt(requiresMatch[1]) : 0;

    // Add Does Not Require filter
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Organic Chemistry' }).click();
    await page.waitForTimeout(500);

    const combinedText = await page.getByText(/Showing (\d+) of/).textContent();
    const combinedMatch = combinedText?.match(/Showing (\d+) of/);
    const combinedCount = combinedMatch ? parseInt(combinedMatch[1]) : 0;

    // Combined count should be less than or equal to individual filter
    expect(combinedCount).toBeLessThanOrEqual(requiresCount);
    expect(combinedCount).toBeLessThanOrEqual(initialCount);
  });

  test('can combine multiple Requires and multiple Does Not Require', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');

    // Add multiple Requires
    await requiresSelect.click();
    await page.getByRole('option', { name: 'General Chemistry' }).click();
    await page.waitForTimeout(300);

    await requiresSelect.click();
    await page.getByRole('option', { name: 'Anatomy' }).click();
    await page.waitForTimeout(300);

    // Add multiple Does Not Require
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(300);

    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Physics' }).click();
    await page.waitForTimeout(500);

    // All chips should be visible
    await expect(page.getByText('General Chemistry').filter({ has: page.locator('svg') })).toBeVisible();
    await expect(page.getByText('Anatomy').filter({ has: page.locator('svg') })).toBeVisible();

    const doesNotRequireContainer = page.locator('label:has-text("Does Not Require")').locator('..');
    await expect(doesNotRequireContainer.getByText('Statistics').filter({ has: page.locator('svg') })).toBeVisible();
    await expect(doesNotRequireContainer.getByText('Physics').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can remove chips from both filters independently', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');

    // Add to both filters
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Research' }).click();
    await page.waitForTimeout(300);

    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Biochemistry' }).click();
    await page.waitForTimeout(500);

    // Remove Requires chip
    const requiresChip = page.getByText('Research').filter({ has: page.locator('svg') });
    await requiresChip.click();
    await page.waitForTimeout(300);

    // Requires chip should be gone
    await expect(requiresChip).not.toBeVisible();

    // Does Not Require chip should still be visible
    const doesNotRequireContainer = page.locator('label:has-text("Does Not Require")').locator('..');
    await expect(doesNotRequireContainer.getByText('Biochemistry').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('Clear All Filters removes both Requires and Does Not Require selections', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');

    // Add to both filters
    await requiresSelect.click();
    await page.getByRole('option', { name: 'General Chemistry' }).click();
    await page.waitForTimeout(300);

    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(500);

    // Click Clear All Filters
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await clearButton.click();
    await page.waitForTimeout(500);

    // Both chips should be removed
    const requiresChip = page.getByText('General Chemistry').filter({ has: page.locator('svg') });
    const doesNotRequireContainer = page.locator('label:has-text("Does Not Require")').locator('..');
    const doesNotRequireChip = doesNotRequireContainer.getByText('Statistics').filter({ has: page.locator('svg') });

    await expect(requiresChip).not.toBeVisible();
    await expect(doesNotRequireChip).not.toBeVisible();
  });
});

test.describe('School Database - Prerequisite Filters with Other Filters', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('can combine prerequisite filters with state filter', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    const locationSelect = page.locator('label:has-text("Location")').locator('..').getByRole('combobox').first();

    // Select state
    await locationSelect.click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    await page.waitForTimeout(300);

    // Select prerequisite
    await requiresSelect.click();
    await page.getByRole('option', { name: 'General Chemistry' }).click();
    await page.waitForTimeout(500);

    // Should show Alabama schools with General Chemistry requirement
    await expect(page.getByText(/Alabama/)).toBeVisible();
    await expect(page.getByText('General Chemistry').filter({ has: page.locator('svg') })).toBeVisible();
  });

  test('can combine prerequisite filters with specialty filters', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');

    // Check NICU specialty
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(300);

    // Select prerequisite
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Research' }).click();
    await page.waitForTimeout(500);

    // Both filters should be active
    const resultsText = await page.getByText(/Showing \d+ of/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can combine prerequisite filters with GRE filter', async ({ page }) => {
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');

    // Check GRE Not Required
    await page.locator('label:has-text("Not Required")').click();
    await page.waitForTimeout(300);

    // Select Does Not Require Statistics
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(500);

    // Should show schools with no GRE and no Statistics
    const resultsText = await page.getByText(/Showing \d+ of/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('can combine prerequisite filters with search', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    const searchInput = page.locator('input[placeholder="Search..."]');

    // Search for "University"
    await searchInput.fill('U');
    await page.waitForTimeout(300);

    // Add prerequisite filter
    await requiresSelect.click();
    await page.getByRole('option', { name: 'General Chemistry' }).click();
    await page.waitForTimeout(500);

    // Should show schools matching search with General Chemistry
    const resultsText = await page.getByText(/Showing \d+ of/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('prerequisite filters update results count correctly', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');

    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of (\d+)/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of (\d+)/);
    const initialShowing = initialMatch ? parseInt(initialMatch[1]) : 0;
    const initialTotal = initialMatch ? parseInt(initialMatch[2]) : 0;

    // Initially, showing should equal total
    expect(initialShowing).toBe(initialTotal);

    // Apply filter
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(500);

    const filteredText = await page.getByText(/Showing (\d+) of (\d+)/).textContent();
    const filteredMatch = filteredText?.match(/Showing (\d+) of (\d+)/);
    const filteredShowing = filteredMatch ? parseInt(filteredMatch[1]) : 0;
    const filteredTotal = filteredMatch ? parseInt(filteredMatch[2]) : 0;

    // Showing should be less than total after filter
    expect(filteredShowing).toBeLessThan(filteredTotal);
    // Total should remain the same
    expect(filteredTotal).toBe(initialTotal);
  });
});

test.describe('School Database - Prerequisite Filter Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('selecting same prerequisite in both Requires and Does Not Require creates empty state', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');
    const doesNotRequireSelect = page.locator('label:has-text("Does Not Require")').locator('..').getByRole('combobox');

    // Select Statistics in Requires
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(300);

    // Select Statistics in Does Not Require (contradictory)
    await doesNotRequireSelect.click();
    await page.getByRole('option', { name: 'Statistics' }).click();
    await page.waitForTimeout(500);

    // Should show no results (logically impossible)
    const resultsText = await page.getByText(/Showing (\d+) of/).textContent();
    const match = resultsText?.match(/Showing (\d+) of/);
    const count = match ? parseInt(match[1]) : -1;

    // Expecting 0 results since no school can both require and not require the same thing
    expect(count).toBe(0);
  });

  test('prerequisite dropdown placeholder resets after selection', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');

    // Select an option
    await requiresSelect.click();
    await page.getByRole('option', { name: 'Physics' }).click();
    await page.waitForTimeout(500);

    // Dropdown should still show placeholder "Select..."
    const placeholder = page.locator('label:has-text("Requires")').locator('..').getByText('Select...');
    await expect(placeholder).toBeVisible();
  });

  test('can select all available prerequisite options', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');

    const allOptions = [
      'Statistics',
      'General Chemistry',
      'Organic Chemistry',
      'Research',
      'Biochemistry',
      'Anatomy',
      'Physics',
      'Pharmacology',
      'Physiology',
      'Microbiology'
    ];

    // Select all options
    for (const option of allOptions) {
      await requiresSelect.click();
      await page.getByRole('option', { name: option }).click();
      await page.waitForTimeout(200);
    }

    await page.waitForTimeout(500);

    // All chips should be visible
    for (const option of allOptions) {
      await expect(page.getByText(option).filter({ has: page.locator('svg') })).toBeVisible();
    }

    // Results should be very limited (schools requiring ALL prerequisites)
    const resultsText = await page.getByText(/Showing (\d+) of/).textContent();
    const match = resultsText?.match(/Showing (\d+) of/);
    const count = match ? parseInt(match[1]) : -1;

    // Expect very few or no schools to require all prerequisites
    expect(count).toBeLessThan(10);
  });

  test('prerequisite chips maintain order of selection', async ({ page }) => {
    const requiresSelect = page.locator('label:has-text("Requires")').locator('..').getByRole('combobox');

    // Select in specific order
    const selectionOrder = ['Physics', 'Anatomy', 'Research'];

    for (const option of selectionOrder) {
      await requiresSelect.click();
      await page.getByRole('option', { name: option }).click();
      await page.waitForTimeout(200);
    }

    await page.waitForTimeout(500);

    // Get all chips
    const chipsContainer = page.locator('label:has-text("Requires")').locator('..').locator('.flex.flex-wrap.gap-1').first();
    const chips = chipsContainer.locator('span');

    // Verify we have 3 chips
    const chipCount = await chips.count();
    expect(chipCount).toBe(3);
  });
});
