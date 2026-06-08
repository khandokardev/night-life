import React, { useState } from "react";
import { Bell, Home as HomeIcon, Wine, Palmtree, UtensilsCrossed, ShoppingBag, Star, Search, SlidersHorizontal, Plus, Check, ChevronRight } from "lucide-react";

const GOLD = "#D4AF37";

const CATS = [
  { label: "All", emoji: "🛍️" },
  { label: "Merchandise", emoji: "👕" },
  { label: "Drinks", emoji: "🍾" },
  { label: "Packages", emoji: "🎁" },
  { label: "Accessories", emoji: "🎧" },
];

const FEATURED_PRODUCT = {
  name: "SA PLUG Hoodie",
  sub: "Premium comfort. Iconic vibes.",
  price: "R699",
  rating: 4.8,
  reviews: 128,
  colors: ["#1A1A1A", "#D4AF37", "#FFFFFF"],
  sizes: ["S", "M", "L", "XL"],
  img: "/__mockup/images/hero.png",
};

const BEST_SELLERS = [
  { name: "SA PLUG Cap", price: "R299", rating: 4.7, img: "/__mockup/images/tour-capetown.jpg" },
  { name: "SA PLUG Tee", price: "R349", rating: 4.6, img: "/__mockup/images/coco.png" },
  { name: "SA PLUG Bottle", price: "R399", rating: 4.9, img: "/__mockup/images/tour-wine.jpg" },
];

const PRODUCTS = [
  { id: 1, name: "SA PLUG Hoodie", price: 699, rating: 4.8, img: "/__mockup/images/hero.png" },
  { id: 2, name: "SA PLUG Tee", price: 349, rating: 4.6, img: "/__mockup/images/coco.png" },
  { id: 3, name: "SA PLUG Cap", price: 299, rating: 4.7, img: "/__mockup/images/tour-capetown.jpg" },
  { id: 4, name: "SA PLUG Champagne", price: 1200, rating: 4.9, img: "/__mockup/images/tour-wine.jpg" },
  { id: 5, name: "SA PLUG Vodka", price: 950, rating: 4.7, img: "/__mockup/images/onyx.png" },
  { id: 6, name: "SA PLUG Whiskey", price: 1100, rating: 4.8, img: "/__mockup/images/zone6.png" },
  { id: 7, name: "VIP Bottle Package", price: 2500, rating: 4.9, img: "/__mockup/images/kong.png" },
  { id: 8, name: "Premium Experience", price: 3800, rating: 4.9, img: "/__mockup/images/tour-yacht.jpg" },
  { id: 9, name: "SA PLUG Gift Card", price: 250, rating: 4.8, img: "/__mockup/images/tour-safari.jpg" },
];

export function Shop() {
  const [activeCat, setActiveCat] = useState("All");
  const [added, setAdded] = useState<number[]>([]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(0);
  const [cartCount, setCartCount] = useState(3);
  const [cartTotal, setCartTotal] = useState(2148);

  const handleAdd = (id: number, price: number) => {
    if (!added.includes(id)) {
      setAdded(prev => [...prev, id]);
      setCartCount(c => c + 1);
      setCartTotal(t => t + price);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-['Inter'] overflow-y-auto pb-32 scrollbar-none">
      <style>{`.scrollbar-none::-webkit-scrollbar{display:none;} .scrollbar-none{-ms-overflow-style:none;scrollbar-width:none;}`}</style>

      <div className="px-4 pt-5 pb-3 flex justify-between items-center sticky top-0 bg-[#080808]/95 backdrop-blur-md z-10">
        <h1 className="font-['Poppins'] font-bold text-2xl">Shop</h1>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center text-black" style={{ background: GOLD }}>{cartCount}</span>}
          </button>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
            <input placeholder="Search products, drinks, and more..." className="w-full bg-[#111] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-[#555] focus:outline-none" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#111] border border-white/10 text-xs font-bold text-[#B3B3B3] flex-shrink-0">
            <SlidersHorizontal size={13} /> Filter
          </button>
        </div>
      </div>

      <div className="relative mx-4 rounded-2xl overflow-hidden mb-5" style={{ height: 180 }}>
        <img src="/__mockup/images/hero.png" alt="" className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(8,8,8,0.9) 40%, rgba(8,8,8,0.2) 100%)" }} />
        <div className="absolute inset-0 p-4 flex flex-col justify-center">
          <h2 className="font-['Poppins'] font-bold text-xl leading-tight mb-1">Elevate Your<br />Night.</h2>
          <p className="text-[#B3B3B3] text-xs mb-3">Official Merchandise &amp; Premium Drinks.</p>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-black text-xs font-bold self-start" style={{ background: GOLD }}>
            Shop Now →
          </button>
        </div>
        <div className="absolute bottom-3 right-4 flex gap-1">
          {[0,1,2].map(i => <div key={i} className={`h-1.5 rounded-full ${i===0?"w-4":"w-1.5"}`} style={{ background: i===0?GOLD:"rgba(255,255,255,0.3)" }} />)}
        </div>
      </div>

      <div className="flex gap-3 px-4 overflow-x-auto pb-2 mb-5 scrollbar-none">
        {CATS.map(c => (
          <button key={c.label} onClick={() => setActiveCat(c.label)}
            className="flex flex-col items-center gap-1 flex-shrink-0 px-3.5 py-2.5 rounded-2xl border transition-all"
            style={{
              background: activeCat === c.label ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.04)",
              borderColor: activeCat === c.label ? GOLD : "rgba(255,255,255,0.1)",
            }}>
            <span className="text-xl">{c.emoji}</span>
            <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color: activeCat === c.label ? GOLD : "#888" }}>{c.label}</span>
          </button>
        ))}
      </div>

      <div className="px-4 mb-6">
        <h2 className="font-['Poppins'] font-bold text-base mb-3">Featured Product</h2>
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex">
            <div className="w-40 h-40 flex-shrink-0 relative bg-[#1A1A1A] flex items-center justify-center">
              <img src={FEATURED_PRODUCT.img} alt={FEATURED_PRODUCT.name} className="absolute inset-0 w-full h-full object-cover opacity-80" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
            </div>
            <div className="flex-1 p-3">
              <p className="font-['Poppins'] font-bold text-sm leading-tight mb-0.5">{FEATURED_PRODUCT.name}</p>
              <p className="text-[#777] text-[10px] mb-1.5">{FEATURED_PRODUCT.sub}</p>
              <p className="font-bold text-base mb-1" style={{ color: GOLD }}>{FEATURED_PRODUCT.price}</p>
              <div className="flex items-center gap-1 mb-2">
                <Star size={10} fill={GOLD} style={{ color: GOLD }} />
                <span className="text-[10px] font-bold" style={{ color: GOLD }}>{FEATURED_PRODUCT.rating}</span>
                <span className="text-[#555] text-[10px]">({FEATURED_PRODUCT.reviews})</span>
              </div>
              <p className="text-[#666] text-[10px] mb-1.5">Black</p>
              <div className="flex gap-1.5 mb-2.5">
                {FEATURED_PRODUCT.sizes.map((s, i) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className="w-7 h-7 rounded-lg text-[10px] font-bold border flex items-center justify-center"
                    style={{ background: selectedSize===s?GOLD:"transparent", color: selectedSize===s?"#000":"#888", borderColor: selectedSize===s?GOLD:"rgba(255,255,255,0.15)" }}>
                    {s}
                  </button>
                ))}
              </div>
              <button onClick={() => handleAdd(0, 699)}
                className="w-full py-2 rounded-xl text-xs font-bold text-black flex items-center justify-center gap-1"
                style={{ background: GOLD }}>
                Add to Cart +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-['Poppins'] font-bold text-base">Best Sellers</h2>
          <button className="text-xs font-bold flex items-center gap-0.5" style={{ color: GOLD }}>View all <ChevronRight size={13} /></button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {BEST_SELLERS.map((p, i) => (
            <div key={i} className="flex-shrink-0 w-[130px] bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
              <div className="h-24 relative">
                <img src={p.img} alt={p.name} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
              </div>
              <div className="p-2.5">
                <p className="font-bold text-xs leading-tight mb-0.5">{p.name}</p>
                <p className="font-bold text-sm" style={{ color: GOLD }}>{p.price}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={9} fill={GOLD} style={{ color: GOLD }} />
                  <span className="text-[9px]" style={{ color: GOLD }}>{p.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-10">
        <h2 className="font-['Poppins'] font-bold text-base mb-3">All Products</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {PRODUCTS.map(p => {
            const isAdded = added.includes(p.id);
            return (
              <div key={p.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                <div className="h-24 relative bg-[#1A1A1A]">
                  <img src={p.img} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-90" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/60 px-1 py-0.5 rounded text-[8px] font-bold">
                    <Star size={7} fill={GOLD} style={{ color: GOLD }} /> {p.rating}
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-[10px] font-bold leading-tight mb-1 line-clamp-2">{p.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold" style={{ color: GOLD }}>R{p.price.toLocaleString()}</span>
                    <button onClick={() => handleAdd(p.id, p.price)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: isAdded ? "rgba(34,197,94,0.2)" : GOLD, border: isAdded ? "1px solid rgba(34,197,94,0.5)" : "none" }}>
                      {isAdded ? <Check size={10} className="text-green-400" /> : <Plus size={11} className="text-black" strokeWidth={3} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {cartCount > 0 && (
        <div className="fixed bottom-16 left-4 right-4 z-40 rounded-2xl p-3.5 flex items-center justify-between" style={{ background: GOLD, boxShadow: "0 8px 32px rgba(212,175,55,0.5)" }}>
          <div className="flex items-center gap-2.5">
            <div className="bg-black/15 w-9 h-9 rounded-xl flex items-center justify-center relative flex-shrink-0">
              <ShoppingBag size={18} className="text-black" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
            </div>
            <div>
              <p className="text-[9px] text-black/70 font-semibold uppercase tracking-wide">{cartCount} items · Subtotal</p>
              <p className="font-['Poppins'] font-bold text-black text-base">R{cartTotal.toLocaleString()}</p>
            </div>
          </div>
          <button className="bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
            View Cart →
          </button>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#080808]/98 backdrop-blur-xl border-t border-white/8 flex">
        {[
          { icon: HomeIcon, label: "Home", active: false },
          { icon: Wine, label: "Clubs", active: false },
          { icon: Palmtree, label: "Tours", active: false },
          { icon: UtensilsCrossed, label: "Dining", active: false },
          { icon: ShoppingBag, label: "Shop", active: true },
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

export default Shop;
