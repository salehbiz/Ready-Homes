import React, { useEffect, useRef, useState, useCallback } from 'react';
import { registerAnimation, gsap } from '../lib/scroll';
import FrameScrub from '../components/FrameScrub';
import { getFrameTier, type FrameTier } from '../lib/frameTier';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [tier, setTier] = useState<FrameTier | null>(null);

  useEffect(() => {
    setTier(getFrameTier());
  }, []);

  // 2. Animations trigger setup
  // The hero overlay text lives in static HTML (#hero-static-overlay) so it
  // paints before the JS bundle loads; its entrance reveal is CSS-driven there.
  useEffect(() => {
    // Register scroll-driven ScrollTriggers in global context
    registerAnimation(() => {
      if (!containerRef.current) return;

      // Fade out all hero overlay components rapidly when user scrolls down
      gsap.to('#hero-static-overlay', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'top -40%', // Fades out completely early in scroll
          scrub: true,
        },
        autoAlpha: 0,
        y: -40,
        ease: 'none',
      });
    });
  }, []);
 
  const framePath = useCallback(
    (i: number) => {
      return tier ? `/frames/hero/${tier.dir}/${String(i).padStart(4, '0')}.${tier.ext}` : '';
    },
    [tier]
  );
 
  const fallbackFramePath = useCallback(
    (i: number) => {
      return tier && tier.dir === 'desktop-hq'
        ? `/frames/hero/desktop/${String(i).padStart(4, '0')}.webp`
        : '';
    },
    [tier]
  );



  return (
    <section ref={containerRef} id="hero" className="w-full bg-[#141316] relative select-none hero-track max-md:w-screen">
        <FrameScrub
          frameCount={150}
          framePath={framePath}
          fallbackFramePath={tier && tier.dir === 'desktop-hq' ? fallbackFramePath : undefined}
          poster="/frames/hero-poster.webp"
          posterMobile="/frames/hero-poster-mobile.webp"
          isHero
          scrollLengthVh={260}
          animationEndProgress={0.77}
          className="w-full hero-sticky max-md:w-screen"
          eager
          tierResolved={!!tier}
          pathKey={tier ? tier.dir : ''}
          zoomOnMobile
        >
          {/* Overlay text is rendered statically in index.html (#hero-static-overlay) for instant LCP paint */}
        </FrameScrub>
      </section>
  );
};
