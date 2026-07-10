import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    travelDate: '',
    email: '',
    tripType: '',
    budget: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        lastName: '',
        travelDate: '',
        email: '',
        tripType: '',
        budget: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <section id="contact-form-section" className="w-full bg-[#f8f8fa] py-12 md:py-28 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6 select-none">
        
        {/* Contact Container Card */}
        <div className="bg-white border border-neutral-200 rounded-[24px] md:rounded-[48px] overflow-hidden p-4 md:p-12 lg:p-16 shadow-sm select-none">
          
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-8 lg:gap-16 items-stretch">
            
            {/* Left Column: Heading, Info, Image */}
            <div className="flex flex-col justify-between gap-10">
              
              <div className="flex flex-col gap-6 text-left">
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.15] hero-text-font">
                  Ready to see 1159 Diamond in person?
                </h3>
                <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-sm">
                  Schedule a private showing. Our team will walk you through every detail — from the hand-selected finishes to the resort-style backyard.
                </p>
              </div>

              {/* Graphic/Image cover wrapper */}
              <div className="w-full h-[180px] lg:h-[300px] rounded-[16px] md:rounded-[24px] overflow-hidden border border-neutral-100 shadow-inner">
                <img 
                  loading="lazy" 
                  src="/videos/neighborhood.webp" 
                  alt="Luxury kitchen design" 
                  className="w-full h-full object-cover"
                />
              </div>

            </div>

            {/* Right Column: Form Block */}
            <div className="flex flex-col justify-center">
              {submitted ? (
                <div className="bg-neutral-50 border border-neutral-300 rounded-3xl p-8 text-center flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900">Thank you!</h4>
                  <p className="text-neutral-600 text-sm">Your submission has been received successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  
                  {/* Row 1: Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2 text-left">
                      <label htmlFor="name" className="text-xs font-semibold text-neutral-800 tracking-wider uppercase">
                        Name
                      </label>
                      <input 
                        className="px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-all placeholder-neutral-400 text-neutral-900 font-medium"
                        type="text" 
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2 text-left">
                      <label htmlFor="lastName" className="text-xs font-semibold text-neutral-800 tracking-wider uppercase">
                        Last Name*
                      </label>
                      <input 
                        className="px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-all placeholder-neutral-400 text-neutral-900 font-medium"
                        type="text" 
                        id="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Travel Date & Work Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2 text-left">
                      <label htmlFor="travelDate" className="text-xs font-semibold text-neutral-800 tracking-wider uppercase">
                        Preferred Showing Date*
                      </label>
                      <select 
                        id="travelDate" 
                        className="px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 font-medium cursor-pointer"
                        value={formData.travelDate}
                        onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                        required
                      >
                        <option value="">Select a date</option>
                        <option value="This Weekend">This Weekend</option>
                        <option value="Next Week">Next Week</option>
                        <option value="Within 2 Weeks">Within 2 Weeks</option>
                        <option value="Flexible">I'm Flexible</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2 text-left">
                      <label htmlFor="email" className="text-xs font-semibold text-neutral-800 tracking-wider uppercase">
                        Work Email*
                      </label>
                      <input 
                        className="px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-all placeholder-neutral-400 text-neutral-900 font-medium"
                        type="email" 
                        id="email"
                        placeholder="example@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Row 3: Trip Types & Estimated Budget */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2 text-left">
                      <label htmlFor="tripType" className="text-xs font-semibold text-neutral-800 tracking-wider uppercase">
                        Buyer Type*
                      </label>
                      <select 
                        id="tripType" 
                        className="px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 font-medium cursor-pointer"
                        value={formData.tripType}
                        onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                        required
                      >
                        <option value="">Select buyer type</option>
                        <option value="First-Time Buyer">First-Time Buyer</option>
                        <option value="Investor">Investor</option>
                        <option value="Relocating">Relocating</option>
                        <option value="Upgrading">Upgrading My Home</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2 text-left">
                      <label htmlFor="budget" className="text-xs font-semibold text-neutral-800 tracking-wider uppercase">
                        Budget Range*
                      </label>
                      <select 
                        id="budget" 
                        className="px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 font-medium cursor-pointer"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        required
                      >
                        <option value="">Select range</option>
                        <option value="$1M - $1.5M">$1M — $1.5M</option>
                        <option value="$1.5M - $2M">$1.5M — $2M</option>
                        <option value="$2M+">$2M+</option>
                        <option value="Pre-Approved">Pre-Approved, Ready to Offer</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Message Textarea */}
                  <div className="flex flex-col gap-2 text-left">
                    <label htmlFor="message" className="text-xs font-semibold text-neutral-800 tracking-wider uppercase">
                      Message
                    </label>
                    <textarea 
                      id="message" 
                      className="px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-all placeholder-neutral-400 text-neutral-900 font-medium min-h-[140px] resize-none"
                      placeholder="Tell us what you're looking for in your next home..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  {/* Row 5: Submit Button */}
                  <button 
                    type="submit"
                    className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-4.5 px-8 rounded-full text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-md shadow-neutral-900/10 hover:shadow-lg hover:shadow-neutral-900/20"
                  >
                    <span>Schedule a Private Showing</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
