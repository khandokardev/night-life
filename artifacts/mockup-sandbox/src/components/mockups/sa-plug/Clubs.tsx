import React, { useState } from "react";
import {
  Search, SlidersHorizontal, ChevronRight, Star, MapPin,
  Crown, Check, Play, Home as HomeIcon, Wine, Palmtree,
  UtensilsCrossed, ShoppingBag
} from "lucide-react";

const GOLD = "#D4AF37";

const clubs = [
  { img: "/__mockup/images/onyx.png", name: "Onyx Sandton", rating: "4.8", reviews: "1.2k", area: "Sandton", genres: ["Amapiano", "Hip Hop", "Afrobeats"] },
  { img: "/__mockup/images/coco.png", name: "Coco Sandton", rating: "4.7", reviews: "980", area: "Sandton", genres: ["Afrobeats", "Hip Hop", "R&B"] },
  { img: "/__mockup/images/zone6.png", name: "Zone 6 Venue", rating: "4.6", reviews: "870", area: "Soweto", genres: ["Amapiano", "Gqom", "Hip Hop"] },
  { img: "/__mockup/images/kong.png", name: "Kong Rosebank", rating: "4.5", reviews: "760", area: "Rosebank", genres: ["Hip Hop", "Afrobeats", "R&B"] },
];

const trending = [
  { img: "/__mockup/images/onboard-1.png", name: "Amapiano Nights", views: "12.4K views" },
  { img: "/__mockup/images/welcome-bg.png", name: "Luxe Fridays Rosebank", views: "9.8K views" },
  { img: "/__mockup/images/auth-bg.png", name: "After Dark Saturdays", views: "8.3K views" },
  { img: "/__mockup/images/splash-bg.png", name: "Rooftop Takeovers", views: "7.1K views" },
];

const genreColors: Record<string, { bg: string; color: string }> = {
  "Amapiano": { bg: "rgba(212,175,55,0.14)", color: GOLD },
  "Hip Hop": { bg: "rgba(255,255,255,0.08)", color: "#aaa" },
  "Afrobeats": { bg: "rgba(220,100,50,0.16)", color: "#E08060" },
  "R&B": { bg: "rgba(160,100,220,0.16)", color: "#B070E0" },
  "Gqom": { bg: "rgba(50,160,220,0.16)", color: "#50A0DC" },
  "EDM": { bg: "rgba(50,220,150,0.14)", color: "#40C090" },
};

const navItems = [
  { icon: HomeIcon, label: "Home", active: false },
  { icon: Wine, label: "Clubs", active: true },
  { icon: Palmtree, label: "Tours", active: false },
  { icon: UtensilsCrossed, label: "Dining", active: false },
  { icon: ShoppingBag, label: "Shop", active: false },
];

export function Clubs() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "VIP", "Rooftop", "Amapiano", "Afrobeats", "EDM"];

  return (
    <div className="min-h-screen bg-[#080808] text-white font-['Inter'] pb-24 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

      {/* ── Header ── */}
      <div className="px-4 pt-6 pb-3">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-['Poppins'] font-bold text-2xl">Clubs</h1>
          <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Search size={17} className="text-[#B3B3B3]" />
          </button>
        </div>

        {/* Search + filter icon */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
            <input
              placeholder="Search clubs, venues or areas"
              readOnly
              className="w-full bg-[#111] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-[#555] outline-none"
            />
          </div>
          <button className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center flex-shrink-0">
            <SlidersHorizontal size={16} className="text-[#B3B3B3]" />
          </button>
        </div>

        {/* Genre filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all"
              style={activeFilter === f
                ? { background: GOLD, color: "#000" }
                : { background: "rgba(255,255,255,0.06)", color: "#888", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div className="px-4 mb-6">
        <div className="relative rounded-2xl overflow-hidden h-44">
          <img src="/__mockup/images/hero.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 60%, transparent 100%)" }} />
          <div className="absolute inset-0 p-5 flex flex-col justify-end">
            <h2 className="font-['Poppins'] font-bold text-[22px] leading-tight mb-1">
              Tonight Belongs<br />To You
            </h2>
            <p className="text-xs mb-3" style={{ color: "#B3B3B3" }}>The city. The music. The energy.</p>
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-black text-xs self-start"
              style={{ background: GOLD, boxShadow: "0 0 16px rgba(212,175,55,0.5)" }}
            >
              Explore Top Clubs <ChevronRight size={13} strokeWidth={3} />
            </button>
          </div>
          {/* Dots */}
          <div className="absolute bottom-3 right-4 flex gap-1.5 items-center">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="rounded-full transition-all"
                style={{ width: i === 0 ? 14 : 4, height: 4, background: i === 0 ? GOLD : "rgba(255,255,255,0.3)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Handpicked Clubs ── */}
      <section className="mb-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <span className="font-['Poppins'] font-bold text-[15px]">Handpicked Clubs</span>
          <button className="text-xs font-medium flex items-center gap-0.5" style={{ color: GOLD }}>
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {clubs.map((c, i) => (
            <div key={i} className="flex-shrink-0 w-[88px]">
              <div className="relative w-[88px] h-[88px] rounded-2xl overflow-hidden mb-2">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute top-1.5 left-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: GOLD, color: "#000" }}>VIP</span>
              </div>
              <p className="font-semibold text-[11px] leading-tight mb-0.5">{c.name}</p>
              <p className="text-[10px] mb-0.5" style={{ color: "#777" }}>{c.area}</p>
              <div className="flex items-center gap-1">
                <Star size={8} fill={GOLD} color={GOLD} />
                <span className="text-[10px] font-bold" style={{ color: GOLD }}>{c.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Premium Bottle Service ── */}
      <section className="px-4 mb-6">
        <div className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0C0A00 0%, #1C1600 100%)" }}>
          <img
            src="/__mockup/images/champagne.png"
            alt=""
            className="absolute right-0 top-0 h-full w-[52%] object-cover"
            style={{ opacity: 0.45 }}
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, #0C0A00 40%, rgba(12,10,0,0.5) 70%, transparent 100%)" }} />
          <div className="relative z-10 p-5 pb-6">
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(212,175,55,0.18)", border: "1px solid rgba(212,175,55,0.35)" }}>
              <Crown size={14} style={{ color: GOLD }} />
            </div>
            <h3 className="font-['Poppins'] font-bold text-[18px] mb-1">Premium Bottle Service</h3>
            <p className="text-xs mb-4" style={{ color: "#999" }}>Skip the line. Own the night.</p>
            {["VIP Table Booking", "Premium Bottles", "Dedicated Host"].map(f => (
              <div key={f} className="flex items-center gap-2.5 mb-2">
                <Check size={13} style={{ color: GOLD }} strokeWidth={2.5} />
                <span className="text-sm text-white">{f}</span>
              </div>
            ))}
            <button className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full border text-white text-sm font-semibold"
              style={{ borderColor: "rgba(255,255,255,0.25)" }}>
              Book VIP Experience <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Trending Now ── */}
      <section className="mb-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <span className="font-['Poppins'] font-bold text-[15px]">Trending Now</span>
          <button className="text-xs font-medium flex items-center gap-0.5" style={{ color: GOLD }}>
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {trending.map((t, i) => (
            <div key={i} className="flex-shrink-0 w-[128px]">
              <div className="relative w-[128px] h-[88px] rounded-2xl overflow-hidden mb-2">
                <img src={t.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}>
                    <Play size={13} fill="white" color="white" style={{ marginLeft: 2 }} />
                  </div>
                </div>
              </div>
              <p className="font-semibold text-[11px] leading-tight mb-0.5">{t.name}</p>
              <p className="text-[10px]" style={{ color: "#666" }}>{t.views}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Top Clubs List ── */}
      <section className="px-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="font-['Poppins'] font-bold text-[15px]">Top Clubs</span>
          <button className="text-xs font-medium flex items-center gap-0.5" style={{ color: GOLD }}>
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div className="space-y-3">
          {clubs.map((c, i) => (
            <div key={i} className="flex gap-3 rounded-2xl p-3"
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)" }}>
              <img src={c.img} alt={c.name} className="w-[76px] h-[76px] rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-['Poppins'] font-semibold text-[13px] leading-tight">{c.name}</span>
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: "rgba(212,175,55,0.15)", color: GOLD, border: "1px solid rgba(212,175,55,0.3)" }}>VIP</span>
                </div>
                <div className="flex items-center gap-1 mb-1.5">
                  <Star size={9} fill={GOLD} color={GOLD} />
                  <span className="text-[11px] font-bold" style={{ color: GOLD }}>{c.rating}</span>
                  <span className="text-[11px]" style={{ color: "#666" }}>({c.reviews}) · {c.area}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {c.genres.map(g => (
                    <span key={g} className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: genreColors[g]?.bg ?? "rgba(255,255,255,0.08)",
                        color: genreColors[g]?.color ?? "#999"
                      }}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0 justify-center">
                <button className="px-3 py-2 rounded-xl text-[10px] font-bold text-black whitespace-nowrap"
                  style={{ background: GOLD, boxShadow: "0 0 10px rgba(212,175,55,0.3)" }}>
                  Book Table
                </button>
                <button className="px-3 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap"
                  style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#ccc" }}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom Navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 flex">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button key={label} className="flex-1 flex flex-col items-center py-3 gap-0.5">
            <Icon size={20} style={{ color: active ? GOLD : "#B3B3B3" }} strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium" style={{ color: active ? GOLD : "#B3B3B3" }}>{label}</span>
            {active && <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: GOLD }} />}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Clubs;
