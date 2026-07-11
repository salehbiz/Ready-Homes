import React, { useEffect, useRef, useState, useCallback } from 'react';
import { registerAnimation, gsap, lenis } from '../lib/scroll';
import FrameScrub from '../components/FrameScrub';
import { ArrowRight } from 'lucide-react';
import { getFrameTier, type FrameTier } from '../lib/frameTier';
import logoWhite from '../assets/logo-white.png';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const subHeadingRef = useRef<HTMLDivElement>(null);

  // Preloader refs
  const preloaderRef = useRef<HTMLDivElement>(null);
  const preloaderText1Ref = useRef<HTMLDivElement>(null);
  const preloaderImgsRef = useRef<HTMLDivElement>(null);

  const [activeFrame, setActiveFrame] = useState(0);
  const [tier] = useState<FrameTier>(getFrameTier);
  const [preloaderDone, setPreloaderDone] = useState(false);


  // 2. Run Preloader image time-lapse loop sequence
  useEffect(() => {
    if (preloaderDone) return;
    const interval = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % 9);
    }, 150);

    return () => clearInterval(interval);
  }, [preloaderDone]);

  // 2. Animations trigger setup
  useEffect(() => {
    const tlPreloader = gsap.timeline({
      onComplete: () => {
        if (preloaderRef.current) {
          preloaderRef.current.style.display = 'none';
        }
        setPreloaderDone(true);
      },
    });

    // Reveal preloader elements
    tlPreloader
      .fromTo(
        preloaderText1Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
      .fromTo(
        preloaderImgsRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' },
        '-=0.3'
      )
      // Slide preloader overlay up out of screen
      .to(preloaderRef.current, {
        yPercent: -100,
        duration: 1.0,
        ease: 'power4.inOut',
        delay: 0.4,
      })
      // Reveal subheadings
      .fromTo(
        subHeadingRef.current ? subHeadingRef.current.querySelectorAll('div') : [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15 },
        '-=0.2'
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
    <>
      {/* 1. Black Fullscreen loading preloader */}
      <div
        ref={preloaderRef}
        className="fixed inset-0 z-[100] bg-[#141316] flex flex-col justify-between select-none px-6 md:px-12 py-16"
      >
        {/* Top spacer to maintain vertical centering */}
        <div className="h-16 md:h-20 w-auto"></div>

        {/* Center alignment logo image & cycle image frames */}
        <div className="flex flex-col items-center justify-center gap-6 w-full max-w-4xl mx-auto flex-1 select-none">
          {/* Centered Large Original Logo Image */}
          <div
            ref={preloaderText1Ref}
            className="flex items-center justify-center select-none"
          >
            <img 
              src={logoWhite} 
              alt="Ready Homes Logo" 
              className="w-[60vw] max-w-[360px] h-auto object-contain select-none" 
            />
          </div>

          {/* Animated image sequence — using ultra-compressed 2KB thumbnails */}
          <div
            ref={preloaderImgsRef}
            className="relative w-16 h-16 md:w-20 md:h-20 select-none"
          >
            {Array.from({ length: 9 }).map((_, idx) => (
              <img
                key={idx}
                src={`/preloader/${idx + 1}.webp`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover rounded-[12px] shadow-lg transition-opacity duration-150 ease-out border border-white/10"
                style={{ opacity: activeFrame === idx ? 1 : 0 }}
              />
            ))}
          </div>
        </div>

        {/* Preloader bottom copyrights */}
        <div className="text-[10px] md:text-xs font-semibold tracking-wider text-neutral-500 uppercase text-center">
          © 2026 READY HOMES. ALL RIGHTS RESERVED.
        </div>
      </div>

      <section ref={containerRef} id="hero" className="w-full bg-[#141316] relative select-none hero-track max-md:w-screen">
        <FrameScrub
          frameCount={150}
          framePath={framePath}
          fallbackFramePath={tier && tier.dir === 'desktop-hq' ? fallbackFramePath : undefined}
          poster="/frames/hero-poster.webp"
          posterMobile="/frames/hero-poster-mobile.webp"
          isHero
          scrollLengthVh={200}
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
                        lenis.scrollTo(element, { offset: -80 });
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
    </>
  );
};
