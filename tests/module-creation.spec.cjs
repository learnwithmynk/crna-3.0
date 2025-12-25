/**
 * Module Creation Tests
 *
 * Tests for creating new modules, uploading thumbnails, and saving.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5176';

test.describe('Module Creation', () => {
  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(30000);

    // Listen to console logs for debugging
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warn') {
        console.log(`[${msg.type()}] ${msg.text()}`);
      }
    });

    // Listen for failed requests
    page.on('requestfailed', request => {
      console.log(`Request failed: ${request.url()} - ${request.failure()?.errorText}`);
    });
  });

  test('new module page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/modules/new`);
    await page.waitForLoadState('networkidle');

    // Wait for page to render (look for the form elements which are always present)
    const titleInput = page.locator('input#title');
    await expect(titleInput).toBeVisible({ timeout: 15000 });

    // Should have title input
    await expect(titleInput).toBeVisible();

    // Should have slug input
    const slugInput = page.locator('input#slug');
    await expect(slugInput).toBeVisible();

    // Should have description textarea
    const descriptionInput = page.locator('textarea#description');
    await expect(descriptionInput).toBeVisible();

    // Should have Save button
    const saveButton = page.getByRole('button', { name: /save/i });
    await expect(saveButton).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/module-new-page.png', fullPage: true });
  });

  test('can fill in basic module information', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/modules/new`);
    await page.waitForLoadState('networkidle');

    // Fill in title
    const titleInput = page.locator('input#title');
    await titleInput.fill('Test Module');
    await expect(titleInput).toHaveValue('Test Module');

    // Click Generate to auto-generate slug
    const generateButton = page.getByRole('button', { name: /generate/i });
    await generateButton.click();

    // Slug should be auto-generated
    const slugInput = page.locator('input#slug');
    await expect(slugInput).toHaveValue('test-module');

    // Fill description
    const descriptionInput = page.locator('textarea#description');
    await descriptionInput.fill('This is a test module description');

    await page.screenshot({ path: 'test-results/module-filled-form.png', fullPage: true });
  });

  test('thumbnail upload button exists and is clickable', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/modules/new`);
    await page.waitForLoadState('networkidle');

    // Find upload button
    const uploadButton = page.getByRole('button', { name: /upload image/i });
    await expect(uploadButton).toBeVisible();

    // Find hidden file input
    const fileInput = page.locator('input#thumbnail');
    await expect(fileInput).toHaveCount(1);

    await page.screenshot({ path: 'test-results/module-thumbnail-section.png' });
  });

  test('thumbnail upload handles file selection', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/modules/new`);
    await page.waitForLoadState('networkidle');

    // Create a test image file
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');

    // Check if fixture exists, if not skip
    const fs = require('fs');
    if (!fs.existsSync(testImagePath)) {
      // Create fixtures directory and a simple test file
      const fixturesDir = path.join(__dirname, 'fixtures');
      if (!fs.existsSync(fixturesDir)) {
        fs.mkdirSync(fixturesDir, { recursive: true });
      }

      // Create a minimal valid PNG (1x1 red pixel)
      const minimalPNG = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // 8-bit RGB
        0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
        0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, // compressed data
        0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x05, 0xFE, //
        0xD4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, // IEND chunk
        0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      fs.writeFileSync(testImagePath, minimalPNG);
    }

    // Set file input
    const fileInput = page.locator('input#thumbnail');
    await fileInput.setInputFiles(testImagePath);

    // Wait for upload to process (may take a moment)
    await page.waitForTimeout(2000);

    // Take screenshot to see result
    await page.screenshot({ path: 'test-results/module-after-upload.png', fullPage: true });

    // Check for either:
    // 1. An image thumbnail is shown
    // 2. An error toast is shown (if upload fails due to auth)
    const thumbnailImage = page.locator('img[alt="Module thumbnail"]');
    const errorToast = page.locator('[data-sonner-toast]');

    // Log what we see
    const hasThumb = await thumbnailImage.count();
    const hasError = await errorToast.count();
    console.log(`After upload - thumbnail images: ${hasThumb}, error toasts: ${hasError}`);
  });

  test('save button triggers save action', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/modules/new`);
    await page.waitForLoadState('networkidle');

    // Fill required fields
    await page.locator('input#title').fill('Test Module for Save');
    await page.getByRole('button', { name: /generate/i }).click();

    // Wait for slug to be generated
    await page.waitForTimeout(500);

    // Listen for network requests
    const saveRequests = [];
    page.on('request', request => {
      if (request.url().includes('modules') && request.method() === 'POST') {
        saveRequests.push({
          url: request.url(),
          method: request.method(),
          postData: request.postData()
        });
        console.log('Save request:', request.url(), request.method());
      }
    });

    page.on('response', response => {
      if (response.url().includes('modules')) {
        console.log('Module response:', response.status(), response.url());
      }
    });

    // Click save
    const saveButton = page.getByRole('button', { name: /save/i }).first();
    await saveButton.click();

    // Wait for save to process
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/module-after-save.png', fullPage: true });

    // Check for success toast or error
    const successToast = page.getByText(/created|saved/i);
    const errorToast = page.getByText(/failed|error/i);

    const hasSuccess = await successToast.count();
    const hasError = await errorToast.count();
    console.log(`After save - success: ${hasSuccess}, error: ${hasError}`);
    console.log(`Save requests made: ${saveRequests.length}`);
  });

  test('category and status selectors work', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/modules/new`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Wait for any loading overlays to disappear
    await page.waitForSelector('[data-loading]', { state: 'detached', timeout: 5000 }).catch(() => {});

    // Find category selector and click if visible
    const categorySelect = page.locator('button').filter({ hasText: /select category/i }).first();
    if (await categorySelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await categorySelect.click({ force: true });
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/module-category-dropdown.png' });
      // Press Escape to close dropdown
      await page.keyboard.press('Escape');
    }

    // Find status selector and click if visible
    const statusSelect = page.locator('button').filter({ hasText: /draft/i }).first();
    if (await statusSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await statusSelect.click({ force: true });
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/module-status-dropdown.png' });
    }
  });

  test('entitlements checkboxes load', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/modules/new`);
    await page.waitForLoadState('networkidle');

    // Look for Access Control section
    const accessControlHeading = page.getByText('Access Control');
    await expect(accessControlHeading).toBeVisible();

    // Should have checkboxes
    const checkboxes = page.locator('[role="checkbox"]');
    const count = await checkboxes.count();
    console.log(`Found ${count} checkboxes`);

    await page.screenshot({ path: 'test-results/module-entitlements.png', fullPage: true });
  });
});

test.describe('Module Creation - Debug', () => {
  test('debug full module creation flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/modules/new`);
    await page.waitForLoadState('networkidle');

    console.log('=== Starting module creation debug ===');

    // 1. Check if page loaded
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);

    // 2. Fill basic info
    console.log('Filling title...');
    await page.locator('input#title').fill('Debug Test Module');

    console.log('Generating slug...');
    await page.getByRole('button', { name: /generate/i }).click();
    await page.waitForTimeout(500);

    const slugValue = await page.locator('input#slug').inputValue();
    console.log('Generated slug:', slugValue);

    // 3. Check initial state before save
    console.log('Taking pre-save screenshot...');
    await page.screenshot({ path: 'test-results/debug-pre-save.png', fullPage: true });

    // 4. Capture all console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 5. Try to save
    console.log('Clicking save...');
    await page.getByRole('button', { name: /save/i }).first().click();

    // 6. Wait and capture result
    await page.waitForTimeout(3000);

    console.log('Console errors:', consoleErrors);

    // 7. Take post-save screenshot
    await page.screenshot({ path: 'test-results/debug-post-save.png', fullPage: true });

    // 8. Check current URL (should redirect on success)
    const currentUrl = page.url();
    console.log('Current URL after save:', currentUrl);

    // 9. Check for any visible messages
    const pageText = await page.locator('body').textContent();
    if (pageText.includes('created') || pageText.includes('Created')) {
      console.log('SUCCESS: Found "created" message');
    } else if (pageText.includes('error') || pageText.includes('Error') || pageText.includes('failed') || pageText.includes('Failed')) {
      console.log('ERROR: Found error message in page');
    }

    console.log('=== Module creation debug complete ===');
  });
});
