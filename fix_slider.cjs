const fs = require('fs');

const htmlPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// The segment bar has 4 segments. We want to remove the last one.
// The pattern looks like:
//   <div class="segment-bar" role="presentation">
//     ... segments ...
//   </div>
// We can use a regex to match the segment-bar and its 4 children, replacing it with 3 children.

let occurrences = 0;
html = html.replace(/<div class="segment-bar" role="presentation">\s*(<div class="segment-bar__segment[^>]*><\/div>)\s*(<div class="segment-bar__segment[^>]*><\/div>)\s*(<div class="segment-bar__segment[^>]*><\/div>)\s*(<div class="segment-bar__segment[^>]*><\/div>)\s*<\/div>/g, (match, s1, s2, s3, s4) => {
    occurrences++;
    return `<div class="segment-bar" role="presentation">\n      ${s1}\n      ${s2}\n      ${s3}\n    </div>`;
});

console.log(`Replaced ${occurrences} occurrences.`);
fs.writeFileSync(htmlPath, html);
