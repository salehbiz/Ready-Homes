import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcBase = './tmp-original-frames/public/frames';
const destBase = './public/frames-new';

const sequences = ['hero', 'section3', 'transformation'];
const BATCH_SIZE = 16; // Process 16 frames in parallel

async function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

async function processBatch(files, srcDir, destDir, tier, seq) {
  const promises = files.map(async f => {
    const srcPath = path.join(srcDir, f);
    const destFileName = f.replace('.webp', `.${tier.format}`);
    const destPath = path.join(destDir, destFileName);
    
    let pipeline = sharp(srcPath);
    if (tier.resize) {
      pipeline = pipeline.resize(tier.resize.width, tier.resize.height, { fit: 'cover' });
    }
    
    if (tier.format === 'avif') {
      pipeline = pipeline.avif({ quality: tier.quality, effort: 3 }); // effort 3 is faster but still great quality
    } else {
      pipeline = pipeline.webp({ quality: tier.quality, effort: 4 });
    }
    
    await pipeline.toFile(destPath);
    return fs.statSync(destPath).size;
  });
  
  return Promise.all(promises);
}

async function processFrames() {
  console.log('Starting fast batch frame optimization...');
  const start = Date.now();
  
  for (const seq of sequences) {
    const seqSrc = path.join(srcBase, seq);
    const seqDest = path.join(destBase, seq);
    
    const tiers = [
      {
        name: 'desktop-hq',
        format: 'avif',
        quality: 35,
        resize: null
      },
      {
        name: 'desktop',
        format: 'webp',
        quality: 70,
        resize: seq === 'hero' ? { width: 1920, height: 1080 } : null
      },
      {
        name: 'mobile',
        format: 'avif',
        quality: 35,
        resize: null
      }
    ];
    
    for (const tier of tiers) {
      const srcDir = path.join(seqSrc, tier.name);
      const destDir = path.join(seqDest, tier.name);
      
      if (!fs.existsSync(srcDir)) {
        console.log(`Source directory not found: ${srcDir}`);
        continue;
      }
      
      await cleanDir(destDir);
      const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.webp'));
      console.log(`Processing ${seq}/${tier.name} (${files.length} frames)...`);
      
      let totalSize = 0;
      
      // Batch processing loop
      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        const sizes = await processBatch(batch, srcDir, destDir, tier, seq);
        totalSize += sizes.reduce((acc, s) => acc + s, 0);
      }
      
      const avgSize = totalSize / files.length;
      console.log(`Completed ${seq}/${tier.name}. Avg size: ${(avgSize / 1024).toFixed(2)} KB`);
    }
  }
  
  console.log(`Frame optimization finished in ${((Date.now() - start) / 1000).toFixed(1)}s!`);
}

processFrames().catch(console.error);
