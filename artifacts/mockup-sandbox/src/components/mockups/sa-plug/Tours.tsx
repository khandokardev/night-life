import React, { useState } from "react";
import { Bell, Home as HomeIcon, Wine, Palmtree, UtensilsCrossed, ShoppingBag, Star, MapPin, Clock, Users, ChevronRight, Heart, ArrowRight } from "lucide-react";

const GOLD = "#D4AF37";

const CATS = [
  { label: "All", emoji: "🌍" },
  { label: "Safari", emoji: "🦁" },
  { label: "City", emoji: "🏙️" },
  { label: "Wine", emoji: "🍷" },
  { label: "Adventure", emoji: "🪂" },
  { label: "Cultural", emoji: "🎭" },
];

const FEATURED = {
  name: "Sunset Safari Experience",
  loc: "Kruger National Park",
  desc: "Experience the wild like never before with expert guides and luxury comfort.",
  price: "R2,900",
  img: "/__mockup/images/tour-safari.jpg",
};

const TOP_TOURS = [
  { name: "Cape Town City Tour", rating: 4.6, reviews: 128, price: "From R950 pp", img: "/__mockup/images/tour-capetown.jpg" },
  { name: "Stellenbosch Wine Tour", rating: 4.7, reviews: 96, price: "From R1,250 pp", img: "/__mockup/images/tour-wine.jpg" },
  { name: "Garden Route Tour", rating: 4.8, reviews: 112, price: "From R1,950 pp", img: "/__mockup/images/tour-helicopter.jpg" },
];

const ALL_TOURS = [
  { name: "Safari Experience", loc: "Kruger National Park", price: "From R1,250 pp", rating: 4.8, dur: "3 Days", img: "/__mockup/images/tour-safari.jpg" },
  { name: "Cape Town City Tour", loc: "Cape Town", price: "From R950 pp", rating: 4.7, dur: "Full Day", img: "/__mockup/images/tour-capetown.jpg" },
  { name: "Stellenbosch Wine Tour", loc: "Stellenbosch", price: "From R1,250 pp", rating: 4.9, dur: "Full Day", img: "/__mockup/images/tour-wine.jpg" },
  { name: "Yacht Experience", loc: "V&A Waterfront", price: "From R3,200 pp", rating: 5.0, dur: "Half Day", img: "/__mockup/images/tour-yacht.jpg" },
  { name: "Helicopter Tour", loc: "Cape Town", price: "From R4,500 pp", rating: 4.9, dur: "1 Hour", img: "/__mockup/images/tour-helicopter.jpg" },
];

export function Tours() {
  const [activeCat, setActiveCat] = useState("All");
  const [saved, setSaved] = useState<number[]>([]);

  return (
    <div className="min-h-screen bg-[#080808] text-white font-['Inter'] overflow-y-auto pb-24 scrollbar-none">
      <style>{`.scrollbar-none::-webkit-scrollbar{display:none;} .scrollbar-none{-ms-overflow-style:none;scrollbar-width:none;}`}</style>

      <div className="px-4 pt-5 pb-3 flex justify-between items-center">
        <div>
          <p className="text-[#888] text-xs mb-0.5 flex items-center gap-1">
            <span className="text-lg">🏕️</span> Hi, Luma Explorer
          </p>
          <h1 className="font-['Poppins'] font-bold text-xl">Explore Tours</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
      </div>

      <div className="relative mx-4 rounded-2xl overflow-hidden mb-5" style={{ height: 200 }}>
        <img src="/__mockup/images/tour-capetown.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.85) 100%)" }} />
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h2 className="font-['Poppins'] font-bold text-xl leading-tight mb-1">Explore<br />South Africa</h2>
          <p className="text-[#B3B3B3] text-xs mb-3">Epic landscapes, vibrant cities and unforgettable moments.</p>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-black text-xs font-bold" style={{ background: GOLD }}>
            Explore Tours <ArrowRight size={13} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="flex gap-3 px-4 overflow-x-auto pb-2 mb-5 scrollbar-none">
        {CATS.map(c => (
          <button key={c.label} onClick={() => setActiveCat(c.label)}
            className="flex items-center gap-1.5 flex-shrink-0 px-3.5 py-2 rounded-full border transition-all text-xs font-semibold"
            style={{
              background: activeCat === c.label ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)",
              borderColor: activeCat === c.label ? GOLD : "rgba(255,255,255,0.1)",
              color: activeCat === c.label ? GOLD : "#888",
            }}>
            <span>{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-['Poppins'] font-bold text-base">Featured Experience</h2>
        </div>
        <div className="relative rounded-2xl overflow-hidden" style={{ height: 220 }}>
          <img src={FEATURED.img} alt={FEATURED.name} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.8) 100%)" }} />
          <button onClick={() => setSaved(s => s.includes(0) ? s.filter(x=>x!==0) : [...s,0])} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
            <Heart size={15} fill={saved.includes(0)?GOLD:"none"} style={{ color: saved.includes(0)?GOLD:"#fff" }} />
          </button>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <p className="text-[#B3B3B3] text-xs mb-1 flex items-center gap-1"><MapPin size={10} />{FEATURED.loc}</p>
            <h3 className="font-['Poppins'] font-bold text-lg leading-tight mb-1">{FEATURED.name}</h3>
            <p className="text-[#B3B3B3] text-xs mb-3">{FEATURED.desc}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm" style={{ color: GOLD }}>From {FEATURED.price} pp</span>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-black text-xs font-bold" style={{ background: GOLD }}>
                View Details <ArrowRight size={12} strokeWidth={3} />
              </button>
            </div>
          </div>
          <div className="absolute bottom-12 left-4 flex gap-1">
            {[0,1,2,3,4].map(i => <div key={i} className={`h-1 rounded-full ${i===0?"w-4":"w-1.5"}`} style={{ background: i===0?GOLD:"rgba(255,255,255,0.4)" }} />)}
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-['Poppins'] font-bold text-base">Top Tours</h2>
          <button className="text-xs font-bold flex items-center gap-0.5" style={{ color: GOLD }}>View all <ChevronRight size={13} /></button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {TOP_TOURS.map((t, i) => (
            <div key={i} className="flex-shrink-0 w-[170px] bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
              <div className="h-28 relative">
                <img src={t.img} alt={t.name} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
              </div>
              <div className="p-3">
                <p className="font-['Poppins'] font-bold text-xs leading-tight mb-1">{t.name}</p>
                <div className="flex items-center gap-1 mb-1">
                  <Star size={9} fill={GOLD} style={{ color: GOLD }} />
                  <span className="text-[10px] font-bold" style={{ color: GOLD }}>{t.rating}</span>
                  <span className="text-[#666] text-[10px]">({t.reviews})</span>
                </div>
                <p className="text-[10px] font-bold" style={{ color: GOLD }}>{t.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-['Poppins'] font-bold text-base">All Experiences</h2>
        </div>
        <div className="space-y-3">
          {ALL_TOURS.map((t, i) => (
            <div key={i} className="flex gap-3 bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
              <div className="w-24 h-24 flex-shrink-0 relative">
                <img src={t.img} alt={t.name} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
              </div>
              <div className="flex-1 py-3 pr-3">
                <p className="font-['Poppins'] font-bold text-sm mb-0.5">{t.name}</p>
                <p className="text-[#777] text-xs mb-1 flex items-center gap-1"><MapPin size={10} />{t.loc}</p>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={9} fill={GOLD} style={{ color: GOLD }} />
                  <span className="text-[10px] font-bold" style={{ color: GOLD }}>{t.rating}</span>
                  <span className="text-[#666] text-[10px]">· <Clock size={9} className="inline" /> {t.dur}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs" style={{ color: GOLD }}>{t.price}</span>
                  <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-black" style={{ background: GOLD }}>Book</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#080808]/98 backdrop-blur-xl border-t border-white/8 flex">
        {[
          { icon: HomeIcon, label: "Home", active: false },
          { icon: Wine, label: "Clubs", active: false },
          { icon: Palmtree, label: "Tours", active: true },
          { icon: UtensilsCrossed, label: "Dining", active: false },
          { icon: ShoppingBag, label: "Shop", active: false },
        ].map(({ icon: Icon, label, active }) => (
          <button key={label} className="flex-1 flex flex-col items-center py-3 gap-0.5">
            <Icon size={20} style={{ color: active ? GOLD : "#B3B3B3" }} strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium" style={{ color: active ? GOLD : "#B3B3B3" }}>{label}</span>
            {active && <div className="w-1 h-1 rounded-full" style={{ background: GOLD }} />}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Tours;
