import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Let's compare original WebP and new AVIF for the 3 darkest frames of each sequence
const originalBase = './tmp-original-frames/public/frames';
const newBase = './public/frames-new';

const checks = [
  { seq: 'hero', tier: 'desktop-hq', file: '0096' },
  { seq: 'hero', tier: 'desktop-hq', file: '0097' },
  { seq: 'hero', tier: 'desktop-hq', file: '0098' },
  { seq: 'section3', tier: 'desktop-hq', file: '0106' },
  { seq: 'section3', tier: 'desktop-hq', file: '0110' },
  { seq: 'section3', tier: 'desktop-hq', file: '0111' },
  { seq: 'transformation', tier: 'desktop-hq', file: '0003' },
  { seq: 'transformation', tier: 'desktop-hq', file: '0004' },
  { seq: 'transformation', tier: 'desktop-hq', file: '0005' }
];

async function calculatePSNR(origPath, newPath) {
  // Load raw pixels
  const { data: origData, info: origInfo } = await sharp(origPath).raw().toBuffer({ resolveWithObject: true });
  const { data: newData, info: newInfo } = await sharp(newPath).raw().toBuffer({ resolveWithObject: true });

  if (origInfo.width !== newInfo.width || origInfo.height !== newInfo.height) {
    throw new Error(`Dimension mismatch: ${origInfo.width}x${origInfo.height} vs ${newInfo.width}x${newInfo.height}`);
  }

  let mse = 0;
  const len = origInfo.width * origInfo.height * 3; // R, G, B channels
  const origChannels = origInfo.channels;
  const newChannels = newInfo.channels;

  let origIdx = 0;
  let newIdx = 0;

  for (let i = 0; i < origInfo.width * origInfo.height; i++) {
    // Read RGB channel differences
    const rDiff = origData[origIdx] - newData[newIdx];
    const gDiff = origData[origIdx + 1] - newData[newIdx + 1];
    const bDiff = origData[origIdx + 2] - newData[newIdx + 2];

    mse += (rDiff * rDiff + gDiff * gDiff + bDiff * bDiff) / 3;

    origIdx += origChannels;
    newIdx += newChannels;
  }

  mse = mse / (origInfo.width * origInfo.height);

  if (mse === 0) return Infinity;

  const maxVal = 255;
  const psnr = 20 * Math.log10(maxVal / Math.sqrt(mse));
  return psnr;
}

async function run() {
  console.log('Calculating Peak Signal-to-Noise Ratio (PSNR) for the darkest frames...');
  console.log('Target: PSNR > 35 dB (visually indistinguishable)');
  console.log('--------------------------------------------------');

  for (const c of checks) {
    const origPath = path.join(originalBase, c.seq, c.tier, `${c.file}.webp`);
    const newPath = path.join(newBase, c.seq, c.tier, `${c.file}.avif`);

    if (!fs.existsSync(origPath) || !fs.existsSync(newPath)) {
      console.log(`Skipping ${c.seq}/${c.file} (file missing)`);
      continue;
    }

    const psnr = await calculatePSNR(origPath, newPath);
    console.log(`${c.seq}/${c.tier}/${c.file}: PSNR = ${psnr.toFixed(2)} dB - ${psnr >= 35 ? 'PASS' : 'WARNING (Low PSNR)'}`);
  }
}

run().catch(console.error);
