import purgecss from '@fullhuman/postcss-purgecss';

// The theme CSS (public/assets/css/*) ships styles for an entire Shopify store;
// this single-page site uses a fraction of it. Purge unused selectors at build
// time only — dev serves the full stylesheet so new markup can be iterated on
// without rebuilding.
//
// Content includes the theme JS so classes toggled at runtime (e.g. "is-grabbing",
// "utility-bar-sticky-mobile-copy-reveal") count as used. Inline <style> blocks in
// index.html are not processed by PostCSS and are unaffected.
const purge = purgecss({
  content: ['./index.html', './src/**/*.{ts,tsx}', './public/assets/js/*.js'],
  defaultExtractor: (content) => content.match(/[A-Za-z0-9_-]+/g) || [],
  safelist: {
    standard: ['html', 'body', /^(is-|has-|js-|cc-|no-)/, /^(active|open|hidden|loaded|loading|sticky)$/],
    deep: [
      /drawer/, /modal/, /pop-?up/, /quick-popup/, /utility-bar/,
      /slider/, /carousel/, /scrolling-image-list/, /segment-bar/, /feature-rating/,
      /nav/, /search/, /cart/, /pageheader/, /logo-area/, /mobile-menu/, /overlay/,
    ],
  },
});

export default {
  plugins: process.env.NODE_ENV === 'production' ? [purge] : [],
};
