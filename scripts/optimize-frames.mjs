// scripts/optimize-frames.mjs
import sharp from 'sharp';
import { readdir, unlink, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const F = 'public/frames';
const SEQS = ['hero', 'transformation', 'section3'];
const webps = async d => existsSync(d) ? (await readdir(d)).filter(f => f.endsWith('.webp')) : [];

// 1. FIX MOBILE HERO BUG: generate the missing hero/mobile AVIF frames.
//    Source = hero/desktop-hq webp (2560x1440), center-cropped to 9:16 portrait.
{
  const src = path.join(F, 'hero/desktop-hq');
  const out = path.join(F, 'hero/mobile');
  await mkdir(out, { recursive: true });
  for (const f of await webps(src)) {
    await sharp(path.join(src, f))
      .resize(540, 960, { fit: 'cover', position: 'centre' })
      .avif({ quality: 55, effort: 4 })
      .toFile(path.join(out, f.replace('.webp', '.avif')));
  }
  console.log('hero/mobile avif generated');
}

// 2. RIGHT-SIZE hero/desktop (WebP fallback tier) from 2560 -> 1920 in place.
{
  const dir = path.join(F, 'hero/desktop');
  for (const f of await webps(dir)) {
    const p = path.join(dir, f);
    const buf = await sharp(p).resize(1920, 1080, { fit: 'cover' })
      .webp({ quality: 80, effort: 6 }).toBuffer();
    await writeFile(p, buf);
  }
  console.log('hero/desktop downscaled to 1920 webp');
}

// 3. AVIF the primary desktop-hq tier for ALL sequences (keep resolution),
//    then delete the replaced webp. desktop-hq keeps 2560 for retina sharpness.
for (const seq of SEQS) {
  const dir = path.join(F, seq, 'desktop-hq');
  for (const f of await webps(dir)) {
    const p = path.join(dir, f);
    await sharp(p).avif({ quality: 58, effort: 4 }).toFile(p.replace('.webp', '.avif'));
    await unlink(p);
  }
  console.log(`${seq}/desktop-hq -> avif`);
}

// 4. DELETE DEAD FRAMES (unreferenced by any tier path):
//    a) numbered *.webp sitting directly in each seq root (NOT subdirs, NOT posters)
for (const seq of SEQS) {
  for (const f of await webps(path.join(F, seq))) await unlink(path.join(F, seq, f));
}
//    b) the unused webp siblings in section3/mobile (mobile only ever loads .avif)
{
  const m = path.join(F, 'section3/mobile');
  for (const f of await webps(m)) await unlink(path.join(m, f));
}
console.log('dead frames removed');
