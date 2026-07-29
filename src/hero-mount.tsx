import React from 'react';
import { createRoot } from 'react-dom/client';
import { Hero } from './sections/Hero';
import './index.css';

const rootElement = document.getElementById('react-hero-root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Hero />
    </React.StrictMode>
  );
} else {
  console.error("React root element (#react-hero-root) not found in the DOM.");
}

// Lazy-load below-the-fold React roots when they approach the viewport
const lazyMount = (elementId: string, importFn: () => Promise<any>) => {
  const el = document.getElementById(elementId);
  if (el) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        importFn().catch((err) => console.error(`Failed to lazy load ${elementId}:`, err));
        observer.disconnect();
      }
    }, { rootMargin: '200px' });
    observer.observe(el);
  }
};

lazyMount('react-horizontal-scrub-root', () => import('./horizontal-mount'));
lazyMount('react-transformation-root', () => import('./transformation-mount'));

