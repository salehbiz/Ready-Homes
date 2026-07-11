import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { registerAnimation, gsap } from '../lib/scroll';
import { HorizontalScrubSection } from './HorizontalScrubSection';
import { CloserLookTour } from './CloserLookTour';
import { FeatureDetails } from './FeatureDetails';

export const InfoBlocks: React.FC = () => {
  const workRefs = useRef<HTMLDivElement[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Clear array to prevent accumulation on re-renders
  workRefs.current = [];

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    
    // Find the currently active/centered child element
    const children = Array.from(el.children) as HTMLElement[];
    const containerCenter = el.scrollLeft + el.clientWidth / 2;
    
    // Find which child is closest to the container center
    let activeIdx = 0;
    let minDiff = Infinity;
    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const diff = Math.abs(childCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        activeIdx = idx;
      }
    });
    
    // Calculate target index
    let targetIdx = activeIdx;
    if (direction === 'left') {
      targetIdx = Math.max(0, activeIdx - 1);
    } else {
      targetIdx = Math.min(children.length - 1, activeIdx + 1);
    }
    
    // Scroll to the target element aligned to the center
    const targetChild = children[targetIdx];
    if (targetChild) {
      const targetLeft = targetChild.offsetLeft - (el.clientWidth - targetChild.clientWidth) / 2;
      el.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }
  };



  useEffect(() => {
    registerAnimation(() => {





      // 4. Staggered reveal for Featured Work Cards
      workRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          }
        );
      });
    });
  }, []);



  interface FeaturedWork {
    title: string;
    category: string;
    img: string;
    boldText: string;
    caption: string;
    boldTextEnd?: string;
    captionEnd?: string;
  }

  const works: FeaturedWork[] = [
    {
      title: 'Luxury Living Room Spaces',
      category: 'LIVING ROOM',
      img: '/featured/featured_living.webp',
      boldText: 'Living Room spaces',
      caption: ' are flooded with natural light from floor-to-ceiling glass windows, creating an expansive yet warm social hub.',
    },
    {
      title: "Gourmet Chef's Kitchens",
      category: 'KITCHEN AREA',
      img: '/featured/featured_kitchen.webp',
      boldText: "Gourmet Chef's Kitchens",
      caption: ' pair oak cabinetry with hand-finished stone slabs, bridging modern design with practical durability.',
    },
    {
      title: 'Private Wellness Sauna',
      category: 'SAUNA & SPA',
      img: '/featured/featured_sauna.webp',
      boldText: 'Traditional Finnish Saunas',
      caption: ' offer a spa-like retreat right at home, built with moisture-resistant cedar paneling and soft ambient lighting.',
    },
    {
      title: 'Quiet Master Bedrooms',
      category: 'BEDROOM SUITE',
      img: '/featured/featured_bedroom.webp',
      boldText: 'Quiet Master Bedrooms',
      caption: ' serve as a tranquil sanctuary with custom structural finishes that frame trees and landscape vistas.',
    },
  ];



  return (
    <div className="w-full bg-white select-none">
      {/* 1. Interactive Closer Look Detail Tour */}
      <CloserLookTour />



      {/* 3. Featured Work - Take a Closer Look Slider */}
      <section id="featured-work" className="py-16 md:py-36 w-full select-none overflow-hidden bg-white">
        <div className="w-full px-6 md:px-12 lg:px-16 flex justify-between items-end border-b border-neutral-100 pb-6 md:pb-8 mb-10 md:mb-12 select-none">
          <div>
            <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-neutral-900 text-left font-sans">
              Take a closer look.
            </h2>
          </div>
          {/* Desktop Arrow Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
              aria-label="Previous details"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
              aria-label="Next details"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Snapping horizontal scroll view container */}
        <div 
          ref={scrollRef}
          className="featured-scroll-container flex gap-6 overflow-x-auto pb-8 select-none scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {works.map((work, idx) => (
            <div
              key={idx}
              ref={(el) => { if (el) workRefs.current.push(el); }}
              className="flex-shrink-0 w-[85vw] md:w-[640px] flex flex-col gap-6 select-none"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Image card */}
              <div className="w-full aspect-[4/3] rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#f5f5f7] relative border border-neutral-100 select-none">
                <img
                  src={work.img}
                  alt={work.title}
                  loading="lazy"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>

              {/* Text caption below */}
              <div className="px-2 text-left select-none max-w-[600px]">
                <p className="text-[15px] md:text-[17px] text-[#86868b] font-normal leading-relaxed">
                  {work.boldText && (
                    <strong className="text-[#1d1d1f] font-semibold">{work.boldText}</strong>
                  )}
                  {work.caption}
                  {work.boldTextEnd && (
                    <strong className="text-[#1d1d1f] font-semibold">{work.boldTextEnd}</strong>
                  )}
                  {work.captionEnd}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Responsive padding and scrollbar hider */}
        <style dangerouslySetInnerHTML={{__html: `
          .featured-scroll-container {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
            touch-action: pan-x;
          }
          @media (min-width: 768px) {
            .featured-scroll-container {
              padding-left: 3rem;
              padding-right: 3rem;
            }
          }
          @media (min-width: 1024px) {
            .featured-scroll-container {
              padding-left: 4rem;
              padding-right: 4rem;
            }
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
            touch-action: pan-x;
          }
        `}} />
      </section>

      {/* 3.5 Horizontal Scrub Scroll Section */}
      <HorizontalScrubSection />

      {/* 4. Feature Details Alternating Split Section */}
      <FeatureDetails />


    </div>
  );
};
