# Integration Tests (tests/hooks/)

## Overview

This directory contains **Playwright integration tests** that verify the app works correctly with mock authentication and data. These tests cover:

- **useUser** - Authentication, page access, user data display
- **useTrackers** - Clinical, Shadow Days, EQ trackers
- **useEvents** - Events page, filtering, saving events
- **useBookings** - Marketplace, provider profiles, booking flow
- **usePrograms** - School database, saved/target programs, checklists

## Quick Commands

```bash
# Run all integration tests (~2 min)
npx playwright test tests/hooks/ --reporter=list

# Quick smoke test (shows dots)
npx playwright test tests/hooks/ --reporter=dot

# Run specific test file
npx playwright test tests/hooks/useTrackers.spec.cjs --reporter=list

# Debug with visible browser
npx playwright test tests/hooks/useTrackers.spec.cjs --headed

# Run single test by name
npx playwright test tests/hooks/ -g "clinical tracker" --headed
```

## How Tests Work

### Mock Authentication

The `playwright.config.js` disables Supabase during tests:

```javascript
webServer: {
  env: {
    VITE_SUPABASE_URL: '',
    VITE_SUPABASE_ANON_KEY: '',
  }
}
```

This causes `useAuth.jsx` to use a mock user (defined around line 12-20), allowing tests to access protected routes without real authentication.

### Mock Data

When Supabase is disabled, all hooks fall back to mock data from `/src/data/` files:
- `mockUser.js` - User profile, academic/clinical data
- `mockEvents.js` - CRNA events
- `mockProviders.js` - Marketplace mentors
- `schools.js` - School database

## Test Files

| File | Tests | Coverage |
|------|-------|----------|
| `useUser.spec.cjs` | 30 | Login/register pages, protected page access, responsive layouts |
| `useTrackers.spec.cjs` | 36 | Clinical/Shadow/EQ trackers, forms, delete confirmations |
| `useEvents.spec.cjs` | ~35 | Events page, filters, view modes, save/unsave, modals |
| `useBookings.spec.cjs` | 34 | Marketplace, provider profiles, booking flow, cancellation |
| `usePrograms.spec.cjs` | ~11 | School database, save schools, target programs, checklists |

## When to Run Tests

**Run after:**
- UI component changes (button, card, input, etc.)
- Layout changes (sidebar, header, page-wrapper)
- Page component updates
- Hook modifications
- CSS/styling changes

**Expected result:** All tests pass. If tests fail after UI changes, either:
1. The UI change broke functionality (bug to fix)
2. Test selectors need updating (update tests)

## Troubleshooting

### Tests redirect to /login unexpectedly

**Cause:** `.env.local` has Supabase credentials and dev server cached them.

**Fix:**
```bash
# Stop dev server (Ctrl+C), then:
mv .env.local .env.local.backup
npm run dev  # Restart without Supabase
npx playwright test tests/hooks/
mv .env.local.backup .env.local  # Restore after
```

### Element not found / timeout errors

**Cause:** UI selectors don't match current component structure.

**Fix:** Run with `--headed` to see what's actually rendered:
```bash
npx playwright test tests/hooks/useTrackers.spec.cjs --headed -g "clinical"
```

Then update selectors in the test file to match current UI.

### Tests pass locally but fail in CI

**Cause:** Timing issues - CI machines may be slower.

**Fix:** Increase timeouts or add explicit waits:
```javascript
await page.waitForSelector('.school-card', { timeout: 10000 });
```

## Updating Tests After UI Changes

When you change UI components and tests fail:

1. **Identify the selector that broke:**
   ```bash
   npx playwright test tests/hooks/ --reporter=list 2>&1 | grep "Error:"
   ```

2. **Check actual UI:** Run with `--headed` or inspect the component file

3. **Update the selector** in the test file to match new UI

4. **Re-run to verify:** `npx playwright test tests/hooks/`

### Common Selector Patterns

```javascript
// By role (preferred)
page.getByRole('button', { name: /save/i })
page.getByRole('heading', { name: 'Events' })

// By text
page.getByText('Log Shift')
page.getByText(/clinical.*tracker/i)

// By placeholder
page.getByPlaceholder(/search/i)

// By test ID (if added to components)
page.getByTestId('clinical-tracker')

// By CSS class (last resort)
page.locator('.school-card')
page.locator('[class*="lucide-bookmark"]')
```

## File Structure

```
tests/hooks/
├── README.md              # This file
├── useUser.spec.cjs       # Auth & user data tests
├── useTrackers.spec.cjs   # Tracker page tests
├── useEvents.spec.cjs     # Events page tests
├── useBookings.spec.cjs   # Marketplace & booking tests
├── usePrograms.spec.cjs   # Schools & programs tests
├── debug-dashboard.spec.cjs  # Debug helper
└── debug-events.spec.cjs     # Debug helper
```

## Adding New Tests

1. Create `tests/hooks/useNewFeature.spec.cjs`
2. Follow existing patterns for setup/teardown
3. Use resilient selectors (roles > text > CSS)
4. Add appropriate waits for async content
5. Update this README with new test coverage
