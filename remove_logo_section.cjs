const fs = require('fs');

const path = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(path, 'utf8');

const startStr = '<div id="shopify-section-template--24392116044050__5d3ab86b-77b5-40c9-8f6d-af9b1cabc4c1"';
const endStr = '<div id="shopify-section-template--24392116044050__163592870141219e2f"';

const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  html = html.substring(0, startIndex) + html.substring(endIndex);
  fs.writeFileSync(path, html);
  console.log("Removed the logo list section.");
} else {
  console.log("Could not find the logo list section.");
}
