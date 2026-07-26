const fs = require('fs');
const htmlPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Make the header sticky
const headerTarget = '<div id="shopify-section-sections--24392109293842__header" class="shopify-section shopify-section-group-header-group section-header">';
const headerReplacement = '<div id="shopify-section-sections--24392109293842__header" class="shopify-section shopify-section-group-header-group section-header" style="position: sticky; top: 0; z-index: 9999; background: white;">';
html = html.replace(headerTarget, headerReplacement);

// 2. Make the button white (btn--secondary instead of btn--primary)
const btnTarget = '<a href="/contact" class="btn btn--primary" style="margin-left: 20px;">SCHEDULE A CALL</a>';
const btnReplacement = '<a href="/contact" class="btn btn--secondary" style="margin-left: 20px;">SCHEDULE A CALL</a>';
html = html.replace(btnTarget, btnReplacement);

fs.writeFileSync(htmlPath, html);
console.log("Applied sticky header and updated button class.");
