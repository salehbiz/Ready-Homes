import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { lenis } from '../lib/scroll';
import logo from '../assets/logo-white.png';

export const Footer: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      lenis.scrollTo(element, { offset: -80 });
    }
  };

  return (
    <footer id="contact" className="bg-[#141316] text-white pt-24 pb-12 select-none border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-20">
        
        {/* Footer Top Row: Brand Info vs Navigation Lists */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 select-none">
          
          {/* Left Column: Brand, Description, Email */}
          <div className="w-full lg:w-[48%] flex flex-col gap-8 select-none text-left">
            <img src={logo} alt="Ready Homes Logo" className="h-10 md:h-12 w-auto object-contain select-none" />
            
            <div className="text-xl md:text-2xl font-bold tracking-tight text-neutral-100 leading-normal max-w-md hero-text-font">
              Your dream home at 1159 Diamond St is waiting. Let's make it yours.
            </div>
            
            <a
              href="mailto:INFO@READY-HOMES.IO"
              className="text-lg md:text-xl font-semibold tracking-wider text-white hover:text-neutral-300 transition-colors uppercase border-b border-white/10 pb-1 self-start"
            >
              INFO@READY-HOMES.IO
            </a>
          </div>

          {/* Right Column: Platform & Terms Navigation Lists */}
          <div className="w-full lg:w-[45%] flex flex-wrap justify-between gap-12 lg:gap-8 select-none">
            
            {/* Column 1: Platform */}
            <div className="flex flex-col gap-6 min-w-[140px] text-left">
              <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">Platform</span>
              <ul className="flex flex-col gap-4">
                {[
                  { name: 'HOME', id: 'hero' },
                  { name: 'ABOUT THE PROPERTY', id: 'about' },
                  { name: 'GALLERY', id: 'featured-work' },
                  { name: 'AMENITIES', id: 'what-we-do' },
                  { name: 'SCHEDULE A SHOWING', id: 'contact' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleScrollTo(item.id);
                      }}
                      className="text-sm font-semibold tracking-wide text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group cursor-pointer"
                    >
                      {item.name}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Terms */}
            <div className="flex flex-col gap-6 min-w-[140px] text-left">
              <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">Terms</span>
              <ul className="flex flex-col gap-4">
                {['FLOOR PLANS', 'PRIVACY POLICY', 'DISCLOSURES', 'TERMS OF USE', 'ACCESSIBILITY'].map((name) => (
                  <li key={name}>
                    <a
                      href="#contact"
                      onClick={(e) => e.preventDefault()}
                      className="text-sm font-semibold tracking-wide text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Row: Huge Text Brand + Copyright */}
        <div className="flex flex-col gap-8 border-t border-white/5 pt-12 select-none">
          {/* Large Graphic Footer SVG/text banner representing original logo frame */}
          <div className="w-full flex justify-center items-center select-none py-8 bg-white/5 rounded-[24px]">
            <img src={logo} alt="Ready Homes Logo" className="h-8 md:h-10 w-auto object-contain opacity-25 select-none" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs font-semibold tracking-wider text-neutral-500 gap-4">
            <div>© 2026 Ready Homes. All Rights Reserved.</div>
            <div>1159 Diamond St · Designed by Ready Homes</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
