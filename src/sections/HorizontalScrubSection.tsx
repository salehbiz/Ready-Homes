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

  const getRoomStyles = (idx: number, isMobile: boolean) => {
    const numRooms = rooms.length;
    const center = (idx + 0.5) / numRooms;
    const step = 1 / numRooms;
    
    // Distance in step units
    const relativeDist = (progress - center) / step;
    const absDist = Math.abs(relativeDist);
    
    let opacity = 0;
    if (absDist <= 0.35) {
      opacity = 1;
    } else if (absDist >= 0.75) {
      opacity = 0;
    } else {
      const t = (absDist - 0.35) / (0.75 - 0.35);
      opacity = 1 - (3 * t * t - 2 * t * t * t);
    }
    
    // Boundary clamps to keep first/last solid at the limits
    if (idx === 0 && progress <= center) {
      opacity = 1;
    }
    if (idx === numRooms - 1 && progress >= center) {
      opacity = 1;
    }
    
    const maxShift = isMobile ? 12 : 20;
    const clampedDist = Math.max(-1, Math.min(1, relativeDist));
    const translateY = -clampedDist * maxShift;
    
    return {
      opacity,
      transform: `translateY(${translateY}px) translateZ(0)`,
      pointerEvents: opacity > 0.5 ? ('auto' as const) : ('none' as const),
      visibility: opacity > 0 ? ('visible' as const) : ('hidden' as const),
      transition: 'opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
    };
  };

  const getBlackFadeOpacity = (prog: number) => {
    const numRooms = rooms.length;
    const firstCenter = 0.5 / numRooms;
    const lastCenter = (numRooms - 0.5) / numRooms;
    if (prog < firstCenter || prog > lastCenter) {
      return 0;
    }

    const relativePos = prog * numRooms;
    const fraction = relativePos - Math.floor(relativePos);
    const distFromCenter = Math.abs(fraction - 0.5);
    
    const fadeThreshold = 0.35;
    if (distFromCenter <= fadeThreshold) {
      return 0;
    }
    
    const t = (distFromCenter - fadeThreshold) / (0.5 - fadeThreshold);
    const smoothT = 3 * t * t - 2 * t * t * t;
    
    const maxOpacity = 0.85;
    return smoothT * maxOpacity;
  };

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
        eager
        tierResolved={!!tier}
        pathKey={tier ? tier.dir : ''}
      >
        {/* Dark gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Cinematic black transition overlay */}
        <div 
          className="absolute inset-0 bg-black pointer-events-none z-10"
          style={{ 
            opacity: getBlackFadeOpacity(progress),
            transition: 'opacity 0.15s linear'
          }}
        />

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
          <div className="relative w-full h-[130px]">
            {rooms.map((room, idx) => {
              return (
                <div
                  key={idx}
                  className="absolute inset-x-0 bottom-0 flex flex-col text-left"
                  style={getRoomStyles(idx, true)}
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

        {/* Desktop Info Overlay */}
        <div className="hidden md:block absolute bottom-16 left-16 z-30 w-full max-w-md h-[180px] pointer-events-none">
          {rooms.map((room, idx) => {
            return (
              <div
                key={idx}
                className="absolute inset-x-0 bottom-0 flex flex-col gap-2 text-left"
                style={getRoomStyles(idx, false)}
              >
                <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
                  Space {idx + 1} of 8
                </span>
                <h3 className="text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                  {room.title}
                </h3>
                <p className="text-sm text-white/50 font-medium leading-relaxed max-w-xs mt-1">
                  {room.desc}
                </p>
              </div>
            );
          })}
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
