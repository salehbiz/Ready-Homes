import React, { useState, useCallback } from 'react';
import FrameScrub from '../components/FrameScrub';
import { getFrameTier, type FrameTier } from '../lib/frameTier';

export const HorizontalScrubSection: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [tier] = useState<FrameTier>(getFrameTier);


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

  const handleProgress = useCallback((prog: number) => {
    setProgress(prog);
  }, []);

  const rooms = [
    {
      title: "Living Room",
      desc: "An open-concept, light-filled lounge featuring expansive windows and bespoke architecture, providing a grand setting for relaxation."
    },
    {
      title: "Kitchen",
      desc: "A gourmet chef's dream equipped with built-in professional appliances, custom millwork cabinets, and a massive marble center island."
    },
    {
      title: "Stairs",
      desc: "A floating architectural staircase that links the ground level with private quarters, showing structural elegance and clean modern geometry."
    },
    {
      title: "Master Bedroom",
      desc: "A quiet penthouse retreat that catches beautiful morning light, complete with double walk-in wardrobes and tree-lined neighborhood views."
    },
    {
      title: "Master Bathroom",
      desc: "A spa-like oasis designed with premium stone cladding, double oak vanities, a freestanding soaking tub, and custom brass hardware."
    },
    {
      title: "Spa & Sauna",
      desc: "A dedicated wellness wing featuring a private cedar sauna, steam shower, and a lounge area designed for home rejuvenation."
    },
    {
      title: "Pool",
      desc: "A heated infinity-edge pool bordered by limestone paving and designer landscaping, ideal for outdoor dining and pool parties."
    },
    {
      title: "Cinema Room",
      desc: "An acoustically-optimized private theatre room featuring plush custom seating and state-of-the-art immersive sound setup."
    }
  ];

  return (
    <section id="horizontal-scrub" className="w-full bg-[#141316] relative select-none max-md:w-screen">
      <FrameScrub
        frameCount={120}
        framePath={framePath}
        fallbackFramePath={tier && tier.dir === 'desktop-hq' ? fallbackFramePath : undefined}
        poster="/frames/section3-poster.webp"
        scrollLengthVh={500}
        className="w-full max-md:w-screen"
        onProgress={handleProgress}
        containOnMobile={false}
        tierResolved={!!tier}
        pathKey={tier ? tier.dir : ''}
      >
        {/* Dark gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Progress bar at the very top */}
        <div className="absolute top-0 left-0 w-full h-[3px] z-50 bg-white/10">
          <div
            className="h-full bg-white origin-left"
            style={{ transform: `scaleX(${progress})`, transition: 'none' }}
          />
        </div>

        {/* Mobile Info Overlay */}
        <div className="block md:hidden absolute bottom-0 left-0 w-full z-30 text-left pointer-events-none"
             style={{
               padding: '2rem clamp(1.25rem, 5vw, 3rem) calc(env(safe-area-inset-bottom) + 2rem)',
               background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
               minHeight: '220px'
             }}
        >
          <div className="relative w-full h-[130px] overflow-hidden">
            <div 
              className="w-full flex flex-col"
              style={{ 
                transform: `translate3d(0, ${-progress * (rooms.length - 1) * 130}px, 0)`,
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {rooms.map((room, idx) => {
                const center = idx / (rooms.length - 1);
                const dist = Math.abs(progress - center);
                const opacity = Math.max(0, 1 - dist * (rooms.length - 1));
                return (
                  <div
                    key={idx}
                    className="w-full h-[130px] flex flex-col text-left justify-end pb-1"
                    style={{
                      opacity,
                      transition: 'opacity 0.2s ease-out'
                    }}
                  >
                    <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase block mb-1">
                      Space {idx + 1} of 8
                    </span>
                    <h3 className="text-[2rem] font-bold text-white tracking-tight leading-tight hero-text-font mb-2 uppercase">
                      {room.title}
                    </h3>
                    <p className="text-sm text-white/70 font-medium leading-relaxed max-w-sm">
                      {room.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Info Overlay */}
        <div className="hidden md:block absolute bottom-16 left-16 z-30 w-full max-w-md h-[180px] overflow-hidden pointer-events-none">
          <div 
            className="w-full flex flex-col"
            style={{ 
              transform: `translate3d(0, ${-progress * (rooms.length - 1) * 180}px, 0)`,
              transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {rooms.map((room, idx) => {
              const center = idx / (rooms.length - 1);
              const dist = Math.abs(progress - center);
              const opacity = Math.max(0, 1 - dist * (rooms.length - 1));
              return (
                <div
                  key={idx}
                  className="w-full h-[180px] flex flex-col gap-2 text-left justify-end pb-1"
                  style={{
                    opacity,
                    transition: 'opacity 0.2s ease-out'
                  }}
                >
                  <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
                    Space {idx + 1} of 8
                  </span>
                  <h3 className="text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] uppercase">
                    {room.title}
                  </h3>
                  <p className="text-sm text-white/50 font-medium leading-relaxed max-w-xs mt-1">
                    {room.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll hint — bottom center, fades out as you scroll */}
        <div
          className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 text-white/40 pointer-events-none"
          style={{ opacity: Math.max(0, 1 - progress * 8) }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
          <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Scroll to explore</span>
        </div>
      </FrameScrub>
    </section>
  );
};
