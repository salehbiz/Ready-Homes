import purgecss from '@fullhuman/postcss-purgecss';

// The theme CSS (public/assets/css/*) ships styles for an entire Shopify store;
// this single-page site uses a fraction of it. Purge unused selectors at build
// time only — dev serves the full stylesheet so new markup can be iterated on
// without rebuilding.
//
// Content includes the theme JS so classes toggled at runtime (e.g. "is-grabbing",
// "utility-bar-sticky-mobile-copy-reveal") count as used.
const purge = purgecss({
  content: ['./index.html', './src/**/*.{ts,tsx}', './public/assets/js/*.js'],
  // Tailwind-style extractor: also captures variant/arbitrary classes such as
  // "max-md:flex" or "bg-[#141316]", which the old \w-only extractor split at
  // ':' and '[' and therefore purged from production builds.
  defaultExtractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
  safelist: {
    standard: ['html', 'body', /^(is-|has-|js-|cc-|no-)/, /^(active|open|hidden|loaded|loading|sticky)$/],
    deep: [
      /drawer/, /modal/, /pop-?up/, /quick-popup/, /utility-bar/,
      /slider/, /carousel/, /scrolling-image-list/, /segment-bar/, /feature-rating/,
      /nav/, /search/, /cart/, /pageheader/, /logo-area/, /mobile-menu/, /overlay/,
    ],
    // greedy keeps any rule whose selector merely CONTAINS these — needed for
    // JS-toggled state selectors like `[data-cc-animate].fade-in-up.cc-animate-in`
    // that never appear verbatim in markup (purging them froze desktop sections
    // at the animation's opacity:0 starting state)
    greedy: [/cc-animate/, /data-cc-animate/, /fade-in/],
  },
});

// Vite hands every inline <style> block in index.html to PostCSS as its own
// "index.html?html-proxy&inline-css&index=N.css" source, so purge saw them too and
// dropped rules whose state selectors it could not prove were used — e.g. the
// scrolling-image-list section's `[data-current-index="N"] [data-index="N"]{opacity:1}`
// rules, which left every image at the theme's .25 base opacity and the paired text
// permanently `visibility:hidden`. Those blocks are hand-written for this one page and
// have nothing to purge, so restrict purging to the bundled theme CSS.
const purgeThemeCssOnly = {
  postcssPlugin: 'purgecss-theme-css-only',
  OnceExit(root, helpers) {
    const from = root.source?.input?.from || '';
    if (from.includes('?html-proxy')) return undefined;
    return purge.OnceExit(root, helpers);
  },
};

export default {
  plugins: process.env.NODE_ENV === 'production' ? [purgeThemeCssOnly] : [],
};
