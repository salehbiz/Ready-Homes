const fs = require('fs');
const originalHtml = fs.readFileSync('/Users/apple/.gemini/antigravity-ide/scratch/fronteriors.html', 'utf8');
const indexHtml = fs.readFileSync('/Users/apple/Documents/Projects/Ready Homes 2.0/index.html', 'utf8');

// Find the style block in original html (it starts with <style>@font-face)
const styleMatch = originalHtml.match(/<style>@font-face[\s\S]*?<\/style>/);
if (!styleMatch) {
  console.log("Could not find style block in original HTML");
  process.exit(1);
}

const newStyleBlock = styleMatch[0];

// Find the style block we inserted in index.html
const indexStyleMatch = indexHtml.match(/<style>\s*\/\* Ensure font overrides are clean \*\/[\s\S]*?<\/style>/);
if (!indexStyleMatch) {
  console.log("Could not find inserted style block in index HTML");
  process.exit(1);
}

const newIndexHtml = indexHtml.replace(indexStyleMatch[0], newStyleBlock);
fs.writeFileSync('/Users/apple/Documents/Projects/Ready Homes 2.0/index.html', newIndexHtml);
console.log("Successfully restored original CSS variables to index.html");
