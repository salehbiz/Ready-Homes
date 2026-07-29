import fs from 'fs';
import path from 'path';

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function downloadFont(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download font: ${res.statusText}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
}

async function fetchFontCss(family, weights) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weights.join(';')}&display=swap`;
  const res = await fetch(url, { headers: { 'User-Agent': userAgent } });
  if (!res.ok) throw new Error(`Failed to fetch Google Fonts CSS: ${res.statusText}`);
  return await res.text();
}

function parseCss(css) {
  // Extract latin subset woff2 URLs from Google Fonts response
  const regex = /\/\*\s*latin\s*\*\/[\s\S]*?@font-face\s*\{([\s\S]*?)\}/g;
  const matches = [];
  let match;
  while ((match = regex.exec(css)) !== null) {
    const block = match[1];
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    const urlMatch = block.match(/url\((https:\/\/fonts\.gstatic\.com\/.*?\.woff2)\)/);
    if (weightMatch && urlMatch) {
      matches.push({
        weight: parseInt(weightMatch[1], 10),
        url: urlMatch[1]
      });
    }
  }
  return matches;
}

async function main() {
  const fontsDir = path.resolve('public/fonts');
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
  }

  // 1. Download Poppins
  console.log('Fetching Poppins CSS from Google Fonts...');
  const poppinsCss = await fetchFontCss('Poppins', [400, 500, 600]);
  const poppinsFonts = parseCss(poppinsCss);
  
  if (poppinsFonts.length === 0) {
    console.warn('Could not parse Poppins latin subsets. Saving raw CSS to debug:', poppinsCss);
  }

  for (const font of poppinsFonts) {
    const dest = path.join(fontsDir, `poppins-n${font.weight === 400 ? '4' : font.weight === 500 ? '5' : '6'}.woff2`);
    console.log(`Downloading Poppins ${font.weight} -> ${dest} from ${font.url}...`);
    await downloadFont(font.url, dest);
  }

  // 2. Download Trirong
  console.log('Fetching Trirong CSS from Google Fonts...');
  const trirongCss = await fetchFontCss('Trirong', [700]);
  const trirongFonts = parseCss(trirongCss);
  
  if (trirongFonts.length === 0) {
    console.warn('Could not parse Trirong latin subsets. Saving raw CSS to debug:', trirongCss);
  }

  for (const font of trirongFonts) {
    const dest = path.join(fontsDir, `trirong-n7.woff2`);
    console.log(`Downloading Trirong ${font.weight} -> ${dest} from ${font.url}...`);
    await downloadFont(font.url, dest);
  }
  
  console.log('All fonts downloaded and saved successfully to public/fonts/');
}

main().catch(console.error);
