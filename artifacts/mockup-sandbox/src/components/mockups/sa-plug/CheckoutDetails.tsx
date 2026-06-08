import React, { useState } from "react";
import { ArrowLeft, Calendar, Users, Check, ChevronRight } from "lucide-react";

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

export function CheckoutDetails() {
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("Lerato Mokoena");
  const [phone, setPhone] = useState("+27 82 345 6789");
  const [email, setEmail] = useState("lerato.mokoena@example.com");

  return (
    <div className="min-h-screen bg-[#080808] text-white font-['Inter']">
      <div className="flex items-center px-4 pt-6 pb-3 sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-white/5">
        <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 flex-shrink-0">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-['Poppins'] font-bold text-lg flex-1 text-center pr-9">Checkout</h1>
      </div>

      <Stepper step={1} />

      <div className="px-4 pb-32 space-y-6">
        {/* Order Summary */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-['Poppins'] font-bold text-base">Order Summary</h2>
            <button className="text-sm font-semibold" style={{ color: GOLD }}>Edit</button>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex gap-3">
            <img src={BOOKING.img} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
            <div className="flex-1 min-w-0">
              <p className="font-['Poppins'] font-bold text-sm leading-tight mb-1">{BOOKING.title}</p>
              <p className="text-[#B3B3B3] text-xs mb-2">{BOOKING.venue}</p>
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={11} style={{ color: GOLD }} />
                <span className="text-[11px] text-[#B3B3B3]">{BOOKING.date}</span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <Users size={11} style={{ color: GOLD }} />
                <span className="text-[11px] text-[#B3B3B3]">{BOOKING.guests}</span>
              </div>
              <p className="font-['Poppins'] font-bold text-base text-right" style={{ color: GOLD }}>{BOOKING.price}</p>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div>
          <h2 className="font-['Poppins'] font-bold text-base mb-3">Customer Details</h2>
          <div className="space-y-3">
            {([
              { label: "Full Name", value: name, set: setName, type: "text" },
              { label: "Phone Number", value: phone, set: setPhone, type: "tel" },
              { label: "Email Address", value: email, set: setEmail, type: "email" },
            ] as { label: string; value: string; set: (v: string) => void; type: string }[]).map(({ label, value, set, type }) => (
              <div key={label} className="bg-[#111] border border-white/10 rounded-xl px-4 py-3">
                <p className="text-[11px] text-[#777] mb-1">{label}</p>
                <input type={type} value={value} onChange={e => set(e.target.value)}
                  className="w-full bg-transparent text-white text-sm font-medium outline-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <button onClick={() => setAgreed(!agreed)} className="flex items-center gap-3 w-full text-left">
          <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
            style={{ borderColor: agreed ? GOLD : "#444", background: agreed ? GOLD : "transparent" }}>
            {agreed && <Check size={11} color="black" strokeWidth={3} />}
          </div>
          <span className="text-sm text-[#B3B3B3]">
            I agree to the <span style={{ color: GOLD }}>Terms & Conditions</span>
          </span>
        </button>
      </div>

      {/* Continue button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-5 bg-[#080808]/95 backdrop-blur-xl border-t border-white/5">
        <button className="w-full py-4 rounded-2xl font-bold text-black flex items-center justify-center gap-2 text-[15px] active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #D4AF37 0%, #C9A000 100%)", boxShadow: "0 8px 24px rgba(212,175,55,0.35)" }}>
          Continue to Payment <ChevronRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

export default CheckoutDetails;
