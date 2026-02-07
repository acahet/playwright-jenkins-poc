import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('navigation menu contains key sections', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Check that main navigation sections are present
  await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'API' })).toBeVisible();
});

test('search functionality is available', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Check search button exists
  const searchButton = page.getByRole('button', { name: /search/i }).first();
  await expect(searchButton).toBeVisible();
});

test('navigate to API documentation', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Navigate to API section
  await page.getByRole('link', { name: 'API' }).click();

  // Verify we're on the API page
  await expect(page).toHaveURL(/.*api.*/);
});

test('check GitHub link is present', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Look for GitHub link
  const githubLink = page.locator('a[href*="github.com"]').first();
  await expect(githubLink).toBeVisible();
});

test('footer contains community links', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Check for footer content
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();
});

test('docs page has sidebar navigation', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');

  // Check for sidebar with navigation
  const sidebar = page.locator('aside, nav.menu, [class*="sidebar"]').first();
  await expect(sidebar).toBeVisible();
});

// ========== FLAKY TESTS BELOW ==========
// These tests are intentionally flaky to demonstrate common flaky patterns

test('FLAKY: race condition with timing', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // This is flaky because it doesn't wait for the element properly
  // and depends on page load speed
  await page.waitForTimeout(100); // Bad practice: arbitrary timeout
  
  const heading = page.locator('h1').first();
  // Might fail if the page hasn't fully loaded
  expect(await heading.textContent()).toBeTruthy();
});

test('FLAKY: checking dynamic content without proper wait', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Navigate without waiting for navigation to complete
  page.getByRole('link', { name: 'Get started' }).click(); // Missing await
  
  // This might fail because the navigation hasn't completed
  await page.waitForTimeout(50); // Too short timeout
  await expect(page).toHaveURL(/.*intro/);
});

test('FLAKY: dependent on network speed', async ({ page }) => {
  // Set very short timeout
  page.setDefaultTimeout(500); // Very aggressive timeout
  
  await page.goto('https://playwright.dev/');

  // Might fail on slow networks
  await expect(page.locator('body')).toBeVisible();
});

test('FLAKY: checking count of elements that might vary', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Element counts might vary based on page state or A/B testing
  const links = page.locator('a');
  const count = await links.count();
  
  // This exact number might change
  expect(count).toBe(42); // Hardcoded expectation
});

test('FLAKY: timestamp-based assertion', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  const now = Date.now();
  
  // Do some action
  await page.getByRole('link', { name: 'Docs' }).click();
  
  const elapsed = Date.now() - now;
  
  // This is flaky because network/system performance varies
  expect(elapsed).toBeLessThan(100); // Might fail on slower systems
});

test('FLAKY: checking text that might have whitespace variations', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  const heading = page.locator('h1').first();
  const text = await heading.textContent();
  
  // Exact match might fail due to whitespace, special characters, etc.
  expect(text).toBe('Playwright'); // Might have extra spaces or line breaks
});
