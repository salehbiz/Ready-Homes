import React from 'react';

export const FeatureDetails: React.FC = () => {
  return (
    <section id="feature-details" className="py-16 md:py-36 w-full bg-white select-none overflow-hidden text-left">
      <div className="w-full px-6 md:px-12 lg:px-16 select-none">
        
        {/* Category & Header */}
        <div className="max-w-4xl mb-16 md:mb-24">
          <span className="text-[#e30022] text-sm md:text-base font-bold tracking-widest uppercase block mb-3 font-sans">
            Craftsmanship
          </span>
          <h2 className="text-4xl md:text-[5.5rem] font-bold tracking-tight text-[#1d1d1f] mb-6 md:mb-8 font-sans leading-none">
            Better by every measure.
          </h2>
          <p className="text-[17px] md:text-[21px] text-[#86868b] leading-relaxed font-normal font-sans max-w-3xl">
            Designed with an uncompromising eye for detail and crafted from the finest materials, 1159 Diamond St represents modern luxury living at its finest. From the precision-engineered micro-bevel joint floorings underfoot to the architectural geometry of its open-concept spaces, this home is built to inspire. Experience a residence where state-of-the-art building science meets organic warmth.
          </p>
        </div>

        {/* Alternating Detail Blocks */}
        <div className="flex flex-col gap-20 md:gap-36">
          
          {/* Block 1: Joints (Image left, text right on desktop. Text top, image bottom on mobile) */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Image (Left on desktop) - rendered first in DOM, so mobile shows it below if we put text on top?
                Wait, on mobile, Screenshot 1 shows text on top, image below.
                So on mobile we want Text on top, Image below.
                We can achieve this with CSS order!
                Container has flex flex-col md:flex-row.
                Image card has order-2 md:order-1.
                Text panel has order-1 md:order-2.
            */}
            <div className="w-full md:w-[60%] aspect-[4/3] rounded-[24px] md:rounded-[36px] overflow-hidden bg-[#f5f5f7] border border-neutral-200/50 shadow-sm order-2 md:order-1">
              <img
                src="/tour/house_aerial.webp"
                alt="Aerial view of 1159 Diamond"
                loading="lazy"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            <div className="w-full md:w-[40%] flex flex-col gap-5 text-left order-1 md:order-2 pr-0 md:pr-8">
              {/* Precision Joints SVG Icon */}
              <div className="w-14 h-14 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#e30022] shadow-sm border border-neutral-100">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 10h10M7 14h10M4 6v12M20 6v12"/>
                </svg>
              </div>
              <p className="text-[15px] md:text-[17px] text-[#86868b] font-normal leading-relaxed font-sans max-w-sm">
                <strong className="text-[#1d1d1f] font-semibold">Perfect micro-bevel joints. </strong>
                Every floorboard in the main residence fits together with less than a tenth of a millimeter of space, creating a completely smooth, flush surface underfoot that is built to endure.
              </p>
            </div>
          </div>

          {/* Block 2: Scratch Shield (Text left, image right on desktop. Image top, text bottom on mobile) */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* On mobile, Screenshot 3 shows Image on top, text below.
                So on mobile we want Image on top, Text below.
                We can achieve this with CSS order:
                Image card has order-1 md:order-2.
                Text panel has order-2 md:order-1.
            */}
            <div className="w-full md:w-[60%] aspect-[4/3] rounded-[24px] md:rounded-[36px] overflow-hidden bg-[#f5f5f7] border border-neutral-200/50 shadow-sm order-1 md:order-2">
              <img
                src="/tour/house_address.webp"
                alt="1159 Diamond Street Address"
                loading="lazy"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            <div className="w-full md:w-[40%] flex flex-col gap-5 text-left order-2 md:order-1 pl-0 md:pl-8">
              {/* Scratch Shield SVG Icon */}
              <div className="w-14 h-14 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#e30022] shadow-sm border border-neutral-100">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <p className="text-[15px] md:text-[17px] text-[#86868b] font-normal leading-relaxed font-sans max-w-sm">
                <strong className="text-[#1d1d1f] font-semibold">Resilient premium materials. </strong>
                Featuring premium stone slabs and UV-cured wood finishes throughout, the home is engineered to resist high traffic, fading, and wear, ensuring it remains timeless for decades.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
