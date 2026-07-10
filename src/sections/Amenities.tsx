import React, { useEffect, useRef } from 'react';
import { registerAnimation, gsap } from '../lib/scroll';

export const Amenities: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const brandLogos = [
    'https://cdn.prod.website-files.com/68d5ef256aa1426c46f24ec9/69ba2709610914ee4931157d_Group-6.svg',
    'https://cdn.prod.website-files.com/68d5ef256aa1426c46f24ec9/69ba27093768fa7ea2aa10b6_Frame.svg',
    'https://cdn.prod.website-files.com/68d5ef256aa1426c46f24ec9/69ba270965f0b95df06d08d4_Frame.svg',
    'https://cdn.prod.website-files.com/68d5ef256aa1426c46f24ec9/69ba2709ba6ae29ab8c76d72_Frame.svg',
  ];

  useEffect(() => {
    registerAnimation(() => {
      if (!containerRef.current || !marqueeRef.current) return;

      // Staggered reveal for the brand section container
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
          },
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        }
      );
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-16 bg-white overflow-hidden select-none border-b border-neutral-100"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-center items-center">
        {/* Infinite scrolling marquee track */}
        <div className="relative w-full max-w-[800px] overflow-hidden select-none">
          {/* Edge overlays to fade out the marquee boundaries */}
          <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Marquee list */}
          <div className="flex gap-16 whitespace-nowrap overflow-hidden py-2 select-none">
            {/* Infinite looping container */}
            <div ref={marqueeRef} className="animate-marquee flex gap-16 select-none">
              {brandLogos.map((logo, idx) => (
                <img
                  key={`b1-${idx}`}
                  src={logo}
                  alt="Client brand logo"
                  className="h-7 w-auto select-none opacity-40 hover:opacity-100 transition-opacity duration-300 pointer-events-none filter grayscale brightness-0"
                />
              ))}
              {/* Duplicate logos for infinite marquee effect */}
              {brandLogos.map((logo, idx) => (
                <img
                  key={`b2-${idx}`}
                  src={logo}
                  alt="Client brand logo"
                  className="h-7 w-auto select-none opacity-40 hover:opacity-100 transition-opacity duration-300 pointer-events-none filter grayscale brightness-0"
                />
              ))}
              {/* Triplicate logos to ensure gap-free rendering */}
              {brandLogos.map((logo, idx) => (
                <img
                  key={`b3-${idx}`}
                  src={logo}
                  alt="Client brand logo"
                  className="h-7 w-auto select-none opacity-40 hover:opacity-100 transition-opacity duration-300 pointer-events-none filter grayscale brightness-0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
