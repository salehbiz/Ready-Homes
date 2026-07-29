import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function compress(src, dest, quality) {
  const originalSize = fs.statSync(src).size;
  await sharp(src)
    .webp({ quality, effort: 6 })
    .toFile(dest);
  const newSize = fs.statSync(dest).size;
  console.log(`Compressed ${src} -> ${dest} (Quality: ${quality})`);
  console.log(`  Size: ${(originalSize / 1024).toFixed(2)} KB -> ${(newSize / 1024).toFixed(2)} KB`);
}

async function main() {
  const posterPath = path.resolve('public/frames/hero-poster.webp');
  const tempPosterPath = path.resolve('public/frames/hero-poster-temp.webp');
  const mobilePosterPath = path.resolve('public/frames/hero-poster-mobile.webp');
  const tempMobilePosterPath = path.resolve('public/frames/hero-poster-mobile-temp.webp');

  if (fs.existsSync(posterPath)) {
    await compress(posterPath, tempPosterPath, 70);
    fs.renameSync(tempPosterPath, posterPath);
  } else {
    console.error(`Poster not found: ${posterPath}`);
  }

  if (fs.existsSync(mobilePosterPath)) {
    await compress(mobilePosterPath, tempMobilePosterPath, 65);
    fs.renameSync(tempMobilePosterPath, mobilePosterPath);
  } else {
    console.error(`Mobile poster not found: ${mobilePosterPath}`);
  }
}

main().catch(console.error);
