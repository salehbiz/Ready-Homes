import React, { useState, useCallback, useEffect } from 'react';
import FrameScrub from '../components/FrameScrub';
import { getFrameTier, type FrameTier } from '../lib/frameTier';

export const HorizontalScrubSection: React.FC = () => {
  const [tier, setTier] = useState<FrameTier | null>(null);
  const [currentFrame, setCurrentFrame] = useState(1);

  useEffect(() => {
    setTier(getFrameTier());
  }, []);

  const framePath = useCallback(
    (i: number) => {
      return tier ? `/frames/section3/${tier.dir}/${String(i).padStart(4, '0')}.${tier.ext}` : '';
    },
    [tier]
  );

  const fallbackFramePath = useCallback(
    (i: number) => {
      return tier && tier.dir === 'desktop-hq'
        ? `/frames/section3/desktop/${String(i).padStart(4, '0')}.webp`
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
    heading = 'Spa';
    subtext = 'Finnish sauna with gym and yoga studio';
  } else if (currentFrame <= 100) {
    heading = 'Movie Theater';
    subtext = 'Stadium seating with surround sound speakers';
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
        posterMobile="/frames/section3-poster-mobile.webp"
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
        {/* Ready Homes style Bottom-Left Typography Overlay */}
        <div className="absolute inset-0 z-30 pointer-events-none w-full h-full">
          <div className="text-overlay text-overlay--for-banner text-overlay--v-bottom text-overlay--h-left image-overlay__over w-full h-full" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="text-overlay__inner" style={{ "--heading-max-width": "25em" } as React.CSSProperties}>
              <div className="text-overlay__text pointer-events-none transition-all duration-300 ease-out" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                <div className="text-overlay__reveal">
                  <h2 className="text-overlay__title h1" style={{ color: 'white' }}>
                    {heading}
                  </h2>
                </div>
                <div className="text-overlay__reveal">
                  <div className="text-overlay__subheading subheading subheading--over mt-2" style={{ color: 'white' }}>
                    {subtext}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FrameScrub>
    </section>
  );
};
