import React from "react";

export function Splash() {
  return (
    <div className="min-h-screen bg-black overflow-y-auto relative font-['Inter'] flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/__mockup/images/splash-bg.png" 
          alt="Night skyline" 
          className="w-full h-full object-cover opacity-40 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full">
        <div className="text-center mb-16">
          <img
            src="/__mockup/images/sa-plug-logo.png"
            alt="SA PLUG"
            className="w-72 h-auto mx-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.6)]"
          />
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="relative z-10 w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-16 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#D4AF37] to-[#FFF3B0] rounded-full w-1/2 animate-[pulse_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
}

export default Splash;
