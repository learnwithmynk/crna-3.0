// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * School Database Filters - Specialty Accepted, Type, and Other Filters
 *
 * Comprehensive test suite for:
 * 1. Specialty Accepted - NICU/PICU/ER/Other Critical Care (AND logic)
 * 2. Type - Front-Loaded/Integrated (OR logic)
 * 3. GPA Type - GPA calculations complete
 * 4. Other - Work During Program, Nursing CAS, Rolling Admissions, Partially Online, Accepts Bachelors Science Related
 *
 * Tests cover:
 * - Individual checkbox filters
 * - Results matching filter criteria
 * - Combinations within same section
 * - Combinations across sections
 */

test.describe('School Database - Specialty Accepted Filters (AND Logic)', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('individual filter - NICU Experience', async ({ page }) => {
    // Check NICU Experience
    const checkbox = page.locator('label:has-text("NICU Experience")');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify results update
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();

    // Verify checkbox is checked
    const checkboxInput = page.locator('#acceptsNicu');
    expect(await checkboxInput.isChecked()).toBe(true);

    // Should show schools accepting NICU (like Samford)
    await expect(page.getByText('Samford U')).toBeVisible();
  });

  test('individual filter - PICU Experience', async ({ page }) => {
    const checkbox = page.locator('label:has-text("PICU Experience")');
    await checkbox.click();
    await page.waitForTimeout(500);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();

    const checkboxInput = page.locator('#acceptsPicu');
    expect(await checkboxInput.isChecked()).toBe(true);

    // Should show schools accepting PICU (like Samford)
    await expect(page.getByText('Samford U')).toBeVisible();
  });

  test('individual filter - ER Experience', async ({ page }) => {
    const checkbox = page.locator('label:has-text("ER Experience")');
    await checkbox.click();
    await page.waitForTimeout(500);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();

    const checkboxInput = page.locator('#acceptsEr');
    expect(await checkboxInput.isChecked()).toBe(true);
  });

  test('individual filter - Possibly Accepts Other Areas Of Critical Care', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Specialty Accepted")').locator('..').locator('label:has-text("Possibly Accepts Other Areas Of Critical Care")');
    await checkbox.click();
    await page.waitForTimeout(500);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();

    const checkboxInput = page.locator('#acceptsOtherCriticalCare');
    expect(await checkboxInput.isChecked()).toBe(true);

    // Should show schools accepting other critical care (like Samford)
    await expect(page.getByText('Samford U')).toBeVisible();
  });

  test('multiple specialty filters - AND logic (NICU + PICU)', async ({ page }) => {
    // Get initial count for NICU only
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(500);

    const nicuOnlyText = await page.getByText(/Showing (\d+) of/).textContent();
    const nicuOnlyMatch = nicuOnlyText?.match(/Showing (\d+) of/);
    const nicuOnlyCount = nicuOnlyMatch ? parseInt(nicuOnlyMatch[1]) : 0;

    // Add PICU filter
    await page.locator('label:has-text("PICU Experience")').click();
    await page.waitForTimeout(500);

    // Count should be less than or equal to NICU-only (AND logic)
    const bothText = await page.getByText(/Showing (\d+) of/).textContent();
    const bothMatch = bothText?.match(/Showing (\d+) of/);
    const bothCount = bothMatch ? parseInt(bothMatch[1]) : 0;

    expect(bothCount).toBeLessThanOrEqual(nicuOnlyCount);

    // Should show schools accepting BOTH NICU and PICU (like Samford)
    await expect(page.getByText('Samford U')).toBeVisible();
  });

  test('multiple specialty filters - AND logic (NICU + PICU + Other Critical Care)', async ({ page }) => {
    // Check all three
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(300);

    await page.locator('label:has-text("PICU Experience")').click();
    await page.waitForTimeout(300);

    await page.locator('label:has-text("Specialty Accepted")').locator('..').locator('label:has-text("Possibly Accepts Other Areas Of Critical Care")').click();
    await page.waitForTimeout(500);

    // Should only show schools matching ALL three criteria (like Samford)
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();

    // All checkboxes should be checked
    expect(await page.locator('#acceptsNicu').isChecked()).toBe(true);
    expect(await page.locator('#acceptsPicu').isChecked()).toBe(true);
    expect(await page.locator('#acceptsOtherCriticalCare').isChecked()).toBe(true);
  });

  test('specialty filters narrow results with AND logic', async ({ page }) => {
    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of/);
    const initialCount = initialMatch ? parseInt(initialMatch[1]) : 0;

    // Apply first filter
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(500);

    const afterFirstText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterFirstMatch = afterFirstText?.match(/Showing (\d+) of/);
    const afterFirstCount = afterFirstMatch ? parseInt(afterFirstMatch[1]) : 0;

    // Apply second filter
    await page.locator('label:has-text("PICU Experience")').click();
    await page.waitForTimeout(500);

    const afterSecondText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterSecondMatch = afterSecondText?.match(/Showing (\d+) of/);
    const afterSecondCount = afterSecondMatch ? parseInt(afterSecondMatch[1]) : 0;

    // Each additional filter should narrow or maintain count (AND logic)
    expect(afterFirstCount).toBeLessThanOrEqual(initialCount);
    expect(afterSecondCount).toBeLessThanOrEqual(afterFirstCount);
  });

  test('can uncheck specialty filter', async ({ page }) => {
    // Check NICU
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(500);

    expect(await page.locator('#acceptsNicu').isChecked()).toBe(true);

    // Uncheck NICU
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(500);

    expect(await page.locator('#acceptsNicu').isChecked()).toBe(false);
  });
});

test.describe('School Database - Type Filters (OR Logic)', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('individual filter - Front-Loaded', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify checkbox is checked
    const checkboxInput = page.locator('#typeFrontLoaded');
    expect(await checkboxInput.isChecked()).toBe(true);

    // Should show front-loaded schools like Samford
    await expect(page.getByText('Samford U')).toBeVisible();

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('individual filter - Integrated', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Integrated")');
    await checkbox.click();
    await page.waitForTimeout(500);

    const checkboxInput = page.locator('#typeIntegrated');
    expect(await checkboxInput.isChecked()).toBe(true);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('multiple type filters - OR logic (Front-Loaded + Integrated)', async ({ page }) => {
    // Get count for Front-Loaded only
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(500);

    const frontLoadedText = await page.getByText(/Showing (\d+) of/).textContent();
    const frontLoadedMatch = frontLoadedText?.match(/Showing (\d+) of/);
    const frontLoadedCount = frontLoadedMatch ? parseInt(frontLoadedMatch[1]) : 0;

    // Add Integrated filter
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Integrated")').click();
    await page.waitForTimeout(500);

    // Count should be greater than or equal to front-loaded-only (OR logic)
    const bothText = await page.getByText(/Showing (\d+) of/).textContent();
    const bothMatch = bothText?.match(/Showing (\d+) of/);
    const bothCount = bothMatch ? parseInt(bothMatch[1]) : 0;

    expect(bothCount).toBeGreaterThanOrEqual(frontLoadedCount);

    // Both checkboxes should be checked
    expect(await page.locator('#typeFrontLoaded').isChecked()).toBe(true);
    expect(await page.locator('#typeIntegrated').isChecked()).toBe(true);
  });

  test('type filters expand results with OR logic', async ({ page }) => {
    // Apply first filter
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(500);

    const afterFirstText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterFirstMatch = afterFirstText?.match(/Showing (\d+) of/);
    const afterFirstCount = afterFirstMatch ? parseInt(afterFirstMatch[1]) : 0;

    // Apply second filter
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Integrated")').click();
    await page.waitForTimeout(500);

    const afterSecondText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterSecondMatch = afterSecondText?.match(/Showing (\d+) of/);
    const afterSecondCount = afterSecondMatch ? parseInt(afterSecondMatch[1]) : 0;

    // Second filter should expand or maintain count (OR logic)
    expect(afterSecondCount).toBeGreaterThanOrEqual(afterFirstCount);
  });

  test('can uncheck type filter', async ({ page }) => {
    // Check Front-Loaded
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(500);

    expect(await page.locator('#typeFrontLoaded').isChecked()).toBe(true);

    // Uncheck Front-Loaded
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(500);

    expect(await page.locator('#typeFrontLoaded').isChecked()).toBe(false);
  });
});

test.describe('School Database - GPA Type Filter', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('can filter by GPA calculations complete', async ({ page }) => {
    const checkbox = page.locator('label:has-text("GPA Type")').locator('..').locator('label:has-text("GPA calculations complete")');
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify checkbox is checked
    const checkboxInput = page.locator('#gpaCalculationsComplete');
    expect(await checkboxInput.isChecked()).toBe(true);

    // Should show schools with GPA calculations (like Samford which has all GPA types)
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('GPA calculations complete shows only schools with GPA data', async ({ page }) => {
    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of/);
    const initialCount = initialMatch ? parseInt(initialMatch[1]) : 0;

    // Apply filter
    await page.locator('label:has-text("GPA Type")').locator('..').locator('label:has-text("GPA calculations complete")').click();
    await page.waitForTimeout(500);

    const filteredText = await page.getByText(/Showing (\d+) of/).textContent();
    const filteredMatch = filteredText?.match(/Showing (\d+) of/);
    const filteredCount = filteredMatch ? parseInt(filteredMatch[1]) : 0;

    // Should filter out schools without complete GPA data
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('can uncheck GPA calculations complete', async ({ page }) => {
    // Check filter
    await page.locator('label:has-text("GPA Type")').locator('..').locator('label:has-text("GPA calculations complete")').click();
    await page.waitForTimeout(500);

    expect(await page.locator('#gpaCalculationsComplete').isChecked()).toBe(true);

    // Uncheck filter
    await page.locator('label:has-text("GPA Type")').locator('..').locator('label:has-text("GPA calculations complete")').click();
    await page.waitForTimeout(500);

    expect(await page.locator('#gpaCalculationsComplete').isChecked()).toBe(false);
  });
});

test.describe('School Database - Other Filters (Individual)', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('individual filter - Work During Program', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Work During Program")');
    await checkbox.click();
    await page.waitForTimeout(500);

    const checkboxInput = page.locator('#ableToWork');
    expect(await checkboxInput.isChecked()).toBe(true);

    // Should show schools that allow work (like Samford)
    await expect(page.getByText('Samford U')).toBeVisible();

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('individual filter - Nursing Cas', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Nursing Cas")');
    await checkbox.click();
    await page.waitForTimeout(500);

    const checkboxInput = page.locator('#nursingCas');
    expect(await checkboxInput.isChecked()).toBe(true);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('individual filter - Rolling Admissions', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Rolling Admissions")');
    await checkbox.click();
    await page.waitForTimeout(500);

    const checkboxInput = page.locator('#rollingAdmissions');
    expect(await checkboxInput.isChecked()).toBe(true);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('individual filter - Partially Online', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Partially Online")');
    await checkbox.click();
    await page.waitForTimeout(500);

    const checkboxInput = page.locator('#partiallyOnline');
    expect(await checkboxInput.isChecked()).toBe(true);

    // Should show partially online schools (like Samford)
    await expect(page.getByText('Samford U')).toBeVisible();

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('individual filter - Accepts Bachelors of Science In a Related Field', async ({ page }) => {
    const checkbox = page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Accepts Bachelors of Science In a Related Field")');
    await checkbox.click();
    await page.waitForTimeout(500);

    const checkboxInput = page.locator('#acceptsBachelorsScienceRelated');
    expect(await checkboxInput.isChecked()).toBe(true);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });
});

test.describe('School Database - Other Filters (Combinations)', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('multiple Other filters - Work During Program + Partially Online', async ({ page }) => {
    // Check Work During Program
    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Work During Program")').click();
    await page.waitForTimeout(300);

    // Check Partially Online
    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Partially Online")').click();
    await page.waitForTimeout(500);

    // Should show schools matching BOTH criteria (like Samford)
    await expect(page.getByText('Samford U')).toBeVisible();

    // Both checkboxes should be checked
    expect(await page.locator('#ableToWork').isChecked()).toBe(true);
    expect(await page.locator('#partiallyOnline').isChecked()).toBe(true);
  });

  test('multiple Other filters narrow results (AND logic)', async ({ page }) => {
    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of/);
    const initialCount = initialMatch ? parseInt(initialMatch[1]) : 0;

    // Apply first filter
    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Work During Program")').click();
    await page.waitForTimeout(500);

    const afterFirstText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterFirstMatch = afterFirstText?.match(/Showing (\d+) of/);
    const afterFirstCount = afterFirstMatch ? parseInt(afterFirstMatch[1]) : 0;

    // Apply second filter
    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Partially Online")').click();
    await page.waitForTimeout(500);

    const afterSecondText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterSecondMatch = afterSecondText?.match(/Showing (\d+) of/);
    const afterSecondCount = afterSecondMatch ? parseInt(afterSecondMatch[1]) : 0;

    // Each filter should narrow or maintain count (AND logic)
    expect(afterFirstCount).toBeLessThanOrEqual(initialCount);
    expect(afterSecondCount).toBeLessThanOrEqual(afterFirstCount);
  });

  test('can uncheck Other filters', async ({ page }) => {
    // Check Work During Program
    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Work During Program")').click();
    await page.waitForTimeout(500);

    expect(await page.locator('#ableToWork').isChecked()).toBe(true);

    // Uncheck Work During Program
    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Work During Program")').click();
    await page.waitForTimeout(500);

    expect(await page.locator('#ableToWork').isChecked()).toBe(false);
  });
});

test.describe('School Database - Cross-Section Filter Combinations', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('combine Specialty + Type filters (NICU + Front-Loaded)', async ({ page }) => {
    // Check NICU
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(300);

    // Check Front-Loaded
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(500);

    // Should show schools matching both (like Samford)
    await expect(page.getByText('Samford U')).toBeVisible();

    expect(await page.locator('#acceptsNicu').isChecked()).toBe(true);
    expect(await page.locator('#typeFrontLoaded').isChecked()).toBe(true);
  });

  test('combine Specialty + Other filters (NICU + Work During Program)', async ({ page }) => {
    // Check NICU
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(300);

    // Check Work During Program
    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Work During Program")').click();
    await page.waitForTimeout(500);

    // Should show schools matching both (like Samford)
    await expect(page.getByText('Samford U')).toBeVisible();

    expect(await page.locator('#acceptsNicu').isChecked()).toBe(true);
    expect(await page.locator('#ableToWork').isChecked()).toBe(true);
  });

  test('combine Type + Other filters (Front-Loaded + Partially Online)', async ({ page }) => {
    // Check Front-Loaded
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(300);

    // Check Partially Online
    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Partially Online")').click();
    await page.waitForTimeout(500);

    // Should show schools matching both (like Samford)
    await expect(page.getByText('Samford U')).toBeVisible();

    expect(await page.locator('#typeFrontLoaded').isChecked()).toBe(true);
    expect(await page.locator('#partiallyOnline').isChecked()).toBe(true);
  });

  test('combine Specialty + GPA Type filters (NICU + GPA calculations complete)', async ({ page }) => {
    // Check NICU
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(300);

    // Check GPA calculations complete
    await page.locator('label:has-text("GPA Type")').locator('..').locator('label:has-text("GPA calculations complete")').click();
    await page.waitForTimeout(500);

    expect(await page.locator('#acceptsNicu').isChecked()).toBe(true);
    expect(await page.locator('#gpaCalculationsComplete').isChecked()).toBe(true);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('combine all filter sections (Specialty + Type + GPA Type + Other)', async ({ page }) => {
    // Apply filters from each section
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(200);

    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(200);

    await page.locator('label:has-text("GPA Type")').locator('..').locator('label:has-text("GPA calculations complete")').click();
    await page.waitForTimeout(200);

    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Work During Program")').click();
    await page.waitForTimeout(500);

    // Should show only schools matching ALL criteria
    expect(await page.locator('#acceptsNicu').isChecked()).toBe(true);
    expect(await page.locator('#typeFrontLoaded').isChecked()).toBe(true);
    expect(await page.locator('#gpaCalculationsComplete').isChecked()).toBe(true);
    expect(await page.locator('#ableToWork').isChecked()).toBe(true);

    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toBeTruthy();
  });

  test('cross-section filters narrow results progressively', async ({ page }) => {
    // Get initial count
    const initialText = await page.getByText(/Showing (\d+) of/).textContent();
    const initialMatch = initialText?.match(/Showing (\d+) of/);
    const initialCount = initialMatch ? parseInt(initialMatch[1]) : 0;

    // Apply Specialty filter
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(500);

    const afterSpecialtyText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterSpecialtyMatch = afterSpecialtyText?.match(/Showing (\d+) of/);
    const afterSpecialtyCount = afterSpecialtyMatch ? parseInt(afterSpecialtyMatch[1]) : 0;

    // Apply Type filter (OR logic within Type, but AND with previous filters)
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(500);

    const afterTypeText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterTypeMatch = afterTypeText?.match(/Showing (\d+) of/);
    const afterTypeCount = afterTypeMatch ? parseInt(afterTypeMatch[1]) : 0;

    // Apply Other filter
    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Work During Program")').click();
    await page.waitForTimeout(500);

    const afterOtherText = await page.getByText(/Showing (\d+) of/).textContent();
    const afterOtherMatch = afterOtherText?.match(/Showing (\d+) of/);
    const afterOtherCount = afterOtherMatch ? parseInt(afterOtherMatch[1]) : 0;

    // Each filter should narrow or maintain count
    expect(afterSpecialtyCount).toBeLessThanOrEqual(initialCount);
    expect(afterTypeCount).toBeLessThanOrEqual(afterSpecialtyCount);
    expect(afterOtherCount).toBeLessThanOrEqual(afterTypeCount);
  });
});

test.describe('School Database - Clear All Filters (Specialty, Type, Other)', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('Clear All Filters resets Specialty checkboxes', async ({ page }) => {
    // Check NICU and PICU
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(300);
    await page.locator('label:has-text("PICU Experience")').click();
    await page.waitForTimeout(500);

    // Clear filters
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await clearButton.click();
    await page.waitForTimeout(500);

    // Checkboxes should be unchecked
    expect(await page.locator('#acceptsNicu').isChecked()).toBe(false);
    expect(await page.locator('#acceptsPicu').isChecked()).toBe(false);
  });

  test('Clear All Filters resets Type checkboxes', async ({ page }) => {
    // Check Front-Loaded
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(500);

    // Clear filters
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await clearButton.click();
    await page.waitForTimeout(500);

    // Checkbox should be unchecked
    expect(await page.locator('#typeFrontLoaded').isChecked()).toBe(false);
  });

  test('Clear All Filters resets GPA Type checkbox', async ({ page }) => {
    // Check GPA calculations complete
    await page.locator('label:has-text("GPA Type")').locator('..').locator('label:has-text("GPA calculations complete")').click();
    await page.waitForTimeout(500);

    // Clear filters
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await clearButton.click();
    await page.waitForTimeout(500);

    // Checkbox should be unchecked
    expect(await page.locator('#gpaCalculationsComplete').isChecked()).toBe(false);
  });

  test('Clear All Filters resets Other checkboxes', async ({ page }) => {
    // Check Work During Program and Partially Online
    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Work During Program")').click();
    await page.waitForTimeout(300);
    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Partially Online")').click();
    await page.waitForTimeout(500);

    // Clear filters
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await clearButton.click();
    await page.waitForTimeout(500);

    // Checkboxes should be unchecked
    expect(await page.locator('#ableToWork').isChecked()).toBe(false);
    expect(await page.locator('#partiallyOnline').isChecked()).toBe(false);
  });

  test('Clear All Filters resets all sections at once', async ({ page }) => {
    // Apply filters from all sections
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(200);
    await page.locator('label:has-text("Type")').locator('..').locator('label:has-text("Front-Loaded")').click();
    await page.waitForTimeout(200);
    await page.locator('label:has-text("GPA Type")').locator('..').locator('label:has-text("GPA calculations complete")').click();
    await page.waitForTimeout(200);
    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Work During Program")').click();
    await page.waitForTimeout(500);

    // Clear all filters
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    await clearButton.click();
    await page.waitForTimeout(500);

    // All checkboxes should be unchecked
    expect(await page.locator('#acceptsNicu').isChecked()).toBe(false);
    expect(await page.locator('#typeFrontLoaded').isChecked()).toBe(false);
    expect(await page.locator('#gpaCalculationsComplete').isChecked()).toBe(false);
    expect(await page.locator('#ableToWork').isChecked()).toBe(false);

    // Should show all schools again
    const resultsText = await page.getByText(/Showing.*of.*programs/).textContent();
    expect(resultsText).toContain('of');
  });
});

test.describe('School Database - Filter Results Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal
    await page.goto('/schools');
    await page.evaluate(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('results count displays correctly with filters', async ({ page }) => {
    // Apply filter
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(500);

    // Results count should be visible and properly formatted
    const resultsText = await page.getByText(/Showing \d+ of \d+ programs/).textContent();
    expect(resultsText).toBeTruthy();
    expect(resultsText).toMatch(/Showing \d+ of \d+ programs/);
  });

  test('no results shows empty state', async ({ page }) => {
    // Apply very restrictive combination that might return no results
    await page.locator('label:has-text("ER Experience")').click();
    await page.waitForTimeout(300);

    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Nursing Cas")').click();
    await page.waitForTimeout(300);

    await page.locator('label:has-text("Other")').locator('..').locator('label:has-text("Rolling Admissions")').click();
    await page.waitForTimeout(500);

    // Check if we have results or empty state
    const resultsText = await page.getByText(/Showing (\d+) of/).textContent();
    const match = resultsText?.match(/Showing (\d+) of/);
    const count = match ? parseInt(match[1]) : 0;

    if (count === 0) {
      // Should show empty state
      await expect(page.getByText(/No schools match your filters/i)).toBeVisible();
    }
  });

  test('filters persist when toggling between checked and unchecked', async ({ page }) => {
    // Check filter
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(500);

    const afterCheckText = await page.getByText(/Showing (\d+) of/).textContent();

    // Uncheck filter
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(500);

    const afterUncheckText = await page.getByText(/Showing (\d+) of/).textContent();

    // Check filter again
    await page.locator('label:has-text("NICU Experience")').click();
    await page.waitForTimeout(500);

    const afterRecheckText = await page.getByText(/Showing (\d+) of/).textContent();

    // First and third check should show same results
    expect(afterCheckText).toEqual(afterRecheckText);

    // Unchecked state should show more results
    const checkMatch = afterCheckText?.match(/Showing (\d+) of/);
    const uncheckMatch = afterUncheckText?.match(/Showing (\d+) of/);
    const checkCount = checkMatch ? parseInt(checkMatch[1]) : 0;
    const uncheckCount = uncheckMatch ? parseInt(uncheckMatch[1]) : 0;

    expect(uncheckCount).toBeGreaterThanOrEqual(checkCount);
  });
});
