const fs = require('fs');

// 1. Update Hero.tsx
const heroPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/src/sections/Hero.tsx';
let hero = fs.readFileSync(heroPath, 'utf8');

const oldHeroText = `            <h4 className="text-white/80 text-[10px] md:text-xs tracking-widest uppercase font-sans font-bold">
              DESIGN STUDIO
            </h4>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight hero-text-font leading-tight max-w-xl">
              Start with the Discovery Call.
            </h2>
            
            <div className="pointer-events-auto mt-2">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('contact');
                  if (element) {
                    import('../lib/scroll').then(({ lenis }) => lenis.scrollTo(element, { offset: 0 }));
                  }
                }}
                className="inline-flex items-center justify-center bg-white text-black px-8 py-3.5 text-[11px] tracking-widest uppercase font-bold hover:bg-neutral-200 transition-colors font-sans"
              >
                BOOK YOUR FREE SLOT NOW
              </a>
            </div>`;

const newHeroText = `            <h4 className="text-white/80 text-[10px] md:text-[11px] tracking-widest uppercase font-sans font-bold mb-2">
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
            </div>`;

hero = hero.replace(oldHeroText, newHeroText);
fs.writeFileSync(heroPath, hero);


// 2. Update index.html for transparent header colors
const htmlPath = '/Users/apple/Documents/Projects/Ready Homes 2.0/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const oldScript = `<script>
  window.addEventListener('scroll', function() {
    var header = document.getElementById('shopify-section-sections--24392109293842__header');
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'white';
    } else {
      header.style.backgroundColor = 'transparent';
    }
  });
</script>`;

const newScript = `<style>
  /* Styles for transparent header */
  .header-is-transparent .navigation__link,
  .header-is-transparent .header-account-link__icon svg,
  .header-is-transparent .show-search-link__icon svg,
  .header-is-transparent .cart-link__icon svg,
  .header-is-transparent .cart-link__count {
    color: white !important;
  }
  .header-is-transparent .logo__image {
    filter: brightness(0) invert(1);
    transition: filter 0.3s ease;
  }
  .section-header .logo__image {
    transition: filter 0.3s ease;
  }
  /* Optional: Make the Schedule Call button transparent with white border when header is transparent */
  .header-is-transparent .btn--secondary {
    background-color: transparent !important;
    color: white !important;
    border: 1px solid white !important;
  }
  /* Default button transition */
  .section-header .btn--secondary {
    transition: background-color 0.3s ease, color 0.3s ease, border 0.3s ease;
  }
</style>
<script>
  function updateHeader() {
    var header = document.getElementById('shopify-section-sections--24392109293842__header');
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'white';
      header.classList.remove('header-is-transparent');
    } else {
      header.style.backgroundColor = 'transparent';
      header.classList.add('header-is-transparent');
    }
  }
  window.addEventListener('scroll', updateHeader);
  updateHeader(); // Run on load
</script>`;

if (html.includes(oldScript)) {
    html = html.replace(oldScript, newScript);
    fs.writeFileSync(htmlPath, html);
    console.log("Successfully updated hero text and header transparency logic.");
} else {
    console.log("Could not find old transparent header script.");
}
