import React from "react";
import { Home as HomeIcon, Palmtree, Wine, UtensilsCrossed, User, ChevronRight, Star, Heart, CreditCard, Bell, Crown, Settings, HelpCircle, LogOut, Calendar } from "lucide-react";

export function Profile() {
  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto pb-32 font-['Inter']">
      {/* Hero Section */}
      <section className="relative pt-16 pb-8 px-6 flex flex-col items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-black to-black -z-10" />
        
        <div className="w-28 h-28 rounded-full border-4 border-[#D4AF37] overflow-hidden mb-4 relative shadow-[0_0_30px_rgba(212,175,55,0.4)] p-1">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Thabo Nkosi" className="w-full h-full rounded-full object-cover bg-white/5" />
        </div>
        
        <h1 className="text-3xl font-['Poppins'] font-bold mb-2">Thabo Nkosi</h1>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
            <Crown size={14} /> VIP Member
          </div>
          <div className="flex items-center gap-1 text-[#D4AF37] text-sm font-bold bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <Star size={14} fill="#D4AF37" /> 4.9 <span className="text-[#B3B3B3] font-normal ml-1">Top Member</span>
          </div>
        </div>
      </section>

      {/* VIP Status Card */}
      <section className="px-6 mb-6">
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-2 border-[#D4AF37]/50 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_25px_rgba(212,175,55,0.15)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <div className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-1">Gold VIP Member</div>
              <div className="text-xs text-[#B3B3B3]">Member since 2022</div>
            </div>
            <Crown size={28} className="text-[#D4AF37]" />
          </div>
          
          <div className="mb-6 relative z-10">
            <div className="text-xs text-[#B3B3B3] uppercase tracking-wide mb-1">Available Points</div>
            <div className="text-3xl font-['Poppins'] font-bold">12,450 <span className="text-sm text-[#D4AF37] font-normal">pts</span></div>
          </div>
          
          <button className="w-full bg-[#D4AF37] text-black font-bold py-3.5 rounded-xl uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-transform active:scale-95 relative z-10">
            Upgrade to Platinum
          </button>
        </div>
      </section>

      {/* Stats Row */}
      <section className="px-6 mb-8">
        <div className="flex gap-3">
          {[
            { label: "Bookings", val: "47" },
            { label: "Reviews", val: "23" },
            { label: "Saved", val: "18" }
          ].map((stat, i) => (
            <div key={i} className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
              <div className="text-2xl font-['Poppins'] font-bold text-white">{stat.val}</div>
              <div className="text-[10px] text-[#B3B3B3] uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Menu List */}
      <section className="px-6 mb-8">
        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
          {[
            { icon: Calendar, label: "My Bookings" },
            { icon: Heart, label: "Saved Venues" },
            { icon: CreditCard, label: "Payment Methods" },
            { icon: Bell, label: "Notifications" },
            { icon: Crown, label: "VIP Membership" },
            { icon: Settings, label: "Settings" },
            { icon: HelpCircle, label: "Help & Support" }
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <item.icon size={18} className="text-[#D4AF37]" />
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-[#B3B3B3]" />
            </button>
          ))}
        </div>
      </section>

      {/* Sign Out */}
      <section className="px-6 mb-12">
        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-500 font-bold uppercase tracking-wider text-sm hover:bg-red-500/10 transition-colors">
          <LogOut size={18} /> Sign Out
        </button>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 flex">
        {([
          { icon: HomeIcon, label: "Home", active: false },
          { icon: Wine, label: "Clubs", active: false },
          { icon: Palmtree, label: "Tours", active: false },
          { icon: UtensilsCrossed, label: "Dining", active: false },
          { icon: User, label: "Profile", active: true },
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

export default Profile;
