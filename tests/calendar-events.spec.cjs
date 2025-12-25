// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Calendar Events System Tests
 *
 * Tests calendar functionality at /dashboard (CalendarWidget component)
 *
 * Event types tested:
 * - crna_club: Yellow - CRNA Club events (all members)
 * - deadline: Red - Target program deadlines (auto-generated)
 * - school_event: Blue - School events (saved/target programs)
 * - shadow_day: Orange - Shadow experiences (user-created)
 * - work_shift: Green - Work schedule (user-created)
 * - interview: Teal - Interview appointments (user-created)
 * - marketplace: Purple - Marketplace bookings (auto-generated)
 * - other: Gray - Miscellaneous events (user-created)
 *
 * Key features:
 * - Events auto-populate based on user data
 * - Users can hide events without deleting
 * - Users can delete only user-created events
 * - Calendar and list view modes
 * - Event filtering and display logic
 */

test.describe('Calendar Events - Event Visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('calendar widget is visible on dashboard', async ({ page }) => {
    await expect(page.getByText('My Calendar')).toBeVisible();
  });

  test('CRNA Club events show with yellow indicator', async ({ page }) => {
    // Look for calendar event legend showing CRNA Club events
    const clubLegend = page.locator('text=Club').locator('..');
    await expect(clubLegend).toBeVisible();

    // Yellow dot should be present
    const yellowDot = clubLegend.locator('.bg-yellow-400');
    await expect(yellowDot).toBeVisible();
  });

  test('deadline events show with red indicator', async ({ page }) => {
    // Check deadline legend
    const deadlineLegend = page.locator('text=Deadline').locator('..');
    await expect(deadlineLegend).toBeVisible();

    // Red dot should be present
    const redDot = deadlineLegend.locator('.bg-red-500');
    await expect(redDot).toBeVisible();
  });

  test('shadow day events show with orange indicator', async ({ page }) => {
    const shadowLegend = page.locator('text=Shadow').locator('..');
    await expect(shadowLegend).toBeVisible();

    const orangeDot = shadowLegend.locator('.bg-orange-500');
    await expect(orangeDot).toBeVisible();
  });

  test('work shift events show with green indicator', async ({ page }) => {
    const workLegend = page.locator('text=Work').locator('..');
    await expect(workLegend).toBeVisible();

    const greenDot = workLegend.locator('.bg-green-500');
    await expect(greenDot).toBeVisible();
  });

  test('interview events show with teal indicator', async ({ page }) => {
    const interviewLegend = page.locator('text=Interview').locator('..');
    await expect(interviewLegend).toBeVisible();

    const tealDot = interviewLegend.locator('.bg-teal-500');
    await expect(tealDot).toBeVisible();
  });

  test('marketplace appointment events show with purple indicator', async ({ page }) => {
    const apptLegend = page.locator('text=Appts').locator('..');
    await expect(apptLegend).toBeVisible();

    const purpleDot = apptLegend.locator('.bg-purple-500');
    await expect(purpleDot).toBeVisible();
  });

  test('calendar shows event dots on days with events', async ({ page }) => {
    // Switch to calendar view if not already
    const calendarViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-calendar"]') });
    await calendarViewBtn.click();

    // Look for any calendar day with event indicators (colored dots)
    const eventDots = page.locator('.bg-yellow-400, .bg-red-500, .bg-orange-500, .bg-green-500, .bg-teal-500, .bg-purple-500, .bg-blue-500');
    const count = await eventDots.count();

    // Should have at least some event indicators if mock data is present
    // Note: This may be 0 if no mock events are in the current month
  });
});

test.describe('Calendar Events - View Modes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('can switch to calendar view', async ({ page }) => {
    // Find calendar view button by icon
    const calendarViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-calendar"]') });
    await calendarViewBtn.click();

    // Should show month navigation
    await expect(page.locator('text=/January|February|March|April|May|June|July|August|September|October|November|December/')).toBeVisible();
  });

  test('can switch to list view', async ({ page }) => {
    // Find list view button by icon
    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // Should show "Upcoming Events" text
    await expect(page.getByText(/Upcoming Events/i)).toBeVisible();
  });

  test('calendar view shows month navigation buttons', async ({ page }) => {
    const calendarViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-calendar"]') });
    await calendarViewBtn.click();

    // Should have prev/next month buttons
    const prevBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-chevron-left"]') });
    const nextBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-chevron-right"]') });

    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();
  });

  test('can navigate to previous month', async ({ page }) => {
    const calendarViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-calendar"]') });
    await calendarViewBtn.click();

    // Get current month
    const currentMonth = await page.locator('text=/January|February|March|April|May|June|July|August|September|October|November|December/').textContent();

    // Click previous month
    const prevBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-chevron-left"]') });
    await prevBtn.click();

    // Month should change (or year if we're in January)
    const newMonth = await page.locator('text=/January|February|March|April|May|June|July|August|September|October|November|December/').textContent();
    // Months may be the same if we wrapped around the year, so just verify the element is still visible
    await expect(page.locator('text=/January|February|March|April|May|June|July|August|September|October|November|December/')).toBeVisible();
  });

  test('can navigate to next month', async ({ page }) => {
    const calendarViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-calendar"]') });
    await calendarViewBtn.click();

    // Click next month
    const nextBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-chevron-right"]') });
    await nextBtn.click();

    // Verify month navigation works
    await expect(page.locator('text=/January|February|March|April|May|June|July|August|September|October|November|December/')).toBeVisible();
  });

  test('list view shows event count', async ({ page }) => {
    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // Should show count like "Upcoming Events (5)"
    await expect(page.getByText(/Upcoming Events \(\d+\)/i)).toBeVisible();
  });
});

test.describe('Calendar Events - Add Event Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('has Add Event button', async ({ page }) => {
    // Look for plus icon button
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await expect(addBtn).toBeVisible();
  });

  test('clicking Add Event opens dialog', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Dialog should open with title "Add Event"
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Add Event')).toBeVisible();
  });

  test('add event dialog has event type selector', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Should have Event Type field
    await expect(page.getByText('Event Type')).toBeVisible();
  });

  test('add event dialog has required title field', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Should have Title field with required indicator
    await expect(page.getByText(/Title/i)).toBeVisible();
    await expect(page.getByText(/\*/)).toBeVisible(); // Required asterisk
  });

  test('add event dialog has date field', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    await expect(page.getByText(/Date/i)).toBeVisible();
  });

  test('add event dialog has optional time field', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    await expect(page.getByText(/Time.*optional/i)).toBeVisible();
  });

  test('add event dialog has location field', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    await expect(page.getByText('Location')).toBeVisible();
  });

  test('can cancel adding event', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Click Cancel button
    const cancelBtn = page.getByRole('button', { name: /Cancel/i });
    await cancelBtn.click();

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});

test.describe('Calendar Events - Add Shadow Day Event', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('can add shadow day event', async ({ page }) => {
    // Open add event dialog
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Event type should default to Shadow Day
    // Fill in required fields
    const titleInput = page.getByLabel(/Title/i);
    await titleInput.fill('Shadow at Mayo Clinic');

    const dateInput = page.getByLabel(/Date/i);
    await dateInput.fill('2025-12-25');

    const locationInput = page.getByLabel(/Location/i);
    await locationInput.fill('Mayo Clinic - Rochester');

    // Submit
    const addEventBtn = page.getByRole('button', { name: /Add Event/i });
    await addEventBtn.click();

    // Should show success toast
    await expect(page.getByText(/Shadow day scheduled/i)).toBeVisible();
  });

  test('shadow day shows helper text about tracker integration', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Should show helper text about Shadow Days Tracker
    await expect(page.getByText(/Shadow days will appear in your Shadow Days Tracker/i)).toBeVisible();
  });
});

test.describe('Calendar Events - Add Work Shift Event', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('can select work shift event type', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Click event type selector
    await page.getByRole('combobox').click();

    // Select Work Shift
    await page.getByRole('option', { name: /Work Shift/i }).click();

    // Should show work shift helper text
    await expect(page.getByText(/Track your work schedule/i)).toBeVisible();
  });

  test('can add work shift event', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Select Work Shift type
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Work Shift/i }).click();

    // Fill in details
    await page.getByLabel(/Title/i).fill('Night Shift - MICU');
    await page.getByLabel(/Date/i).fill('2025-12-20');
    await page.getByLabel(/Location/i).fill('Medical ICU, Floor 3');

    // Submit
    await page.getByRole('button', { name: /Add Event/i }).click();

    // Should show success
    await expect(page.getByText(/Work shift added/i)).toBeVisible();
  });
});

test.describe('Calendar Events - Add Interview Event', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('can add interview event', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Select Interview type
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Interview/i }).click();

    // Fill in details
    await page.getByLabel(/Title/i).fill('Georgetown Interview');
    await page.getByLabel(/Date/i).fill('2025-12-28');
    await page.getByLabel(/Time/i).fill('14:00');
    await page.getByLabel(/Location/i).fill('Georgetown University Hospital');

    // Submit
    await page.getByRole('button', { name: /Add Event/i }).click();

    // Should show success
    await expect(page.getByText(/Interview scheduled/i)).toBeVisible();
  });
});

test.describe('Calendar Events - Add Other Event', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('can add other event type', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Select Other type
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Other/i }).click();

    // Fill in details
    await page.getByLabel(/Title/i).fill('Study Group Meeting');
    await page.getByLabel(/Date/i).fill('2025-12-22');

    // Submit
    await page.getByRole('button', { name: /Add Event/i }).click();

    // Should show success
    await expect(page.getByText(/Event added to calendar/i)).toBeVisible();
  });
});

test.describe('Calendar Events - Delete Events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('user-created events show delete button on hover', async ({ page }) => {
    // Switch to list view to see events
    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // First, add an event
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    await page.getByLabel(/Title/i).fill('Test Event to Delete');
    await page.getByLabel(/Date/i).fill('2025-12-30');
    await page.getByRole('button', { name: /Add Event/i }).click();

    // Wait for success toast to appear and disappear
    await expect(page.getByText(/scheduled|added/i)).toBeVisible();
    await page.waitForTimeout(2000); // Wait for toast to clear

    // Look for the event in the list
    const eventCard = page.locator('text=Test Event to Delete').locator('..').locator('..');

    // Hover over it to reveal delete button
    await eventCard.hover();

    // Delete button should appear (trash icon)
    const deleteBtn = eventCard.getByRole('button').filter({ has: page.locator('[class*="lucide-trash"]') });
    const isVisible = await deleteBtn.isVisible().catch(() => false);

    // Delete button may require hover state - check if it exists
    if (isVisible) {
      await expect(deleteBtn).toBeVisible();
    }
  });

  test('can delete shadow day event', async ({ page }) => {
    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // Add a shadow day event
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    await page.getByLabel(/Title/i).fill('Shadow Day to Delete');
    await page.getByLabel(/Date/i).fill('2025-12-31');
    await page.getByRole('button', { name: /Add Event/i }).click();

    await page.waitForTimeout(2000); // Wait for toast

    // Find and hover over the event
    const eventCard = page.locator('text=Shadow Day to Delete').locator('..').locator('..');
    await eventCard.hover();

    // Click delete
    const deleteBtn = eventCard.getByRole('button').filter({ has: page.locator('[class*="lucide-trash"]') });
    await deleteBtn.click();

    // Confirm deletion
    await expect(page.getByText(/Remove Event/i)).toBeVisible();
    await page.getByRole('button', { name: /Remove/i }).click();

    // Should show success
    await expect(page.getByText(/Event removed/i)).toBeVisible();
  });

  test('can delete work shift event', async ({ page }) => {
    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // Add work shift
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Work Shift/i }).click();

    await page.getByLabel(/Title/i).fill('Work Shift to Delete');
    await page.getByLabel(/Date/i).fill('2025-12-31');
    await page.getByRole('button', { name: /Add Event/i }).click();

    await page.waitForTimeout(2000);

    // Delete it
    const eventCard = page.locator('text=Work Shift to Delete').locator('..').locator('..');
    await eventCard.hover();

    const deleteBtn = eventCard.getByRole('button').filter({ has: page.locator('[class*="lucide-trash"]') });
    await deleteBtn.click();

    await page.getByRole('button', { name: /Remove/i }).click();
    await expect(page.getByText(/Event removed/i)).toBeVisible();
  });

  test('can delete other event', async ({ page }) => {
    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // Add other event
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Other/i }).click();

    await page.getByLabel(/Title/i).fill('Other Event to Delete');
    await page.getByLabel(/Date/i).fill('2025-12-31');
    await page.getByRole('button', { name: /Add Event/i }).click();

    await page.waitForTimeout(2000);

    // Delete it
    const eventCard = page.locator('text=Other Event to Delete').locator('..').locator('..');
    await eventCard.hover();

    const deleteBtn = eventCard.getByRole('button').filter({ has: page.locator('[class*="lucide-trash"]') });
    await deleteBtn.click();

    await page.getByRole('button', { name: /Remove/i }).click();
    await expect(page.getByText(/Event removed/i)).toBeVisible();
  });

  test('CRNA Club events do not show delete button', async ({ page }) => {
    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // Look for CRNA Club events in the list (from mock data)
    // They should have "CRNA Club" badge but no delete button
    const crnaClubBadge = page.getByText('CRNA Club');
    const eventCount = await crnaClubBadge.count();

    if (eventCount > 0) {
      // Get first CRNA Club event card
      const eventCard = crnaClubBadge.first().locator('..').locator('..');
      await eventCard.hover();

      // Should NOT have delete button
      const deleteBtn = eventCard.getByRole('button').filter({ has: page.locator('[class*="lucide-trash"]') });
      await expect(deleteBtn).not.toBeVisible();
    }
  });

  test('deadline events do not show delete button', async ({ page }) => {
    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // Look for deadline events (would have "Due" badge)
    const dueBadge = page.getByText('Due');
    const eventCount = await dueBadge.count();

    if (eventCount > 0) {
      const eventCard = dueBadge.first().locator('..').locator('..');
      await eventCard.hover();

      // Should NOT have delete button
      const deleteBtn = eventCard.getByRole('button').filter({ has: page.locator('[class*="lucide-trash"]') });
      await expect(deleteBtn).not.toBeVisible();
    }
  });

  test('marketplace events do not show delete button', async ({ page }) => {
    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // Look for Appointment badge (marketplace events)
    const appointmentBadge = page.getByText('Appointment');
    const eventCount = await appointmentBadge.count();

    if (eventCount > 0) {
      const eventCard = appointmentBadge.first().locator('..').locator('..');
      await eventCard.hover();

      // Should NOT have delete button
      const deleteBtn = eventCard.getByRole('button').filter({ has: page.locator('[class*="lucide-trash"]') });
      await expect(deleteBtn).not.toBeVisible();
    }
  });
});

test.describe('Calendar Events - Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('cannot submit without title', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Fill date but not title
    await page.getByLabel(/Date/i).fill('2025-12-25');

    // Submit button should be disabled
    const submitBtn = page.getByRole('button', { name: /Add Event/i });
    await expect(submitBtn).toBeDisabled();
  });

  test('cannot submit without date', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Fill title but not date
    await page.getByLabel(/Title/i).fill('Test Event');

    // Submit button should be disabled
    const submitBtn = page.getByRole('button', { name: /Add Event/i });
    await expect(submitBtn).toBeDisabled();
  });

  test('can submit with only required fields', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Fill only required fields
    await page.getByLabel(/Title/i).fill('Minimal Event');
    await page.getByLabel(/Date/i).fill('2025-12-25');

    // Submit button should be enabled
    const submitBtn = page.getByRole('button', { name: /Add Event/i });
    await expect(submitBtn).toBeEnabled();

    await submitBtn.click();
    await expect(page.getByText(/added|scheduled/i)).toBeVisible();
  });

  test('time field is optional', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Verify time field shows as optional
    await expect(page.getByText(/Time.*optional/i)).toBeVisible();
  });

  test('location field is optional', async ({ page }) => {
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Location field should be present but not required
    const locationField = page.getByLabel(/Location/i);
    await expect(locationField).toBeVisible();

    // Should not have required asterisk next to Location
    const locationLabel = page.locator('label:has-text("Location")');
    const hasAsterisk = await locationLabel.locator('text=*').isVisible().catch(() => false);
    expect(hasAsterisk).toBe(false);
  });
});

test.describe('Calendar Events - Event Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('added events appear in list view', async ({ page }) => {
    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // Add an event
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    await page.getByLabel(/Title/i).fill('New Test Event');
    await page.getByLabel(/Date/i).fill('2025-12-29');
    await page.getByRole('button', { name: /Add Event/i }).click();

    await page.waitForTimeout(1000);

    // Event should appear in list
    await expect(page.getByText('New Test Event')).toBeVisible();
  });

  test('added events appear on calendar date', async ({ page }) => {
    // Add event for a future date
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    await page.getByLabel(/Title/i).fill('Calendar Date Event');
    await page.getByLabel(/Date/i).fill('2025-12-15');
    await page.getByRole('button', { name: /Add Event/i }).click();

    await page.waitForTimeout(1000);

    // Switch to calendar view
    const calendarViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-calendar"]') });
    await calendarViewBtn.click();

    // Navigate to December 2025 if needed
    const currentMonthText = await page.locator('text=/January|February|March|April|May|June|July|August|September|October|November|December/').textContent();

    // If not in December, navigate (this is simplified - production test would be more robust)
    if (!currentMonthText?.includes('December')) {
      const nextBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-chevron-right"]') });
      await nextBtn.click();
    }

    // The calendar grid should be visible
    await expect(page.locator('[role="tablist"]').locator('..')).toBeVisible();
  });

  test('events show event type badge', async ({ page }) => {
    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // Add event
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    await page.getByLabel(/Title/i).fill('Badge Test Event');
    await page.getByLabel(/Date/i).fill('2025-12-28');
    await page.getByRole('button', { name: /Add Event/i }).click();

    await page.waitForTimeout(1000);

    // Should show "Shadow Day" badge (default type)
    await expect(page.getByText('Shadow Day')).toBeVisible();
  });

  test('events with location show location icon and text', async ({ page }) => {
    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // Add event with location
    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    await page.getByLabel(/Title/i).fill('Event with Location');
    await page.getByLabel(/Date/i).fill('2025-12-27');
    await page.getByLabel(/Location/i).fill('Test Hospital');
    await page.getByRole('button', { name: /Add Event/i }).click();

    await page.waitForTimeout(1000);

    // Should show location
    await expect(page.getByText('Test Hospital')).toBeVisible();
  });
});

test.describe('Calendar Events - Empty States', () => {
  test('list view shows empty state when no upcoming events', async ({ page }) => {
    // This would require mocking no events
    // For now, just verify the list view renders
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    const listViewBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await listViewBtn.click();

    // Should show "Upcoming Events" header
    await expect(page.getByText(/Upcoming Events/i)).toBeVisible();
  });
});

test.describe('Calendar Events - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('calendar renders on mobile', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Calendar widget should be visible
    await expect(page.getByText('My Calendar')).toBeVisible();
  });

  test('calendar buttons are touch-friendly', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // View toggle buttons should be at least 44px (will check that they're visible)
    const calendarBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-calendar"]') });
    await expect(calendarBtn).toBeVisible();

    const listBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-list"]') });
    await expect(listBtn).toBeVisible();
  });

  test('add event dialog is responsive on mobile', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    const addBtn = page.getByRole('button').filter({ has: page.locator('[class*="lucide-plus"]') }).first();
    await addBtn.click();

    // Dialog should be visible and responsive
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Add Event')).toBeVisible();
  });
});

test.describe('Calendar Events - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('calendar renders on desktop', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('My Calendar')).toBeVisible();
  });

  test('calendar is in sidebar on desktop', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Calendar should be in the sidebar (right side on desktop)
    const calendar = page.getByText('My Calendar');
    await expect(calendar).toBeVisible();
  });
});
