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
  syncTouch: true,
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

export { gsap, ScrollTrigger };
