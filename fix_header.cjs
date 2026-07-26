const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Change transparent header text color to #ffffff so menu is visible on dark background
html = html.replace('--transparent-header-text-color: #000000;', '--transparent-header-text-color: #ffffff;');

// 2. Add margin-right to the schedule call button on mobile
const oldCss = `    .schedule-call-btn {
      font-size: 8px !important;
      padding: 5px 8px !important;
      margin-left: 10px !important;
      min-width: unset;
      min-height: unset;
      letter-spacing: 0.05em;
    }`;

const newCss = `    .schedule-call-btn {
      font-size: 8px !important;
      padding: 5px 8px !important;
      margin-left: 10px !important;
      margin-right: 16px !important;
      min-width: unset;
      min-height: unset;
      letter-spacing: 0.05em;
    }`;

html = html.replace(oldCss, newCss);

// Also add margin-right to desktop schedule call button if needed, but the user complained about mobile. Let's add it to the inline style as well just in case.
// <a href="/contact" class="btn btn--secondary btn--compact schedule-call-btn" style="margin-left: 20px;">SCHEDULE A CALL</a>
html = html.replace('<a href="/contact" class="btn btn--secondary btn--compact schedule-call-btn" style="margin-left: 20px;">SCHEDULE A CALL</a>', '<a href="/contact" class="btn btn--secondary btn--compact schedule-call-btn" style="margin-left: 20px; margin-right: 15px;">SCHEDULE A CALL</a>');

// And let's make sure .mobile-nav-toggle svg color is #ffffff if the variable trick doesn't work.
const oldMobileNavSvg = `    .mobile-nav-toggle svg {
      width: 28px;
      height: 28px;
      stroke: currentColor;
    }`;

const newMobileNavSvg = `    .mobile-nav-toggle svg {
      width: 28px;
      height: 28px;
      stroke: currentColor;
    }
    .pageheader--transparent .mobile-nav-toggle svg {
      stroke: #ffffff !important;
    }`;

html = html.replace(oldMobileNavSvg, newMobileNavSvg);

// And we need to make sure the mobile menu container has some padding left too if it's touching the edge.
const mobileMenuCssOld = `    .mobile-nav-toggle {
      display: flex !important;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }`;

const mobileMenuCssNew = `    .mobile-nav-toggle {
      display: flex !important;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      padding: 0;
      padding-left: 16px;
      cursor: pointer;
    }`;

html = html.replace(mobileMenuCssOld, mobileMenuCssNew);


fs.writeFileSync('index.html', html);
console.log('Fixed header');
