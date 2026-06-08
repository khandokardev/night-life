import React from "react";
import { ChevronRight } from "lucide-react";

export function Onboarding() {
  return (
    <div className="min-h-screen bg-black overflow-y-auto relative font-['Inter']">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/__mockup/images/onboard-1.png" 
          alt="VIP Nightclub" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black"></div>
      </div>

      {/* Top bar */}
      <div className="absolute top-safe right-0 p-6 z-20 w-full flex justify-end">
        <button className="text-[#B3B3B3] text-sm font-medium hover:text-white transition-colors">
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-10 flex flex-col pb-safe">
        <h2 className="font-['Poppins'] font-bold text-4xl text-white mb-4 leading-tight uppercase">
          Experience <br />
          <span className="text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">Luxury</span> <br />
          Nightlife
        </h2>
        
        <p className="text-[#B3B3B3] text-base mb-10 leading-relaxed max-w-sm">
          Exclusive access to South Africa's most premium venues, bottle service, and unforgettable experiences.
        </p>

        {/* Footer controls */}
        <div className="flex items-center justify-between mt-auto pt-4">
          {/* Indicators */}
          <div className="flex gap-2">
            <div className="w-8 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
            <div className="w-2 h-1 rounded-full bg-white/20"></div>
            <div className="w-2 h-1 rounded-full bg-white/20"></div>
          </div>

          {/* Next Button */}
          <button className="flex items-center gap-2 bg-[#D4AF37] text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(212,175,55,0.5)] active:scale-95 transition-transform">
            Next <ChevronRight size={18} className="stroke-[3]" />
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .top-safe { top: env(safe-area-inset-top, 1rem); }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 2rem); }
      `}} />
    </div>
  );
}

export default Onboarding;
