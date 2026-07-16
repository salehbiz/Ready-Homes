// scripts/convert-mobile-hero.mjs
import sharp from 'sharp';
import { readdir, unlink } from 'node:fs/promises';
import path from 'node:path';

const dir = 'public/frames/hero/mobile';
// Read all .webp files in public/frames/hero/mobile
const files = (await readdir(dir)).filter(f => f.endsWith('.webp') && !f.includes(' '));

for (const f of files) {
  const srcPath = path.join(dir, f);
  const destPath = path.join(dir, f.replace('.webp', '.avif'));
  
  // Convert original mobile hero webp to avif (maintain original aspect ratio and crop)
  await sharp(srcPath)
    .avif({ quality: 55, effort: 4 })
    .toFile(destPath);
  
  // Delete the source webp file
  await unlink(srcPath);
}

console.log('Mobile hero frames converted to AVIF successfully.');
