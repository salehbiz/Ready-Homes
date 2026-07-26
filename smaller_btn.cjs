const fs = require('fs');
const htmlPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const btnTarget = '<a href="/contact" class="btn btn--secondary" style="margin-left: 20px;">SCHEDULE A CALL</a>';
// Try adding btn--compact, and also reducing font-size slightly just in case btn--compact only changes padding.
const btnReplacement = '<a href="/contact" class="btn btn--secondary btn--compact" style="margin-left: 20px; font-size: 11px; padding: 10px 16px;">SCHEDULE A CALL</a>';
html = html.replace(btnTarget, btnReplacement);

fs.writeFileSync(htmlPath, html);
console.log("Made the schedule a call button smaller.");
