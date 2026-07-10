import React, { useEffect } from 'react';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { InfoBlocks } from './sections/InfoBlocks';
import { Transformation } from './sections/Transformation';
import { VideoSection } from './sections/VideoSection';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './sections/Footer';
import { lenis, ScrollTrigger } from './lib/scroll';
import { initCrispQualityEffects } from './lib/quality';

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
    <div className="relative w-full bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      {/* 1. Sticky Navigation Header */}
      <Header />

      {/* 2. Full-viewport Hero (includes entry preloader & slanted sliding image track) */}
      <Hero />



      {/* 4. Core Content Sections (About reveal, stats counters, portfolio cards grid, what we do grid, testimonials) */}
      <InfoBlocks />

      {/* 5. Sticky Parallax DESIGN AGENCY Scroll-Reveal block */}
      <Transformation />

      {/* 5.4 Tour Presentation Video Section */}
      <VideoSection />

      {/* 5.5 Contact Form Section */}
      <ContactSection />

      {/* 6. Footer indexes & copyright */}
      <Footer />
    </div>
  );
};

export default App;
