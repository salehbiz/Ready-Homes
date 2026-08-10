import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize single Lenis smooth scrolling instance with luxury slow-scroll physics
export const lenis = new Lenis({
  duration: 1.8,          // Deliberate, smooth deceleration (takes 1.8s to fully slide)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration curve
  wheelMultiplier: 0.75,  // Dampens mousewheel ticks by 25% for high-resolution scroll control
  touchMultiplier: 1.2,   // Dampens touch flicks by ~50% to prevent flying past scroll-scrub animations
  infinite: false,
  // syncTouch intentionally left off: virtual touch scrolling is janky on iOS and
  // fights with natively-scrolling regions (mobile carousels), making sections feel
  // detached from the page. Native touch scroll still drives ScrollTrigger via lenis.on('scroll').
  allowNestedScroll: true, // let nested scrollers (e.g. mobile carousels) receive touch gestures
});

// Update ScrollTrigger on scroll and animate Lenis via GSAP ticker
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// Create a single GSAP context for the entire application animations
export const gsapCtx = gsap.context(() => {});

// Helper to add ScrollTriggers to the shared context
export const registerAnimation = (animationFn: () => void | (() => void)) => {
  gsapCtx.add(animationFn);
};

// Debounced ScrollTrigger refresh to prevent layout thrashing from multiple components
let refreshTimeout: number | undefined;
export const safeRefresh = () => {
  if (typeof window === 'undefined') return;
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }
  refreshTimeout = window.setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
};

export { gsap, ScrollTrigger };
