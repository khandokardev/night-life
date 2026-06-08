import React from "react";

const GOLD = "#D4AF37";

const AppleIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 814 1000" fill="white">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 134.4-317.8 266.5-317.8 69.8 0 127.9 45.1 172.4 45.1 42.8 0 109.1-47.2 187.4-47.2 14.6 0 108.2 1.3 172.4 62.2zm-174.4-102.7c33.4-39.5 57.1-94.3 57.1-149.2 0-7.7-.6-15.4-1.9-22.4-54.2 1.9-117.8 36.5-155.6 80.5-30.6 35.8-60.3 90.7-60.3 146.8 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.3 1.3 13.4 1.3 48.7 0 109.1-33.4 145.4-76.2z"/>
  </svg>
);

const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#1877F2"/>
    <path fill="white" d="M15.12 8.877h-2.018V7.62c0-.498.33-.614.562-.614h1.424V5.01L13.11 5c-2.219 0-2.723 1.663-2.723 2.726v1.151H9v2.046h1.387V16h2.715v-5.077h1.831l.187-2.046z"/>
  </svg>
);

export function Welcome({ navigate }: { navigate?: (s: string) => void }) {
  const go = (s: string) => navigate?.(s);

  const socialButtons = [
    { icon: <AppleIcon size={22} />, label: "Apple" },
    { icon: <GoogleIcon size={22} />, label: "Google" },
    { icon: <FacebookIcon size={22} />, label: "Facebook" },
  ];

  return (
    <div className="min-h-screen bg-black overflow-y-auto relative font-['Inter'] flex flex-col">
      <div className="absolute inset-0 z-0">
        <img src="/__mockup/images/welcome-bg.png" alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-16 pb-10">
        <div className="flex flex-col items-center mt-10 mb-auto">
          <img src="/__mockup/images/sa-plug-logo.png" alt="SA PLUG"
            className="w-56 h-auto mx-auto drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]" />
        </div>

        <div className="mb-8 text-center">
          <h2 className="font-['Poppins'] font-bold text-3xl text-white mb-2">Welcome to SA PLUG</h2>
          <p className="text-[#B3B3B3] text-sm max-w-[280px] mx-auto">
            South Africa's #1 Luxury Nightlife & Experiences Platform
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-7">
          <button onClick={() => go("signin")} className="w-full py-4 rounded-2xl font-bold text-black text-[15px] tracking-wide active:scale-95 transition-transform"
            style={{ background: `linear-gradient(135deg, #D4AF37 0%, #C9A000 100%)`, boxShadow: `0 8px 24px rgba(212,175,55,0.4)` }}>
            Log In
          </button>
          <button onClick={() => go("signup")} className="w-full py-4 rounded-2xl font-bold text-[15px] tracking-wide border active:scale-95 transition-transform"
            style={{ color: GOLD, borderColor: GOLD }}>
            Create Account
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[#666] text-xs">or continue with</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="flex gap-3 mb-7">
          {socialButtons.map(({ icon, label }) => (
            <button key={label} onClick={() => go("home")}
              className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-transform">
              {icon}
              <span className="text-[11px] text-[#999] font-medium">{label}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-[#666] text-[11px]">
          By continuing, you agree to our{" "}
          <a href="#" style={{ color: GOLD }}>Terms</a> &{" "}
          <a href="#" style={{ color: GOLD }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

export default Welcome;
