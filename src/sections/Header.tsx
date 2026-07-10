import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { lenis, registerAnimation, ScrollTrigger } from '../lib/scroll';
import { Logo } from '../components/Logo';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // IntersectionObserver to detect active section for navigation pills
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ['hero', 'about', 'featured-work', 'what-we-do', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    registerAnimation(() => {
      // Toggle class/state after scrolling 80% of the hero track
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom 20%', // 80% of hero track height (since trigger is 200vh)
        onLeave: () => setIsScrolled(true),
        onEnterBack: () => setIsScrolled(false),
      });
    });
  }, []);

  const handleScrollTo = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      if (window.innerWidth < 768) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        lenis.scrollTo(element, { offset: -80 });
      }
    }
  };

  const navLinks = [
    { name: 'HOME', id: 'hero' },
    { name: 'ABOUT', id: 'about' },
    { name: 'GALLERY', id: 'featured-work' },
    { name: 'AMENITIES', id: 'what-we-do' },
    { name: 'CONTACT', id: 'contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-out select-none flex items-center ${
          isScrolled
            ? 'h-16 md:h-[96px] bg-[rgba(10,10,10,0.7)] backdrop-blur-[12px] border-b border-white/5'
            : 'h-16 md:h-[128px] bg-transparent border-b border-transparent'
        }`}
        style={{ backdropFilter: isScrolled ? 'blur(12px)' : 'none' }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo brand (flooring | studio) */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo('hero');
            }}
            className="flex items-center select-none cursor-pointer"
          >
            <Logo className="h-6 md:h-12 w-auto select-none" color="white" />
          </a>

          {/* Center: Navigation capsule (hidden on mobile, visible on desktop) */}
          <div className="!hidden md:!flex glass-nav-pill">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo('hero');
              }}
              className={`glass-nav-link ${activeSection === 'hero' ? 'active' : ''}`}
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo('about');
              }}
              className={`glass-nav-link ${activeSection === 'about' ? 'active' : ''}`}
            >
              About
            </a>
            <a
              href="#featured-work"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo('featured-work');
              }}
              className={`glass-nav-link ${activeSection === 'featured-work' ? 'active' : ''}`}
            >
              Gallery
            </a>
            <a
              href="#what-we-do"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo('what-we-do');
              }}
              className={`glass-nav-link ${activeSection === 'what-we-do' ? 'active' : ''}`}
            >
              Amenities
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo('contact');
              }}
              className={`glass-nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            >
              Contact
            </a>
          </div>

          {/* Right section: Schedule a Call & menu toggle button */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo('contact');
              }}
              className="!hidden sm:!inline-flex btn-pill-white"
            >
              <span>Book a Showing</span>
              <span className="arrow-circle-blue">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:!hidden w-11 h-11 rounded-full border border-white/20 bg-white/10 flex flex-col justify-center items-center gap-1.5 hover:scale-105 hover:border-white transition-all cursor-pointer shadow-sm relative z-50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-4.5 h-4.5 text-white" />
              ) : (
                <>
                  <span className="w-5 h-[1.5px] bg-white"></span>
                  <span className="w-5 h-[1.5px] bg-white"></span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu links container */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-[rgba(15,15,15,0.95)] backdrop-blur-[16px] border-b border-white/10 overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-[380px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
          <div className="px-6 py-8 flex flex-col gap-6 select-none">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo(link.id);
                }}
                className={`text-lg font-bold tracking-widest text-left transition-colors cursor-pointer min-h-[44px] py-3 flex items-center ${
                  activeSection === link.id ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo('contact');
              }}
              className="btn-pill-white w-full justify-center mt-4"
            >
              <span>Schedule a Call</span>
              <span className="arrow-circle-blue">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
};
