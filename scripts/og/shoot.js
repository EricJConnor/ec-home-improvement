const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file://' + __dirname + '/og.html'); await p.waitForTimeout(400);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: __dirname + '/../../public/og.jpg', type: 'jpeg', quality: 84 });
  await b.close();
})();
