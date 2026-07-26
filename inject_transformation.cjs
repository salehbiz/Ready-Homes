const fs = require('fs');

const htmlPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const targetLine = '  </main><div id="pagefooter"><!-- BEGIN sections: footer-group -->';
const replacement = `  </main>
  <!-- React Transformation Island -->
  <div id="react-transformation-root"></div>
  <script type="module" src="/src/transformation-mount.tsx"></script>
  <div id="pagefooter"><!-- BEGIN sections: footer-group -->`;

if (html.includes(targetLine)) {
  html = html.replace(targetLine, replacement);
  fs.writeFileSync(htmlPath, html);
  console.log("Injected react-transformation-root into index.html");
} else {
  console.log("Could not find the target line to inject.");
}
