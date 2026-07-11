import React, { useEffect } from 'react';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { lenis, ScrollTrigger } from './lib/scroll';
import { initCrispQualityEffects } from './lib/quality';

// Lazy load below-the-fold content sections to drastically reduce initial JS bundle size and TBT
const InfoBlocks = React.lazy(() => import('./sections/InfoBlocks').then(m => ({ default: m.InfoBlocks })));
const Transformation = React.lazy(() => import('./sections/Transformation').then(m => ({ default: m.Transformation })));
const ContactSection = React.lazy(() => import('./sections/ContactSection').then(m => ({ default: m.ContactSection })));
const Footer = React.lazy(() => import('./sections/Footer').then(m => ({ default: m.Footer })));

// Helper wrapper to refresh ScrollTrigger once a lazy-loaded section completes rendering
const LazySection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, []);
  return <>{children}</>;
};

const App: React.FC = () => {
  useEffect(() => {
    // Refresh ScrollTriggers when app elements are fully loaded
    ScrollTrigger.refresh();

    // Initialize custom cursor and crisp quality interactions
    initCrispQualityEffects();

    return () => {
      // Clean up Lenis instance
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white" style={{ overflowX: 'clip' }}>
      {/* 1. Sticky Navigation Header */}
      <Header />

      {/* 2. Full-viewport Hero (includes entry preloader & slanted sliding image track) */}
      <Hero />

      {/* Dynamic suspense boundaries for asynchronous sections */}
      <React.Suspense fallback={null}>
        {/* 4. Core Content Sections */}
        <LazySection>
          <InfoBlocks />
        </LazySection>

        {/* 5. Sticky Parallax Scroll-Reveal block */}
        <LazySection>
          <Transformation />
        </LazySection>

        {/* 5.5 Contact Form Section */}
        <LazySection>
          <ContactSection />
        </LazySection>

        {/* 6. Footer indexes & copyright */}
        <LazySection>
          <Footer />
        </LazySection>
      </React.Suspense>
    </div>
  );
};

export default App;
