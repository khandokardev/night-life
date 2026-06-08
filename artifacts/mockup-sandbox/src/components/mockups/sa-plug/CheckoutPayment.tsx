import React, { useState } from "react";
import { ArrowLeft, Calendar, Users, Check, CreditCard, Tag, Lock } from "lucide-react";

const GOLD = "#D4AF37";

const BOOKING = {
  title: "Rooftop Sunset Experience",
  venue: "Urban Glow",
  date: "Sat, 25 May 2024 · 7:00 PM",
  guests: "2 Guests",
  price: "R1,200",
  img: "/__mockup/images/onyx.png",
};

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

const ApplePayBadge = () => (
  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "#1D1D1F" }}>
    <svg width={14} height={17} viewBox="0 0 814 1000" fill="white">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 134.4-317.8 266.5-317.8 69.8 0 127.9 45.1 172.4 45.1 42.8 0 109.1-47.2 187.4-47.2 14.6 0 108.2 1.3 172.4 62.2zm-174.4-102.7c33.4-39.5 57.1-94.3 57.1-149.2 0-7.7-.6-15.4-1.9-22.4-54.2 1.9-117.8 36.5-155.6 80.5-30.6 35.8-60.3 90.7-60.3 146.8 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.3 1.3 13.4 1.3 48.7 0 109.1-33.4 145.4-76.2z"/>
    </svg>
    <span className="text-white font-semibold text-xs tracking-tight">Pay</span>
  </div>
);

const GPayBadge = () => (
  <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#1D1D1F" }}>
    <svg width={16} height={16} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    <span className="text-white font-semibold text-xs tracking-tight">Pay</span>
  </div>
);

export function CheckoutPayment() {
  const [payMethod, setPayMethod] = useState<"card" | "apple" | "google">("card");
  const [promo, setPromo] = useState("");

  const opts = [
    { id: "card" as const, icon: <CreditCard size={20} style={{ color: GOLD }} />, label: "Card", sub: "Visa, Mastercard, Amex" },
    { id: "apple" as const, icon: <ApplePayBadge />, label: "Apple Pay", sub: null },
    { id: "google" as const, icon: <GPayBadge />, label: "Google Pay", sub: null },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white font-['Inter']">
      <div className="flex items-center px-4 pt-6 pb-3 sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-white/5">
        <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 flex-shrink-0">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-['Poppins'] font-bold text-lg flex-1 text-center pr-9">Checkout</h1>
      </div>

      <Stepper step={2} />

      <div className="px-4 pb-36 space-y-6">
        {/* Booking Details */}
        <div>
          <h2 className="font-['Poppins'] font-bold text-base mb-3">Booking Details</h2>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex gap-3">
            <img src={BOOKING.img} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
            <div className="flex-1 min-w-0">
              <p className="font-['Poppins'] font-bold text-sm leading-tight mb-1">{BOOKING.title}</p>
              <p className="text-[#B3B3B3] text-xs mb-2">{BOOKING.venue}</p>
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={10} style={{ color: GOLD }} />
                <span className="text-[10px] text-[#B3B3B3] flex-1">{BOOKING.date}</span>
                <span className="font-['Poppins'] font-bold text-sm" style={{ color: GOLD }}>{BOOKING.price}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={10} style={{ color: GOLD }} />
                <span className="text-[10px] text-[#B3B3B3]">{BOOKING.guests}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="font-['Poppins'] font-bold text-base mb-3">Payment Method</h2>
          <div className="space-y-2.5">
            {opts.map(({ id, icon, label, sub }) => {
              const sel = payMethod === id;
              return (
                <button key={id} onClick={() => setPayMethod(id)}
                  className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all"
                  style={{ background: sel ? "rgba(212,175,55,0.07)" : "#111", border: `1.5px solid ${sel ? GOLD : "rgba(255,255,255,0.1)"}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: sel ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.05)" }}>
                    {icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm">{label}</p>
                    {sub && <p className="text-[11px] text-[#777]">{sub}</p>}
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: sel ? GOLD : "#444" }}>
                    {sel && <div className="w-2.5 h-2.5 rounded-full" style={{ background: GOLD }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <h2 className="font-['Poppins'] font-bold text-base mb-3">Promo Code</h2>
          <div className="bg-[#111] border border-white/10 rounded-2xl flex items-center px-4">
            <Tag size={15} style={{ color: GOLD }} className="flex-shrink-0 mr-2" />
            <input value={promo} onChange={e => setPromo(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-[#444]" />
            <button className="font-bold text-sm py-1.5 px-3 rounded-xl flex-shrink-0" style={{ color: GOLD }}>Apply</button>
          </div>
        </div>

        {/* Total */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-['Poppins'] font-bold text-base">Total Amount</p>
              <p className="text-[#777] text-xs mt-0.5">Inclusive of taxes and fees</p>
            </div>
            <p className="font-['Poppins'] font-bold text-2xl">R1,200</p>
          </div>
        </div>
      </div>

      {/* Pay button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-5 bg-[#080808]/95 backdrop-blur-xl border-t border-white/5">
        <button className="w-full py-4 rounded-2xl font-bold text-black flex items-center justify-center gap-2 text-[15px] active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #D4AF37 0%, #C9A000 100%)", boxShadow: "0 8px 24px rgba(212,175,55,0.35)" }}>
          <Lock size={16} color="black" strokeWidth={2.5} /> Pay R1,200
        </button>
      </div>
    </div>
  );
}

export default CheckoutPayment;
