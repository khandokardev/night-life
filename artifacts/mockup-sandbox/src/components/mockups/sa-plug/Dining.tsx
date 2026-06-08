import React, { useState } from "react";
import { Bell, Home as HomeIcon, Wine, Palmtree, UtensilsCrossed, ShoppingBag, Star, MapPin, Search, Bookmark, ChevronRight, ArrowRight } from "lucide-react";

const GOLD = "#D4AF37";

const CATS = [
  { label: "All", emoji: "🍽️" },
  { label: "Fine Dining", emoji: "🥂" },
  { label: "Rooftop", emoji: "🌆" },
  { label: "African", emoji: "🌍" },
  { label: "Brunch", emoji: "☕" },
  { label: "Date Night", emoji: "🕯️" },
];

const FEATURED = {
  name: "Rooftop by Luma",
  tag: "NEW",
  type: "Rooftop",
  loc: "Victoria Island",
  rating: 4.7,
  reviews: 320,
  desc: "Panoramic views, signature cocktails, and elevated dishes.",
  price: "From R1500",
  img: "/__mockup/images/tour-capetown.jpg",
};

const RESTAURANTS = [
  { name: "Marble", type: "Fine Dining", price: "From R1200", rating: 4.8, img: "/__mockup/images/hero.png" },
  { name: "Saint", type: "Lounge", price: "From R900", rating: 4.6, img: "/__mockup/images/coco.png" },
  { name: "The Grillhouse", type: "Steakhouse", price: "From R1100", rating: 4.6, img: "/__mockup/images/onyx.png" },
  { name: "Flames", type: "Contemporary", price: "From R800", rating: 4.5, img: "/__mockup/images/zone6.png" },
];

export function Dining() {
  const [activecat, setActiveCat] = useState("All");
  const [saved, setSaved] = useState(false);

  return (
    <div className="min-h-screen bg-[#080808] text-white font-['Inter'] overflow-y-auto pb-24 scrollbar-none">
      <style>{`.scrollbar-none::-webkit-scrollbar{display:none;} .scrollbar-none{-ms-overflow-style:none;scrollbar-width:none;}`}</style>

      <div className="px-4 pt-5 pb-3 flex justify-between items-center">
        <div>
          <p className="text-[#888] text-xs mb-0.5">Hi, Luma Explorer ✈</p>
          <h1 className="font-['Poppins'] font-bold text-xl leading-tight">Discover Dining</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
      </div>

      <div className="relative mx-4 rounded-2xl overflow-hidden mb-5" style={{ height: 200 }}>
        <img src={FEATURED.img} alt="" className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.85) 100%)" }} />
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h2 className="font-['Poppins'] font-bold text-2xl leading-tight mb-1.5">Discover<br />Exceptional Dining</h2>
          <p className="text-[#B3B3B3] text-xs mb-3">Handpicked restaurants. Unforgettable flavors.</p>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-black text-xs font-bold" style={{ background: GOLD }}>
            Explore Now <ArrowRight size={13} strokeWidth={3} />
          </button>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-1">
          {[0,1,2,3].map(i => <div key={i} className={`h-1.5 rounded-full ${i===0?"w-4":"w-1.5"}`} style={{ background: i===0?GOLD:"rgba(255,255,255,0.3)" }} />)}
        </div>
      </div>

      <div className="flex gap-3 px-4 overflow-x-auto pb-2 mb-5 scrollbar-none">
        {CATS.map(c => (
          <button key={c.label} onClick={() => setActiveCat(c.label)}
            className="flex flex-col items-center gap-1 flex-shrink-0 px-4 py-2.5 rounded-2xl border transition-all"
            style={{
              background: activecat === c.label ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)",
              borderColor: activecat === c.label ? GOLD : "rgba(255,255,255,0.1)",
            }}>
            <span className="text-xl">{c.emoji}</span>
            <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color: activecat === c.label ? GOLD : "#888" }}>{c.label}</span>
          </button>
        ))}
      </div>

      <div className="px-4 mb-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-['Poppins'] font-bold text-base">Featured Dining</h2>
          <button className="text-xs font-bold flex items-center gap-0.5" style={{ color: GOLD }}>View all <ChevronRight size={13} /></button>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="relative h-44">
            <img src={FEATURED.img} alt={FEATURED.name} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <button onClick={() => setSaved(s => !s)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
              <Bookmark size={15} fill={saved ? GOLD : "none"} style={{ color: saved ? GOLD : "#fff" }} />
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-['Poppins'] font-bold text-base">{FEATURED.name}</h3>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded text-black" style={{ background: GOLD }}>{FEATURED.tag}</span>
            </div>
            <p className="text-[#888] text-xs mb-1.5">{FEATURED.type} · {FEATURED.loc}</p>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Star size={11} fill={GOLD} style={{ color: GOLD }} />
              <span className="font-bold text-xs" style={{ color: GOLD }}>{FEATURED.rating}</span>
              <span className="text-[#666] text-xs">({FEATURED.reviews})</span>
            </div>
            <p className="text-[#B3B3B3] text-xs mb-2">{FEATURED.desc}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm" style={{ color: GOLD }}>{FEATURED.price}</span>
              <span className="text-[#666] text-xs">per person</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-['Poppins'] font-bold text-base">Top Restaurants</h2>
          <button className="text-xs font-bold flex items-center gap-0.5" style={{ color: GOLD }}>View all <ChevronRight size={13} /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {RESTAURANTS.map((r, i) => (
            <div key={i} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
              <div className="h-28 relative">
                <img src={r.img} alt={r.name} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
              </div>
              <div className="p-3">
                <p className="font-['Poppins'] font-bold text-sm mb-0.5">{r.name}</p>
                <p className="text-[#777] text-[10px] mb-1">{r.type}</p>
                <div className="flex items-center gap-1 mb-1">
                  <Star size={9} fill={GOLD} style={{ color: GOLD }} />
                  <span className="text-[10px] font-bold" style={{ color: GOLD }}>{r.rating}</span>
                </div>
                <p className="text-[10px] font-bold" style={{ color: GOLD }}>{r.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#080808]/98 backdrop-blur-xl border-t border-white/8 flex">
        {[
          { icon: HomeIcon, label: "Home", active: false },
          { icon: Wine, label: "Clubs", active: false },
          { icon: Palmtree, label: "Tours", active: false },
          { icon: UtensilsCrossed, label: "Dining", active: true },
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

export default Dining;
