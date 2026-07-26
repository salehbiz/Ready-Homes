const fs = require('fs');

const heroPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/src/sections/Hero.tsx';
let hero = fs.readFileSync(heroPath, 'utf8');

const target = `          {/* Bottom Left Overlay contents */}
          <div ref={subHeadingRef} className="absolute bottom-16 left-6 md:left-12 lg:left-16 z-20 flex flex-col items-start gap-4 pointer-events-none select-none text-left">
            <h4 className="text-white/80 text-[10px] md:text-[11px] tracking-widest uppercase font-sans font-bold mb-2">
              NEW IN HARDWARE
            </h4>
            <h2 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold tracking-tight hero-text-font leading-[1.1] max-w-xl mb-4">
              The Finishing Touch
            </h2>
            
            <div className="pointer-events-auto mt-2">
              <a
                href="/collections/hardware"
                className="inline-flex items-center justify-center bg-white text-black px-10 py-4 text-[12px] tracking-widest uppercase font-bold hover:bg-neutral-200 transition-colors font-sans"
              >
                Shop Hardware
              </a>
            </div>
          </div>`;

const replacement = `          {/* Bottom Left Overlay contents exactly as original slider */}
          <div ref={subHeadingRef} className="absolute inset-0 z-20 pointer-events-none w-full h-full">
            <div className="text-overlay text-overlay--with-reveal text-overlay--for-banner text-overlay--v-bottom text-overlay--h-left image-overlay__over has-motion w-full h-full" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <div className="text-overlay__inner" style={{ "--heading-max-width": "15em" } as React.CSSProperties}>
                <div className="text-overlay__text slideshow__motion-overlay has-motion pointer-events-none">
                  <div className="text-overlay__reveal">
                    <div className="text-overlay__subheading subheading subheading--over has-motion" style={{ color: 'white' }}>NEW IN HARDWARE</div>
                  </div>
                  <div className="text-overlay__reveal">
                    <h2 className="text-overlay__title h1 has-motion" style={{ color: 'white' }}>The Finishing Touch</h2>
                  </div>
                  <div className="text-overlay__button-row pointer-events-auto">
                    <a className="text-overlay__button btn btn--secondary" href="/collections/hardware">Shop Hardware</a>
                  </div>
                </div>
              </div>
            </div>
          </div>`;

if (hero.includes(target)) {
    hero = hero.replace(target, replacement);
    fs.writeFileSync(heroPath, hero);
    console.log("Replaced Hero text block.");
} else {
    console.log("Target block not found.");
}
