import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

    console.log('Navigating to development server...');
    await page.goto('http://localhost:3000/portal', { waitUntil: 'networkidle2' });

    console.log('Evaluating elements on the page...');
    const result = await page.evaluate(() => {
      const classes = [
        'max-w-xs',
        'max-w-sm',
        'max-w-md',
        'max-w-lg',
        'max-w-xl',
        'max-w-2xl',
        'max-w-3xl',
        'max-w-4xl',
        'max-w-5xl',
        'max-w-6xl',
        'max-w-7xl'
      ];

      const computedVals = {};
      classes.forEach(cls => {
        const div = document.createElement('div');
        div.className = cls;
        document.body.appendChild(div);
        const style = window.getComputedStyle(div);
        computedVals[cls] = style.maxWidth;
        document.body.removeChild(div);
      });

      const loginCard = document.querySelector('.max-w-md');
      let loginCardInfo = null;
      if (loginCard) {
        const style = window.getComputedStyle(loginCard);
        loginCardInfo = {
          maxWidth: style.maxWidth,
          width: style.width,
          parentWidth: loginCard.parentElement ? window.getComputedStyle(loginCard.parentElement).width : null,
          tagName: loginCard.tagName,
          className: loginCard.className
        };
      }

      const heading = document.querySelector('h2') || document.querySelector('h1');
      let headingInfo = null;
      if (heading) {
        const style = window.getComputedStyle(heading);
        headingInfo = {
          tagName: heading.tagName,
          text: heading.innerText,
          width: style.width,
          maxWidth: style.maxWidth,
          fontSize: style.fontSize
        };
      }

      return {
        computedVals,
        loginCardInfo,
        headingInfo
      };
    });

    console.log('\n--- COMPUTED MAX-WIDTH VALUES FOR ALL UTILITIES ---');
    console.log(JSON.stringify(result.computedVals, null, 2));

    console.log('\n--- ACTUAL PORTAL LOGIN CARD & PARENT ---');
    console.log(JSON.stringify(result.loginCardInfo, null, 2));

    console.log('\n--- PORTAL HEADING ---');
    console.log(JSON.stringify(result.headingInfo, null, 2));

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await browser.close();
  }
}

run();
