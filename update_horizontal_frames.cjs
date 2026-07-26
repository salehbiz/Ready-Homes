const fs = require('fs');

const path = '/Users/apple/Documents/Projects/Ready Homes 2.0/src/sections/HorizontalScrubSection.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldFramePath = `  const framePath = useCallback(
    (i: number) => {
      return tier ? \`/frames/section3/\${tier.dir}/\${String(i).padStart(4, '0')}.\${tier.ext}\` : '';
    },
    [tier]
  );`;

const newFramePath = `  const framePath = useCallback(
    (i: number) => {
      if (!tier) return '';
      if (i <= 120) {
        return \`/frames/transformation/\${tier.dir}/\${String(i).padStart(4, '0')}.\${tier.ext}\`;
      } else {
        return \`/frames/section3/\${tier.dir}/\${String(i - 120).padStart(4, '0')}.\${tier.ext}\`;
      }
    },
    [tier]
  );`;

const oldFallbackPath = `  const fallbackFramePath = useCallback(
    (i: number) => {
      return tier && tier.dir === 'desktop-hq'
        ? \`/frames/section3/desktop/\${String(i).padStart(4, '0')}.webp\`
        : '';
    },
    [tier]
  );`;

const newFallbackPath = `  const fallbackFramePath = useCallback(
    (i: number) => {
      if (!(tier && tier.dir === 'desktop-hq')) return '';
      if (i <= 120) {
        return \`/frames/transformation/desktop/\${String(i).padStart(4, '0')}.webp\`;
      } else {
        return \`/frames/section3/desktop/\${String(i - 120).padStart(4, '0')}.webp\`;
      }
    },
    [tier]
  );`;

content = content.replace(oldFramePath, newFramePath);
content = content.replace(oldFallbackPath, newFallbackPath);

content = content.replace('frameCount={120}', 'frameCount={240}');
content = content.replace('poster="/frames/section3-poster.webp"', 'poster="/frames/transformation-poster.webp"');
content = content.replace('scrollLengthVh={650}', 'scrollLengthVh={950}');

fs.writeFileSync(path, content);
console.log("Updated HorizontalScrubSection.tsx to combine the 240 frames.");
