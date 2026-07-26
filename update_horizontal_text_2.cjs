const fs = require('fs');

const path = '/Users/apple/Documents/Projects/Ready Homes 2.0/src/sections/HorizontalScrubSection.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldOverlay = `        {/* Fronteriors-style Typography Overlay */}
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

const newOverlay = `        {/* Fronteriors-style Top-Left Typography Overlay */}
        <div className="absolute inset-0 z-30 pointer-events-none select-none text-overlay text-overlay--for-banner text-overlay--v-top text-overlay--h-left image-overlay__over pt-16 pl-6 md:pl-12 lg:pl-16">
          <div className="text-overlay__inner text-left">
            <div className="text-overlay__text" style={{ color: 'white' }}>
              <div className="text-overlay__subheading subheading subheading--over lightish-spaced-row-above" style={{ color: 'rgba(255,255,255,0.8)' }}>
                DESIGN COLLABORATION
              </div>
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight hero-text-font leading-tight max-w-xl">
                Customise IKEA Bestå
              </h2>
              <div className="text-overlay__button-row button-row lightish-spaced-row-above pointer-events-auto mt-6">
                <a className="text-overlay__button button-row__btn small-feature-link" href="#featured-work" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                  SHOP NOW
                </a>
              </div>
            </div>
          </div>
        </div>`;

content = content.replace(oldOverlay, newOverlay);

fs.writeFileSync(path, content);
console.log("Updated overlay text back to the original ReadyHomes text with Fronteriors layout.");
