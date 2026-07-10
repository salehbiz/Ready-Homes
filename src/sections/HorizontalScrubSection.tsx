import React, { useState, useCallback } from 'react';
import FrameScrub from '../components/FrameScrub';

export const HorizontalScrubSection: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleProgress = useCallback((prog: number) => {
    setProgress(prog);
  }, []);

  return (
    <section id="horizontal-scrub" className="w-full bg-[#141316] relative select-none max-md:h-[100dvh] max-md:min-h-[100dvh] max-md:w-screen max-md:overflow-hidden">
      <FrameScrub
        frameCount={120}
        framePath={(i) => `/frames/section3/${String(i).padStart(4, '0')}.webp`}
        poster="/frames/section3-poster.webp"
        scrollLengthVh={isMobile ? 100 : 500}
        className="w-full max-md:h-[100dvh] max-md:min-h-[100dvh] max-md:w-screen max-md:overflow-hidden"
        onProgress={handleProgress}
        containOnMobile={false}
        eager
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
               padding: '2rem 1.5rem calc(env(safe-area-inset-bottom) + 2rem)',
               background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)'
             }}
        >
          <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase block mb-1">
            Project Showcase
          </span>
          <h3 className="text-[2rem] font-bold text-white tracking-tight leading-tight hero-text-font mb-2 uppercase">
            Luxury Surface Tour
          </h3>
          <p className="text-base text-white/70 font-medium leading-relaxed max-w-sm">
            Take a scroll-driven visual journey through spaces reimagined with our premium wood flooring, custom cabinetry, and hand-finished stone slabs.
          </p>
        </div>

        {/* Desktop Info Overlay */}
        <div className="hidden md:flex absolute bottom-16 left-16 z-30 flex-col gap-2 max-w-md pointer-events-none">
          <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
            Project Showcase
          </span>
          <h3 className="text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Luxury Surface Tour
          </h3>
          <p className="text-sm text-white/50 font-medium leading-relaxed max-w-xs mt-1">
            Take a scroll-driven visual journey through spaces reimagined with our premium wood flooring, custom cabinetry, and hand-finished stone slabs.
          </p>
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
