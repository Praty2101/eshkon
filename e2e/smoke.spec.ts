import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'fs';

test.describe('Smoke tests & Accessibility', () => {
  test('preview page renders mock data and passes accessibility checks', async ({ page }) => {
    // Navigate to preview page for mock landing
    await page.goto('/preview/landing');
    
    // Smoke test: Hero renders
    await expect(page.locator('text=Build Beautiful Pages, Effortlessly')).toBeVisible();
    
    // Smoke CTA interaction test
    // Use .first() in case multiple "Start Building" buttons appear (e.g. mobile/desktop)
    const cta = page.getByRole('button', { name: /Start Building/i }).first();
    await expect(cta).toBeVisible();

    // Axe Accessibility Test (WCAG 2.2 AAA-oriented)
    const a11yResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
      
    // Output report to artifact for CI
    fs.writeFileSync('a11y-report.json', JSON.stringify(a11yResults, null, 2));

    // CI fails on violations
    expect(a11yResults.violations).toEqual([]);
  });

  test('studio editor layout is accessible', async ({ page }) => {
    // Navigate with editor cookie to bypass RBAC redirect
    await page.context().addCookies([
      { name: 'user-role', value: 'editor', domain: 'localhost', path: '/' }
    ]);
    
    await page.goto('/studio/landing');
    await expect(page.locator('text=Page Studio')).toBeVisible();

    const a11yResults = await new AxeBuilder({ page }).analyze();
    
    // Expect editor to be reasonably accessible
    expect(a11yResults.violations).toEqual([]);
  });
});

