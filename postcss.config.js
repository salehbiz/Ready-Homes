import purgecss from '@fullhuman/postcss-purgecss';

export default {
  plugins: [
    purgecss({
      content: [
        './index.html',
        './src/**/*.tsx',
        './src/**/*.ts'
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: {
        standard: [
          'header-is-transparent',
          'pageheader--transparent',
          'navigation--tight-underline',
          'pageheader--layout-inline-permitted',
          'no-js',
          'js',
          'lenis',
          'scrollTrigger',
          'pin-spacer',
          'cc-animate',
          'cc-animate-in',
          'cc-animate-complete',
          'scheduled-call-btn',
          'schedule-call-btn'
        ],
        deep: [],
        greedy: []
      }
    })
  ]
};
