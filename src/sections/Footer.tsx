import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { lenis } from '../lib/scroll';

export const Footer: React.FC = () => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
      });
      setTimeStr(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      if (window.innerWidth < 768) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        lenis.scrollTo(element, { offset: -64 });
      }
    }
  };

  const socials = [
    { name: 'X', handle: '@readyhomes', url: 'https://x.com' },
    { name: 'Instagram', handle: '@readyhomes', url: 'https://instagram.com' },
    { name: 'YouTube', handle: '@readyhomes', url: 'https://youtube.com' },
    { name: 'LinkedIn', handle: '@readyhomes', url: 'https://linkedin.com' },
  ];

  return (
    <footer id="contact" className="w-full bg-[#141316] select-none rounded-t-[32px] md:rounded-t-[48px] border-t border-white/5 p-6 md:p-10 lg:p-12 flex flex-col gap-10 md:gap-12 mt-16 md:mt-24">
      <div className="w-full select-none flex flex-col gap-10 md:gap-12">
        
        {/* Top Row: columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 text-left">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-3.5 select-none text-left">
            <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Ready Homes</span>
            <div className="text-sm md:text-base font-bold tracking-tight text-white leading-relaxed max-w-xs hero-text-font">
              Bespoke residential architectural design studio. Crafting spaces for the life you love at 1159 Diamond St.
            </div>
            <a
              href="mailto:INFO@READY-HOMES.IO"
              className="text-xs font-bold tracking-wide text-white hover:text-neutral-300 transition-colors uppercase border-b border-white/20 pb-0.5 self-start mt-2"
            >
              INFO@READY-HOMES.IO
            </a>
          </div>

          {/* Column 2: Explore Navigation */}
          <div className="flex flex-col gap-3.5 select-none text-left">
            <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Explore</span>
            <ul className="flex flex-col gap-2">
              {[
                { name: 'Home', id: 'hero' },
                { name: 'About The Property', id: 'about' },
                { name: 'Gallery', id: 'featured-work' },
                { name: 'Amenities', id: 'what-we-do' },
                { name: 'Contact Us', id: 'contact' },
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollTo(item.id);
                    }}
                    className="text-xs md:text-sm font-semibold tracking-wide text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group cursor-pointer"
                  >
                    {item.name}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Follow Us */}
          <div className="flex flex-col gap-3.5 select-none text-left">
            <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Follow Us</span>
            <div className="flex flex-wrap gap-2 max-w-xs">
              {socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 py-1 px-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 shadow-sm transition-all text-white font-semibold text-xs cursor-pointer select-none"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>{soc.name} <span className="text-neutral-500 font-normal">{soc.handle}</span></span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: CTAs */}
          <div className="flex flex-col gap-3.5 select-none text-left">
            <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Bookings</span>
            <div className="flex flex-col gap-4">
              
              {/* Schedule a Call */}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('contact');
                }}
                className="group block text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 text-base md:text-lg font-bold text-white group-hover:text-neutral-300 transition-colors">
                  <span>Schedule a Call</span>
                  <span className="w-5.5 h-5.5 rounded-full bg-white text-neutral-950 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 font-medium">Let's plan your residence</span>
              </a>

              <div className="w-full h-[1px] bg-white/10" />

              {/* View Gallery */}
              <a
                href="#featured-work"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('featured-work');
                }}
                className="group block text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 text-base md:text-lg font-bold text-white group-hover:text-neutral-300 transition-colors">
                  <span>Explore Residence</span>
                  <span className="w-5.5 h-5.5 rounded-full bg-white text-neutral-950 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 font-medium">Interactive property gallery</span>
              </a>

            </div>
          </div>

        </div>

        {/* Center: Massive lowercase branding text */}
        <div className="text-[8.5vw] font-black text-white tracking-tighter leading-none select-none text-center font-sans lowercase pt-4 border-b border-white/5 pb-2">
          ready homes
        </div>

        {/* Bottom Row: Metadata */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-semibold tracking-wider text-neutral-500 gap-4 select-none font-sans">
          <div className="flex items-center flex-wrap gap-2 md:gap-4 justify-center">
            <span>© 2026 READY HOMES</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-neutral-300 cursor-pointer">PRIVACY POLICY</a>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <a href="#disclosures" onClick={(e) => e.preventDefault()} className="hover:text-neutral-300 cursor-pointer">DISCLOSURES</a>
          </div>
          <div className="flex items-center gap-2">
            <span>CALIFORNIA, USA</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="font-bold text-neutral-400 uppercase">{timeStr || '12:00 PM'}</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>72°F ☀️</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
