/**
 * Playwright tests for Provider Application Flow
 * Tests the 5-step application wizard for becoming a mentor
 */

const { test, expect } = require('@playwright/test');

test.describe('Provider Application Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/apply');
    await page.waitForTimeout(500);
  });

  test('page loads with step indicator and eligibility check', async ({ page }) => {
    // Check header
    await expect(page.getByRole('heading', { name: /mentor application/i })).toBeVisible();

    // Check eligibility question (the question text specifically)
    await expect(page.getByText('Are you currently enrolled in a CRNA program?')).toBeVisible();

    // Check eligibility options are present
    await expect(page.getByText(/yes, i am/i)).toBeVisible();
  });

  test('step 1 - eligibility check shows options', async ({ page }) => {
    // Both Yes and No options should be visible
    await expect(page.getByText(/yes, i am/i)).toBeVisible();
    await expect(page.getByText(/no, i'm not/i)).toBeVisible();
  });

  test('step 1 - selecting No shows not eligible message', async ({ page }) => {
    // Click "No, I'm not"
    await page.getByText(/no, i'm not/i).click();
    await page.waitForTimeout(200);

    // Should show not eligible message
    await expect(page.getByText(/sorry, you're not eligible/i)).toBeVisible();
    await expect(page.getByText(/mentors must be current srnas/i)).toBeVisible();

    // Next button should be disabled
    const nextButton = page.getByRole('button', { name: /next/i });
    await expect(nextButton).toBeDisabled();
  });

  test('step 1 - selecting Yes enables next button', async ({ page }) => {
    // Click "Yes, I am"
    await page.getByText(/yes, i am/i).click();
    await page.waitForTimeout(200);

    // Next button should be enabled
    const nextButton = page.getByRole('button', { name: /next/i });
    await expect(nextButton).toBeEnabled();
  });

  test('step 2 - basic info shows required fields', async ({ page }) => {
    // Navigate to step 2
    await page.getByText(/yes, i am/i).click();
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(300);

    // Check step 2 fields are visible
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByText(/profile photo/i)).toBeVisible();
    await expect(page.getByText('Student ID *')).toBeVisible();
    await expect(page.getByLabel(/rn license number/i)).toBeVisible();
    await expect(page.getByText(/license state/i)).toBeVisible();
  });

  test('step 2 - photo upload shows AI tips', async ({ page }) => {
    // Navigate to step 2
    await page.getByText(/yes, i am/i).click();
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(300);

    // Check for photo tips
    await expect(page.getByText(/photo tips/i)).toBeVisible();
    await expect(page.getByText(/smile!/i)).toBeVisible();
  });

  test('step 2 - validates required fields on next', async ({ page }) => {
    // Navigate to step 2
    await page.getByText(/yes, i am/i).click();
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(300);

    // Try to go next without filling fields
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(200);

    // Should show validation errors
    await expect(page.getByText(/first name is required/i)).toBeVisible();
  });

  test('can navigate back from step 2', async ({ page }) => {
    // Navigate to step 2
    await page.getByText(/yes, i am/i).click();
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(300);

    // Click the step navigation back button (second one - first is header back)
    await page.getByRole('button', { name: /^back$/i }).nth(1).click();
    await page.waitForTimeout(300);

    // Should be back on step 1 - check for eligibility options
    await expect(page.getByText(/yes, i am/i)).toBeVisible();
  });

  test('back button returns to become-a-mentor page', async ({ page }) => {
    // Click the back link at the top
    await page.getByRole('button', { name: /^back$/i }).first().click();

    // Should navigate to become-a-mentor
    await expect(page).toHaveURL(/\/marketplace\/become-a-mentor/);
  });
});

test.describe('Provider Application - Full Flow', () => {
  test('can complete step 1 eligibility', async ({ page }) => {
    await page.goto('/marketplace/provider/apply');
    await page.waitForTimeout(500);

    // Select Yes
    await page.getByText(/yes, i am/i).click();

    // Click Next
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(300);

    // Should be on step 2
    await expect(page.getByText(/basic information/i)).toBeVisible();
  });
});

test.describe('Application Status Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/application-status');
    await page.waitForTimeout(500);
  });

  test('page loads with pending status', async ({ page }) => {
    // Default mock is pending status
    await expect(page.getByText(/application under review/i)).toBeVisible();
    await expect(page.getByText(/2-3 business days/i)).toBeVisible();
  });

  test('shows timeline of what happens next', async ({ page }) => {
    await expect(page.getByText(/what happens next/i)).toBeVisible();
    await expect(page.getByText(/application submitted/i)).toBeVisible();
    await expect(page.getByText(/license verification/i)).toBeVisible();
    await expect(page.getByText(/team review/i)).toBeVisible();
    await expect(page.getByText(/decision notification/i)).toBeVisible();
  });

  test('shows check status button', async ({ page }) => {
    const checkButton = page.getByRole('button', { name: /check status/i });
    await expect(checkButton).toBeVisible();

    // Click it
    await checkButton.click();
    await expect(page.getByText(/checking/i)).toBeVisible();
  });

  test('shows help contact information', async ({ page }) => {
    await expect(page.getByText(/have questions/i)).toBeVisible();
    await expect(page.getByText(/mentors@thecrnaclub.com/i)).toBeVisible();
  });

  test('shows security note', async ({ page }) => {
    await expect(page.getByText(/secure and confidential/i)).toBeVisible();
  });
});

test.describe('Provider Application - Navigation', () => {
  test('can navigate from become-a-mentor to application', async ({ page }) => {
    await page.goto('/marketplace/become-a-mentor');
    await page.waitForTimeout(500);

    // Click Get Started or Start My Application
    const startButton = page.getByRole('link', { name: /get started/i }).first();
    await startButton.click();

    // Should be on application page
    await expect(page).toHaveURL(/\/marketplace\/provider\/apply/);
  });
});
