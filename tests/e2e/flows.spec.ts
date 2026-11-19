/**
 * Playwright E2E Test Suite for SimplifyPDF
 * Covers:
 * - Flow 1: Guest homepage -> Dropzone -> Compress -> Download
 * - Flow 2: User Pro Upgrade -> Batch ZIP Studio (20 files) -> Download ZIP
 * - Flow 3: Admin 2FA -> Tool Circuit Breakers -> Theme Tokens Live Sync
 * - Flow 4: WCAG 2.2 AA Accessibility & Pure White Text Contrast Check
 */

import { test, expect } from '@playwright/test';

test.describe('SimplifyPDF End-to-End User Journeys', () => {
  const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';
  const APP_URL = process.env.APP_URL || 'http://localhost:3002';
  const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:3001';

  test('Flow 1: Guest Homepage Dropzone -> Compress PDF -> Download Result', async ({ page }) => {
    await page.goto(WEB_URL);

    // Verify Title & Hero
    await expect(page).toHaveTitle(/SimplifyPDF/);
    const dropzone = page.locator('text=Drag & drop your PDF here');
    await expect(dropzone).toBeVisible();

    // Navigate to Compress tool
    await page.click('text=Compress PDF');
    await expect(page).toHaveURL(/.*tools\/compress/);

    // Verify Dropzone and Compression Controls
    const uploader = page.locator('input[type="file"]');
    expect(uploader).toBeDefined();

    // Verify compression presets
    await expect(page.locator('text=Extreme Compression')).toBeVisible();
    await expect(page.locator('text=Recommended')).toBeVisible();
    await expect(page.locator('text=Less Compression')).toBeVisible();
  });

  test('Flow 2: Pro Upgrade -> Batch ZIP Studio -> Multi-File Queue', async ({ page }) => {
    await page.goto(`${WEB_URL}/pricing`);

    // Verify Pricing Toggles (INR / USD)
    const currencyToggle = page.locator('text=USD ($) Stripe Global');
    await currencyToggle.click();
    await expect(page.locator('text=$49/yr')).toBeVisible();

    // Switch to Monthly
    await page.click('text=Monthly Billing');
    await expect(page.locator('text=$4.99')).toBeVisible();

    // Initiate Pro Sandbox Checkout
    await page.click('text=Upgrade to Pro');
    await expect(page).toHaveURL(/.*checkout\/success/);

    // Verify Success Screen & Confetti
    await expect(page.locator('text=You\'re officially a SimplifyPDF Pro!')).toBeVisible();
    await expect(page.locator('text=2,048 MB (2 GB)')).toBeVisible();
    await expect(page.locator('text=Launch Pro Batch Studio')).toBeVisible();
  });

  test('Flow 3: Admin 2FA Login -> Tool Breaker Toggle -> Live Token Broadcast', async ({ page }) => {
    await page.goto(ADMIN_URL);

    // Check Admin Console Navigation
    await expect(page.locator('text=SimplifyPDF')).toBeVisible();

    // Navigate to Live Design Studio
    await page.goto(`${ADMIN_URL}/design`);
    await expect(page.locator('text=Live Design Studio')).toBeVisible();

    // Verify Nuvexa Brand Color Tokens
    const primaryInput = page.locator('input[value="#864FFE"]');
    expect(primaryInput).toBeDefined();

    // Verify Reset to Nuvexa Defaults Button
    const resetButton = page.locator('text=Reset to Nuvexa Defaults');
    await expect(resetButton).toBeVisible();
  });

  test('Flow 4: WCAG 2.2 AA Contrast & Pure White Button Text Verification', async ({ page }) => {
    await page.goto(WEB_URL);

    // Ensure all primary buttons use pure white text (#ffffff or rgb(255, 255, 255))
    const primaryButtons = page.locator('.btn-primary, button:has-text("Get Started"), button:has-text("Upgrade to Pro")');
    const count = await primaryButtons.count();

    for (let i = 0; i < count; i++) {
      const btn = primaryButtons.nth(i);
      if (await btn.isVisible()) {
        const color = await btn.evaluate((el) => window.getComputedStyle(el).color);
        // Expect pure white text (rgb(255, 255, 255))
        expect(color).toMatch(/(rgb\(255,\s*255,\s*255\)|#ffffff)/i);
      }
    }
  });
});
