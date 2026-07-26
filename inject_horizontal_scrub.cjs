const fs = require('fs');
const htmlPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const startMarker = '<div id="shopify-section-template--24392116044050__background_video_fnDfnQ" class="shopify-section section-background-video">';
const endMarker = '</div><div id="shopify-section-template--24392116044050__cross_page_promos_bCknXf" class="shopify-section">';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = '<div id="react-horizontal-scrub-root"></div>\n<script type="module" src="/src/horizontal-mount.tsx"></script>\n';
    
    html = html.substring(0, startIndex) + newContent + html.substring(endIndex);

    fs.writeFileSync(htmlPath, html);
    console.log("Successfully replaced video section with Horizontal Scrub React mount point.");
} else {
    console.log("Could not find the target block bounds.", startIndex, endIndex);
}
