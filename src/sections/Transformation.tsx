import React, { useRef, useState, useCallback } from 'react';
import FrameScrub from '../components/FrameScrub';
import { getFrameTier, type FrameTier } from '../lib/frameTier';

export const Transformation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tier] = useState<FrameTier>(getFrameTier);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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
    <section ref={containerRef} id="transformation" className="w-full bg-[#141316] relative select-none max-md:h-[100dvh] max-md:min-h-[100dvh] max-md:w-screen max-md:overflow-hidden">
      <FrameScrub
        frameCount={120}
        framePath={framePath}
        fallbackFramePath={tier && tier.dir === 'desktop-hq' ? fallbackFramePath : undefined}
        poster="/frames/transformation-poster.webp"
        scrollLengthVh={isMobile ? 100 : 300}
        className="w-full max-md:h-[100dvh] max-md:min-h-[100dvh] max-md:w-screen max-md:overflow-hidden"
        containOnMobile={false}
        tierResolved={!!tier}
        pathKey={tier ? tier.dir : ''}
      >
        {/* Mobile Info Overlay */}
        <div className="block md:hidden absolute bottom-0 left-0 w-full z-30 text-left pointer-events-none"
             style={{
               padding: '2rem 1.5rem calc(env(safe-area-inset-bottom) + 2rem)',
               background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)'
             }}
        >
          <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase block mb-1">
            Before & After
          </span>
          <h3 className="text-[2rem] font-bold text-white tracking-tight leading-tight hero-text-font mb-2 uppercase">
            Space Transformation
          </h3>
          <p className="text-base text-white/70 font-medium leading-relaxed max-w-sm">
            Witness the complete evolution of the space.
          </p>
        </div>
      </FrameScrub>
    </section>
  );
};
