import React, { useState } from "react";
import { ArrowLeft, Mail, Phone, Send, ShieldCheck, MessageSquare } from "lucide-react";
import { CountryCodePicker, DEFAULT_COUNTRY, type Country } from "./CountryCodePicker";

const GOLD = "#D4AF37";

const Sparkle = ({ size = 14, color = GOLD }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
  </svg>
);

export function ForgotPassword({ navigate }: { navigate?: (s: string) => void }) {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const go = (s: string) => navigate?.(s);

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-['Inter'] text-white flex flex-col px-6">
      <button onClick={() => go("signin")} className="mt-12 mb-8 self-start w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
        <ArrowLeft size={20} />
      </button>

      {/* Icon */}
      <div className="flex flex-col items-center mb-7 relative">
        <div className="relative">
          <div className="w-24 h-24 rounded-full flex items-center justify-center relative"
            style={{ background: "linear-gradient(145deg, #D4AF37 0%, #8B6914 60%, #4A3500 100%)", boxShadow: "0 0 50px rgba(212,175,55,0.4), 0 0 100px rgba(212,175,55,0.15)" }}>
            <svg width="40" height="48" viewBox="0 0 44 52" fill="none">
              <rect x="4" y="22" width="36" height="28" rx="5" fill="white" />
              <path d="M11 22V15C11 8.373 16.373 3 23 3S35 8.373 35 15V22" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
              <circle cx="22" cy="36" r="4" fill="#C9A000" />
              <rect x="20.5" y="38" width="3" height="5" rx="1.5" fill="#C9A000" />
            </svg>
            <div className="absolute inset-0 rounded-full border border-white/10" />
          </div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 96 96" fill="none" style={{ top: 0, left: 0 }}>
            <circle cx="48" cy="48" r="44" stroke="rgba(212,175,55,0.25)" strokeWidth="1" strokeDasharray="4 5" />
          </svg>
          <div className="absolute -top-3 -right-1"><Sparkle size={16} color="#5BC8A0" /></div>
          <div className="absolute -top-2 -left-4"><Sparkle size={12} color={GOLD} /></div>
          <div className="absolute -bottom-2 -right-5"><Sparkle size={10} color="#C87E5B" /></div>
          <div className="absolute bottom-2 -left-6"><Sparkle size={14} color={GOLD} /></div>
        </div>
      </div>

      <div className="bg-[#0D0D0D] rounded-[28px] p-6 mb-4">
        <h1 className="font-['Poppins'] font-bold text-[24px] text-white mb-2">
          {mode === "email" ? "Forgot Password?" : "Reset via Phone"}
        </h1>
        <p className="text-[#888] text-sm mb-5 leading-relaxed">
          {mode === "email"
            ? "No worries! Enter your email and we'll send you a reset link."
            : "Enter your phone number and we'll send a verification code."}
        </p>

        {/* ── Email / Phone Toggle ── */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-5">
          {(["email", "phone"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={mode === m ? { background: GOLD, color: "#000" } : { color: "#777" }}>
              {m === "email" ? <><Mail size={15} /> Email</> : <><Phone size={15} /> Phone</>}
            </button>
          ))}
        </div>

        {mode === "email" ? (
          <div className="relative mb-5">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]" />
            <input type="email" placeholder="Email Address"
              className="w-full bg-white/5 border border-white/15 rounded-2xl py-[14px] pl-11 pr-4 text-white text-sm placeholder:text-[#666] outline-none focus:border-[#D4AF37]" />
          </div>
        ) : (
          <div className="mb-5">
            <div className="flex gap-2 mb-2">
              <CountryCodePicker selected={country} onChange={setCountry} />
              <div className="relative flex-1">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]" />
                <input type="tel" placeholder="Phone number"
                  className="w-full bg-white/5 border border-white/15 rounded-2xl py-[14px] pl-10 pr-4 text-white text-sm placeholder:text-[#666] outline-none focus:border-[#D4AF37]" />
              </div>
            </div>
            <div className="flex items-start gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
              <MessageSquare size={12} style={{ color: GOLD }} className="flex-shrink-0 mt-0.5" />
              <p className="text-[11px]" style={{ color: "#B3913A" }}>A 6-digit OTP will be sent via SMS to reset your account.</p>
            </div>
          </div>
        )}

        <button onClick={() => go("otp")}
          className="w-full py-4 rounded-2xl font-bold text-black text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
          style={{ background: `linear-gradient(135deg, #D4AF37 0%, #C9A000 100%)`, boxShadow: `0 8px 24px rgba(212,175,55,0.35)` }}>
          {mode === "email"
            ? <><Send size={16} className="text-black" /> Send Reset Link</>
            : <><MessageSquare size={16} className="text-black" /> Send OTP</>}
        </button>
      </div>

      <div className="bg-[#0D0D0D] border border-white/10 rounded-[24px] p-4 mb-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
          <ShieldCheck size={20} style={{ color: GOLD }} />
        </div>
        <div>
          <p className="font-bold text-sm text-white">Secure & Private</p>
          <p className="text-[#777] text-xs">We'll never share your information with anyone.</p>
        </div>
      </div>

      <p className="text-center text-[#777] text-sm mt-auto mb-8">
        Remember your password?{" "}
        <button onClick={() => go("signin")} className="font-bold" style={{ color: GOLD }}>Log In</button>
      </p>
    </div>
  );
}

export default ForgotPassword;
