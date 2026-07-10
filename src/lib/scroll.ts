import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize single Lenis smooth scrolling instance
export const lenis = new Lenis({
  duration: 0.9,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 2.5,
  infinite: false,
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
