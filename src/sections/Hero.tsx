import React, { useEffect, useRef, useState } from 'react';
import { registerAnimation, gsap, lenis } from '../lib/scroll';
import FrameScrub from '../components/FrameScrub';
import { ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const subHeadingRef = useRef<HTMLDivElement>(null);

  // Preloader refs
  const preloaderRef = useRef<HTMLDivElement>(null);
  const preloaderText1Ref = useRef<HTMLDivElement>(null);
  const preloaderImgsRef = useRef<HTMLDivElement>(null);

  const [activeFrame, setActiveFrame] = useState(0);

  // 1. Run Preloader image time-lapse loop sequence
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % 9);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // 2. Animations trigger setup
  useEffect(() => {
    const tlPreloader = gsap.timeline({
      onComplete: () => {
        if (preloaderRef.current) {
          preloaderRef.current.style.display = 'none';
        }
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

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            <Logo className="w-[60vw] max-w-[320px] h-auto select-none" color="white" />
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
          © 2026 FLOORING STUDIO. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* 2. Main Hero Section (Scroller Canvas replaces the video, locked in track) */}
      <section ref={containerRef} id="hero" className="w-full bg-[#141316] relative select-none hero-track max-md:h-[100dvh] max-md:min-h-[100dvh] max-md:w-screen max-md:overflow-hidden">
        <FrameScrub
          frameCount={100}
          framePath={(i) => {
            const dir = isMobile ? 'hero-mobile' : 'hero';
            return `/frames/${dir}/${String(i).padStart(4, '0')}.webp`;
          }}
          poster="/frames/hero/0001.webp"
          scrollLengthVh={isMobile ? 100 : 200}
          className="w-full hero-sticky max-md:h-[100dvh] max-md:min-h-[100dvh] max-md:w-screen max-md:overflow-hidden"
          eager
        >
          {/* Subtle dark overlay for hero video readability */}
          <div className="absolute inset-0 bg-[#141316]/30 pointer-events-none z-10" />

          {/* Mobile bottom-positioned content overlay */}
          <div 
            className="block md:hidden absolute left-0 bottom-0 w-full text-left z-30 flex flex-col gap-4 pointer-events-none"
            style={{
              padding: '2rem 1.5rem calc(env(safe-area-inset-bottom) + 2rem)',
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)'
            }}
          >
            <div>
              <h2 className="text-white text-[2rem] font-bold tracking-tight leading-tight hero-text-font mb-2 uppercase">
                Premium Surfaces
              </h2>
              <p className="text-white text-base opacity-90 font-medium">
                Crafted for the spaces you love.
              </p>
            </div>
            <div className="pointer-events-auto">
              <a
                href="#featured-work"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('featured-work');
                  if (element) {
                    if (window.innerWidth < 768) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      lenis.scrollTo(element, { offset: -80 });
                    }
                  }
                }}
                className="btn-pill-white cursor-pointer hero-text-font min-h-[44px] px-5 py-3"
              >
                <span>Explore Our Work</span>
                <span className="arrow-circle-blue">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </a>
            </div>
          </div>

          {/* Desktop Center Overlay contents */}
          <div className="hidden md:flex w-full h-full flex-col justify-center items-center py-16 px-6 md:px-12 relative z-20 pointer-events-none hero-content">
            <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center flex-1">
              {/* Centered alignment for subheading and button */}
              <div
                ref={subHeadingRef}
                className="flex flex-col items-center justify-center w-full text-center gap-8 select-none"
              >
                <div className="text-white text-2xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] max-w-3xl hero-text-font">
                  Premium surfaces. Crafted for the spaces you love.
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
                    <span>Explore Our Work</span>
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
