const fs = require('fs');
const htmlPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace the header style
const oldStyle = 'style="position: sticky; top: 0; z-index: 9999; background: white;"';
const newStyle = 'style="position: fixed; top: 0; width: 100%; z-index: 9999; background-color: transparent; transition: background-color 0.3s ease;"';
html = html.replace(oldStyle, newStyle);

// Add the scroll script just before closing </body>
const script = `
<script>
  window.addEventListener('scroll', function() {
    var header = document.getElementById('shopify-section-sections--24392109293842__header');
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'white';
    } else {
      header.style.backgroundColor = 'transparent';
    }
  });
</script>
</body>`;

html = html.replace('</body>', script);

fs.writeFileSync(htmlPath, html);
console.log("Applied transparent-to-white scroll effect to header.");
