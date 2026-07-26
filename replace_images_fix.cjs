const fs = require('fs');

const path = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(path, 'utf8');

const images = [
  '/tour/tour_outdoor_sitting.webp',
  '/tour/tour_outdoor_kitchen.webp',
  '/tour/tour_pool.webp',
  '/tour/tour_community.webp',
  '/tour/house_address.webp',
  '/tour/tour_bedrooms.webp',
  '/tour/tour_area.webp',
  '/tour/tour_kitchen.webp',
  '/tour/house_aerial.webp',
  '/tour/tour_sauna.webp',
  '/portfolio/service_packaging.webp',
  '/portfolio/work4.webp',
  '/portfolio/work3.webp',
  '/portfolio/work2.webp',
  '/portfolio/work1.webp',
  '/portfolio/service_branding.webp',
  '/portfolio/service_illustration.webp',
  '/portfolio/service_marketing.webp',
  '/featured/featured_sauna.webp',
  '/featured/featured_bedroom.webp',
  '/featured/featured_kitchen.webp',
  '/featured/featured_living.webp',
  '/services/service3.webp',
  '/services/contact.webp',
  '/services/service2.webp',
  '/services/service4.webp',
  '/services/service1.webp'
];

let i = 0;
function getNextImage() {
  const img = images[i % images.length];
  i++;
  return img;
}

// 1. Remove ANY srcset attribute (srcset, data-srcset, data-manual-srcset, etc)
const srcsetRegex = new RegExp('\\\\s[a-z0-9-]*srcset="[^"]*"', 'g');
html = html.replace(srcsetRegex, '');

// 2. Remove ANY sizes attribute
const sizesRegex = new RegExp('\\\\s[a-z0-9-]*sizes="[^"]*"', 'g');
html = html.replace(sizesRegex, '');

// 3. Replace ANY src attribute containing us.fronteriors.co/cdn/shop
const srcRegex = new RegExp('\\\\s([a-z0-9-]*src)="[^"]*us\\\\.fronteriors\\\\.co/cdn/shop/[^"]*"', 'g');
html = html.replace(srcRegex, function(match, attrName) {
  return ' ' + attrName + '="' + getNextImage() + '"';
});

fs.writeFileSync(path, html);
console.log("Replaced missed Fronteriors images with Ready Homes images.");
