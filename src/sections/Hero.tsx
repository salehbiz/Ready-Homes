import React, { useEffect, useRef, useState, useCallback } from 'react';
import { registerAnimation, gsap } from '../lib/scroll';
import FrameScrub from '../components/FrameScrub';
import { getFrameTier, type FrameTier } from '../lib/frameTier';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const subHeadingRef = useRef<HTMLDivElement>(null);

  const [tier] = useState<FrameTier>(getFrameTier);

  // 2. Animations trigger setup
  useEffect(() => {
    const isMob = window.innerWidth < 768;

    // Text reveal animation runs immediately
    gsap.fromTo(
      subHeadingRef.current ? subHeadingRef.current.querySelectorAll('div') : [],
      { opacity: 0, y: isMob ? 20 : 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: isMob ? 0.12 : 0.15 }
    );

    // Register scroll-driven ScrollTriggers in global context
    registerAnimation(() => {
      if (!containerRef.current) return;

      // Fade out all hero overlay components rapidly when user scrolls down
      gsap.to(subHeadingRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'top -40%', // Fades out completely early in scroll
          scrub: true,
        },
        opacity: 0,
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
          {/* Bottom Left Overlay contents exactly as original slider */}
          <div ref={subHeadingRef} className="absolute inset-0 z-20 pointer-events-none w-full h-full">
            <div className="text-overlay text-overlay--with-reveal text-overlay--for-banner text-overlay--v-bottom text-overlay--h-left image-overlay__over has-motion w-full h-full" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <div className="text-overlay__inner" style={{ "--heading-max-width": "15em" } as React.CSSProperties}>
                <div className="text-overlay__text slideshow__motion-overlay has-motion pointer-events-none">
                  <div className="text-overlay__reveal">
                    <div className="text-overlay__subheading subheading subheading--over has-motion" style={{ color: 'white' }}>NEW IN HARDWARE</div>
                  </div>
                  <div className="text-overlay__reveal">
                    <h2 className="text-overlay__title h1 has-motion" style={{ color: 'white' }}>The Finishing Touch</h2>
                  </div>
                  <div className="text-overlay__button-row pointer-events-auto">
                    <a className="text-overlay__button btn btn--secondary" href="/collections/hardware">Shop Hardware</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FrameScrub>
      </section>
  );
};
