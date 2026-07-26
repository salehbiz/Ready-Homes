const fs = require('fs');

const path = '/Users/apple/Documents/Projects/Ready Homes 2.0/src/sections/HorizontalScrubSection.tsx';
let content = fs.readFileSync(path, 'utf8');

// I will completely replace the whole file for safety to add state and logic properly.
const newContent = `import React, { useState, useCallback, useEffect } from 'react';
import FrameScrub from '../components/FrameScrub';
import { getFrameTier, type FrameTier } from '../lib/frameTier';

export const HorizontalScrubSection: React.FC = () => {
  const [tier] = useState<FrameTier>(getFrameTier);
  const [currentFrame, setCurrentFrame] = useState(1);

  const framePath = useCallback(
    (i: number) => {
      return tier ? \`/frames/section3/\${tier.dir}/\${String(i).padStart(4, '0')}.\${tier.ext}\` : '';
    },
    [tier]
  );

  const fallbackFramePath = useCallback(
    (i: number) => {
      return tier && tier.dir === 'desktop-hq'
        ? \`/frames/section3/desktop/\${String(i).padStart(4, '0')}.webp\`
        : '';
    },
    [tier]
  );

  // Determine active text based on frame index (1 to 120)
  // Divided into 6 segments of 20 frames each
  let heading = '';
  let subtext = '';

  if (currentFrame <= 20) {
    heading = 'Master Bedroom';
    subtext = 'Premium architectural details for your private sanctuary.';
  } else if (currentFrame <= 40) {
    heading = 'Master Bathroom';
    subtext = 'Exquisite materials for a luxurious spa experience at home.';
  } else if (currentFrame <= 60) {
    heading = 'Kitchen';
    subtext = 'Gourmet culinary spaces designed for entertaining.';
  } else if (currentFrame <= 80) {
    heading = 'Spa and Sauna';
    subtext = 'Traditional Finnish sauna with custom cedar paneling.';
  } else if (currentFrame <= 100) {
    heading = 'Cinema Room';
    subtext = 'Acoustically treated private viewing rooms.';
  } else {
    heading = 'Backyard';
    subtext = 'Expansive outdoor living spaces surrounded by nature.';
  }

  return (
    <section id="horizontal-scrub" className="w-full bg-[#141316] relative select-none max-md:w-screen">
      <FrameScrub
        frameCount={120}
        framePath={framePath}
        fallbackFramePath={tier && tier.dir === 'desktop-hq' ? fallbackFramePath : undefined}
        poster="/frames/section3-poster.webp"
        scrollLengthVh={650}
        animationEndProgress={0.77}
        className="w-full max-md:w-screen"
        containOnMobile={false}
        tierResolved={!!tier}
        pathKey={tier ? tier.dir : ''}
        onProgress={(prog, frame) => {
          setCurrentFrame(frame);
        }}
      >
        {/* Fronteriors-style Bottom-Left Typography Overlay */}
        <div className="absolute inset-0 z-30 pointer-events-none select-none text-overlay text-overlay--for-banner text-overlay--v-bottom text-overlay--h-left image-overlay__over pb-16 pl-6 md:pl-12 lg:pl-16">
          <div className="text-overlay__inner text-left">
            <div 
              className="text-overlay__text transition-all duration-300 ease-out" 
              style={{ color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
            >
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight hero-text-font leading-tight max-w-xl">
                {heading}
              </h2>
              <div className="text-overlay__subheading subheading subheading--over lightish-spaced-row-above" style={{ color: 'rgba(255,255,255,0.8)', marginTop: '12px' }}>
                {subtext}
              </div>
            </div>
          </div>
        </div>
      </FrameScrub>
    </section>
  );
};
`;

fs.writeFileSync(path, newContent);
console.log("Updated HorizontalScrubSection.tsx to include dynamic scroll-based text overlays.");
