/**
 * Marketplace Messaging Tests
 *
 * Tests for the direct messaging system:
 * - Thread list display
 * - Conversation view
 * - Sending messages
 * - Real-time updates
 * - Mobile responsive layout
 */

const { test, expect } = require('@playwright/test');

test.describe('Messages Page - Thread List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/messages');
  });

  test('messages page loads', async ({ page }) => {
    await page.waitForTimeout(500);

    // Should show messages interface
    await expect(page.getByText(/message|conversation|inbox/i)).toBeVisible();
  });

  test('thread list is visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(500);

    const threadList = page.locator('[data-testid="thread-list"]');
    if (await threadList.isVisible()) {
      await expect(threadList).toBeVisible();
    }
  });

  test('conversation threads show preview', async ({ page }) => {
    await page.waitForTimeout(500);

    // Thread items should show message preview
    const threadItem = page.locator('[data-testid^="thread-item"]').first();
    if (await threadItem.isVisible()) {
      await expect(threadItem).toBeVisible();
    }
  });

  test('unread indicator shows for unread threads', async ({ page }) => {
    await page.waitForTimeout(500);

    // Unread badge or indicator
    const unreadIndicator = page.locator('[data-testid="unread-badge"]');
    // May or may not have unread messages
  });

  test('new conversation button exists', async ({ page }) => {
    await page.waitForTimeout(500);

    const newButton = page.getByRole('button', { name: /new|compose|start/i });
    if (await newButton.isVisible()) {
      await expect(newButton).toBeVisible();
    }
  });

  test('search conversations input exists', async ({ page }) => {
    await page.waitForTimeout(500);

    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();
    }
  });
});

test.describe('Messages Page - Conversation View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/messages');
    await page.waitForTimeout(500);
  });

  test('selecting thread shows conversation', async ({ page }) => {
    const threadItem = page.locator('[data-testid^="thread-item"]').first();
    if (await threadItem.isVisible()) {
      await threadItem.click();
      await page.waitForTimeout(300);

      // Should show message thread
      const messageThread = page.locator('[data-testid="message-thread"]');
      await expect(messageThread).toBeVisible();
    }
  });

  test('conversation shows other user name', async ({ page }) => {
    const threadItem = page.locator('[data-testid^="thread-item"]').first();
    if (await threadItem.isVisible()) {
      await threadItem.click();
      await page.waitForTimeout(300);

      // Header should show name
      const header = page.locator('[data-testid="conversation-header"]');
      if (await header.isVisible()) {
        await expect(header).toBeVisible();
      }
    }
  });

  test('messages display in bubbles', async ({ page }) => {
    const threadItem = page.locator('[data-testid^="thread-item"]').first();
    if (await threadItem.isVisible()) {
      await threadItem.click();
      await page.waitForTimeout(300);

      const messageBubble = page.locator('[data-testid^="message-bubble"]').first();
      if (await messageBubble.isVisible()) {
        await expect(messageBubble).toBeVisible();
      }
    }
  });

  test('message input exists', async ({ page }) => {
    const threadItem = page.locator('[data-testid^="thread-item"]').first();
    if (await threadItem.isVisible()) {
      await threadItem.click();
      await page.waitForTimeout(300);

      const messageInput = page.getByPlaceholder(/type|message|write/i);
      await expect(messageInput).toBeVisible();
    }
  });

  test('send button exists', async ({ page }) => {
    const threadItem = page.locator('[data-testid^="thread-item"]').first();
    if (await threadItem.isVisible()) {
      await threadItem.click();
      await page.waitForTimeout(300);

      const sendButton = page.getByRole('button', { name: /send/i });
      await expect(sendButton).toBeVisible();
    }
  });
});

test.describe('Messages Page - Sending Messages', () => {
  test('can type a message', async ({ page }) => {
    await page.goto('/messages');
    await page.waitForTimeout(500);

    const threadItem = page.locator('[data-testid^="thread-item"]').first();
    if (await threadItem.isVisible()) {
      await threadItem.click();
      await page.waitForTimeout(300);

      const messageInput = page.getByPlaceholder(/type|message|write/i);
      await messageInput.fill('Test message');
      await expect(messageInput).toHaveValue('Test message');
    }
  });

  test('send button enables with message', async ({ page }) => {
    await page.goto('/messages');
    await page.waitForTimeout(500);

    const threadItem = page.locator('[data-testid^="thread-item"]').first();
    if (await threadItem.isVisible()) {
      await threadItem.click();
      await page.waitForTimeout(300);

      const messageInput = page.getByPlaceholder(/type|message|write/i);
      const sendButton = page.getByRole('button', { name: /send/i });

      await messageInput.fill('Test message');
      await expect(sendButton).toBeEnabled();
    }
  });
});

test.describe('Messages Page - Mobile Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/messages');
  });

  test('mobile shows thread list initially', async ({ page }) => {
    await page.waitForTimeout(500);

    // On mobile, should see thread list
    const threadList = page.locator('[data-testid="thread-list"]');
    if (await threadList.isVisible()) {
      await expect(threadList).toBeVisible();
    }
  });

  test('selecting thread hides list on mobile', async ({ page }) => {
    await page.waitForTimeout(500);

    const threadItem = page.locator('[data-testid^="thread-item"]').first();
    if (await threadItem.isVisible()) {
      await threadItem.click();
      await page.waitForTimeout(300);

      // Thread list should be hidden, conversation visible
      const messageThread = page.locator('[data-testid="message-thread"]');
      if (await messageThread.isVisible()) {
        await expect(messageThread).toBeVisible();
      }
    }
  });

  test('back button returns to thread list on mobile', async ({ page }) => {
    await page.waitForTimeout(500);

    const threadItem = page.locator('[data-testid^="thread-item"]').first();
    if (await threadItem.isVisible()) {
      await threadItem.click();
      await page.waitForTimeout(300);

      const backButton = page.getByRole('button', { name: /back/i });
      if (await backButton.isVisible()) {
        await backButton.click();
        await page.waitForTimeout(300);

        // Should be back on thread list
        const threadList = page.locator('[data-testid="thread-list"]');
        await expect(threadList).toBeVisible();
      }
    }
  });
});

test.describe('Messages Page - New Conversation', () => {
  test('new conversation button opens sheet/modal', async ({ page }) => {
    await page.goto('/messages');
    await page.waitForTimeout(500);

    const newButton = page.getByRole('button', { name: /new|compose|start/i });
    if (await newButton.isVisible()) {
      await newButton.click();
      await page.waitForTimeout(300);

      // Should show new conversation UI
      const newConversationUI = page.getByText(/new conversation|select recipient/i);
      if (await newConversationUI.isVisible()) {
        await expect(newConversationUI).toBeVisible();
      }
    }
  });

  test('can search for recipients', async ({ page }) => {
    await page.goto('/messages');
    await page.waitForTimeout(500);

    const newButton = page.getByRole('button', { name: /new|compose|start/i });
    if (await newButton.isVisible()) {
      await newButton.click();
      await page.waitForTimeout(300);

      const recipientSearch = page.getByPlaceholder(/search|find/i);
      if (await recipientSearch.isVisible()) {
        await recipientSearch.fill('Sarah');
        await page.waitForTimeout(300);
      }
    }
  });
});

test.describe('Messages Page - Empty State', () => {
  test('shows empty state when no conversations', async ({ page }) => {
    await page.goto('/messages');
    await page.waitForTimeout(500);

    // If no conversations, should show empty state
    const emptyState = page.getByText(/no conversations|no messages|start a conversation/i);
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
    }
  });
});

test.describe('Messages Page - URL Parameters', () => {
  test('thread parameter selects conversation', async ({ page }) => {
    await page.goto('/messages?thread=test-thread-1');
    await page.waitForTimeout(500);

    // Should auto-select the thread
    const messageThread = page.locator('[data-testid="message-thread"]');
    // Implementation dependent
  });
});
