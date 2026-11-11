// Renders tools/captures/og.html to public/og.png, the 1200x630 link preview image.
const { chromium } = require('playwright-core');
const path = require('node:path');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file://' + path.resolve(__dirname, 'captures/og.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.resolve(__dirname, '../public/og.png') });
  await b.close();
})();
