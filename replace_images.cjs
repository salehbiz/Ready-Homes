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

// 1. Remove all srcset and data-srcset attributes completely
html = html.replace(/\\s(data-)?srcset="[^"]*"/g, '');

// 2. Remove all sizes attributes
html = html.replace(/\\ssizes="[^"]*"/g, '');

// 3. Replace all src attributes that point to cdn/shop with our new images
const srcRegex = new RegExp('\\\\s(data-)?src="[^"]*cdn/shop/[^"]*"', 'g');
html = html.replace(srcRegex, function(match, p1) {
  const attr = p1 ? 'data-src' : 'src';
  return ' ' + attr + '="' + getNextImage() + '"';
});

// 4. Replace CSS urls
// url(https://us.fronteriors.co/cdn/shop/...)
const urlRegex = new RegExp('url\\\\([^)]+cdn/shop/[^)]+\\\\)', 'g');
html = html.replace(urlRegex, function(match) {
  return 'url(' + getNextImage() + ')';
});

fs.writeFileSync(path, html);
console.log("Replaced all Fronteriors images with Ready Homes images.");
