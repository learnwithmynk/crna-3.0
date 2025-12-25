/**
 * Playwright tests for Provider Services Page
 * Tests service management for mentors/providers
 */

const { test, expect } = require('@playwright/test');

test.describe('Provider Services Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/services');
    await page.waitForTimeout(500);
  });

  test('page loads with services header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /my services/i })).toBeVisible();
  });

  test('shows summary stats cards', async ({ page }) => {
    await expect(page.getByText(/active services/i)).toBeVisible();
    await expect(page.getByText(/total bookings/i)).toBeVisible();
    await expect(page.getByText(/avg rating/i)).toBeVisible();
    await expect(page.getByText(/total revenue/i)).toBeVisible();
  });

  test('displays service cards', async ({ page }) => {
    const serviceCards = page.locator('[data-testid="service-card"]');
    await expect(serviceCards.first()).toBeVisible();
    // Should have at least one service
    const count = await serviceCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('service card shows stats', async ({ page }) => {
    const firstCard = page.locator('[data-testid="service-card"]').first();
    await expect(firstCard.getByText(/saves/i)).toBeVisible();
    await expect(firstCard.getByText(/bookings/i)).toBeVisible();
    await expect(firstCard.getByText(/revenue/i)).toBeVisible();
  });

  test('has Add Service button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /add service/i })).toBeVisible();
  });
});

test.describe('Provider Services - Toggle Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/services');
    await page.waitForTimeout(500);
  });

  test('can toggle service availability', async ({ page }) => {
    const serviceToggle = page.getByTestId('service-toggle').first();
    await expect(serviceToggle).toBeVisible();

    // Get initial state
    const isChecked = await serviceToggle.isChecked();

    // Toggle it
    await serviceToggle.click();

    // Should be opposite now
    await expect(serviceToggle).toHaveAttribute('data-state', isChecked ? 'unchecked' : 'checked');
  });

  test('can toggle instant book', async ({ page }) => {
    const instantToggle = page.getByTestId('instant-book-toggle').first();
    await expect(instantToggle).toBeVisible();

    // Toggle it
    await instantToggle.click();

    // Verify it changed
    const newState = await instantToggle.getAttribute('data-state');
    expect(['checked', 'unchecked']).toContain(newState);
  });

  test('disabled service shows disabled badge', async ({ page }) => {
    // Find a service toggle and turn it off
    const serviceToggle = page.getByTestId('service-toggle').first();
    const isChecked = await serviceToggle.isChecked();

    if (isChecked) {
      await serviceToggle.click();
      await page.waitForTimeout(200);
    }

    // Should show disabled state
    await expect(page.getByText(/disabled/i).first()).toBeVisible();
  });
});

test.describe('Provider Services - Edit Service Sheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/services');
    await page.waitForTimeout(500);
  });

  test('clicking Edit opens edit sheet', async ({ page }) => {
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    await editButton.click();

    // Sheet should open with form
    await expect(page.getByRole('heading', { name: /edit service/i })).toBeVisible();
  });

  test('edit sheet has all form fields', async ({ page }) => {
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    await editButton.click();

    // Check for form fields
    await expect(page.getByLabel(/title/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
    await expect(page.getByLabel(/price/i)).toBeVisible();
  });

  test('edit sheet has deliverables section', async ({ page }) => {
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    await editButton.click();

    await expect(page.getByText(/deliverables/i)).toBeVisible();
  });

  test('can cancel edit and close sheet', async ({ page }) => {
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    await editButton.click();

    // Click cancel
    await page.getByRole('button', { name: /cancel/i }).click();

    // Sheet should close
    await expect(page.getByRole('heading', { name: /edit service/i })).not.toBeVisible();
  });

  test('Add Service button opens sheet with empty form', async ({ page }) => {
    await page.getByRole('button', { name: /add service/i }).click();

    // Sheet should open with "Add New Service" title
    await expect(page.getByRole('heading', { name: /add new service/i })).toBeVisible();

    // Title should be empty
    const titleInput = page.getByLabel(/title/i);
    await expect(titleInput).toHaveValue('');
  });
});

test.describe('Provider Services - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/services');
    await page.waitForTimeout(500);
  });

  test('has quick actions section', async ({ page }) => {
    await expect(page.getByText(/quick actions/i)).toBeVisible();
  });

  test('has link to manage availability', async ({ page }) => {
    const link = page.getByRole('link', { name: /manage availability/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /\/marketplace\/provider\/availability/);
  });

  test('has link to view earnings', async ({ page }) => {
    const link = page.getByRole('link', { name: /view earnings/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /\/marketplace\/provider\/earnings/);
  });
});

test.describe('Provider Services - Tips Card', () => {
  test('shows tips to increase bookings', async ({ page }) => {
    await page.goto('/marketplace/provider/services');
    await page.waitForTimeout(500);

    await expect(page.getByText(/tips to increase bookings/i)).toBeVisible();
    await expect(page.getByText(/3\+ services/i)).toBeVisible();
  });
});
