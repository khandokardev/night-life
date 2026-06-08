import React from "react";
import { MessageCircle, ShoppingBag, Search, Home as HomeIcon, Palmtree, Wine, UtensilsCrossed, ChevronRight, Star, MapPin, Bell, User, Users, QrCode, Plus, CheckCircle, Clock, Utensils, Ticket, Calendar } from "lucide-react";

export function Reservations() {
  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto pb-32 font-['Inter'] relative">
      {/* Header */}
      <header className="flex justify-between items-center p-6 sticky top-0 z-50 bg-black/80 backdrop-blur-md">
        <div className="text-2xl font-['Poppins'] font-bold tracking-wider">
          <span className="text-[#D4AF37]">SA</span> PLUG
        </div>
        <div className="flex gap-4">
          <button className="p-2 rounded-full bg-white/5 border border-white/10 text-white">
            <Bell size={20} />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover bg-white/10" />
          </div>
        </div>
      </header>

      <div className="px-6 mb-6">
        <h1 className="text-4xl font-['Poppins'] font-bold mb-2 uppercase tracking-wide">My Reservations</h1>
        <p className="text-[#B3B3B3] text-sm">Upcoming & Past bookings</p>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-8 sticky top-[88px] z-40 bg-black/90 py-2 backdrop-blur-md">
        <div className="flex bg-[#0D0D0D] border border-white/10 p-1 rounded-xl">
          {["Upcoming", "Past", "Cancelled"].map((tab, i) => (
            <button 
              key={tab}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                i === 0 
                ? 'bg-white/10 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                : 'text-[#B3B3B3] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Book Section */}
      <section className="px-6 mb-10">
        <h2 className="text-sm font-['Poppins'] font-bold text-[#B3B3B3] uppercase tracking-wider mb-4">Quick Book</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Wine, label: "Book Club Table" },
            { icon: Palmtree, label: "Book Tour" },
            { icon: Utensils, label: "Dining Reservation" },
            { icon: Ticket, label: "Event Tickets" }
          ].map((item, i) => (
            <button key={i} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-[#D4AF37]/50 transition-colors">
              <item.icon size={24} className="text-[#D4AF37]" />
              <span className="text-xs font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Bookings List */}
      <section className="px-6 mb-8">
        <div className="flex flex-col gap-4">
          {/* Card 1 */}
          <div className="flex flex-col p-4 rounded-2xl bg-[#0D0D0D] border border-white/10 gap-4">
            <div className="flex gap-4">
              <img src="/__mockup/images/onyx.png" alt="Onyx Sandton" className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-['Poppins'] font-bold text-base leading-none">ONYX SANDTON</h3>
                  <div className="flex items-center gap-1 bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    <CheckCircle size={10} /> Confirmed
                  </div>
                </div>
                <div className="text-xs text-[#D4AF37] font-bold mb-1">VIP Package</div>
                <div className="flex items-center gap-2 text-[10px] text-[#B3B3B3] mb-1">
                  <Calendar size={10}/> Tonight <span className="mx-1">•</span> <Clock size={10}/> 10:00 PM
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#B3B3B3]">
                  <Users size={10}/> Table for 4
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-colors">
                View Details
              </button>
              <button className="flex-1 py-2.5 bg-[#D4AF37] text-black text-xs font-bold rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <QrCode size={14} /> QR Code
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col p-4 rounded-2xl bg-[#0D0D0D] border border-white/10 gap-4">
            <div className="flex gap-4">
              <img src="/__mockup/images/tour-capetown.jpg" alt="Cape Town Tour" className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-['Poppins'] font-bold text-base leading-none">CAPE TOWN TOUR</h3>
                  <div className="flex items-center gap-1 bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    <CheckCircle size={10} /> Confirmed
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#B3B3B3] mb-1 mt-2">
                  <Calendar size={10}/> Tomorrow <span className="mx-1">•</span> <Clock size={10}/> 09:00 AM
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#B3B3B3]">
                  <Users size={10}/> 2 Guests
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-colors">
                View Details
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col p-4 rounded-2xl bg-[#0D0D0D] border border-white/10 gap-4">
            <div className="flex gap-4">
              <img src="/__mockup/images/coco.png" alt="Coco Sandton" className="w-20 h-20 rounded-xl object-cover opacity-70" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-['Poppins'] font-bold text-base leading-none">COCO SANDTON</h3>
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    <Clock size={10} /> Pending
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#B3B3B3] mb-1 mt-2">
                  <Calendar size={10}/> Sat, 25 May <span className="mx-1">•</span> <Clock size={10}/> 11:00 PM
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#B3B3B3]">
                  <Users size={10}/> Table for 2
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-colors">
                View Details
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center text-black shadow-[0_0_25px_rgba(212,175,55,0.6)] z-40 transition-transform active:scale-95 hover:scale-105">
        <Plus size={28} />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 flex">
        {([
          { icon: HomeIcon, label: "Home", active: false },
          { icon: Wine, label: "Clubs", active: false },
          { icon: Palmtree, label: "Tours", active: false },
          { icon: UtensilsCrossed, label: "Dining", active: true },
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
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1rem); }
      `}} />
    </div>
  );
}

export default Reservations;
