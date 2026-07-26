const fs = require('fs');
const path = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Remove the previously injected transformation root at the bottom
const bottomInjection = `  <!-- React Transformation Island -->
  <div id="react-transformation-root"></div>
  <script type="module" src="/src/transformation-mount.tsx"></script>`;
if (html.includes(bottomInjection)) {
  html = html.replace(bottomInjection, '');
}

// 2. Find the hardcoded background video section and replace it
const startString = `<div id="shopify-section-template--24392116044050__background_video_MXgYqJ"`;
const endString = `</div><div id="shopify-section-template--24392116044050__5d3ab86b-77b5-40c9-8f6d-af9b1cabc4c1"`;

const startIndex = html.indexOf(startString);
const endIndex = html.indexOf(endString);

if (startIndex !== -1 && endIndex !== -1) {
  const before = html.substring(0, startIndex);
  const after = html.substring(endIndex);
  
  const replacement = `
  <!-- React Transformation Island -->
  <div id="react-transformation-root"></div>
  <script type="module" src="/src/transformation-mount.tsx"></script>
  `;
  
  html = before + replacement + after;
  fs.writeFileSync(path, html);
  console.log("Replaced the hardcoded 'Jewelry for Cabinets' video section with the React Transformation Island!");
} else {
  console.log("Could not find the hardcoded section bounds.");
}
