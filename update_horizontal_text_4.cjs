const fs = require('fs');

const path = '/Users/apple/Documents/Projects/Ready Homes 2.0/src/sections/HorizontalScrubSection.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldOverlay = `        {/* Fronteriors-style Centered Typography Overlay (from Transformation.tsx) */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none select-none text-center px-6 text-overlay text-overlay--for-banner image-overlay__over">
          <div className="text-overlay__inner text-center">
            <div className="text-overlay__text" style={{ color: 'white' }}>
              <div className="text-overlay__subheading subheading subheading--over lightish-spaced-row-above" style={{ color: 'rgba(255,255,255,0.8)' }}>
                THE FINISHING TOUCH
              </div>
              <h2 className="text-overlay__title h1 block-heading_MtNm4V" style={{ color: 'white', maxWidth: '800px', margin: '0 auto' }}>
                Spaces Within joins our hardware curation.
              </h2>
              <div className="text-overlay__button-row button-row lightish-spaced-row-above pointer-events-auto mt-6">
                <a className="text-overlay__button button-row__btn small-feature-link" href="#featured-work" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                  SHOP HARDWARE
                </a>
              </div>
            </div>
          </div>
        </div>`;

const newOverlay = `        {/* Fronteriors-style Centered Typography Overlay (from Transformation.tsx) */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none select-none text-center px-6 text-overlay text-overlay--for-banner image-overlay__over">
          <div className="text-overlay__inner text-center">
            <div className="text-overlay__text" style={{ color: 'white' }}>
              <div className="text-overlay__subheading subheading subheading--over lightish-spaced-row-above" style={{ color: 'rgba(255,255,255,0.8)' }}>
                THE FINISHING TOUCH
              </div>
              <h2 className="text-overlay__title h1 block-heading_MtNm4V" style={{ color: 'white', maxWidth: '800px', margin: '0 auto' }}>
                Spaces Within joins our hardware curation.
              </h2>
              <div className="text-overlay__button-row button-row lightish-spaced-row-above pointer-events-auto mt-6">
                <a className="text-overlay__button button-row__btn small-feature-link" href="#" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                  SHOP HARDWARE
                </a>
              </div>
            </div>
          </div>
        </div>`;

content = content.replace(oldOverlay, newOverlay);

fs.writeFileSync(path, content);
console.log("Updated anchor link to avoid jumping to featured-work anchor on click.");
