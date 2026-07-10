const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:5183/love', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:\\Users\\sharm\\AppData\\Local\\Temp\\claude\\c--Users-sharm-OneDrive-Desktop-Astrologyn-frontend\\94efd242-39fd-4893-b4bf-8fda741f2915\\scratchpad\\love-full.png', fullPage: true });

  const el = await page.$('.place-autocomplete-wrapper');
  if (el) {
    await el.screenshot({ path: 'C:\\Users\\sharm\\AppData\\Local\\Temp\\claude\\c--Users-sharm-OneDrive-Desktop-Astrologyn-frontend\\94efd242-39fd-4893-b4bf-8fda741f2915\\scratchpad\\birthplace.png' });
    const info = await el.evaluate((node) => {
      const input = node.querySelector('input');
      const group = node.querySelector('.input-group');
      const groupText = node.querySelector('.input-group-text');
      const cs = window.getComputedStyle(input);
      const csGroup = window.getComputedStyle(group);
      const csIcon = window.getComputedStyle(groupText);
      return {
        inputBorderRadius: cs.borderRadius,
        inputBorder: cs.border,
        inputDisplay: cs.display,
        groupDisplay: csGroup.display,
        groupFlexWrap: csGroup.flexWrap,
        iconBorderRadius: csIcon.borderRadius,
        iconDisplay: csIcon.display,
        iconMarginRight: csIcon.marginRight,
        inputMarginLeft: cs.marginLeft,
      };
    });
    console.log(JSON.stringify(info, null, 2));
  } else {
    console.log('NOT FOUND');
  }

  await browser.close();
})();
