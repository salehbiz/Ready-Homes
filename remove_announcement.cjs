const fs = require('fs');
const htmlPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// The announcement bar starts at `<div id="shopify-section-sections--24392109293842__announcement-bar"`
// and ends right before `<div id="shopify-section-sections--24392109293842__header"`

const startString = '<div id="shopify-section-sections--24392109293842__announcement-bar"';
const endString = '<div id="shopify-section-sections--24392109293842__header"';

const startIndex = html.indexOf(startString);
const endIndex = html.indexOf(endString, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const newHtml = html.substring(0, startIndex) + html.substring(endIndex);
    fs.writeFileSync(htmlPath, newHtml);
    console.log("Successfully removed the announcement bar.");
} else {
    console.log("Could not find the announcement bar bounds.");
}
