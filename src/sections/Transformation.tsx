import React, { useRef, useState, useCallback, useEffect } from 'react';
import FrameScrub from '../components/FrameScrub';
import { getFrameTier, type FrameTier } from '../lib/frameTier';

export const Transformation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<FrameTier | null>(null);

  useEffect(() => {
    setTier(getFrameTier());
  }, []);


  const framePath = useCallback(
    (i: number) => {
      return tier ? `/frames/transformation/${tier.dir}/${String(i).padStart(4, '0')}.${tier.ext}` : '';
    },
    [tier]
  );

  const fallbackFramePath = useCallback(
    (i: number) => {
      return tier && tier.dir === 'desktop-hq'
        ? `/frames/transformation/desktop/${String(i).padStart(4, '0')}.webp`
        : '';
    },
    [tier]
  );

  return (
    <section ref={containerRef} id="transformation" className="w-full bg-[#141316] relative select-none max-md:w-screen">
      <FrameScrub
        frameCount={120}
        framePath={framePath}
        fallbackFramePath={tier && tier.dir === 'desktop-hq' ? fallbackFramePath : undefined}
        poster="/frames/transformation-poster.webp"
        scrollLengthVh={300}
        className="w-full max-md:w-screen"
        containOnMobile={false}
        tierResolved={!!tier}
        pathKey={tier ? tier.dir : ''}
      >
        {/* Fronteriors-style Bottom-Left Typography Overlay */}
        <div className="absolute inset-0 z-30 pointer-events-none w-full h-full">
          <div className="text-overlay text-overlay--for-banner text-overlay--v-bottom text-overlay--h-left image-overlay__over w-full h-full" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="text-overlay__inner" style={{ "--heading-max-width": "25em" } as React.CSSProperties}>
              <div className="text-overlay__text pointer-events-none">
                <div className="text-overlay__reveal">
                  <div className="text-overlay__subheading subheading subheading--over" style={{ color: 'white' }}>
                    THE FINISHING TOUCH
                  </div>
                </div>
                <div className="text-overlay__reveal">
                  <h2 className="text-overlay__title h1" style={{ color: 'white' }}>
                    Spaces Within joins our hardware curation.
                  </h2>
                </div>
                <div className="text-overlay__button-row pointer-events-auto mt-6">
                  <a className="text-overlay__button btn btn--secondary" style={{ backgroundColor: 'transparent', color: 'white', borderColor: 'white' }} href="/collections/hardware">
                    Shop Hardware
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FrameScrub>
    </section>
  );
};
