const fs = require('fs');

const path = '/Users/apple/Documents/Projects/Ready Homes 2.0/src/sections/HorizontalScrubSection.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldOverlay = `        {/* Fronteriors-style Left-aligned Overlay */}
        <div className="absolute bottom-16 left-6 md:left-12 lg:left-16 z-30 flex flex-col items-start gap-4 pointer-events-none select-none text-left">
          <h4 className="text-white/80 text-[10px] md:text-xs tracking-widest uppercase font-sans font-bold">
            DESIGN COLLABORATION
          </h4>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight hero-text-font leading-tight max-w-xl">
            Customise IKEA Bestå
          </h2>
          <div className="pointer-events-auto mt-2">
            <a 
              href="#featured-work" 
              className="inline-flex items-center justify-center bg-white text-black px-8 py-3.5 text-[11px] tracking-widest uppercase font-bold hover:bg-neutral-200 transition-colors font-sans"
            >
              SHOP NOW
            </a>
          </div>
        </div>`;

const newOverlay = `        {/* Fronteriors-style Typography Overlay */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none select-none text-center px-6">
          <div className="text-overlay__text" style={{ color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            <div className="text-overlay__subheading subheading subheading--over lightish-spaced-row-above" style={{ color: 'rgba(255,255,255,0.8)' }}>
              TRANSFORM YOUR SPACES
            </div>
            <h2 className="text-overlay__title h1 block-heading_MtNm4V" style={{ color: 'white', maxWidth: '800px', margin: '0 auto' }}>
              Master Bedroom, Master Bathroom, Kitchen & Wardrobes.
            </h2>
            <div className="text-overlay__button-row button-row lightish-spaced-row-above pointer-events-auto mt-6">
              <a className="text-overlay__button button-row__btn small-feature-link" href="#" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                Learn more
              </a>
            </div>
          </div>
        </div>`;

content = content.replace(oldOverlay, newOverlay);

const featureBand = `      {/* Feature Band Below Scrub */}
      <div className="w-full bg-white border-y border-neutral-200 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-6 font-sans text-[10px] md:text-xs tracking-widest uppercase font-bold text-[#1a1a1a] text-center">
          <div className="flex-1 min-w-[140px]">custom made for ikea frames</div>
          <div className="flex-1 min-w-[140px]">expert support & guides</div>
          <div className="flex-1 min-w-[140px]">quality you can feel</div>
          <div className="flex-1 min-w-[140px]">worldwide shipping</div>
        </div>
      </div>

      {/* Sand Concept Banner */}
      <div className="w-full bg-[#f3efe9] py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="hero-text-font text-xl md:text-2xl text-neutral-800 leading-relaxed">
            Get the look of custom cabinetry without the designer price tag. We offer a system of modular parts that seamlessly add to IKEA's Bestå, Pax and Sektion frames.
          </p>
        </div>
      </div>`;

content = content.replace(featureBand, '');

fs.writeFileSync(path, content);
console.log("Updated overlay text and removed feature bands.");
