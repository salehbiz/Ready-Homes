const fs = require('fs');
const htmlPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const startMarker = '<div class="logo-area__right__inner">';
const endMarker = '</div>\n      </div>\n    </div><script src="/assets/js/main-search.js" defer></script>';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = `<div class="logo-area__right__inner" style="display: flex; align-items: center;">
          <a href="/contact" class="btn btn--primary" style="margin-left: 20px;">SCHEDULE A CALL</a>\n        `;
    
    const newHtml = html.substring(0, startIndex) + newContent + html.substring(endIndex);
    fs.writeFileSync(htmlPath, newHtml);
    console.log("Successfully replaced the header icons with a button.");
} else {
    console.log("Could not find the target block.");
}
