const fs = require('fs');
const htmlPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const target = '<img class="logo__image" src="https://us.fronteriors.co/cdn/shop/files/Fronteriors_email_confirmation.png?v=1682493627&width=360" alt="Fronteriors US" itemprop="logo" width="893" height="183" loading="eager" />';
const replacement = '<img class="logo__image" src="/assets/logo.png" alt="Ready Homes" itemprop="logo" style="width: 180px; height: auto; display: block;" loading="eager" />';

html = html.replace(target, replacement);

fs.writeFileSync(htmlPath, html);
console.log("Replaced logo.");
