const fs = require('fs');

const htmlPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const newNavContent = `
  <li class="navigation__item"><a href="/" class="navigation__link">HOME</a></li>
  <li class="navigation__item"><a href="/about" class="navigation__link">ABOUT</a></li>
  <li class="navigation__item"><a href="/gallery" class="navigation__link">GALLERY</a></li>
  <li class="navigation__item"><a href="/amenities" class="navigation__link">AMENITIES</a></li>
  <li class="navigation__item"><a href="/contact" class="navigation__link">CONTACT</a></li>
`;

// There are multiple navigation__tier-1 lists (desktop and mobile/proxy).
// Since parsing HTML with nested tags using regex is brittle, we'll find the exact start and end indices by counting <ul> and </ul> tags.

function replaceTier1(htmlStr) {
    let result = htmlStr;
    let searchIdx = 0;
    while (true) {
        const startMarker = '<ul class="navigation__tier-1">';
        const startIdx = result.indexOf(startMarker, searchIdx);
        if (startIdx === -1) break;

        const contentStartIdx = startIdx + startMarker.length;
        
        let depth = 1;
        let currentIdx = contentStartIdx;
        
        while (depth > 0 && currentIdx < result.length) {
            const nextUl = result.indexOf('<ul', currentIdx);
            const nextEndUl = result.indexOf('</ul>', currentIdx);
            
            if (nextEndUl === -1) break; // error
            
            if (nextUl !== -1 && nextUl < nextEndUl) {
                depth++;
                currentIdx = nextUl + 3;
            } else {
                depth--;
                currentIdx = nextEndUl + 5;
            }
        }
        
        const contentEndIdx = currentIdx - 5; // right before </ul>
        
        result = result.substring(0, contentStartIdx) + newNavContent + result.substring(contentEndIdx);
        searchIdx = startIdx + startMarker.length + newNavContent.length + 5;
    }
    return result;
}

const newHtml = replaceTier1(html);

if (newHtml !== html) {
    fs.writeFileSync(htmlPath, newHtml);
    console.log("Successfully replaced navigation links!");
} else {
    console.log("Failed to find navigation links to replace.");
}
