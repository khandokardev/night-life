import React from "react";
import { Calendar, Users, Check, CreditCard, ChevronRight, Share2 } from "lucide-react";

const GOLD = "#D4AF37";

const BOOKING = {
  title: "Rooftop Sunset Experience",
  venue: "Urban Glow",
  date: "Sat, 25 May 2024 · 7:00 PM",
  guests: "2 Guests",
  price: "R1,200",
  img: "/__mockup/images/onyx.png",
};

function Sparkle({ size = 38, color = GOLD }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
    </svg>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Details", "Payment", "Confirmation"];
  return (
    <div className="flex items-center justify-center py-4 px-4">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === step;
        const done = num < step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={active || done ? { background: GOLD, color: "#000" } : { background: "transparent", border: "1.5px solid #444", color: "#666" }}>
                {done ? <Check size={12} strokeWidth={3} /> : num}
              </div>
              <span className="text-[10px] font-medium" style={{ color: active ? "#fff" : "#666" }}>{label}</span>
            </div>
            {i < 2 && <div className="h-px w-10 mb-4 mx-1.5" style={{ background: num < step ? GOLD : "#2A2A2A" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const confettiPieces = [
  { x: 8, y: 30, color: GOLD, r: 30, w: 9, h: 5 },
  { x: 82, y: 18, color: "#FF6B6B", r: -20, w: 6, h: 9 },
  { x: 10, y: 60, color: "#4ECDC4", r: 45, w: 5, h: 8 },
  { x: 86, y: 55, color: GOLD, r: -45, w: 8, h: 5 },
  { x: 72, y: 20, color: "#A78BFA", r: 15, w: 9, h: 6 },
  { x: 20, y: 42, color: "#FCA5A5", r: -30, w: 6, h: 7 },
  { x: 90, y: 38, color: "#6EE7B7", r: 60, w: 5, h: 9 },
  { x: 38, y: 10, color: "#FBBF24", r: -15, w: 8, h: 5 },
  { x: 62, y: 8, color: "#F472B6", r: 35, w: 5, h: 10 },
  { x: 50, y: 14, color: GOLD, r: 50, w: 6, h: 6 },
];

export function CheckoutConfirmed() {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-['Inter'] pb-10">
      <Stepper step={3} />

      {/* Celebration hero */}
      <div className="relative flex flex-col items-center pt-4 pb-8 px-6">
        {confettiPieces.map((c, i) => (
          <div key={i} className="absolute rounded-sm opacity-75 pointer-events-none"
            style={{ left: `${c.x}%`, top: c.y, width: c.w, height: c.h, background: c.color, transform: `rotate(${c.r}deg)` }} />
        ))}
        <div className="relative mb-5">
          <div className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.08) 100%)", border: "1.5px solid rgba(212,175,55,0.4)" }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1C1500 0%, #2A1F00 100%)", border: "1px solid rgba(212,175,55,0.5)" }}>
              <Sparkle size={38} color={GOLD} />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-2 border-[#080808] flex items-center justify-center">
            <Check size={14} color="white" strokeWidth={3} />
          </div>
        </div>
        <h1 className="font-['Poppins'] font-bold text-2xl mb-2">Booking Confirmed!</h1>
        <p className="text-[#B3B3B3] text-sm text-center leading-relaxed">
          You're all set. Get ready for an<br />unforgettable experience.
        </p>
      </div>

      <div className="px-4 space-y-4">
        {/* Booking Summary */}
        <div>
          <h2 className="font-['Poppins'] font-bold text-base mb-3">Booking Summary</h2>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex gap-3 mb-3">
            <img src={BOOKING.img} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
            <div className="flex-1 min-w-0">
              <p className="font-['Poppins'] font-bold text-sm leading-tight mb-1">{BOOKING.title}</p>
              <p className="text-[#B3B3B3] text-xs mb-2">{BOOKING.venue}</p>
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={10} style={{ color: GOLD }} />
                <span className="text-[10px] text-[#B3B3B3]">{BOOKING.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={10} style={{ color: GOLD }} />
                <span className="text-[10px] text-[#B3B3B3]">{BOOKING.guests}</span>
              </div>
            </div>
            <p className="font-['Poppins'] font-bold text-base self-end flex-shrink-0" style={{ color: GOLD }}>{BOOKING.price}</p>
          </div>

          {/* Payment summary */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">Total Paid</span>
              <span className="font-['Poppins'] font-bold text-lg" style={{ color: GOLD }}>R1,200</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#777]">Payment Method</span>
              <div className="flex items-center gap-1.5">
                <CreditCard size={14} style={{ color: GOLD }} />
                <span className="text-sm font-medium">Visa •••• 4242</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <button className="w-full py-4 rounded-2xl font-bold text-black flex items-center justify-center gap-2 text-[15px] active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #D4AF37 0%, #C9A000 100%)", boxShadow: "0 8px 24px rgba(212,175,55,0.35)" }}>
          View My Bookings <ChevronRight size={18} strokeWidth={3} />
        </button>
        <button className="w-full py-4 rounded-2xl font-semibold text-white text-[15px] border border-white/15 flex items-center justify-center gap-2 active:scale-95 transition-transform bg-white/5">
          <Calendar size={18} style={{ color: GOLD }} /> Add to Calendar
        </button>
        <button className="w-full py-4 rounded-2xl font-semibold text-white text-[15px] border border-white/15 flex items-center justify-center gap-2 active:scale-95 transition-transform bg-white/5">
          <Share2 size={18} style={{ color: GOLD }} /> Share Booking
        </button>
      </div>
    </div>
  );
}

export default CheckoutConfirmed;
