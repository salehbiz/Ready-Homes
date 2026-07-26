const fs = require('fs');

const path = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(path, 'utf8');

// Replace all caps
html = html.replace(/WHY FRONTERIORS/g, 'WHY READY HOMES');

// Replace standard casing
html = html.replace(/Fronteriors US/g, 'Ready Homes');
html = html.replace(/Fronteriors/g, 'Ready Homes');

// Replace the email
html = html.replace(/info@fronteriors\.co/g, 'info@readyhomes.com');

fs.writeFileSync(path, html);
console.log("Replaced brand name across HTML.");
