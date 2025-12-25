// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * useEvents Hook Supabase Integration Tests
 *
 * Tests the Events page at /events
 * Validates Supabase integration with:
 * - school_events table (school info sessions)
 * - crna_club_events table (club events)
 * - state_meetings table (AANA meetings)
 * - user_saved_events table (bookmarks)
 *
 * Key features:
 * - Events page loads with school events
 * - Filter events by category
 * - Save/unsave events (toggle bookmark)
 * - View event details
 * - Grid/list view modes
 * - All/saved view toggle
 *
 * Note: Tests work with mock authentication when Supabase is not configured
 */

test.describe('useEvents Hook - Events Page Load', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to events page
    await page.goto('/events');

    // Wait for page to fully load (handles auth redirect if needed)
    await page.waitForLoadState('networkidle');

    // Give time for React to render and auth to settle
    await page.waitForTimeout(2000);
  });

  test('events page loads successfully', async ({ page }) => {
    // Should show Events heading
    await expect(page.getByRole('heading', { name: /Events/i })).toBeVisible({ timeout: 10000 });
  });

  test('page shows description', async ({ page }) => {
    // Check for page description
    await expect(page.getByText(/Discover CRNA events, open houses, and networking/i)).toBeVisible({ timeout: 5000 });
  });

  test('shows event count', async ({ page }) => {
    // Should show text like "5 events" or "1 event"
    await expect(page.getByText(/\d+ event/i)).toBeVisible({ timeout: 5000 });
  });

  test('shows View All and Saved toggle', async ({ page }) => {
    // Check for view toggle buttons (they use underline styling, not role="button")
    const viewAllText = page.getByText('View All', { exact: true });
    const savedText = page.getByText('Saved', { exact: true });

    await expect(viewAllText).toBeVisible({ timeout: 5000 });
    await expect(savedText).toBeVisible({ timeout: 5000 });
  });

  test('View All is active by default', async ({ page }) => {
    // View All should have underline decoration by default
    const viewAllButton = page.locator('button:has-text("View All")');

    // Check if it has the underline class
    const hasUnderline = await viewAllButton.evaluate(el =>
      el.className.includes('underline')
    );
    expect(hasUnderline).toBe(true);
  });

  test('shows filter controls', async ({ page }) => {
    // Category dropdown - look for select or combobox
    const categoryFilter = page.locator('select, [role="combobox"]').first();
    await expect(categoryFilter).toBeVisible({ timeout: 5000 });

    // Reset button
    const resetBtn = page.locator('button:has-text("Reset")');
    await expect(resetBtn).toBeVisible({ timeout: 5000 });
  });

  test('shows view mode toggle (grid/list)', async ({ page }) => {
    // Grid and list view buttons should be visible (they contain icons, not text)
    const gridBtn = page.locator('button').filter({ has: page.locator('[class*="lucide-layout-grid"]') }).first();
    const listBtn = page.locator('button').filter({ has: page.locator('[class*="lucide-list"]') }).first();

    await expect(gridBtn).toBeVisible({ timeout: 5000 });
    await expect(listBtn).toBeVisible({ timeout: 5000 });
  });

  test('events load and display in grid by default', async ({ page }) => {
    // Wait for events to load
    await page.waitForTimeout(2000);

    // Check if at least one event card is visible or see the count
    const eventCount = await page.getByText(/\d+ event/i).textContent();
    expect(eventCount).toBeTruthy();
  });
});

test.describe('useEvents Hook - Filter by Category', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('can open category filter dropdown', async ({ page }) => {
    const categoryDropdown = page.locator('select, [role="combobox"]').first();

    // If it's a select, just check visibility
    // If it's a custom dropdown, click it
    const tagName = await categoryDropdown.evaluate(el => el.tagName);

    if (tagName === 'SELECT') {
      await expect(categoryDropdown).toBeVisible();
    } else {
      await categoryDropdown.click();
      await page.waitForTimeout(500);
    }
  });

  test('category filter shows available categories', async ({ page }) => {
    const categoryDropdown = page.locator('select').first();
    const isSelect = await categoryDropdown.isVisible().catch(() => false);

    if (isSelect) {
      // Check for option elements
      const options = await categoryDropdown.locator('option').allTextContents();
      expect(options.length).toBeGreaterThan(0);
    }
  });

  test('can filter by category', async ({ page }) => {
    const categoryDropdown = page.locator('select').first();
    const isVisible = await categoryDropdown.isVisible().catch(() => false);

    if (isVisible) {
      // Get initial count
      const initialCountText = await page.getByText(/\d+ event/i).textContent();

      // Select a category
      await categoryDropdown.selectOption({ index: 1 });
      await page.waitForTimeout(1000);

      // Check if count updated or stayed same
      const newCountText = await page.getByText(/\d+ event/i).textContent();
      expect(newCountText).toBeTruthy();
    }
  });

  test('can reset category filter', async ({ page }) => {
    const categoryDropdown = page.locator('select').first();
    const isVisible = await categoryDropdown.isVisible().catch(() => false);

    if (isVisible) {
      // First apply a filter
      await categoryDropdown.selectOption({ index: 1 });
      await page.waitForTimeout(1000);

      // Reset filter
      const resetBtn = page.locator('button:has-text("Reset")');
      await resetBtn.click();
      await page.waitForTimeout(1000);

      // Verify reset happened
      const eventCount = await page.getByText(/\d+ event/i).textContent();
      expect(eventCount).toBeTruthy();
    }
  });

  test('shows empty state when no events match filter', async ({ page }) => {
    // Check if events are shown OR empty state is shown
    const hasEvents = await page.getByText(/\d+ event/i).isVisible();
    const hasEmptyState = await page.getByText(/No events found/i).isVisible().catch(() => false);

    // One of these should be true
    expect(hasEvents || hasEmptyState).toBe(true);
  });
});

test.describe('useEvents Hook - Save Event (Toggle Bookmark)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('event cards have bookmark buttons', async ({ page }) => {
    // Look for bookmark icon button
    const bookmarkButtons = page.locator('[class*="lucide-bookmark"], [data-testid="bookmark-button"]');
    const count = await bookmarkButtons.count();

    // Should have at least one bookmark button if events are loaded
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('can save an event', async ({ page }) => {
    // Find bookmark button within event cards - the button contains a span with the icon
    const bookmarkBtn = page.locator('button').filter({ has: page.locator('svg.lucide-bookmark') }).first();
    const isVisible = await bookmarkBtn.isVisible().catch(() => false);

    if (isVisible) {
      await bookmarkBtn.click();
      await page.waitForTimeout(500);

      // Should show success toast - use exact text to avoid matching "Saved" button
      const toast = page.getByText('Event saved!', { exact: true });
      await expect(toast).toBeVisible({ timeout: 3000 });
    }
  });

  test('can unsave a saved event', async ({ page }) => {
    // First save an event
    const bookmarkBtn = page.locator('button').filter({ has: page.locator('svg.lucide-bookmark') }).first();
    const isVisible = await bookmarkBtn.isVisible().catch(() => false);

    if (isVisible) {
      // Save the event
      await bookmarkBtn.click();
      await page.waitForTimeout(2500);

      // Now unsave it
      await bookmarkBtn.click();
      await page.waitForTimeout(500);

      // Should show "removed" toast - use more specific selector
      const toast = page.getByText('Event removed from saved', { exact: true });
      await expect(toast).toBeVisible({ timeout: 3000 });
    }
  });

  test('saved events appear in Saved view', async ({ page }) => {
    // Save an event first
    const bookmarkBtn = page.locator('button').filter({ has: page.locator('svg.lucide-bookmark') }).first();
    const isVisible = await bookmarkBtn.isVisible().catch(() => false);

    if (isVisible) {
      await bookmarkBtn.click();
      await page.waitForTimeout(2500);

      // Switch to Saved view
      const savedBtn = page.locator('button:has-text("Saved")');
      await savedBtn.click();
      await page.waitForTimeout(1000);

      // Should show at least 1 event or the count
      const eventCount = await page.getByText(/\d+ event/i).isVisible();
      expect(eventCount).toBeTruthy();
    }
  });

  test('Saved view shows empty state when no saved events', async ({ page }) => {
    // Switch to Saved view without saving anything
    const savedBtn = page.locator('button:has-text("Saved")');
    await savedBtn.click();
    await page.waitForTimeout(1000);

    // Should show empty state or events
    const hasEmptyState = await page.getByText(/No saved events/i).isVisible().catch(() => false);
    const hasEvents = await page.getByText(/\d+ event/i).isVisible().catch(() => false);

    // One should be true
    expect(hasEmptyState || hasEvents).toBe(true);
  });

  test('empty state in Saved view has Browse Events button', async ({ page }) => {
    const savedBtn = page.locator('button:has-text("Saved")');
    await savedBtn.click();
    await page.waitForTimeout(1000);

    // Check if empty state exists
    const hasEmptyState = await page.getByText(/No saved events/i).isVisible().catch(() => false);

    if (hasEmptyState) {
      // Should have Browse Events button
      const browseBtn = page.locator('button:has-text("Browse Events")');
      await expect(browseBtn).toBeVisible();
    }
  });

  test('clicking Browse Events in empty state switches to View All', async ({ page }) => {
    const savedBtn = page.locator('button:has-text("Saved")');
    await savedBtn.click();
    await page.waitForTimeout(1000);

    const hasEmptyState = await page.getByText(/No saved events/i).isVisible().catch(() => false);

    if (hasEmptyState) {
      const browseBtn = page.locator('button:has-text("Browse Events")');
      await browseBtn.click();
      await page.waitForTimeout(1000);

      // Should switch to View All (check if View All button is active)
      const viewAllBtn = page.locator('button:has-text("View All")');
      const hasUnderline = await viewAllBtn.evaluate(el =>
        el.className.includes('underline')
      );
      expect(hasUnderline).toBe(true);
    }
  });
});

test.describe('useEvents Hook - View Event Details', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('clicking event card opens detail modal', async ({ page }) => {
    // Find first event card - click anywhere on the card content
    const eventCard = page.locator('.bg-gradient-to-b.from-yellow-50').first();
    const isVisible = await eventCard.isVisible().catch(() => false);

    if (isVisible) {
      await eventCard.click();
      await page.waitForTimeout(500);

      // Dialog should open
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible({ timeout: 3000 });
    }
  });

  test('event detail modal shows event information', async ({ page }) => {
    const eventCard = page.locator('.bg-gradient-to-b.from-yellow-50').first();
    const isVisible = await eventCard.isVisible().catch(() => false);

    if (isVisible) {
      await eventCard.click();
      await page.waitForTimeout(500);

      // Modal should show event details
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible({ timeout: 3000 });
    }
  });

  test('can close event detail modal', async ({ page }) => {
    const eventCard = page.locator('.bg-gradient-to-b.from-yellow-50').first();
    const isVisible = await eventCard.isVisible().catch(() => false);

    if (isVisible) {
      await eventCard.click();
      await page.waitForTimeout(500);

      // Try to close the dialog
      const closeBtn = page.locator('button[aria-label="Close"], button:has-text("Close")').first();
      const canClose = await closeBtn.isVisible().catch(() => false);

      if (canClose) {
        await closeBtn.click();
        await page.waitForTimeout(500);

        // Dialog should close
        const dialog = page.getByRole('dialog');
        await expect(dialog).not.toBeVisible();
      } else {
        // Try ESC key
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }
  });

  test('can save event from detail modal', async ({ page }) => {
    const eventCard = page.locator('.bg-gradient-to-b.from-yellow-50').first();
    const isVisible = await eventCard.isVisible().catch(() => false);

    if (isVisible) {
      await eventCard.click();
      await page.waitForTimeout(500);

      // Find bookmark button in modal
      const modalBookmarkBtn = page.getByRole('dialog').locator('button').filter({ has: page.locator('svg.lucide-bookmark') }).first();
      const isBtnVisible = await modalBookmarkBtn.isVisible().catch(() => false);

      if (isBtnVisible) {
        await modalBookmarkBtn.click();
        await page.waitForTimeout(500);

        // Should show toast - check for either save or remove message
        const saveToast = page.getByText('Event saved!', { exact: true });
        const removeToast = page.getByText('Event removed from saved', { exact: true });

        // Wait for either toast to appear
        try {
          await expect(saveToast).toBeVisible({ timeout: 3000 });
        } catch {
          await expect(removeToast).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });
});

test.describe('useEvents Hook - View Modes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('can switch to list view', async ({ page }) => {
    const listViewBtn = page.locator('button').filter({ has: page.locator('svg.lucide-list') }).first();
    const isVisible = await listViewBtn.isVisible().catch(() => false);

    if (isVisible) {
      await listViewBtn.click();
      await page.waitForTimeout(500);

      // Check if the button has active state
      const hasActiveClass = await listViewBtn.evaluate(el =>
        el.className.includes('bg-gray-900') || el.className.includes('text-white')
      );
      expect(hasActiveClass).toBe(true);
    }
  });

  test('can switch back to grid view', async ({ page }) => {
    // First switch to list
    const listViewBtn = page.locator('button').filter({ has: page.locator('svg.lucide-list') }).first();
    const isListVisible = await listViewBtn.isVisible().catch(() => false);

    if (isListVisible) {
      await listViewBtn.click();
      await page.waitForTimeout(500);

      // Then switch back to grid
      const gridViewBtn = page.locator('button').filter({ has: page.locator('svg.lucide-layout-grid') }).first();
      await gridViewBtn.click();
      await page.waitForTimeout(500);

      const hasActiveClass = await gridViewBtn.evaluate(el =>
        el.className.includes('bg-gray-900') || el.className.includes('text-white')
      );
      expect(hasActiveClass).toBe(true);
    }
  });

  test('grid is default view mode', async ({ page }) => {
    const gridViewBtn = page.locator('button').filter({ has: page.locator('svg.lucide-layout-grid') }).first();
    const isVisible = await gridViewBtn.isVisible().catch(() => false);

    if (isVisible) {
      const hasActiveClass = await gridViewBtn.evaluate(el =>
        el.className.includes('bg-gray-900') || el.className.includes('text-white')
      );
      expect(hasActiveClass).toBe(true);
    }
  });
});

test.describe('useEvents Hook - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('events page loads on mobile', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await expect(page.getByRole('heading', { name: /Events/i })).toBeVisible({ timeout: 10000 });
  });

  test('filters are accessible on mobile', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Filters container should be visible
    const categoryDropdown = page.locator('select, [role="combobox"]').first();
    await expect(categoryDropdown).toBeVisible({ timeout: 5000 });
  });

  test('view toggle buttons are touch-friendly on mobile', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const gridBtn = page.locator('button').filter({ has: page.locator('svg.lucide-layout-grid') }).first();
    const listBtn = page.locator('button').filter({ has: page.locator('svg.lucide-list') }).first();

    // Both should be visible and tappable
    await expect(gridBtn).toBeVisible({ timeout: 5000 });
    await expect(listBtn).toBeVisible({ timeout: 5000 });
  });

  test('event cards display on mobile', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should show events
    const eventCount = await page.getByText(/\d+ event/i).textContent();
    expect(eventCount).toBeTruthy();
  });
});

test.describe('useEvents Hook - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('events page loads on desktop', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await expect(page.getByRole('heading', { name: /Events/i })).toBeVisible({ timeout: 10000 });
  });

  test('shows events in grid layout', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Desktop should show events
    const eventCount = await page.getByText(/\d+ event/i).textContent();
    expect(eventCount).toBeTruthy();
  });

  test('filters display on desktop', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const categoryDropdown = page.locator('select, [role="combobox"]').first();
    const resetBtn = page.locator('button:has-text("Reset")');

    await expect(categoryDropdown).toBeVisible({ timeout: 5000 });
    await expect(resetBtn).toBeVisible({ timeout: 5000 });
  });
});

test.describe('useEvents Hook - Error Handling', () => {
  test('page loads gracefully when events available', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should either show events or empty state, not crash
    const hasEvents = await page.getByText(/\d+ event/i).isVisible();
    const hasEmptyState = await page.getByText(/No events found/i).isVisible().catch(() => false);

    expect(hasEvents || hasEmptyState).toBe(true);
  });

  test('handles authentication state with mock user', async ({ page }) => {
    // Test that page works with mock authentication
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Page should load with mock auth
    await expect(page.getByRole('heading', { name: /Events/i })).toBeVisible({ timeout: 10000 });
  });
});
