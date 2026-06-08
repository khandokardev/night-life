import React, { useState } from "react";
import { ArrowLeft, Shield } from "lucide-react";

export function OTPVerify() {
  const [digits, setDigits] = useState(["4", "8", "2", "", "", ""]);
  const activeIndex = 3; // 4th box is active

  return (
    <div className="min-h-screen bg-black overflow-y-auto relative font-['Inter'] text-white">
      <div className="relative z-10 px-6 pt-safe pb-8 flex flex-col min-h-screen">
        {/* Header */}
        <div className="pt-4 mb-12">
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-10">
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center text-center">
            {/* Decorative Icon */}
            <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.3)]"></div>
              <Shield size={32} className="text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            
            <h1 className="font-['Poppins'] font-bold text-3xl mb-3">Verify Your Number</h1>
            <p className="text-[#B3B3B3] text-sm max-w-[280px]">
              Enter the 6-digit code sent to <br />
              <span className="text-white font-medium">+27 82 *** 4521</span>
            </p>
          </div>
        </div>

        {/* OTP Form */}
        <div className="flex-1 flex flex-col items-center">
          <div className="flex gap-2 sm:gap-3 mb-10 w-full justify-center">
            {digits.map((digit, index) => (
              <div 
                key={index}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center text-2xl font-bold font-['Poppins'] transition-colors ${
                  index === activeIndex 
                    ? 'border-2 border-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                    : digit 
                      ? 'border border-white/20 bg-white/10' 
                      : 'border border-white/10 bg-white/5'
                }`}
              >
                {digit}
                {index === activeIndex && (
                  <div className="w-0.5 h-6 bg-[#D4AF37] animate-pulse"></div>
                )}
              </div>
            ))}
          </div>

          <button className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-transform active:scale-95 text-sm uppercase tracking-wide mb-6">
            Verify Code
          </button>

          <div className="text-center">
            <p className="text-[#D4AF37] font-medium text-sm mb-4">
              Resend code in 0:45
            </p>
          </div>

          {/* Bottom */}
          <div className="text-center mt-auto">
            <p className="text-[#B3B3B3] text-sm">
              Didn't receive code? <a href="#" className="text-[#D4AF37] font-bold hover:underline decoration-[#D4AF37]/50 underline-offset-2 ml-1">RESEND</a>
            </p>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .pt-safe { padding-top: env(safe-area-inset-top, 1rem); }
      `}} />
    </div>
  );
}

export default OTPVerify;
