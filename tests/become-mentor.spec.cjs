/**
 * Playwright tests for Become a Mentor landing page
 * Tests the SRNA mentor onboarding landing page functionality
 */

const { test, expect } = require('@playwright/test');

test.describe('Become a Mentor Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/become-a-mentor');
    await page.waitForTimeout(500);
  });

  test('page loads with hero section', async ({ page }) => {
    // Check main headline
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/turn your srna experience into/i);

    // Check CTA buttons
    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /learn more/i })).toBeVisible();
  });

  test('shows commission rate clearly', async ({ page }) => {
    // Commission should be prominently displayed (hero stats section)
    await expect(page.getByText('20%', { exact: true })).toBeVisible();

    // Should mention keeping 80% in trust indicators
    await expect(page.getByText(/keep 80%/i).first()).toBeVisible();
  });

  test('displays quick stats', async ({ page }) => {
    // Average earnings in hero stats
    await expect(page.getByText('$200-800', { exact: true }).first()).toBeVisible();

    // Active applicants
    await expect(page.getByText('8,000+').first()).toBeVisible();
  });

  test('shows how it works section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /how it works/i })).toBeVisible();

    // Check for the 4 steps - use the step titles with exact headings
    await expect(page.getByRole('heading', { name: 'Apply' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Set Up Profile' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Accept Bookings' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Get Paid' })).toBeVisible();
  });

  test('shows expectations section', async ({ page }) => {
    // Section header is h2
    await expect(page.getByRole('heading', { name: /crystal clear expectations/i, level: 2 })).toBeVisible();

    // Key expectations should be visible - these are h4 tags in ExpectationsCard
    await expect(page.getByText(/you're an independent contractor/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /48 hours to respond/i })).toBeVisible();
  });

  test('shows differentiators section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /what makes crna club different/i })).toBeVisible();

    // Key differentiators
    await expect(page.getByText(/stand out with personality/i)).toBeVisible();
    await expect(page.getByText(/keep more of what you earn/i)).toBeVisible();
    await expect(page.getByText(/built-in audience/i)).toBeVisible();
  });

  test('FAQ accordion is visible and functional', async ({ page }) => {
    // Section heading
    await expect(page.getByRole('heading', { name: /frequently asked questions/i, level: 2 })).toBeVisible();

    // FAQ question should be visible (the text inside the button)
    const faqQuestionText = page.getByText(/how much can i realistically earn/i);
    await expect(faqQuestionText).toBeVisible();

    // Click to expand the FAQ item - scroll into view first
    await faqQuestionText.scrollIntoViewIfNeeded();
    await faqQuestionText.click();
    await page.waitForTimeout(400);

    // Answer should now be visible
    await expect(page.getByText(/active mentors typically earn/i)).toBeVisible();
  });

  test('FAQ shows all key questions', async ({ page }) => {
    // Check various FAQ questions exist
    await expect(page.getByText(/how long does approval take/i)).toBeVisible();
    await expect(page.getByText(/do i need to be a crna/i)).toBeVisible();
    await expect(page.getByText(/what services can i offer/i)).toBeVisible();
    await expect(page.getByText(/how do i get paid/i)).toBeVisible();
    await expect(page.getByText(/what if i need to take a break/i)).toBeVisible();
  });

  test('start application button navigates correctly', async ({ page }) => {
    // Find the final CTA section
    const ctaButton = page.getByRole('link', { name: /start my application/i });
    await expect(ctaButton).toBeVisible();

    // Check href
    await expect(ctaButton).toHaveAttribute('href', '/marketplace/provider/apply');
  });

  test('get started button in hero navigates correctly', async ({ page }) => {
    const getStartedButton = page.getByRole('link', { name: /get started/i }).first();
    await expect(getStartedButton).toHaveAttribute('href', '/marketplace/provider/apply');
  });

  test('shows testimonials section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /hear from our mentors/i })).toBeVisible();

    // Should have testimonial quotes
    await expect(page.getByText(/I made \$600 in my first month/i)).toBeVisible();
  });

  test('trust indicators are visible in final CTA', async ({ page }) => {
    await expect(page.getByText(/no upfront costs/i)).toBeVisible();
    await expect(page.getByText(/cancel anytime/i)).toBeVisible();
  });

  test('page is responsive - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Hero should still be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // CTA should be visible
    await expect(page.getByRole('link', { name: /get started/i }).first()).toBeVisible();
  });

  test('page is responsive - tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // All sections should be visible - scroll to see them
    await expect(page.getByRole('heading', { name: /how it works/i })).toBeVisible();

    // Scroll down to see more sections - use a specific scroll amount
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(300);
    await expect(page.getByRole('heading', { name: /crystal clear expectations/i }).first()).toBeVisible();
  });

  test('how it works steps can expand', async ({ page }) => {
    // Scroll to the How It Works section first
    await page.getByRole('heading', { name: /how it works/i, level: 2 }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Find the Apply step card and click it
    // The step cards have h3 tags with the title
    const applyHeading = page.getByRole('heading', { name: 'Apply', level: 3 });
    await expect(applyHeading).toBeVisible();
    await applyHeading.click();
    await page.waitForTimeout(500);

    // Details should expand - check for the detail items (use first() due to mobile/desktop duplication)
    await expect(page.getByText(/fill out a quick application form/i).first()).toBeVisible();
  });
});

test.describe('Become a Mentor - Navigation', () => {
  test('can navigate from marketplace to become a mentor', async ({ page }) => {
    await page.goto('/marketplace');
    await page.waitForTimeout(500);

    // Look for a link to become a mentor (if exists in marketplace)
    const becomeMentorLink = page.getByRole('link', { name: /become.*mentor/i });

    if (await becomeMentorLink.isVisible()) {
      await becomeMentorLink.click();
      await expect(page).toHaveURL(/\/marketplace\/become-a-mentor/);
    }
  });

  test('learn more link scrolls to how it works section', async ({ page }) => {
    await page.goto('/marketplace/become-a-mentor');
    await page.waitForTimeout(500);

    const learnMoreLink = page.getByRole('link', { name: /learn more/i });
    await learnMoreLink.click();

    // Should scroll to how it works section
    await page.waitForTimeout(500);
    const howItWorksSection = page.locator('#how-it-works');
    await expect(howItWorksSection).toBeInViewport();
  });
});
