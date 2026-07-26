const fs = require('fs');
const htmlPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const startMarker = '<div id="shopify-section-template--24392116044050__slideshow_6J6yMT" class="shopify-section section-slideshow">';
// We know from previous grep that the closing of the section-slideshow is exactly this line:
const endMarker = '          </div></div></slide-show></div>';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const endOfEndMarker = endIndex + endMarker.length;
    
    const newContent = '<div id="react-hero-root"></div>\n';
    html = html.substring(0, startIndex) + newContent + html.substring(endOfEndMarker);
    
    // Inject the module script before the end of the body or head
    // We'll put it right after the react-hero-root
    html = html.replace('<div id="react-hero-root"></div>', '<div id="react-hero-root"></div>\n<script type="module" src="/src/hero-mount.tsx"></script>');

    fs.writeFileSync(htmlPath, html);
    console.log("Successfully replaced hero section with React mount point.");
} else {
    console.log("Could not find the target block bounds.", startIndex, endIndex);
}
