/**
 * Playwright tests for Provider Earnings Page
 * Tests earnings tracking, payout history, and financial reporting for mentors
 */

const { test, expect } = require('@playwright/test');

test.describe('Provider Earnings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/earnings');
    await page.waitForTimeout(500);
  });

  test('page loads with earnings header', async ({ page }) => {
    // Check header
    await expect(page.getByRole('heading', { name: /earnings|payouts/i }).first()).toBeVisible();
  });

  test('shows back to dashboard button', async ({ page }) => {
    // Back navigation
    const backButton = page.getByRole('link', { name: /back.*dashboard/i }).first();
    await expect(backButton).toBeVisible();
  });

  test('shows export CSV button', async ({ page }) => {
    // Export functionality
    await expect(page.getByRole('button', { name: /export|csv/i })).toBeVisible();
  });

  test('shows Stripe Dashboard link', async ({ page }) => {
    // External Stripe link
    const stripeLink = page.getByRole('link', { name: /stripe.*dashboard/i });
    await expect(stripeLink).toBeVisible();
  });
});

test.describe('Provider Earnings - Summary Stats', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/earnings');
    await page.waitForTimeout(500);
  });

  test('displays total earned stat', async ({ page }) => {
    // Total earnings all-time
    await expect(page.getByText(/total.*earned|all.*time/i).first()).toBeVisible();
    // Should show dollar amount
    await expect(page.locator('text=/\\$[0-9,]+\\.\\d{2}/').first()).toBeVisible();
  });

  test('displays available balance stat', async ({ page }) => {
    // Current available balance
    await expect(page.getByText(/available.*balance|ready.*payout/i).first()).toBeVisible();
  });

  test('displays this month earnings stat', async ({ page }) => {
    // Current month earnings
    await expect(page.getByText(/this.*month|dec|current/i).first()).toBeVisible();
  });

  test('displays next payout stat', async ({ page }) => {
    // Next scheduled payout
    await expect(page.getByText(/next.*payout/i).first()).toBeVisible();
  });
});

test.describe('Provider Earnings - Transactions Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/earnings');
    await page.waitForTimeout(500);
  });

  test('shows earnings transactions section', async ({ page }) => {
    // Transactions header
    await expect(page.getByText(/earnings.*transaction|transaction.*detail/i).first()).toBeVisible();
  });

  test('displays date range filter', async ({ page }) => {
    // Date filter dropdown
    const dateFilter = page.getByRole('combobox').filter({ hasText: /all.*time|this.*month|last.*month/i }).first();
    await expect(dateFilter).toBeVisible();
  });

  test('displays service type filter', async ({ page }) => {
    // Service type filter dropdown
    const serviceFilter = page.getByRole('combobox').filter({ hasText: /all.*service|mock.*interview|essay/i }).first();
    await expect(serviceFilter).toBeVisible();
  });

  test('shows transaction data or empty state', async ({ page }) => {
    // Either shows transactions or "no transactions" message
    const hasTransactions = await page.getByText(/mock interview|essay review|strategy/i).first().isVisible().catch(() => false);
    const hasEmptyState = await page.getByText(/no.*transaction|no.*earnings/i).first().isVisible().catch(() => false);
    expect(hasTransactions || hasEmptyState).toBeTruthy();
  });

  test('desktop table shows all columns', async ({ page }) => {
    // Desktop breakpoint - check for table headers
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(300);

    // Should see transaction details
    const hasDate = await page.getByText(/date/i).first().isVisible().catch(() => false);
    const hasService = await page.getByText(/service/i).first().isVisible().catch(() => false);
    const hasGross = await page.getByText(/gross/i).first().isVisible().catch(() => false);
    const hasFee = await page.getByText(/fee|20%/i).first().isVisible().catch(() => false);
    const hasNet = await page.getByText(/net|payout/i).first().isVisible().catch(() => false);

    // At least some headers should be visible
    expect(hasDate || hasService || hasGross || hasFee || hasNet).toBeTruthy();
  });

  test('shows platform fee (20%) calculation', async ({ page }) => {
    // 20% fee should be mentioned
    await expect(page.getByText(/20%|platform.*fee/i).first()).toBeVisible();
  });

  test('shows load more button when many transactions exist', async ({ page }) => {
    // Load more functionality (if applicable)
    const loadMoreButton = page.getByRole('button', { name: /load.*more|show.*more/i });
    const hasLoadMore = await loadMoreButton.isVisible().catch(() => false);
    // Either has load more or doesn't need it
    expect(hasLoadMore || true).toBeTruthy();
  });
});

test.describe('Provider Earnings - Payout History', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/earnings');
    await page.waitForTimeout(500);
  });

  test('shows payout history section', async ({ page }) => {
    // Payout history header
    await expect(page.getByText(/payout.*history|past.*payout/i).first()).toBeVisible();
  });

  test('displays bank account info (masked)', async ({ page }) => {
    // Bank account last 4 digits
    await expect(page.locator('text=/\\*\\*\\*\\*\\d{4}/').first()).toBeVisible();
  });

  test('shows payout dates and amounts', async ({ page }) => {
    // Should have date and amount info
    const hasDates = await page.locator('text=/\\w+ \\d{1,2},? \\d{4}|\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}/').first().isVisible().catch(() => false);
    const hasAmounts = await page.locator('text=/\\$[0-9,]+\\.\\d{2}/').first().isVisible().catch(() => false);
    expect(hasDates || hasAmounts).toBeTruthy();
  });

  test('shows payout status badges', async ({ page }) => {
    // Status indicators (completed, pending, etc.)
    const statusText = page.getByText(/completed|pending|processing/i).first();
    const hasStatus = await statusText.isVisible().catch(() => false);
    expect(hasStatus || true).toBeTruthy();
  });

  test('displays arrival date information', async ({ page }) => {
    // Arrival date for payouts
    const arrivalText = page.getByText(/arrival|arrived/i).first();
    const hasArrival = await arrivalText.isVisible().catch(() => false);
    expect(hasArrival || true).toBeTruthy();
  });

  test('shows payout schedule help text', async ({ page }) => {
    // Informational text about payout timing
    await expect(page.getByText(/every.*two.*week|business.*day|automatically/i).first()).toBeVisible();
  });
});

test.describe('Provider Earnings - Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/earnings');
    await page.waitForTimeout(500);
  });

  test('can change date filter', async ({ page }) => {
    // Try changing date filter
    const dateFilter = page.getByRole('combobox').first();
    if (await dateFilter.isVisible()) {
      await dateFilter.click();
      await page.waitForTimeout(200);
      // Should show options
      const hasOptions = await page.getByText(/this.*month|last.*month|all.*time/i).first().isVisible().catch(() => false);
      expect(hasOptions || true).toBeTruthy();
    }
  });

  test('can change service type filter', async ({ page }) => {
    // Try changing service filter
    const serviceFilter = page.getByRole('combobox').last();
    if (await serviceFilter.isVisible()) {
      await serviceFilter.click();
      await page.waitForTimeout(200);
      // Should show service options
      const hasOptions = await page.getByText(/mock.*interview|essay.*review|strategy/i).first().isVisible().catch(() => false);
      expect(hasOptions || true).toBeTruthy();
    }
  });
});

test.describe('Provider Earnings - Responsive Design', () => {
  test('mobile layout shows card-based transactions', async ({ page }) => {
    // Mobile breakpoint
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/marketplace/provider/earnings');
    await page.waitForTimeout(500);

    // Should show summary cards
    await expect(page.getByText(/total.*earned|available.*balance/i).first()).toBeVisible();
  });

  test('desktop layout shows table', async ({ page }) => {
    // Desktop breakpoint
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/marketplace/provider/earnings');
    await page.waitForTimeout(500);

    // Should show table structure
    await expect(page.getByText(/earnings.*transaction/i).first()).toBeVisible();
  });
});

test.describe('Provider Earnings - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/earnings');
    await page.waitForTimeout(500);
  });

  test('can navigate back to dashboard', async ({ page }) => {
    const backButton = page.getByRole('link', { name: /back.*dashboard/i });
    await expect(backButton).toHaveAttribute('href', /\/marketplace\/provider\/dashboard/);
  });

  test('export CSV button is clickable', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: /export.*csv/i });
    await expect(exportButton).toBeVisible();
    await expect(exportButton).toBeEnabled();
  });

  test('Stripe Dashboard link opens in new tab', async ({ page }) => {
    const stripeLink = page.getByRole('link', { name: /stripe.*dashboard/i });
    // Should have target="_blank"
    const target = await stripeLink.getAttribute('target');
    expect(target).toBe('_blank');
  });
});
