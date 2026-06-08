import React from "react";
import { MessageCircle, ShoppingCart, Search, Home as HomeIcon, Wine, Palmtree, UtensilsCrossed, ShoppingBag, ChevronRight, Star, MapPin } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto pb-24 font-['Inter']">
      {/* Header */}
      <header className="flex justify-between items-center p-6 sticky top-0 z-50 bg-black/80 backdrop-blur-md">
        <img src="/__mockup/images/sa-plug-logo.png" alt="SA PLUG" className="h-10 w-auto" />
        <div className="flex gap-4">
          <button className="p-2 rounded-full bg-white/5 border border-white/10 text-white">
            <MessageCircle size={20} />
          </button>
          <button className="p-2 rounded-full bg-white/5 border border-white/10 text-white">
            <ShoppingCart size={20} />
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="px-6 mb-8">
        <div className="relative rounded-2xl overflow-hidden h-[400px] shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <img 
            src="/__mockup/images/hero.png" 
            alt="Hero Nightlife" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h1 className="text-4xl font-['Poppins'] font-bold mb-2 leading-tight uppercase">Reserve The<br/><span className="text-[#D4AF37]">Night</span></h1>
            <p className="text-[#B3B3B3] mb-6 text-sm">Clubs. Bottle Service. Experiences.</p>
            <button className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA8A2A] text-black font-bold rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-transform active:scale-95">
              BOOK NOW
            </button>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="px-6 mb-10">
        <div className="flex justify-between gap-4">
          {[
            { icon: Wine, label: "Clubs" },
            { icon: Palmtree, label: "Tours" },
            { icon: UtensilsCrossed, label: "Dining" },
            { icon: ShoppingBag, label: "Shop" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <button className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] hover:bg-white/10 transition-colors">
                <item.icon size={24} />
              </button>
              <span className="text-xs text-[#B3B3B3] font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mb-10">
        <div className="flex justify-between items-end px-6 mb-6">
          <h2 className="text-xl font-['Poppins'] font-bold uppercase tracking-wide text-white">Upcoming Events</h2>
          <button className="text-[#D4AF37] text-sm font-medium flex items-center">View All <ChevronRight size={16}/></button>
        </div>
        <div className="flex overflow-x-auto px-6 gap-4 pb-4 snap-x hide-scrollbar">
          {[
            { date: "MAY 24", title: "Phat Thursdays", venue: "ICON Soweto", vip: true },
            { date: "MAY 26", title: "Major League Saturdays", venue: "Zone 6 Venue", vip: false },
            { date: "MAY 31", title: "Onyx Fridays", venue: "Onyx Sandton", vip: true },
            { date: "JUN 01", title: "The Society", venue: "TBA", vip: false }
          ].map((evt, i) => (
            <div key={i} className="snap-start shrink-0 w-64 rounded-2xl bg-[#0D0D0D] border border-white/10 p-4 relative flex flex-col gap-3">
              {evt.vip && <div className="absolute top-4 right-4 bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold px-2 py-1 rounded">VIP</div>}
              <div className="w-14 h-14 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/5">
                <span className="text-[#D4AF37] text-[10px] font-bold uppercase">{evt.date.split(' ')[0]}</span>
                <span className="text-lg font-['Poppins'] font-bold">{evt.date.split(' ')[1]}</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{evt.title}</h3>
                <p className="text-xs text-[#B3B3B3] flex items-center gap-1"><MapPin size={12}/>{evt.venue}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Book Tours */}
      <section className="mb-10">
        <div className="flex justify-between items-end px-6 mb-6">
          <h2 className="text-xl font-['Poppins'] font-bold uppercase tracking-wide text-white">Book Tours</h2>
          <button className="text-[#D4AF37] text-sm font-medium flex items-center">Explore <ChevronRight size={16}/></button>
        </div>
        <div className="flex overflow-x-auto px-6 gap-4 pb-4 snap-x hide-scrollbar">
          {[
            { img: "/__mockup/images/safari.png", title: "Safari Experience", price: "R1,250" },
            { img: "/__mockup/images/capetown.png", title: "Cape Town City Tour", price: "R850" },
            { img: "/__mockup/images/wine.png", title: "Stellenbosch Wine Tour", price: "R950" }
          ].map((tour, i) => (
            <div key={i} className="snap-start shrink-0 w-72 rounded-2xl overflow-hidden relative group">
              <img src={tour.img} alt={tour.title} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="font-['Poppins'] font-bold text-lg mb-1">{tour.title}</h3>
                <p className="text-[#D4AF37] text-sm font-medium">From {tour.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clubs / Nightlife */}
      <section className="mb-10">
        <div className="flex justify-between items-end px-6 mb-6">
          <h2 className="text-xl font-['Poppins'] font-bold uppercase tracking-wide text-white">Clubs / Nightlife</h2>
        </div>
        <div className="flex overflow-x-auto px-6 gap-4 pb-4 snap-x hide-scrollbar">
          {[
            { img: "/__mockup/images/onyx.png", name: "Onyx Sandton", rating: "4.8" },
            { img: "/__mockup/images/zone6.png", name: "Zone 6 Venue", rating: "4.6" },
            { img: "/__mockup/images/coco.png", name: "Coco Sandton", rating: "4.7" },
            { img: "/__mockup/images/kong.png", name: "Kong Rosebank", rating: "4.5" }
          ].map((club, i) => (
            <div key={i} className="snap-start shrink-0 w-64 rounded-2xl overflow-hidden relative">
              <img src={club.img} alt={club.name} className="w-full h-56 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 w-full flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-['Poppins'] font-bold text-lg">{club.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#D4AF37]">
                    <Star size={12} fill="currentColor" /> {club.rating}
                  </div>
                </div>
                <button className="w-full py-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold rounded-lg uppercase tracking-wider backdrop-blur-sm">
                  Book Table
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 flex">
        {([
          { icon: HomeIcon, label: "Home", active: true },
          { icon: Wine, label: "Clubs", active: false },
          { icon: Palmtree, label: "Tours", active: false },
          { icon: UtensilsCrossed, label: "Dining", active: false },
          { icon: ShoppingBag, label: "Shop", active: false },
        ] as const).map(({ icon: Icon, label, active }) => (
          <button key={label} className="flex-1 flex flex-col items-center py-3 gap-0.5">
            <Icon size={20} style={{ color: active ? "#D4AF37" : "#B3B3B3" }} strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium" style={{ color: active ? "#D4AF37" : "#B3B3B3" }}>{label}</span>
            {active && <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: "#D4AF37" }} />}
          </button>
        ))}
      </nav>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1rem); }
      `}} />
    </div>
  );
}

export default Home;