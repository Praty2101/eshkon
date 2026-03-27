import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'fs';

interface StoredA11yResult {
  name: string;
  url: string;
  violations: number;
  criticalViolations: number;
}

function appendA11yResult(result: StoredA11yResult) {
  const reportPath = 'a11y-report.json';
  const existing = fs.existsSync(reportPath)
    ? (JSON.parse(fs.readFileSync(reportPath, 'utf-8')) as StoredA11yResult[])
    : [];

  existing.push(result);
  fs.writeFileSync(reportPath, JSON.stringify(existing, null, 2));
}

test.describe('Smoke tests & Accessibility', () => {
  test.beforeAll(() => {
    if (fs.existsSync('a11y-report.json')) {
      fs.rmSync('a11y-report.json');
    }
  });

  test('preview page renders mock data and passes accessibility checks', async ({ page }) => {
    // Navigate to preview page for mock landing
    await page.goto('/preview/landing');
    
    // Smoke test: Hero renders
    await expect(page.locator('text=Build Beautiful Pages, Effortlessly')).toBeVisible();
    
    // Axe Accessibility Test (WCAG 2.2 AAA-oriented)
    const a11yResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    appendA11yResult({
      name: 'preview/landing',
      url: page.url(),
      violations: a11yResults.violations.length,
      criticalViolations: a11yResults.violations.filter(
        (violation) => violation.impact === 'critical'
      ).length,
    });

    expect(
      a11yResults.violations.filter((violation) => violation.impact === 'critical')
    ).toEqual([]);

    // Smoke CTA interaction test
    const cta = page.getByRole('link', { name: /Start Building/i });
    await expect(cta).toBeVisible();
    await Promise.all([
      page.waitForURL('**/get-started'),
      cta.click(),
    ]);
    await expect(
      page.getByRole('heading', {
        name: /Explore Page Studio before you need editor access/i,
      })
    ).toBeVisible();
  });

  test('studio editor layout is accessible', async ({ page }) => {
    // Navigate with editor cookie to bypass RBAC redirect
    await page.context().addCookies([
      { name: 'user-role', value: 'editor', domain: 'localhost', path: '/' }
    ]);
    
    await page.goto('/studio/landing');
    await expect(page.getByRole('heading', { name: 'Page Studio', exact: true })).toBeVisible();

    const a11yResults = await new AxeBuilder({ page }).analyze();

    appendA11yResult({
      name: 'studio/landing',
      url: page.url(),
      violations: a11yResults.violations.length,
      criticalViolations: a11yResults.violations.filter(
        (violation) => violation.impact === 'critical'
      ).length,
    });

    expect(
      a11yResults.violations.filter((violation) => violation.impact === 'critical')
    ).toEqual([]);
  });
});
