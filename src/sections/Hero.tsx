import React, { useEffect, useRef, useState, useCallback } from 'react';
import { registerAnimation, gsap, lenis } from '../lib/scroll';
import FrameScrub from '../components/FrameScrub';
import { ArrowRight } from 'lucide-react';
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
          {/* Center Overlay contents (visible on both desktop and mobile) */}
          <div className="flex w-full h-full flex-col justify-center items-center py-16 px-6 md:px-12 relative z-20 pointer-events-none hero-content">
            <div className="w-full px-6 md:px-12 lg:px-16 flex flex-col justify-end md:justify-center items-center flex-1 pb-20 md:pb-0">
              <div
                ref={subHeadingRef}
                className="flex flex-col items-center justify-center w-full text-center gap-6 md:gap-8 select-none"
              >
                <div className="text-white text-[32px] sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.2] md:leading-[1.15] max-w-3xl hero-text-font">
                  Bespoke architecture.<br className="md:hidden" /> Crafted for the life you love.
                </div>
                
                <div className="pointer-events-auto">
                  <a
                    href="#featured-work"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById('featured-work');
                      if (element) {
                        lenis.scrollTo(element, { offset: -64 });
                      }
                    }}
                    className="btn-pill-white cursor-pointer hero-text-font"
                  >
                    <span>Explore the Residence</span>
                    <span className="arrow-circle-blue">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FrameScrub>
      </section>
  );
};
