import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';

interface TourFeature {
  id: string;
  label: string;
  type: 'color' | 'detail';
  img: string;
  title: string;
  desc: string;
}

export const CloserLookTour: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('community');
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  const features: TourFeature[] = [
    {
      id: 'community',
      label: 'Community',
      type: 'color',
      img: '/tour/tour_community.png',
      title: 'The Vibrant Community',
      desc: 'Experience a beautifully designed enclave of modern custom residences set amidst peaceful green walkways and a thriving upscale neighborhood.',
    },
    {
      id: 'pool',
      label: 'Pool Area',
      type: 'detail',
      img: '/tour/tour_pool.png',
      title: 'Resort-Style Pool',
      desc: 'Relax in a breathtaking crystal-clear swimming pool surrounded by custom stone-paved lounge decks and luxury landscaping.',
    },
    {
      id: 'kitchen',
      label: 'Kitchen Area',
      type: 'detail',
      img: '/tour/tour_kitchen.png',
      title: "Gourmet Chef's Kitchen",
      desc: 'An open-concept culinary space detailed with premium oak veneer cabinetry, hand-finished quartz stone islands, and high-end integrated appliances.',
    },
    {
      id: 'bedroom',
      label: 'Bedrooms',
      type: 'detail',
      img: '/tour/tour_bedrooms.png',
      title: 'Serene Master Bedroom',
      desc: 'Warm, light-filled private suites designed with massive glass doors and architectural layouts that catch soft natural lighting throughout the day.',
    },
    {
      id: 'sauna',
      label: 'Sauna',
      type: 'detail',
      img: '/tour/tour_sauna.png',
      title: 'Private Wellness Sauna',
      desc: 'Indulge in a dedicated home spa crafted with premium, moisture-resistant cedar paneling and a traditional heating stove.',
    },
    {
      id: 'outdoor-sitting',
      label: 'Outdoor Sitting',
      type: 'detail',
      img: '/tour/tour_outdoor_sitting.png',
      title: 'Al Fresco Lounge',
      desc: 'A custom outdoor living space complete with glass windbreaks, premium modern lounge seating, and a cozy built-in fire pit.',
    },
    {
      id: 'outdoor-kitchen',
      label: 'Outdoor Kitchen',
      type: 'detail',
      img: '/tour/tour_outdoor_kitchen.png',
      title: 'Outdoor Culinary Station',
      desc: 'Enjoy outdoor hosting with a professional-grade built-in gas grill, stainless steel prep counters, and concrete stone finishings.',
    },
    {
      id: 'area',
      label: 'The Area',
      type: 'detail',
      img: '/tour/tour_area.png',
      title: '1159 Diamond Locale',
      desc: "Nestled in one of the city's most desirable residential zip codes, combining scenic neighborhood vistas with direct access to local boutiques.",
    },
  ];

  const activeIdx = features.findIndex((f) => f.id === activeId);
  const activeFeature = features[activeIdx] || features[0];

  const handleNext = () => {
    const nextIdx = (activeIdx + 1) % features.length;
    setActiveId(features[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (activeIdx - 1 + features.length) % features.length;
    setActiveId(features[prevIdx].id);
  };

  const handlePillClick = (id: string) => {
    setActiveId(id);
    if (id !== 'community') {
      setIsMobileDetailOpen(true);
    } else {
      setIsMobileDetailOpen(false);
    }
  };

  return (
    <section id="closer-look" className="py-16 md:py-32 w-full bg-white select-none overflow-hidden">
      <div className="w-full px-6 md:px-12 lg:px-16 mb-10 select-none text-left">
        <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-neutral-900 font-sans">
          Take a closer look.
        </h2>
      </div>

      {/* Main Container */}
      <div className="w-full relative select-none">
        {/* Desktop Layout */}
        <div className="hidden md:flex mx-6 md:mx-12 lg:mx-16 bg-[#f5f5f7] rounded-[24px] md:rounded-[36px] p-8 md:p-12 lg:p-16 min-h-[640px] gap-12 md:gap-16 relative overflow-hidden border border-neutral-200/50 shadow-sm">
          
          {/* Left Column - Navigation & Text Description */}
          <div className="w-[35%] flex flex-col justify-between z-10 select-none">
            
            {/* Pills Stack */}
            <div className="flex flex-col gap-3 text-left">
              {features.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePillClick(item.id)}
                    className={`flex items-center gap-2.5 py-3 px-5 rounded-full transition-all text-left w-fit select-none font-sans text-[15px] font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-[#e8e8ed] text-[#1d1d1f] shadow-sm'
                        : 'bg-transparent text-[#86868b] hover:text-[#1d1d1f]'
                    }`}
                  >
                    {item.id === 'community' ? (
                      <span className="w-4 h-4 rounded-full border border-neutral-400 bg-neutral-800" />
                    ) : (
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        isActive ? 'border-[#1d1d1f] text-[#1d1d1f]' : 'border-[#86868b] text-[#86868b]'
                      }`}>
                        <Plus className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Floating Detail card for Active detail feature */}
            {activeId !== 'community' && (
              <div className="bg-[#e8e8ed]/80 backdrop-blur-md border border-white/20 p-6 rounded-[24px] max-w-sm mt-8 shadow-sm flex flex-col gap-4 text-left transition-all duration-300">
                <p className="text-[15px] leading-relaxed text-[#1d1d1f]">
                  <strong className="font-semibold text-[#1d1d1f]">{activeFeature.title}. </strong>
                  {activeFeature.desc}
                </p>
                {/* Horizontal Navigation inside detail card */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 rounded-full bg-white/90 shadow-sm border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-white active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 rounded-full bg-white/90 shadow-sm border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-white active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Image display */}
          <div className="w-[65%] relative rounded-[24px] overflow-hidden bg-white border border-neutral-200/50 shadow-sm select-none">
            
            {/* Centered Close Button in Container Top Right */}
            {activeId !== 'community' && (
              <button
                onClick={() => setActiveId('community')}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200/50 shadow-sm flex items-center justify-center text-[#1d1d1f] hover:bg-white active:scale-95 transition-all cursor-pointer z-20"
                aria-label="Close detail"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Main Visual Display */}
            <div className="absolute inset-0 w-full h-full select-none">
              {features.map((item) => (
                <div
                  key={item.id}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out ${
                    activeId === item.id ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />

                  {/* Subtle pulsing rings for sauna wellness steam effect */}
                  {item.id === 'sauna' && activeId === 'sauna' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="absolute w-48 h-48 rounded-full border-2 border-white/40 animate-ping duration-1000" />
                      <span className="absolute w-64 h-64 rounded-full border-2 border-white/20 animate-ping duration-1500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden w-full select-none">
          {/* Mobile Display Container */}
          <div className="mx-6 aspect-[4/3] rounded-[24px] bg-[#f5f5f7] flex items-center justify-center relative overflow-hidden border border-neutral-200/50 shadow-sm">
            
            {/* If Mobile Detail View is open */}
            {isMobileDetailOpen && activeId !== 'community' ? (
              <>
                <img
                  src={activeFeature.img}
                  alt={activeFeature.title}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                />
                
                {/* Header Close button */}
                <div className="absolute top-4 right-4 z-20 select-none">
                  <button
                    onClick={() => setIsMobileDetailOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200/50 shadow-sm flex items-center justify-center text-[#1d1d1f] transition-all cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Pulse rings for sauna/spa on mobile */}
                {activeId === 'sauna' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <span className="absolute w-32 h-32 rounded-full border border-white/40 animate-ping" />
                  </div>
                )}
              </>
            ) : (
              /* Default landing view for Colors */
              <>
                <img
                  src={features[0].img}
                  alt={features[0].title}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                />
              </>
            )}
          </div>

          {/* Description Block Underneath Image */}
          <div className="mt-6 px-6 min-h-[100px] flex flex-col justify-between text-left select-none">
            {isMobileDetailOpen && activeId !== 'community' ? (
              <div>
                <p className="text-[14px] leading-relaxed text-[#86868b] font-normal">
                  <strong className="font-semibold text-[#1d1d1f]">{activeFeature.title}. </strong>
                  {activeFeature.desc}
                </p>
                {/* Navigation Arrows */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={handlePrev}
                    className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-neutral-700 hover:bg-[#e8e8ed] active:scale-95 transition-all cursor-pointer border border-neutral-200/50"
                  >
                    <ChevronLeft className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-neutral-700 hover:bg-[#e8e8ed] active:scale-95 transition-all cursor-pointer border border-neutral-200/50"
                  >
                    <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[14px] leading-relaxed text-[#86868b] font-normal">
                <strong className="font-semibold text-[#1d1d1f]">{features[0].title}. </strong>
                {features[0].desc}
              </p>
            )}
          </div>

          {/* Horizontally scrollable chips stack at bottom of container */}
          <div 
            className="flex gap-2.5 overflow-x-auto py-4 px-6 select-none scrollbar-hide"
            style={{ touchAction: 'pan-x' }}
          >
            {features.map((item) => {
              const isActive = activeId === item.id && (item.id === 'community' ? !isMobileDetailOpen : isMobileDetailOpen);
              return (
                <button
                  key={item.id}
                  onClick={() => handlePillClick(item.id)}
                  className={`flex-shrink-0 flex items-center gap-2 py-2.5 px-4 rounded-full transition-all text-left select-none font-sans text-[13px] font-semibold cursor-pointer ${
                    isActive
                      ? 'bg-[#e8e8ed] text-[#1d1d1f] shadow-sm'
                      : 'bg-[#f5f5f7] text-[#86868b]'
                  }`}
                >
                  {item.id === 'community' ? (
                    <span className="w-3.5 h-3.5 rounded-full border border-neutral-400 bg-neutral-800" />
                  ) : (
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                      isActive ? 'border-[#1d1d1f] text-[#1d1d1f]' : 'border-[#86868b] text-[#86868b]'
                    }`}>
                      <Plus className="w-2 h-2 stroke-[3]" />
                    </span>
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
