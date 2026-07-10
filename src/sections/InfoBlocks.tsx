import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { registerAnimation, gsap } from '../lib/scroll';
import { HorizontalScrubSection } from './HorizontalScrubSection';

export const InfoBlocks: React.FC = () => {
  const introTextRef = useRef<HTMLDivElement>(null);
  const introImgRef = useRef<HTMLImageElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const workRefs = useRef<HTMLDivElement[]>([]);

  // Clear array to prevent accumulation on re-renders
  workRefs.current = [];

  // Staggered counters state
  const [counts, setCounts] = useState({ brands: 0, partners: 0, users: 0, rate: 0 });

  const aboutParagraph = "Flooring Studio isn't just about flooring — it's about crafting the base of your statement. Every surface is designed and custom installed to elevate how you live, work, and connect in your luxury spaces.";
  const aboutChars = aboutParagraph.split("");

  useEffect(() => {
    registerAnimation(() => {
      // 1. Reveal Intro Paragraph Character-by-Character on Scroll
      if (introTextRef.current) {
        gsap.fromTo(
          introTextRef.current.querySelectorAll('.about-char'),
          { opacity: 0.15 },
          {
            scrollTrigger: {
              trigger: introTextRef.current,
              start: 'top 80%',
              end: 'bottom 40%',
              scrub: true,
            },
            opacity: 1,
            stagger: 0.02,
            ease: 'none',
          }
        );
      }

      // Parallax zoom on the wide Soap Bubble image
      if (introImgRef.current) {
        gsap.fromTo(
          introImgRef.current,
          { scale: 1.15, y: -50 },
          {
            scrollTrigger: {
              trigger: introImgRef.current,
              start: 'top 90%',
              end: 'bottom 10%',
              scrub: true,
            },
            scale: 1,
            y: 50,
            ease: 'none',
          }
        );
      }

      // 2. Statistics Counter triggers
      if (statsRef.current) {
        const statsObj = { brands: 0, partners: 0, users: 0, rate: 0 };
        gsap.to(statsObj, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
          brands: 185,
          partners: 63,
          users: 2.5,
          rate: 96,
          duration: 2,
          ease: 'power3.out',
          onUpdate: () => {
            setCounts({
              brands: Math.floor(statsObj.brands),
              partners: Math.floor(statsObj.partners),
              users: parseFloat(statsObj.users.toFixed(1)),
              rate: Math.floor(statsObj.rate),
            });
          },
        });
      }

      // 3. Service Cards Sticky Deck-Stacking Animation
      if (cardsContainerRef.current) {
        const cards = gsap.utils.toArray('.service-card') as HTMLElement[];
        cards.forEach((card, idx) => {
          if (idx === cards.length - 1) return; // Last card doesn't need to scale down

          gsap.to(card, {
            scrollTrigger: {
              trigger: cards[idx + 1],
              start: 'top 90%',
              end: 'top 15%',
              scrub: true,
            },
            scale: 0.93 - idx * 0.01,
            opacity: 0.6,
            ease: 'none',
          });
        });
      }

      // 4. Staggered reveal for Featured Work Cards
      workRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          }
        );
      });
    });
  }, []);

  // Services data
  const services = [
    {
      num: '01',
      title: 'Custom Installations',
      desc: 'Flawless, professional installation of premium hardwood, engineered planks, and large-format tile. Our expert craftsmen ensure precision cuts, perfect leveling, and meticulous finishing for every square inch of your space.',
      img: '/portfolio/service_marketing.webp',
    },
    {
      num: '02',
      title: 'Material Consultation',
      desc: 'Our designers help you choose the perfect species, finish, and plank width to match your aesthetic and lifestyle. We coordinate texture, tone, and durability to elevate the visual harmony of your custom interiors.',
      img: '/portfolio/service_branding.webp',
    },
    {
      num: '03',
      title: 'Residential Spaces',
      desc: 'Premium hardwood flooring designed for comfort, warmth, and luxury. Our selection of engineered oaks and walnuts creates a serene and inviting atmosphere in private rooms and suites, built to stand the test of time.',
      img: '/portfolio/service_packaging.webp',
    },
    {
      num: '04',
      title: 'Living & Open Areas',
      desc: 'Stunning, high-durability wood floors for large open-plan living rooms, dining rooms, and high-traffic areas. Hand-selected planks integrate seamlessly across open spaces, accentuating natural light and modern architecture.',
      img: '/portfolio/service_illustration.webp',
    },
  ];

  // Portfolio items data
  const works = [
    {
      title: 'Premium Engineered Oak Flooring',
      category: 'WOOD FLOORING',
      img: '/portfolio/work1.webp',
      logo: 'https://cdn.prod.website-files.com/69c39b407bf7f57b938e2859/69d37a58c21e8ca1f40693e3_Frame-1.svg',
      size: 'large',
    },
    {
      title: 'Modern Kitchen Cabinetry & Woodwork',
      category: 'CABINETRY',
      img: '/portfolio/work2.webp',
      logo: 'https://cdn.prod.website-files.com/69c39b407bf7f57b938e2859/69d37a6e2b009277c12aca25_Frame.svg',
      size: 'small',
    },
    {
      title: 'Luxury Kitchen Island & Marble Countertops',
      category: 'SURFACES',
      img: '/portfolio/work3.webp',
      logo: 'https://cdn.prod.website-files.com/69c39b407bf7f57b938e2859/69d37a6218071ba084debd2a_Frame-2.svg',
      size: 'small',
    },
    {
      title: 'Premium Quartz & Stone Slabs',
      category: 'STONE SLABS',
      img: '/portfolio/work4.webp',
      logo: 'https://cdn.prod.website-files.com/69c39b407bf7f57b938e2859/69d37a787a3dcbb4cc337f7c_logo-32.svg',
      size: 'large',
    },
  ];

  // Testimonials sliders data
  const testimonials = [
    {
      quote: "The moment I walked in, I knew this wasn't just another renovation. Every detail, from the hardware to the lighting, was thoughtfully chosen. This is the kind of home you dream about.",
      author: "Sarah Mitchell",
      role: "Interior Design Editor, Architectural Digest",
    },
    {
      quote: "Flooring Studio transformed this property into something truly extraordinary. The quality of craftsmanship rivals homes at twice the price point. 1159 Diamond is a masterpiece.",
      author: "James Hartwell",
      role: "Luxury Real Estate Advisor, Coldwell Banker Global Luxury",
    },
    {
      quote: "I've toured hundreds of luxury homes in my career. What sets 1159 Diamond apart is the livability — it's not just beautiful, it's designed for how real families actually live.",
      author: "Elena Rodriguez",
      role: "Senior Broker, The Agency Beverly Hills",
    },
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Intro Reveal Block */}
      <section id="about" className="py-16 md:py-36 max-w-7xl mx-auto px-4 md:px-6 text-center">
        <div ref={introTextRef} className="max-w-4xl mx-auto text-left leading-tight md:leading-normal">
          <h2 className="text-xl md:text-5xl font-medium tracking-tight text-neutral-900 select-none">
            {aboutChars.map((char, i) => (
              <span key={i} className="about-char opacity-15">
                {char}
              </span>
            ))}
          </h2>
        </div>

        {/* Wide Landscape Image Block with parallax zoom */}
        <div className="mt-10 md:mt-24 rounded-[24px] md:rounded-[48px] overflow-hidden aspect-[16/9] w-full max-h-[720px] shadow-sm relative bg-neutral-100">
          <img
            ref={introImgRef}
            src="/videos/neighborhood.webp"
            alt="Luxury kitchen island view"
            loading="lazy"
            className="w-full h-full object-cover scale-100"
          />
        </div>
      </section>

      {/* 2. Stats Counters Block */}
      <section ref={statsRef} className="py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 select-none">
        {/* Stat 1 */}
        <div className="p-6 md:p-10 rounded-[20px] md:rounded-[32px] bg-accent-soft-blue flex flex-col justify-between min-h-[160px] md:min-h-[220px] shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="text-3xl md:text-6xl font-bold tracking-tight text-neutral-900">{counts.brands}+</div>
          <div className="text-xs md:text-sm font-semibold tracking-wide text-neutral-900/60 leading-relaxed">Premium fixtures and finishes sourced worldwide.</div>
        </div>

        {/* Stat 2 */}
        <div className="p-6 md:p-10 rounded-[20px] md:rounded-[32px] bg-accent-soft-purple flex flex-col justify-between min-h-[160px] md:min-h-[220px] shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="text-3xl md:text-6xl font-bold tracking-tight text-neutral-900">{counts.partners}</div>
          <div className="text-xs md:text-sm font-semibold tracking-wide text-neutral-900/60 leading-relaxed">Days of expert craftsmanship poured into every detail.</div>
        </div>

        {/* Stat 3 */}
        <div className="p-6 md:p-10 rounded-[20px] md:rounded-[32px] bg-accent-soft-green flex flex-col justify-between min-h-[160px] md:min-h-[220px] shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="text-3xl md:text-6xl font-bold tracking-tight text-neutral-900">{counts.users}K</div>
          <div className="text-xs md:text-sm font-semibold tracking-wide text-neutral-900/60 leading-relaxed">Square feet of premium surfaces and custom flooring installed.</div>
        </div>

        {/* Stat 4 */}
        <div className="p-6 md:p-10 rounded-[20px] md:rounded-[32px] bg-accent-soft-yellow flex flex-col justify-between min-h-[160px] md:min-h-[220px] shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="text-3xl md:text-6xl font-bold tracking-tight text-neutral-900">{counts.rate}%</div>
          <div className="text-xs md:text-sm font-semibold tracking-wide text-neutral-900/60 leading-relaxed">Of clients report 100% satisfaction with their customized layouts.</div>
        </div>
      </section>

      {/* 3. Featured Work Grid */}
      <section id="featured-work" className="py-16 md:py-36 max-w-7xl mx-auto px-4 md:px-6 select-none">
        <div className="flex justify-between items-end border-b border-neutral-100 pb-6 md:pb-8 mb-10 md:mb-16 select-none">
          <h2 className="text-2xl md:text-5xl font-semibold tracking-tight text-neutral-900 text-left">Every room, a masterpiece.</h2>
          <a
            href="#contact"
            className="text-xs font-bold tracking-widest uppercase cursor-pointer transition-colors max-md:min-h-[44px] max-md:px-5 max-md:py-3 max-md:bg-neutral-900 max-md:text-white max-md:rounded-full max-md:inline-flex max-md:items-center max-md:justify-center md:text-neutral-400 md:hover:text-neutral-900 md:border-b md:border-neutral-200 md:pb-1"
          >
            BOOK A SHOWING          </a>
        </div>

        {/* 4 Cards Grid - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start select-none">
          {/* Column Left */}
          <div className="flex flex-col gap-16 select-none">
            {works.filter((_, idx) => idx % 2 === 0).map((work, idx) => (
              <div
                key={idx}
                ref={(el) => { if (el) workRefs.current.push(el); }}
                className="group relative cursor-pointer select-none text-left"
              >
                <div className="rounded-[24px] md:rounded-[48px] overflow-hidden aspect-square relative bg-neutral-100 shadow-sm transition-all duration-700 hover:shadow-lg">
                  <img
                    src={work.img}
                    alt={work.title}
                    className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out select-none pointer-events-none"
                    loading="lazy"
                  />
                  {/* Floating logo watermark */}
                  <img
                    src={work.logo}
                    alt=""
                    loading="lazy"
                    className="absolute top-8 left-8 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-sm group-hover:scale-110 transition-transform duration-300 pointer-events-none"
                  />
                </div>
                <div className="mt-6 flex justify-between items-start select-none">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 tracking-tight leading-snug">{work.title}</h3>
                    <span className="text-[11px] font-bold tracking-wider text-neutral-400 mt-2 block uppercase">{work.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Column Right */}
          <div className="flex flex-col gap-16 md:mt-24 select-none">
            {works.filter((_, idx) => idx % 2 !== 0).map((work, idx) => (
              <div
                key={idx}
                ref={(el) => { if (el) workRefs.current.push(el); }}
                className="group relative cursor-pointer select-none text-left"
              >
                <div className="rounded-[24px] md:rounded-[48px] overflow-hidden aspect-[4/3] relative bg-neutral-100 shadow-sm transition-all duration-700 hover:shadow-lg">
                  <img
                    src={work.img}
                    alt={work.title}
                    className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out select-none pointer-events-none"
                    loading="lazy"
                  />
                  {/* Floating logo watermark */}
                  <img
                    src={work.logo}
                    alt=""
                    loading="lazy"
                    className="absolute top-8 left-8 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-sm group-hover:scale-110 transition-transform duration-300 pointer-events-none"
                  />
                </div>
                <div className="mt-6 flex justify-between items-start select-none">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 tracking-tight leading-snug">{work.title}</h3>
                    <span className="text-[11px] font-bold tracking-wider text-neutral-400 mt-2 block uppercase">{work.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.5 Horizontal Scrub Scroll Section */}
      <HorizontalScrubSection />

      {/* 4. What We Do - Services (Sticky Stacked Cards) */}
      <section id="what-we-do" className="py-16 md:py-36 max-w-7xl mx-auto px-4 md:px-6 select-none">
        <div className="flex justify-between items-end border-b border-neutral-100 pb-6 md:pb-8 mb-10 md:mb-16 select-none">
          <h2 className="text-2xl md:text-5xl font-semibold tracking-tight text-neutral-900 text-left">Built without compromise.</h2>
          <a
            href="#contact"
            className="text-xs font-bold tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors uppercase border-b border-neutral-200 pb-1 cursor-pointer"
          >
            SEE ALL FEATURES          </a>
        </div>

        {/* Sticky stacked cards deck wrapper */}
        <div ref={cardsContainerRef} className="flex flex-col gap-12 relative select-none">
          {services.map((srv, idx) => (
            <div
              key={srv.num}
              className="service-card flex flex-col md:flex-row items-center gap-6 md:gap-16 bg-[#f7f7f7] rounded-[24px] md:rounded-[40px] overflow-hidden p-4 md:p-12 sticky top-[80px] md:top-[100px] border border-neutral-100 shadow-sm text-left origin-top"
              style={{ top: `${(typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : 100) + idx * 24}px` }}
            >
              {/* Left Column: Image wrapper */}
              <div className="w-full md:w-[48%] rounded-[16px] md:rounded-[32px] overflow-hidden h-[220px] md:h-[460px] bg-neutral-200 select-none">
                <img
                  src={srv.img}
                  alt={srv.title}
                  className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
                  loading="lazy"
                />
              </div>

              {/* Right Column: Text content */}
              <div className="w-full md:w-[48%] flex flex-col justify-between h-auto md:h-[440px] py-2 md:py-6 select-none">
                <div>
                  <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-4 md:mb-6">{srv.title}</h3>
                  <p className="text-sm md:text-base font-semibold leading-relaxed text-neutral-500 max-w-md">
                    {srv.desc}
                  </p>
                </div>
                <a
                  href="#contact"
                  className="text-xs font-bold tracking-widest text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 pb-1 self-start uppercase cursor-pointer"
                >
                  INQUIRE NOW                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Testimonial section */}
      <section id="testimonials" className="py-16 md:py-36 bg-neutral-100 select-none relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10 select-none">
          {/* Avatar Heads */}
          <div className="flex justify-center items-center gap-2 md:gap-4 mb-8 md:mb-12 select-none">
            {[
              'https://cdn.prod.website-files.com/69afdc8a4623a5482ae228d5/69d35cf907a29c2bded6cb28_team_member_image.webp',
              'https://cdn.prod.website-files.com/69afdc8a4623a5482ae228d5/69d35cf9042ff8a031980e12_rectangle_8187.webp',
              'https://cdn.prod.website-files.com/69afdc8a4623a5482ae228d5/69d35cf9df7f1359aa877094_team_member_image%20(1).webp',
              'https://cdn.prod.website-files.com/69afdc8a4623a5482ae228d5/69d35cb18b9fd2f0247b8c8c_QmQbEgtz48twTB88PEQ3S4AdjckYP3cJGq1MhiycBeiA7V.avif',
            ].map((avatar, idx) => (
              <img
                key={idx}
                src={avatar}
                alt=""
                loading="lazy"
                className={`w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-2 shadow-sm cursor-pointer transition-all duration-300 ${
                  activeTestimonial === idx ? 'border-neutral-900 scale-110 saturate-100' : 'border-transparent saturate-0 hover:saturate-50'
                }`}
                onClick={() => setActiveTestimonial(idx % testimonials.length)}
              />
            ))}
          </div>

          {/* Testimonial text block */}
          <div className="min-h-[140px] md:min-h-[160px] flex flex-col justify-center items-center select-none">
            <p className="text-base md:text-3xl font-medium text-neutral-900 tracking-tight leading-relaxed italic max-w-3xl">
              &quot;{testimonials[activeTestimonial].quote}&quot;
            </p>
            <div className="mt-6 md:mt-8 select-none">
              <span className="block text-xs md:text-sm font-bold text-neutral-900 uppercase tracking-widest">{testimonials[activeTestimonial].author}</span>
              <span className="block text-[10px] md:text-xs font-semibold text-neutral-400 mt-1 uppercase">{testimonials[activeTestimonial].role}</span>
            </div>
          </div>

          {/* Sliding Controls */}
          <div className="flex justify-center items-center gap-4 md:gap-6 mt-8 md:mt-12 select-none">
            <button
              onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="p-2 md:p-3 bg-white hover:bg-neutral-900 hover:text-white rounded-full transition-all duration-300 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="p-2 md:p-3 bg-white hover:bg-neutral-900 hover:text-white rounded-full transition-all duration-300 shadow-sm cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
