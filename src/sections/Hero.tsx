import React, { useEffect, useRef, useState } from 'react';
import { registerAnimation, gsap, lenis } from '../lib/scroll';
import FrameScrub from '../components/FrameScrub';
import { ArrowRight } from 'lucide-react';
import logoWhite from '../assets/logo-white.png';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const subHeadingRef = useRef<HTMLDivElement>(null);

  // Preloader refs
  const preloaderRef = useRef<HTMLDivElement>(null);
  const preloaderText1Ref = useRef<HTMLDivElement>(null);
  const preloaderImgsRef = useRef<HTMLDivElement>(null);

  const [activeFrame, setActiveFrame] = useState(0);

  // 1. Run Preloader gradient frame loop sequence
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % 4);
    }, 200);

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
        duration: 1.2,
        ease: 'power4.inOut',
        delay: 0.8,
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
            <img 
              src={logoWhite} 
              alt="Ready Homes Logo" 
              className="w-[60vw] max-w-[360px] h-auto object-contain" 
            />
          </div>

          {/* Animated gradient squares — no network requests */}
          <div
            ref={preloaderImgsRef}
            className="relative w-16 h-16 md:w-20 md:h-20 select-none"
          >
            {[
              'linear-gradient(135deg, #2a2a3e 0%, #3d3556 100%)',
              'linear-gradient(135deg, #1e3a3a 0%, #2d5a4e 100%)',
              'linear-gradient(135deg, #3a2a1e 0%, #5a4e2d 100%)',
              'linear-gradient(135deg, #1e2a3a 0%, #2d4e5a 100%)',
            ].map((grad, idx) => (
              <div
                key={idx}
                className="absolute inset-0 w-full h-full rounded-[12px] shadow-lg transition-opacity duration-150 ease-out border border-white/10"
                style={{ background: grad, opacity: activeFrame % 4 === idx ? 1 : 0 }}
              />
            ))}
          </div>
        </div>

        {/* Preloader bottom copyrights */}
        <div className="text-[10px] md:text-xs font-semibold tracking-wider text-neutral-500 uppercase text-center">
          © 2026 READY HOMES. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* 2. Main Hero Section (Scroller Canvas replaces the video, locked in track) */}
      <section ref={containerRef} id="hero" className="w-full bg-[#141316] relative select-none hero-track">
        <FrameScrub
          frameCount={100}
          framePath={(i) => {
            const dir = isMobile ? 'hero-mobile' : 'hero';
            return `/frames/${dir}/${String(i).padStart(4, '0')}.webp`;
          }}
          poster="/frames/hero/0001.webp"
          scrollLengthVh={200}
          className="w-full hero-sticky"
          eager
        >
          {/* Main Overlay contents */}
          <div className="w-full h-full flex flex-col justify-center items-center py-16 px-6 md:px-12 relative z-20 pointer-events-none hero-content">
            <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center flex-1">
              {/* Centered alignment for subheading and button */}
              <div
                ref={subHeadingRef}
                className="flex flex-col items-center justify-center w-full text-center gap-8 select-none"
              >
                <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] max-w-3xl hero-text-font">
                  Where luxury meets lifestyle. Welcome to 1159 Diamond St.
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
                    <span>Explore the Property</span>
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
