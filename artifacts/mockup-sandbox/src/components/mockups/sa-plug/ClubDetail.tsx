import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Share2, Heart, Star, MapPin, Navigation2,
  CalendarDays, Clock, Users, Minus, Plus, Trash2, Search,
  CheckCircle2, Sparkles, Music2, ShieldCheck, Shield, Lock,
  UtensilsCrossed, Info, LayoutGrid,
} from "lucide-react";

const GOLD = "#D4AF37";

/* ─── TYPES ─── */
type AddOn = { id: number; name: string; desc: string; price: number; qty: number; img: string };
type View = "detail" | "menu" | "booking";

/* ─── MENU DATA ─── */
const MENU_CATS = ["Champagne", "Vodka", "Whiskey", "Cocktails", "Packages"] as const;

const MENU: Record<string, { name: string; sub: string; price: string; img: string }[]> = {
  Champagne: [
    { name: "Moët & Chandon Impérial", sub: "Brut", price: "R1,600", img: "/__mockup/images/champagne.png" },
    { name: "Veuve Clicquot Yellow Label", sub: "Brut", price: "R2,200", img: "/__mockup/images/champagne.png" },
    { name: "Dom Pérignon Vintage", sub: "Brut", price: "R6,500", img: "/__mockup/images/champagne.png" },
    { name: "Luc Belaire Rosé", sub: "Rare Rosé", price: "R1,400", img: "/__mockup/images/champagne.png" },
  ],
  Vodka: [
    { name: "CÎROC Ultra Premium", sub: "750ml", price: "R1,500", img: "/__mockup/images/vodka.png" },
    { name: "Belvedere Vodka", sub: "750ml", price: "R1,600", img: "/__mockup/images/vodka.png" },
    { name: "Grey Goose", sub: "750ml", price: "R1,700", img: "/__mockup/images/vodka.png" },
  ],
  Whiskey: [
    { name: "Johnnie Walker Blue Label", sub: "750ml", price: "R3,200", img: "/__mockup/images/vodka.png" },
    { name: "Macallan 12 Year", sub: "750ml", price: "R2,800", img: "/__mockup/images/vodka.png" },
    { name: "Hennessy VS Cognac", sub: "750ml", price: "R1,900", img: "/__mockup/images/vodka.png" },
  ],
  Cocktails: [
    { name: "Pornstar Martini", sub: "Signature", price: "R180", img: "/__mockup/images/champagne.png" },
    { name: "Espresso Martini", sub: "Signature", price: "R160", img: "/__mockup/images/champagne.png" },
    { name: "Lychee Mojito", sub: "Refreshing", price: "R150", img: "/__mockup/images/champagne.png" },
  ],
  Packages: [
    { name: "Onyx VIP Package", sub: "2 bottles + reserved table + host", price: "R8,500", img: "/__mockup/images/hero.png" },
    { name: "Birthday Special", sub: "3 bottles + sparklers + cake", price: "R12,000", img: "/__mockup/images/hero.png" },
    { name: "Ladies Night Bundle", sub: "Entry + 1 bottle + cocktails", price: "R3,500", img: "/__mockup/images/onyx.png" },
  ],
};

/* ─── SHARED FALLBACK IMAGE ─── */
function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src} alt={alt} className={className}
      onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }}
    />
  );
}

/* ══════════════════════════════════════════════════
   MENU SCREEN
══════════════════════════════════════════════════ */
function MenuScreen({ onBack }: { onBack: () => void }) {
  const [cat, setCat] = useState("Champagne");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);
  const items = MENU[cat] ?? [];

  const addItem = (key: string, name: string) => {
    setCart(prev => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
    setToast(name.length > 24 ? name.slice(0, 24) + "…" : name);
    setTimeout(() => setToast(null), 1800);
  };

  const removeItem = (key: string) => {
    setCart(prev => {
      const next = { ...prev };
      if ((next[key] ?? 0) > 1) next[key]--;
      else delete next[key];
      return next;
    });
  };

  const totalQty = Object.values(cart).reduce((s, n) => s + n, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [key, qty]) => {
    const [catKey, idx] = key.split("::");
    const item = MENU[catKey]?.[Number(idx)];
    const price = item ? parseInt(item.price.replace(/[^0-9]/g, "")) : 0;
    return sum + price * qty;
  }, 0);

  return (
    <div className="h-screen bg-[#080808] text-white font-['Inter'] flex flex-col overflow-hidden">
      {/* Toast notification */}
      {toast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl text-xs font-bold text-black flex items-center gap-2 shadow-lg"
          style={{ background: GOLD, whiteSpace: "nowrap" }}>
          <Plus size={13} strokeWidth={3} /> Added: {toast}
        </div>
      )}

      {/* Sticky header */}
      <div className="flex-shrink-0 bg-[#080808] border-b border-white/8">
        <div className="flex items-center gap-3 px-4 pt-6 pb-3">
          <button onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 text-center">
            <p className="font-['Poppins'] font-bold text-[15px]">Onyx Sandton</p>
            <p className="text-[#888] text-xs">Menu</p>
          </div>
          <div className="relative">
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Search size={17} className="text-[#B3B3B3]" />
            </button>
            {totalQty > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold text-black flex items-center justify-center"
                style={{ background: GOLD }}>{totalQty}</span>
            )}
          </div>
        </div>
        {/* Category tabs */}
        <div className="flex overflow-x-auto px-4 pb-0" style={{ scrollbarWidth: "none" }}>
          {MENU_CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`pb-3 px-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
                cat === c
                  ? "border-[#D4AF37] text-white"
                  : "border-transparent text-[#666]"
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable items */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8" style={{ scrollbarWidth: "none" }}>
        <h2 className="font-['Poppins'] font-bold text-base mb-4">{cat}</h2>

        <div className="space-y-3">
          {items.map((item, i) => {
            const key = `${cat}::${i}`;
            const qty = cart[key] ?? 0;
            return (
              <div key={i}
                className="flex items-center gap-3 bg-[#111] border rounded-2xl p-3 transition-all"
                style={{ borderColor: qty > 0 ? `${GOLD}40` : "rgba(255,255,255,0.08)" }}>
                <div className="w-16 h-16 rounded-xl bg-[#1A1A1A] border border-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <Img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white leading-tight mb-0.5">{item.name}</p>
                  <p className="text-xs text-[#777] mb-1.5">{item.sub}</p>
                  <p className="font-bold text-sm" style={{ color: GOLD }}>{item.price}</p>
                </div>
                {qty > 0 ? (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => removeItem(key)}
                      className="w-7 h-7 rounded-full border border-white/15 bg-white/5 flex items-center justify-center active:scale-90 transition-transform">
                      <Minus size={13} className="text-white" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold tabular-nums" style={{ color: GOLD }}>{qty}</span>
                    <button onClick={() => addItem(key, item.name)}
                      className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                      style={{ background: GOLD }}>
                      <Plus size={13} className="text-black" strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => addItem(key, item.name)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
                    style={{ borderColor: `${GOLD}50`, background: `${GOLD}10` }}>
                    <Plus size={15} style={{ color: GOLD }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p className="flex items-center justify-center gap-1.5 text-[#555] text-xs mt-6">
          <Info size={11} /> All prices are in ZAR and include VAT.
        </p>
      </div>

      {/* Cart summary bar — shown when items are added */}
      {totalQty > 0 && (
        <div className="flex-shrink-0 px-4 py-4 border-t border-white/8" style={{ background: "#0E0E0E" }}>
          <button className="w-full py-3.5 rounded-2xl font-bold text-sm text-black flex items-center justify-between px-5 active:scale-[0.98] transition-transform"
            style={{ background: `linear-gradient(135deg, ${GOLD}, #C9A000)` }}>
            <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-xs font-bold">{totalQty}</span>
            <span>View Order</span>
            <span>R{totalPrice.toLocaleString()}</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   BOOKING SCREEN
══════════════════════════════════════════════════ */
function BookingScreen({ onBack }: { onBack: () => void }) {
  const [addOns, setAddOns] = useState<AddOn[]>([
    { id: 1, name: "VIP Bottle Service", desc: "Includes premium spirits, mixers & VIP host.", price: 2500, qty: 1, img: "/__mockup/images/hero.png" },
    { id: 2, name: "Onyx Experience Package", desc: "Entry for 4, 2 bottles, VIP seating & mixers.", price: 6000, qty: 1, img: "/__mockup/images/onyx.png" },
  ]);

  const updateQty = (id: number, delta: number) => {
    setAddOns(prev =>
      prev.map(a => a.id === id ? { ...a, qty: Math.max(0, a.qty + delta) } : a)
        .filter(a => a.qty > 0)
    );
  };
  const removeAddOn = (id: number) => setAddOns(prev => prev.filter(a => a.id !== id));

  const TABLE_MIN = 2500;
  const addOnsTotal = addOns.reduce((s, a) => s + a.price * a.qty, 0);
  const serviceFee = Math.round((TABLE_MIN + addOnsTotal) * 0.1);
  const total = TABLE_MIN + addOnsTotal + serviceFee;

  const detailGrid = [
    { icon: CalendarDays, label: "Date", value: "Sat, 24 May 2026" },
    { icon: Clock, label: "Time", value: "10:30 PM" },
    { icon: Users, label: "Guests", value: "4 People" },
    { icon: LayoutGrid, label: "Table", value: "Premium Table 12" },
  ];

  return (
    <div className="h-screen bg-[#080808] text-white font-['Inter'] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-6 pb-4 border-b border-white/8">
        <button onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center">
          <p className="font-['Poppins'] font-bold text-[15px]">Book Your Table</p>
          <p className="text-[#888] text-xs">Onyx Sandton</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-40 space-y-6" style={{ scrollbarWidth: "none" }}>

        {/* Booking Details */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-['Poppins'] font-bold text-base">Booking Details</h2>
            <button className="text-xs font-bold" style={{ color: GOLD }}>Edit</button>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-4 grid grid-cols-2 gap-4">
            {detailGrid.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon size={18} style={{ color: GOLD }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#777] uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="font-bold text-sm leading-tight">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add-Ons & Packages */}
        <section>
          <h2 className="font-['Poppins'] font-bold text-base mb-3">Add-Ons & Packages</h2>
          {addOns.length === 0 ? (
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 text-center text-[#555] text-sm">
              No add-ons selected
            </div>
          ) : (
            <div className="space-y-3">
              {addOns.map(addon => (
                <div key={addon.id}
                  className="bg-[#111] border border-white/10 rounded-2xl p-3 flex gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                    <Img src={addon.img} alt={addon.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-bold text-sm leading-tight pr-2 flex-1">{addon.name}</p>
                      <button onClick={() => removeAddOn(addon.id)} className="flex-shrink-0 p-0.5">
                        <Trash2 size={14} className="text-[#555]" />
                      </button>
                    </div>
                    <p className="text-[#888] text-xs mb-2.5 leading-snug">{addon.desc}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm" style={{ color: GOLD }}>
                        R{(addon.price * addon.qty).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(addon.id, -1)}
                          className="w-7 h-7 rounded-full bg-white/5 border border-white/15 flex items-center justify-center active:scale-90 transition-transform">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center tabular-nums">{addon.qty}</span>
                        <button onClick={() => updateQty(addon.id, 1)}
                          className="w-7 h-7 rounded-full bg-white/5 border border-white/15 flex items-center justify-center active:scale-90 transition-transform">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Order Summary */}
        <section>
          <h2 className="font-['Poppins'] font-bold text-base mb-3">Order Summary</h2>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#B3B3B3]">Table Minimum Spend</span>
              <span className="font-medium">R{TABLE_MIN.toLocaleString()}</span>
            </div>
            {addOns.map(a => (
              <div key={a.id} className="flex justify-between items-center text-sm">
                <span className="text-[#B3B3B3] truncate pr-4">{a.name}</span>
                <span className="font-medium flex-shrink-0">R{(a.price * a.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#B3B3B3]">Service Fee (10%)</span>
              <span className="font-medium">R{serviceFee.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
              <span className="font-['Poppins'] font-bold text-base">Total</span>
              <span className="font-['Poppins'] font-bold text-xl" style={{ color: GOLD }}>
                R{total.toLocaleString()}
              </span>
            </div>
          </div>
        </section>

        {/* Deposit notice */}
        <div className="flex items-start gap-3 rounded-2xl p-4"
          style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}>
          <Shield size={18} style={{ color: GOLD }} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#B3B3B3] leading-relaxed">
            A non-refundable deposit of{" "}
            <span className="text-white font-bold">R2,000</span> is required to confirm your booking.
          </p>
        </div>

      </div>

      {/* Sticky footer CTA */}
      <div className="flex-shrink-0 absolute bottom-0 left-0 right-0 bg-[#080808]/97 backdrop-blur-xl border-t border-white/8 px-4 pt-4 pb-6">
        <button
          className="w-full py-4 rounded-2xl font-bold text-black text-[15px] flex items-center justify-center gap-2 mb-3 active:scale-[0.98] transition-transform"
          style={{
            background: "linear-gradient(135deg, #D4AF37 0%, #C9A000 100%)",
            boxShadow: "0 8px 28px rgba(212,175,55,0.35)",
          }}>
          Proceed to Payment <ChevronRight size={18} strokeWidth={3} />
        </button>
        <div className="flex items-center justify-center gap-1.5">
          <Lock size={11} className="text-[#555]" />
          <span className="text-[11px] text-[#555]">Secure & Encrypted Checkout</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CLUB DETAIL MAIN SCREEN
══════════════════════════════════════════════════ */
export function ClubDetail() {
  const [view, setView] = useState<View>("detail");
  const [liked, setLiked] = useState(false);
  const [imgIndex] = useState(1);
  const TOTAL_IMGS = 8;

  if (view === "menu") return <MenuScreen onBack={() => setView("detail")} />;
  if (view === "booking") return <BookingScreen onBack={() => setView("detail")} />;

  const INFO_GRID = [
    { icon: Sparkles, label: "Dress Code", value: "Smart & Stylish" },
    { icon: Music2, label: "Music Policy", value: "Hip Hop, Amapiano" },
    { icon: ShieldCheck, label: "Age Restriction", value: "21+" },
    { icon: Users, label: "Capacity", value: "800+ Guests" },
  ];

  const GALLERY = [
    "/__mockup/images/onyx.png",
    "/__mockup/images/hero.png",
    "/__mockup/images/coco.png",
    "/__mockup/images/zone6.png",
    "/__mockup/images/kong.png",
  ];

  return (
    <div className="h-screen bg-[#080808] text-white font-['Inter'] overflow-y-auto" style={{ scrollbarWidth: "none" }}>

      {/* ── HERO ── */}
      <div className="relative w-full" style={{ height: 280 }}>
        <Img src="/__mockup/images/onyx.png" alt="Onyx Sandton"
          className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(8,8,8,0) 50%, rgba(8,8,8,0.95) 100%)" }} />

        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 pt-6">
          <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setLiked(l => !l)}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Heart size={18}
                fill={liked ? GOLD : "none"}
                style={{ color: liked ? GOLD : "#fff" }} />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Bottom overlays */}
        <div className="absolute bottom-3 left-4 text-[11px] font-semibold"
          style={{ color: "rgba(255,255,255,0.7)" }}>
          {imgIndex} / {TOTAL_IMGS}
        </div>
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-red-500 px-2.5 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-bold text-white tracking-wide">LIVE</span>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="px-5 pt-4 pb-10">

        {/* Name + verified */}
        <div className="flex items-center gap-2 mb-2">
          <h1 className="font-['Poppins'] font-bold text-[22px] leading-tight">Onyx Sandton</h1>
          <CheckCircle2 size={20} strokeWidth={2} style={{ color: GOLD }} />
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-2 mb-2 text-sm flex-wrap">
          <Star size={13} fill={GOLD} style={{ color: GOLD }} />
          <span className="font-bold" style={{ color: GOLD }}>4.8</span>
          <span className="text-[#888]">(1,245)</span>
          <span className="text-[#333]">•</span>
          <span className="text-[#888]">Open until <span className="text-white font-semibold">04:00</span></span>
        </div>

        {/* Location + map */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-[#888] text-sm">
            <MapPin size={13} />
            <span>Sandton, Johannesburg</span>
          </div>
          <button className="text-xs font-bold" style={{ color: GOLD }}>View on Map</button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {["Nightclub", "Hip Hop", "Amapiano", "Live DJ"].map(tag => (
            <span key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium border border-white/15 text-[#B3B3B3] bg-white/5">
              {tag}
            </span>
          ))}
        </div>

        {/* BOOK TABLE — primary CTA */}
        <button onClick={() => setView("booking")}
          className="w-full py-4 rounded-2xl font-bold text-black text-[15px] flex items-center justify-center gap-2 mb-3 active:scale-[0.98] transition-transform"
          style={{
            background: "linear-gradient(135deg, #D4AF37 0%, #C9A000 100%)",
            boxShadow: "0 8px 24px rgba(212,175,55,0.35)",
          }}>
          <CalendarDays size={18} /> Book Table
        </button>

        {/* Secondary buttons */}
        <div className="flex gap-3 mb-7">
          <button onClick={() => setView("menu")}
            className="flex-1 py-3.5 rounded-xl border border-white/15 bg-white/5 text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <UtensilsCrossed size={15} style={{ color: GOLD }} /> Menu
          </button>
          <button
            className="flex-1 py-3.5 rounded-xl border border-white/15 bg-white/5 text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <Navigation2 size={15} style={{ color: GOLD }} /> Directions
          </button>
        </div>

        {/* About */}
        <div className="mb-7">
          <h2 className="font-['Poppins'] font-bold text-base mb-2">About Onyx Sandton</h2>
          <p className="text-[#B3B3B3] text-sm leading-relaxed mb-4">
            Johannesburg's iconic nightlife destination. World-class DJs, premium sound and unforgettable energy every night of the week.
          </p>

          {/* Info 2×2 grid */}
          <div className="grid grid-cols-2 gap-3">
            {INFO_GRID.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[#111] border border-white/8 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon size={13} style={{ color: GOLD }} />
                  <span className="text-[10px] text-[#666] uppercase tracking-wider">{label}</span>
                </div>
                <p className="font-bold text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-['Poppins'] font-bold text-base">Gallery</h2>
            <button className="text-xs font-bold flex items-center gap-0.5" style={{ color: GOLD }}>
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {GALLERY.map((src, i) => (
              <div key={i} className="w-[90px] h-[90px] rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                <Img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        ::-webkit-scrollbar { display: none; }
      ` }} />
    </div>
  );
}

export default ClubDetail;
