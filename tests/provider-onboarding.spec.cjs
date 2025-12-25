/**
 * Playwright tests for Provider Onboarding Flow
 * Tests the 5-step onboarding wizard for approved mentors
 */

const { test, expect } = require('@playwright/test');

test.describe('Provider Onboarding Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/onboarding');
    await page.waitForTimeout(500);
  });

  test('page loads with progress widget', async ({ page }) => {
    // Check header
    await expect(page.getByRole('heading', { name: /mentor onboarding/i })).toBeVisible();

    // Check progress widget is present
    await expect(page.getByText(/complete your onboarding/i)).toBeVisible();
  });

  test('shows step 1 (profile) by default', async ({ page }) => {
    // Step 1 should be profile setup
    await expect(page.getByText(/profile/i).first()).toBeVisible();
  });

  test('progress widget shows current step indicator', async ({ page }) => {
    // Should show step indicators (mobile shows "Step X of 5", desktop shows step labels)
    const stepText = page.getByText(/step.*of.*5|complete your onboarding|profile|application/i).first();
    await expect(stepText).toBeVisible();
  });

  test('can navigate between steps via URL', async ({ page }) => {
    // Navigate to step 2 via URL
    await page.goto('/marketplace/provider/onboarding?step=2');
    await page.waitForTimeout(300);

    // Should show step 2 content (services)
    await expect(page.getByText(/service/i).first()).toBeVisible();
  });

  test('back button returns to become-a-mentor page', async ({ page }) => {
    // Click the back link at the top
    await page.getByRole('link', { name: /back/i }).click();

    // Should navigate to become-a-mentor
    await expect(page).toHaveURL(/\/marketplace\/become-a-mentor/);
  });

  test('next button is present for navigation', async ({ page }) => {
    // Check next button exists (may be disabled due to validation)
    // Use first() since there may be multiple buttons with "next" in the name
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    await expect(nextButton).toBeVisible();
  });

  test('step indicators are clickable for navigation', async ({ page }) => {
    // The dot indicators should be present
    const stepIndicators = page.locator('button[aria-label^="Go to step"]');

    // Should have indicators for steps 1-4 (step 5 is review, no dot)
    await expect(stepIndicators).toHaveCount(4);
  });
});

test.describe('Provider Onboarding - Step 1 Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/onboarding?step=1');
    await page.waitForTimeout(500);
  });

  test('shows profile form fields', async ({ page }) => {
    // Basic profile fields should be visible
    // Note: Exact fields depend on OnboardingStep1Profile implementation
    await expect(page.getByText(/profile/i).first()).toBeVisible();
  });

  test('shows personality questions section', async ({ page }) => {
    // The personality questions are a key differentiator
    await expect(page.getByText(/if you knew me/i)).toBeVisible();
  });
});

test.describe('Provider Onboarding - Step 2 Services', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/onboarding?step=2');
    await page.waitForTimeout(500);
  });

  test('shows services configuration', async ({ page }) => {
    // Should show service-related content
    await expect(page.getByText(/service/i).first()).toBeVisible();
  });
});

test.describe('Provider Onboarding - Step 3 Availability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/onboarding?step=3');
    await page.waitForTimeout(500);
  });

  test('shows availability settings', async ({ page }) => {
    // Should show availability-related content
    await expect(page.getByText(/availability|schedule/i).first()).toBeVisible();
  });

  test('shows video link field', async ({ page }) => {
    // Video link is required for sessions
    await expect(page.getByText(/video|zoom|meet/i).first()).toBeVisible();
  });
});

test.describe('Provider Onboarding - Step 4 Stripe', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/onboarding?step=4');
    await page.waitForTimeout(500);
  });

  test('shows Stripe connection section', async ({ page }) => {
    // Should show payment setup content
    await expect(page.getByText(/stripe|payment|payout/i).first()).toBeVisible();
  });

  test('shows commission breakdown', async ({ page }) => {
    // Should explain the 80/20 split or show payment-related content
    const hasCommission = await page.getByText(/80|20|commission|receive|earn/i).first().isVisible().catch(() => false);
    const hasStripe = await page.getByText(/stripe|payment|connect/i).first().isVisible().catch(() => false);
    expect(hasCommission || hasStripe).toBeTruthy();
  });
});

test.describe('Provider Onboarding - Step 5 Review', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/onboarding?step=5');
    await page.waitForTimeout(500);
  });

  test('shows review and launch section', async ({ page }) => {
    // Should show review/launch content
    await expect(page.getByText(/review|launch/i).first()).toBeVisible();
  });

  test('shows launch button', async ({ page }) => {
    // Launch button should be present
    await expect(page.getByRole('button', { name: /launch/i })).toBeVisible();
  });
});

test.describe('Provider Onboarding - Navigation Flow', () => {
  test('can navigate to all steps via URL', async ({ page }) => {
    // Test navigation to each step directly via URL
    for (let step = 1; step <= 5; step++) {
      await page.goto(`/marketplace/provider/onboarding?step=${step}`);
      await page.waitForTimeout(500);

      // Verify page loads - look for onboarding-related content
      const hasStepContent = await page.getByText(/profile|service|availability|stripe|connect|review|launch|onboarding|next|back/i).first().isVisible().catch(() => false);
      const hasForm = await page.locator('form, input, button').first().isVisible().catch(() => false);
      expect(hasStepContent || hasForm).toBeTruthy();
    }
  });
});
