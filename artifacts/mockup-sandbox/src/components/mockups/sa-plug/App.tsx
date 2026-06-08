import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { ArrowLeft, MessageCircle, ShoppingCart, ShoppingBag, Search, Home as HomeIcon, Music, Wine, Palmtree, Map, Calendar, Coffee, ChevronRight, Star, MapPin, User, Mail, Eye, EyeOff, Phone, Check, Lock, Shield, ShieldCheck, Bell, Heart, CreditCard, Crown, Settings, HelpCircle, LogOut, Plus, Clock, Users, Minus, Trash2, X, Send, QrCode, Tag, Zap, Download, Share2, ChevronDown, CheckCircle2, AlertCircle, UtensilsCrossed, Play, SlidersHorizontal, MessageSquare, Globe, Moon, Sun, Bookmark, ArrowRight, CheckSquare, Square, Utensils, ChevronUp, Filter, Camera, Edit3, Key, ToggleLeft, Navigation, ExternalLink } from "lucide-react";
import { CountryCodePicker, DEFAULT_COUNTRY, type Country } from "./CountryCodePicker";

const LOGO = "/__mockup/images/sa-plug-logo.png";
const GOLD = "#D4AF37";

/* ─── SIMPLE NAV-STATE STORE (category hints, OTP context) ─── */
let _pendingCat = "";
let _otpType: "phone" | "email" = "phone";
let _otpTarget = "";
let _selectedProductId = 20;

/* Simulated delivered orders — only these products unlock the "Write a Review" form */
const PURCHASED_PRODUCT_IDS = new Set([20, 23, 26, 28]); // Hoodie, Dom Pérignon, VIP Bottle, Gift Card

/* ─── GLOBAL BOOKING STATE ─── */
let _bookingState = { dateIdx: 1, time: "10:30 PM", guests: 2, table: "VIP Table A" };
let _bookingEditMode = false;
let _modifyMode = false;          // true when modifying a PAID booking
let _modifyExtraAmount = 0;       // delta the user owes after modification
/* Constants representing the already-confirmed, paid booking (matches BookingDetailScreen "Total Paid: R2,500") */
const PAID_BOOKING_AMOUNT = 2500;
const PAID_BOOKING_TABLE_PRICE = 3200; // getTablePrice("VIP Table A")
const PAID_BOOKING_MIN_GUESTS = 2;

/* ─── BOOKING DATA ─── */
const BOOKING_DATES = [
  { day: "Fri", date: "23", full: "Fri, 23 May 2026" },
  { day: "Sat", date: "24", full: "Sat, 24 May 2026" },
  { day: "Sun", date: "25", full: "Sun, 25 May 2026" },
  { day: "Mon", date: "26", full: "Mon, 26 May 2026" },
  { day: "Tue", date: "27", full: "Tue, 27 May 2026" },
  { day: "Wed", date: "28", full: "Wed, 28 May 2026" },
  { day: "Thu", date: "29", full: "Thu, 29 May 2026" },
];
const BOOKING_TIMES = ["8:00 PM","9:00 PM","9:30 PM","10:00 PM","10:30 PM","11:00 PM","11:30 PM","12:00 AM"];
const BOOKING_TABLES = [
  { id: "T1",    name: "Table 1",    type: "Standard",  cap: 4,  available: true  },
  { id: "T2",    name: "Table 2",    type: "Standard",  cap: 4,  available: true  },
  { id: "T3",    name: "Table 3",    type: "Booth",     cap: 6,  available: false },
  { id: "VIP-A", name: "VIP Table A",type: "Premium",   cap: 8,  available: true  },
  { id: "VIP-B", name: "VIP Table B",type: "Premium",   cap: 8,  available: false },
  { id: "VIP-L", name: "VIP Lounge", type: "Exclusive", cap: 12, available: true  },
];
function getTablePrice(name: string) {
  if (name.includes("VIP Lounge")) return 4000;
  if (name.includes("VIP")) return 3200;
  if (name.includes("Booth")) return 3000;
  return 2500;
}

/* ─── THEME & LANGUAGE CONTEXT ─── */
const ThemeCtx = createContext<'dark' | 'light'>('dark');
const SetThemeCtx = createContext<React.Dispatch<React.SetStateAction<'dark' | 'light'>>>(() => {});
const LangCtx = createContext<string>('en');
const SetLangCtx = createContext<React.Dispatch<React.SetStateAction<string>>>(() => {});

/* ─── NAVIGATION CONTEXT ─── */
const NavCtx = createContext<{ navigate: (s: Screen) => void; goBack: () => void }>({ navigate: () => {}, goBack: () => {} });
function useNav() { return useContext(NavCtx); }

/* ─── THEME COLORS HOOK ─── */
function useTC() {
  const theme = useContext(ThemeCtx);
  const d = theme === 'dark';
  return {
    isDark: d,
    /* ── base surfaces ── */
    bg:       d ? '#000000' : '#F7F4F0',
    bg2:      d ? '#0D0D0D' : '#FFFFFF',
    bg3:      d ? '#111111' : '#F0ECF7',
    card:     d ? '#0D0D0D' : '#FFFFFF',
    card2:    d ? '#111111' : '#F4F1FA',
    /* ── text ── */
    text:     d ? '#FFFFFF' : '#1A1A2E',
    text2:    d ? '#B3B3B3' : '#4B5563',
    text3:    d ? '#777777' : '#9CA3AF',
    muted:    d ? '#555555' : '#D1D5DB',
    /* ── borders ── */
    border:   d ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)',
    border2:  d ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.10)',
    /* ── navigation / overlays ── */
    headerBg: d ? 'rgba(0,0,0,0.92)' : 'rgba(247,244,240,0.95)',
    navBg:    d ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.97)',
    inputBg:  d ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
    overlay:  d ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)',
    tagBg:    d ? 'rgba(255,255,255,0.07)' : 'rgba(108,79,187,0.07)',
    gold10:   'rgba(212,175,55,0.1)',
    gold20:   'rgba(212,175,55,0.2)',
    /* ── light-mode accent system (purple/teal replace gold for interactive UI) ── */
    accent:          d ? GOLD      : '#6C4FBB',
    accentGrad:      d ? 'linear-gradient(135deg,#D4AF37,#C9A000)' : 'linear-gradient(135deg,#45C4B0,#6C4FBB)',
    accentShadow:    d ? 'rgba(212,175,55,0.35)' : 'rgba(108,79,187,0.22)',
    accentTeal:      d ? GOLD      : '#4ECDC4',
    chipBg:          d ? 'rgba(255,255,255,0.07)' : 'rgba(108,79,187,0.07)',
    chipColor:       d ? '#777777' : '#6C4FBB',
    chipActiveBg:    d ? GOLD      : '#4ECDC4',
    chipActiveColor: d ? '#000000' : '#FFFFFF',
    /* ── auth-screen specific ── */
    authSheet:      d ? '#0D0D0D' : '#FFFFFF',
    authText:       d ? '#FFFFFF' : '#1A1A2E',
    authSub:        d ? '#999999' : '#6B7280',
    authInputBg:    d ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
    authBorder:     d ? 'rgba(255,255,255,0.15)' : '#E5E7EB',
    authIcon:       d ? '#888888' : '#9CA3AF',
    authDivider:    d ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
    authDivText:    d ? '#666666' : '#9CA3AF',
    authSocialBg:   d ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
    authSocialBd:   d ? 'rgba(255,255,255,0.1)'  : '#E5E7EB',
    authSocialText: d ? '#999999' : '#6B7280',
    authTabBg:      d ? 'rgba(255,255,255,0.05)' : '#F3F0F9',
    authTabBd:      d ? 'rgba(255,255,255,0.1)'  : '#E0D9F5',
    authTabActive:  d ? GOLD : '#6C4FBB',
    authTabActTxt:  d ? '#000000' : '#FFFFFF',
    authTabInTxt:   d ? '#777777' : '#9CA3AF',
  };
}

const LANGS: { code: string; label: string; flag: string; native: string }[] = [
  { code: "en-ZA", label: "English (SA)", flag: "🇿🇦", native: "South African English" },
  { code: "en-AU", label: "Australian English", flag: "🇦🇺", native: "Australian English" },
  { code: "en-GB", label: "UK English", flag: "🇬🇧", native: "British English" },
  { code: "en-US", label: "US English", flag: "🇺🇸", native: "American English" },
  { code: "af", label: "Afrikaans", flag: "🇿🇦", native: "Afrikaans" },
  { code: "fr", label: "French", flag: "🇫🇷", native: "Français" },
  { code: "pt", label: "Portuguese", flag: "🇵🇹", native: "Português" },
  { code: "ar", label: "Arabic", flag: "🇦🇪", native: "العربية" },
];

type Screen =
  | "splash" | "onboarding" | "welcome" | "signin" | "signup"
  | "forgot" | "otp" | "home" | "clubs" | "tours"
  | "reservations" | "shop" | "profile" | "clubdetail"
  | "cart" | "chat" | "search" | "bookingdetail" | "deals"
  | "checkout-details" | "checkout-payment" | "checkout-confirmed"
  | "profile-bookings" | "profile-saved" | "profile-payment" | "profile-notifications"
  | "profile-vip" | "profile-settings" | "profile-help"
  | "profile-edit" | "profile-password" | "profile-privacy"
  | "dining" | "restaurantdetail" | "tourdetail" | "shopdetail"
  | "legal-terms" | "legal-payment" | "legal-disclaimer" | "legal-refund" | "legal-privacy"
  | "set-password";

interface CartItem { id: number; name: string; price: number; qty: number; venue: string; }

/* ─── SVG ICONS ─── */
const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 814 1000" fill="#ffffff">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 134.4-317.8 266.5-317.8 69.8 0 127.9 45.1 172.4 45.1 42.8 0 109.1-47.2 187.4-47.2 14.6 0 108.2 1.3 172.4 62.2zm-174.4-102.7c33.4-39.5 57.1-94.3 57.1-149.2 0-7.7-.6-15.4-1.9-22.4-54.2 1.9-117.8 36.5-155.6 80.5-30.6 35.8-60.3 90.7-60.3 146.8 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.3 1.3 13.4 1.3 48.7 0 109.1-33.4 145.4-76.2z"/>
  </svg>
);

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#1877F2"/>
    <path fill="white" d="M15.12 8.877h-2.018V7.62c0-.498.33-.614.562-.614h1.424V5.01L13.11 5c-2.219 0-2.723 1.663-2.723 2.726v1.151H9v2.046h1.387V16h2.715v-5.077h1.831l.187-2.046z"/>
  </svg>
);

const Sparkle = ({ size = 14, color = GOLD }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
  </svg>
);

/* ─── FAKE QR CODE ─── */
function FakeQR({ size = 140 }: { size?: number }) {
  const cell = size / 21;
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,0,0],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,1,1,0,1,1,0],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,1,0],
    [1,1,0,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,0,0,1],
    [0,1,1,0,1,1,0,1,1,0,0,1,0,1,1,0,0,1,0,1,1],
    [1,0,1,1,0,1,1,0,1,1,0,0,1,1,0,1,0,0,1,0,0],
    [0,1,0,0,1,0,0,1,0,1,1,0,0,1,1,0,1,1,0,1,1],
    [1,1,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,0,1,0,0],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,1,0,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,1,0,1,0,1,0,1,0,0,0],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0],
    [1,0,1,1,1,0,1,1,1,0,0,1,0,1,1,0,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,1,0,0,1,0,0],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,1,1,0,0,1,1],
    [1,1,1,1,1,1,1,0,1,0,0,1,1,0,1,0,0,1,0,0,0],
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx={4}/>
      {pattern.map((row, r) => row.map((cell_val, c) =>
        cell_val ? <rect key={`${r}-${c}`} x={c * cell + 1} y={r * cell + 1} width={cell - 0.5} height={cell - 0.5} fill="#000" rx={0.5} /> : null
      ))}
      <rect x={size/2 - 12} y={size/2 - 12} width={24} height={24} fill={GOLD} rx={4}/>
    </svg>
  );
}

/* ─── AUTO SLIDER ─── */
interface SlideItem {
  img: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  onCta?: () => void;
}
function AutoSlider({ slides, height = 200, interval = 4000 }: { slides: SlideItem[]; height?: number; interval?: number }) {
  const tc = useTC();
  const [cur, setCur] = useState(0);
  const touchStartX = useRef(0);
  const touchDelta = useRef(0);
  const paused = useRef(false);

  useEffect(() => {
    const t = setInterval(() => { if (!paused.current) setCur(c => (c + 1) % slides.length); }, interval);
    return () => clearInterval(t);
  }, [slides.length, interval]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDelta.current = 0;
    paused.current = true;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchDelta.current = e.touches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    if (touchDelta.current < -50) setCur(c => (c + 1) % slides.length);
    else if (touchDelta.current > 50) setCur(c => (c - 1 + slides.length) % slides.length);
    touchDelta.current = 0;
    setTimeout(() => { paused.current = false; }, 2000);
  };

  const s = slides[cur];
  return (
    <div
      className="relative rounded-2xl overflow-hidden select-none"
      style={{ height }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((sl, i) => (
        <img key={i} src={sl.img} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: i === cur ? 1 : 0 }} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      {s.title && (
        <div className="absolute bottom-0 left-0 p-5 w-full">
          <h2 className="font-['Poppins'] font-bold text-xl leading-tight text-white mb-1">{s.title}</h2>
          {s.subtitle && <p className="text-white/70 text-xs mb-3">{s.subtitle}</p>}
          {s.cta && (
            <button onClick={s.onCta} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white text-xs active:scale-95 transition-transform"
              style={{ background: tc.accentGrad, boxShadow: `0 0 16px ${tc.accentShadow}` }}>
              {s.cta} <ChevronRight size={13} strokeWidth={3} />
            </button>
          )}
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCur(i)} className="rounded-full transition-all"
            style={{ width: i === cur ? 20 : 6, height: 6, background: i === cur ? tc.chipActiveBg : 'rgba(255,255,255,0.4)' }} />
        ))}
      </div>
    </div>
  );
}

/* ─── MAP PREVIEW ─── */
function MapPreview({ venue, address }: { venue: string; address: string }) {
  const tc = useTC();
  const openMaps = () => {
    const query = encodeURIComponent(`${venue}, ${address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ height: 140, border: `1px solid ${tc.border}` }}>
      <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="140" fill={tc.isDark ? '#1A2130' : '#E8EDF5'} />
        {[20,60,100,140,180,220,260,300,340,380].map(x => <line key={x} x1={x} y1="0" x2={x} y2="140" stroke={tc.isDark ? '#222D3D' : '#D8E0ED'} strokeWidth="1"/>)}
        {[20,50,80,110,135].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke={tc.isDark ? '#222D3D' : '#D8E0ED'} strokeWidth="1"/>)}
        <rect x="50" y="30" width="80" height="20" rx="3" fill={tc.isDark ? '#263040' : '#C5D0E2'} />
        <rect x="170" y="55" width="100" height="20" rx="3" fill={tc.isDark ? '#263040' : '#C5D0E2'} />
        <rect x="280" y="20" width="70" height="30" rx="3" fill={tc.isDark ? '#263040' : '#C5D0E2'} />
        <rect x="30" y="70" width="60" height="35" rx="3" fill={tc.isDark ? '#263040' : '#C5D0E2'} />
        <rect x="300" y="70" width="80" height="40" rx="3" fill={tc.isDark ? '#263040' : '#C5D0E2'} />
        <circle cx="200" cy="65" r="22" fill={`${tc.accent}25`} />
        <circle cx="200" cy="65" r="12" fill={tc.accent} />
        <text x="200" y="70" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">📍</text>
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2"
        style={{ background: tc.isDark ? 'rgba(0,0,0,0.88)' : 'rgba(255,255,255,0.94)', backdropFilter: 'blur(8px)' }}>
        <div>
          <p className="font-bold text-xs" style={{ color: tc.text }}>{venue}</p>
          <p className="text-[10px]" style={{ color: tc.text2 }}>{address}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openMaps} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg"
            style={{ background: `${tc.accent}15`, color: tc.accent, border: `1px solid ${tc.accent}40` }}>
            <Navigation size={10} /> Directions
          </button>
          <button onClick={openMaps} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg text-white"
            style={{ background: tc.accentGrad }}>
            <ExternalLink size={10} /> Maps
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── REVIEWS SECTION ─── */
interface ReviewItem { name: string; rating: number; date: string; text: string; }
function ReviewsSection({ rating, count, reviews, purchased = true }: { rating: number; count: number; reviews: ReviewItem[]; purchased?: boolean }) {
  const tc = useTC();
  const [showWrite, setShowWrite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const bars: [number, string][] = [[5,"78%"],[4,"14%"],[3,"5%"],[2,"2%"],[1,"1%"]];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl p-4" style={{ background: tc.card2, border: `1px solid ${tc.border}` }}>
        <div className="text-center">
          <p className="font-['Poppins'] font-bold text-4xl" style={{ color: tc.accent }}>{rating}</p>
          <div className="flex gap-0.5 my-1">{[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i<=Math.round(rating)?GOLD:"none"} style={{ color: GOLD }} />)}</div>
          <p className="text-[10px]" style={{ color: tc.text3 }}>{count.toLocaleString()} reviews</p>
        </div>
        <div className="flex-1 space-y-1">
          {bars.map(([n,pct]) => (
            <div key={n} className="flex items-center gap-2">
              <span className="text-[10px] w-3" style={{ color: tc.text3 }}>{n}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: tc.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: pct, background: tc.accent }} />
              </div>
              <span className="text-[10px] w-7" style={{ color: tc.text3 }}>{pct}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Verified purchase gate */}
      {!purchased && !submitted && (
        <div className="w-full py-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5"
          style={{ borderColor: tc.border, background: tc.card2 }}>
          <div className="flex items-center gap-2">
            <Lock size={14} style={{ color: tc.muted }} />
            <span className="text-sm font-semibold" style={{ color: tc.text2 }}>Verified Purchase Required</span>
          </div>
          <span className="text-[11px]" style={{ color: tc.muted }}>You can review this product after purchase &amp; delivery</span>
        </div>
      )}
      {purchased && !showWrite && !submitted && (
        <button onClick={() => setShowWrite(true)} className="w-full py-3 rounded-xl font-bold text-sm border flex items-center justify-center gap-2"
          style={{ borderColor: tc.accent, color: tc.accent, background: `${tc.accent}08` }}>
          <Edit3 size={15} /> Write a Review
        </button>
      )}
      {showWrite && !submitted && (
        <div className="rounded-2xl p-4 space-y-3" style={{ background: tc.card2, border: `1px solid ${tc.border}` }}>
          <p className="font-bold text-sm" style={{ color: tc.text }}>Your Rating</p>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(i => (
              <button key={i} onClick={() => setUserRating(i)}>
                <Star size={28} fill={i<=userRating?GOLD:"none"} style={{ color: i<=userRating?GOLD:tc.muted }} />
              </button>
            ))}
          </div>
          <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
            placeholder="Share your experience..." rows={3}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
            style={{ background: tc.inputBg, border: `1px solid ${tc.border}`, color: tc.text }} />
          <div className="flex gap-2">
            <button onClick={() => setShowWrite(false)} className="flex-1 py-2.5 rounded-xl font-bold text-xs border" style={{ borderColor: tc.border, color: tc.text2 }}>Cancel</button>
            <button onClick={() => { if (userRating && reviewText) { setSubmitted(true); setShowWrite(false); } }}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white" style={{ background: tc.accentGrad }}>Submit</button>
          </div>
        </div>
      )}
      {submitted && (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <CheckCircle2 size={20} className="text-green-400" />
          <p className="text-sm font-bold text-green-400">Review submitted! Thank you.</p>
        </div>
      )}
      {reviews.map((r, i) => (
        <div key={i} className="rounded-2xl p-4" style={{ background: tc.card2, border: `1px solid ${tc.border}` }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: `${tc.accent}18`, color: tc.accent }}>{r.name[0]}</div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: tc.text }}>{r.name}</p>
              <p className="text-[10px]" style={{ color: tc.muted }}>{r.date}</p>
            </div>
            <div className="flex gap-0.5">{[1,2,3,4,5].map(i2 => <Star key={i2} size={11} fill={i2<=r.rating?GOLD:"none"} style={{ color: GOLD }} />)}</div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: tc.text2 }}>{r.text}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── BOTTOM NAV ─── */
function BottomNav({ active, navigate }: { active: string; navigate: (s: Screen) => void }) {
  const tc = useTC();
  const tabs = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "clubs", label: "Clubs", icon: Wine },
    { id: "tours", label: "Tours", icon: Palmtree },
    { id: "dining", label: "Dining", icon: UtensilsCrossed },
    { id: "shop", label: "Shop", icon: ShoppingBag },
  ] as const;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t flex" style={{ background: tc.navBg, borderColor: tc.border }}>
      {tabs.map(({ id, label, icon: Icon }) => (
        <button key={id} onClick={() => navigate(id as Screen)} className="flex-1 flex flex-col items-center py-3 gap-0.5">
          <Icon size={20} style={{ color: active === id ? tc.accent : tc.text3 }} strokeWidth={active === id ? 2.5 : 1.5} />
          <span className="text-[10px] font-medium" style={{ color: active === id ? tc.accent : tc.text3 }}>{label}</span>
          {active === id && <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: tc.accent }} />}
        </button>
      ))}
    </nav>
  );
}

/* ─── HEADER ─── */
function Header({ navigate, cartCount }: { navigate: (s: Screen) => void; cartCount: number }) {
  const tc = useTC();
  return (
    <header className="flex justify-between items-center px-5 py-3 sticky top-0 z-40 backdrop-blur-md border-b" style={{ background: tc.headerBg, borderColor: tc.border }}>
      <img src={LOGO} alt="SA PLUG" className="h-9 w-auto" />
      <div className="flex gap-3 items-center">
        <button onClick={() => navigate("search")} className="p-2 rounded-full border" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><Search size={18} /></button>
        <button onClick={() => navigate("chat")} className="p-2 rounded-full border" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><MessageCircle size={18} /></button>
        <button onClick={() => navigate("cart")} className="relative p-2 rounded-full border" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}>
          <ShoppingCart size={18} />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{ background: tc.accent }}>{cartCount}</span>}
        </button>
        <button onClick={() => navigate("profile")} className="w-8 h-8 rounded-full border-2 flex items-center justify-center overflow-hidden" style={{ background: `${tc.accent}20`, borderColor: tc.accent }}>
          <User size={16} style={{ color: tc.accent }} />
        </button>
      </div>
    </header>
  );
}

/* ─── AUTH SCREENS ─── */
function SplashScreen({ navigate }: { navigate: (s: Screen) => void }) {
  useEffect(() => { const t = setTimeout(() => navigate("onboarding"), 2500); return () => clearTimeout(t); }, []);
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <img src="/__mockup/images/splash-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
      <div className="relative z-10 flex flex-col items-center">
        <img src={LOGO} alt="SA PLUG" className="w-72 h-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.6)]" />
        <div className="mt-16 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFF3B0] rounded-full animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  );
}

function OnboardingScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { img: "/__mockup/images/onboard-1.png", heading: "Experience", gold: "Luxury", tail: "Nightlife", sub: "Exclusive access to SA's most premium venues, bottle service & unforgettable experiences." },
    { img: "/__mockup/images/onboard-2.png", heading: "Book Premium", gold: "Experiences", tail: "", sub: "Safari, wine tours, helicopter rides, yacht experiences — all in one place." },
    { img: "/__mockup/images/splash-bg.png", heading: "Your VIP", gold: "Concierge", tail: "", sub: "24/7 luxury concierge service at your fingertips. Reserve, discover, belong." },
  ];
  useEffect(() => {
    const t = setInterval(() => setSlide(c => (c + 1) % 3), 4000);
    return () => clearInterval(t);
  }, []);
  const s = slides[slide];
  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-['Inter']">
      {slides.map((sl, i) => (
        <img key={i} src={sl.img} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-80" style={{ opacity: i === slide ? 0.8 : 0 }} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black" />
      <div className="absolute top-5 right-5 z-20"><button onClick={() => navigate("welcome")} className="text-[#B3B3B3] text-sm font-medium">Skip</button></div>
      <div className="absolute bottom-0 left-0 w-full p-8 z-10">
        <h2 className="font-['Poppins'] font-bold text-4xl text-white mb-3 leading-tight uppercase">
          {s.heading}<br /><span style={{ color: GOLD }}>{s.gold}</span>{s.tail && <><br />{s.tail}</>}
        </h2>
        <p className="text-[#B3B3B3] text-sm mb-8 leading-relaxed">{s.sub}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div key={i} onClick={() => setSlide(i)} className="rounded-full transition-all cursor-pointer"
                style={{ width: i === slide ? 28 : 8, height: 4, background: i === slide ? GOLD : "rgba(255,255,255,0.2)" }} />
            ))}
          </div>
          <button onClick={() => slide < 2 ? setSlide(slide + 1) : navigate("welcome")}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-black"
            style={{ background: GOLD, boxShadow: `0 0 20px rgba(212,175,55,0.5)` }}>
            {slide < 2 ? "Next" : "Get Started"} <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="min-h-screen bg-black flex flex-col relative font-['Inter']">
      <img src="/__mockup/images/welcome-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
      <div className="relative z-10 flex flex-col flex-1 px-6 pt-20 pb-10">
        <div className="flex flex-col items-center mb-auto">
          <img src={LOGO} alt="SA PLUG" className="w-56 h-auto drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]" />
        </div>
        <div className="mb-8 text-center">
          <h2 className="font-['Poppins'] font-bold text-3xl text-white mb-2">Welcome to SA PLUG</h2>
          <p className="text-[#B3B3B3] text-sm max-w-[280px] mx-auto">South Africa's #1 Luxury Nightlife & Experiences Platform</p>
        </div>
        <div className="flex flex-col gap-3 mb-7">
          <button onClick={() => navigate("signin")} className="w-full py-4 rounded-2xl font-bold text-black text-[15px] tracking-wide active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #D4AF37 0%, #C9A000 100%)", boxShadow: "0 8px 24px rgba(212,175,55,0.4)" }}>Log In</button>
          <button onClick={() => navigate("signup")} className="w-full py-4 rounded-2xl font-bold text-[15px] tracking-wide border active:scale-95 transition-transform"
            style={{ color: GOLD, borderColor: GOLD }}>Create Account</button>
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-white/10" /><span className="text-[#666] text-xs">or continue with</span><div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="flex gap-3 mb-7">
          {[{ icon: <AppleIcon size={22} />, label: "Apple" }, { icon: <GoogleIcon size={22} />, label: "Google" }, { icon: <FacebookIcon size={22} />, label: "Facebook" }].map(({ icon, label }) => (
            <button key={label} onClick={() => navigate("home")} className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-transform">
              {icon}<span className="text-[11px] text-[#999] font-medium">{label}</span>
            </button>
          ))}
        </div>
        <p className="text-center text-[#666] text-[11px]">By continuing, you agree to our <button onClick={() => navigate("legal-terms")} className="font-semibold underline underline-offset-2" style={{ color: GOLD }}>Terms</button> & <button onClick={() => navigate("legal-privacy")} className="font-semibold underline underline-offset-2" style={{ color: GOLD }}>Privacy Policy</button></p>
      </div>
    </div>
  );
}

function SignInScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [showPw, setShowPw] = useState(false);
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attempted, setAttempted] = useState(false);
  const [emailVal, setEmailVal] = useState("");
  const [pwVal, setPwVal] = useState("");
  const [phoneVal, setPhoneVal] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "email") {
      if (!emailVal.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid email address";
      if (pwVal.length < 6) e.pw = pwVal.length === 0 ? "Password is required" : "Password must be at least 6 characters";
    } else {
      if (phoneVal.replace(/\D/g, "").length < 9) e.phone = "Enter a valid phone number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const tc = useTC();
  return (
    <div className="h-screen flex flex-col overflow-hidden font-['Inter']" style={{ background: tc.isDark ? '#000' : '#F7F4F0' }}>
      <div className="relative h-[38%] flex-shrink-0">
        <img src="/__mockup/images/welcome-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
        <button onClick={() => navigate("welcome")} className="absolute top-12 left-5 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"><ArrowLeft size={20} /></button>
      </div>
      <div className="flex-1 rounded-t-[32px] -mt-8 relative z-10 flex flex-col overflow-y-auto shadow-2xl" style={{ background: tc.authSheet }}>
        <div className="px-6 pt-7 pb-8 flex flex-col flex-1">
          <h1 className="font-['Poppins'] font-bold text-[26px] mb-1" style={{ color: tc.authText }}>Log In</h1>
          <p className="text-sm mb-5" style={{ color: tc.authSub }}>Welcome back! Glad to see you again.</p>
          <div className="flex rounded-2xl p-1 mb-5 border" style={{ background: tc.authTabBg, borderColor: tc.authTabBd }}>
            {(["email", "phone"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={mode === m ? { background: tc.authTabActive, color: tc.authTabActTxt } : { color: tc.authTabInTxt }}>
                {m === "email" ? <><Mail size={15} /> Email</> : <><Phone size={15} /> Phone</>}
              </button>
            ))}
          </div>
          {mode === "email" ? (
            <div className="space-y-3 mb-3">
              <div>
                <div className="relative">
                  <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }} />
                  <input type="email" value={emailVal} onChange={e => setEmailVal(e.target.value)} placeholder="Email Address"
                    className="w-full border rounded-2xl py-[14px] pl-11 pr-4 text-sm outline-none"
                    style={{ background: tc.authInputBg, borderColor: attempted && errors.email ? "#ef4444" : tc.authBorder, color: tc.authText }} />
                </div>
                {attempted && errors.email && <p className="text-red-400 text-xs mt-1 pl-1">{errors.email}</p>}
              </div>
              <div>
                <div className="relative">
                  <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }} />
                  <input type={showPw ? "text" : "password"} value={pwVal} onChange={e => setPwVal(e.target.value)} placeholder="Password"
                    className="w-full border rounded-2xl py-[14px] pl-11 pr-12 text-sm outline-none"
                    style={{ background: tc.authInputBg, borderColor: attempted && errors.pw ? "#ef4444" : tc.authBorder, color: tc.authText }} />
                  <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }}>{showPw ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                </div>
                {attempted && errors.pw && <p className="text-red-400 text-xs mt-1 pl-1">{errors.pw}</p>}
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <div className="flex gap-2">
                <CountryCodePicker selected={country} onChange={setCountry} />
                <div className="relative flex-1">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }} />
                  <input type="tel" value={phoneVal} onChange={e => setPhoneVal(e.target.value)} placeholder="Phone number"
                    className="w-full border rounded-2xl py-[14px] pl-10 pr-4 text-sm outline-none"
                    style={{ background: tc.authInputBg, borderColor: attempted && errors.phone ? "#ef4444" : tc.authBorder, color: tc.authText }} />
                </div>
              </div>
              {attempted && errors.phone && <p className="text-red-400 text-xs mt-1 pl-1">{errors.phone}</p>}
            </div>
          )}
          {mode === "email"
            ? <button onClick={() => navigate("forgot")} className="text-right text-sm font-semibold mb-5" style={{ color: tc.accent }}>Forgot Password?</button>
            : <div className="mb-5" />}
          <button onClick={() => { setAttempted(true); if (!validate()) return; _otpType = mode; _otpTarget = mode === "phone" ? `${country.code} ${phoneVal}` : emailVal; navigate(mode === "phone" ? "otp" : "home"); }}
            className="w-full py-4 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2 mb-5 active:scale-95 transition-transform"
            style={{ background: tc.accentGrad, boxShadow: `0 8px 24px ${tc.accentShadow}` }}>
            {mode === "email" ? <>Log In <ChevronRight size={18} strokeWidth={3} /></> : <>Send OTP <MessageSquare size={17} strokeWidth={2.5} /></>}
          </button>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1" style={{ background: tc.authDivider }} />
            <span className="text-xs" style={{ color: tc.authDivText }}>or continue with</span>
            <div className="h-px flex-1" style={{ background: tc.authDivider }} />
          </div>
          <div className="flex gap-3 mb-5">
            {[{ icon: <AppleIcon size={22} />, label: "Apple" }, { icon: <GoogleIcon size={22} />, label: "Google" }, { icon: <FacebookIcon size={22} />, label: "Facebook" }].map(({ icon, label }) => (
              <button key={label} onClick={() => navigate("home")} className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl border active:scale-95 transition-transform"
                style={{ background: tc.authSocialBg, borderColor: tc.authSocialBd }}>
                {icon}<span className="text-[11px] font-medium" style={{ color: tc.authSocialText }}>{label}</span>
              </button>
            ))}
          </div>
          <p className="text-center text-sm mt-auto" style={{ color: tc.authSub }}>Don't have an account? <button onClick={() => navigate("signup")} className="font-bold" style={{ color: tc.accent }}>Sign Up</button></p>
        </div>
      </div>
    </div>
  );
}

function SignUpScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const tc = useTC();
  const inputCls = "w-full border rounded-2xl py-[14px] pl-11 pr-4 text-sm outline-none";
  const inputStyle = { background: tc.authInputBg, borderColor: tc.authBorder, color: tc.authText };
  return (
    <div className="min-h-screen font-['Inter'] overflow-y-auto" style={{ background: tc.isDark ? '#0A0A0A' : '#F7F4F0' }}>
      <div className="relative h-44 overflow-hidden">
        <button onClick={() => navigate("welcome")} className="absolute top-12 left-5 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"><ArrowLeft size={20} /></button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end justify-center w-full px-8">
          <div className="relative flex items-end justify-center" style={{ width: 240, height: 130 }}>
            <div className="absolute left-0 bottom-0 w-24 h-24 rounded-full overflow-hidden border-2 z-10" style={{ borderColor: `${tc.accent}60` }}><img src="/__mockup/images/tour-safari.jpg" alt="" className="w-full h-full object-cover" /></div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-28 h-28 rounded-full overflow-hidden border-2 z-20" style={{ borderColor: tc.accent }}><img src="/__mockup/images/hero.png" alt="" className="w-full h-full object-cover" /></div>
            <div className="absolute right-0 bottom-0 w-24 h-24 rounded-full overflow-hidden border-2 z-10" style={{ borderColor: `${tc.accent}60` }}><img src="/__mockup/images/tour-capetown.jpg" alt="" className="w-full h-full object-cover" /></div>
          </div>
        </div>
      </div>
      <div className="rounded-t-[32px] -mt-6 px-6 pt-7 pb-10 relative z-10 shadow-2xl" style={{ background: tc.authSheet }}>
        <h1 className="font-['Poppins'] font-bold text-[26px] mb-1" style={{ color: tc.authText }}>Create Account</h1>
        <p className="text-sm mb-5" style={{ color: tc.authSub }}>Let's get you started on your next adventure.</p>
        <div className="flex rounded-2xl p-1 mb-5 border" style={{ background: tc.authTabBg, borderColor: tc.authTabBd }}>
          {(["email", "phone"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={mode === m ? { background: tc.authTabActive, color: tc.authTabActTxt } : { color: tc.authTabInTxt }}>
              {m === "email" ? <><Mail size={15} /> Email</> : <><Phone size={15} /> Phone</>}
            </button>
          ))}
        </div>
        <div className="relative mb-3">
          <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }} />
          <input type="text" placeholder="Full Name" className={inputCls} style={inputStyle} />
        </div>
        <div className="relative mb-3">
          <Calendar size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }} />
          <input type="date" max={new Date(new Date().setFullYear(new Date().getFullYear()-18)).toISOString().split("T")[0]}
            className={inputCls} style={{ ...inputStyle, colorScheme: tc.isDark ? "dark" : "light" }} />
        </div>
        {mode === "email" ? (
          <div className="space-y-3 mb-5">
            <div className="relative"><Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }} /><input type="email" placeholder="Email Address" className={inputCls} style={inputStyle} /></div>
            <div className="relative">
              <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }} />
              <input type={showPw?"text":"password"} placeholder="Password" className={`${inputCls} pr-12`} style={inputStyle} />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }}>{showPw?<EyeOff size={17}/>:<Eye size={17}/>}</button>
            </div>
            <div className="relative">
              <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }} />
              <input type={showCp?"text":"password"} placeholder="Confirm Password" className={`${inputCls} pr-12`} style={inputStyle} />
              <button onClick={() => setShowCp(!showCp)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }}>{showCp?<EyeOff size={17}/>:<Eye size={17}/>}</button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 mb-5">
            <CountryCodePicker selected={country} onChange={setCountry} />
            <div className="relative flex-1">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }} />
              <input type="tel" placeholder="Phone number" className="w-full border rounded-2xl py-[14px] pl-10 pr-4 text-sm outline-none" style={inputStyle} />
            </div>
          </div>
        )}
        <button onClick={() => setAgreed(!agreed)} className="flex items-center gap-3 w-full text-left mb-5">
          <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all" style={{ borderColor: agreed ? tc.accent : tc.authBorder, background: agreed ? tc.accent : "transparent" }}>
            {agreed && <Check size={11} color="white" strokeWidth={3} />}
          </div>
          <span className="text-sm" style={{ color: tc.authSub }}>I agree to the{" "}
            <button onClick={e => { e.stopPropagation(); navigate("legal-terms"); }} className="font-semibold underline underline-offset-2" style={{ color: tc.accent }}>Terms & Conditions</button>
            {" "}and{" "}
            <button onClick={e => { e.stopPropagation(); navigate("legal-privacy"); }} className="font-semibold underline underline-offset-2" style={{ color: tc.accent }}>Privacy Policy</button>
          </span>
        </button>
        <button onClick={() => { _otpType = mode; _otpTarget = mode === "phone" ? "+27 *** ***1234" : "user@example.com"; navigate("otp"); }}
          className="w-full py-4 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2 mb-5 active:scale-95 transition-transform"
          style={{ background: tc.accentGrad, boxShadow: `0 8px 24px ${tc.accentShadow}` }}>
          {mode === "email" ? <>Verify & Create Account <ChevronRight size={18} strokeWidth={3} /></> : <>Send OTP <MessageSquare size={17} strokeWidth={2.5} /></>}
        </button>
        <p className="text-center text-sm" style={{ color: tc.authSub }}>Already have an account?{" "}
          <button onClick={() => navigate("signin")} className="font-bold" style={{ color: tc.accent }}>Log In</button>
        </p>
      </div>
    </div>
  );
}

function ForgotScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  return (
    <div className="min-h-screen font-['Inter'] px-6 pt-16 pb-10" style={{ background: tc.authSheet, color: tc.authText }}>
      <button onClick={() => navigate("signin")} className="w-10 h-10 rounded-full border flex items-center justify-center mb-8" style={{ background: tc.authInputBg, borderColor: tc.authBorder, color: tc.authText }}><ArrowLeft size={20} /></button>
      <h1 className="font-['Poppins'] font-bold text-[26px] mb-2" style={{ color: tc.authText }}>Forgot Password?</h1>
      <p className="text-sm mb-8" style={{ color: tc.authSub }}>Enter your email and we'll send a reset link.</p>
      <div className="relative mb-6">
        <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }} />
        <input type="email" placeholder="Email Address"
          className="w-full border rounded-2xl py-[14px] pl-11 pr-4 text-sm outline-none"
          style={{ background: tc.authInputBg, borderColor: tc.authBorder, color: tc.authText }} />
      </div>
      <button onClick={() => { _otpType = "email"; _otpTarget = "user@example.com"; navigate("otp"); }}
        className="w-full py-4 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
        style={{ background: tc.accentGrad, boxShadow: `0 8px 24px ${tc.accentShadow}` }}>
        Send Reset Link <ChevronRight size={18} strokeWidth={3} />
      </button>
    </div>
  );
}

/* ─── SET PASSWORD SCREEN (phone signup flow) ─── */
function SetPasswordScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const strength = pw.length === 0 ? 0 : pw.length < 6 ? 1 : pw.length < 10 ? 2 : 3;
  const strengthColors = ["#333", "#ef4444", "#f59e0b", "#22c55e"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];
  const errors = attempted ? {
    pw: pw.length < 8 ? (pw.length === 0 ? "Password is required" : "Must be at least 8 characters") : "",
    confirm: confirm !== pw ? "Passwords do not match" : "",
  } : { pw: "", confirm: "" };
  const canSubmit = pw.length >= 8 && pw === confirm;
  const tc = useTC();
  return (
    <div className="min-h-screen font-['Inter'] px-6 pt-14 pb-10" style={{ background: tc.authSheet, color: tc.authText }}>
      <button onClick={() => navigate("otp")} className="w-10 h-10 rounded-full border flex items-center justify-center mb-8" style={{ background: tc.authInputBg, borderColor: tc.authBorder, color: tc.authText }}><ArrowLeft size={20} /></button>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${tc.accent}18`, border: `1px solid ${tc.accent}30` }}>
        <Lock size={28} style={{ color: tc.accent }} />
      </div>
      <h1 className="font-['Poppins'] font-bold text-[26px] mb-2" style={{ color: tc.authText }}>Create Password</h1>
      <p className="text-sm mb-8" style={{ color: tc.authSub }}>Set a secure password for your SA PLUG account.</p>
      <div className="space-y-4 mb-6">
        <div>
          <div className="relative">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }} />
            <input type={showPw ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} placeholder="Create Password"
              className="w-full border rounded-2xl py-[14px] pl-11 pr-12 text-sm outline-none"
              style={{ background: tc.authInputBg, borderColor: attempted && errors.pw ? "#ef4444" : pw.length > 0 ? tc.accent : tc.authBorder, color: tc.authText }} />
            <button onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }}>{showPw ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
          {pw.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">{[1,2,3].map(i => <div key={i} className="flex-1 h-1.5 rounded-full transition-all" style={{ background: strength >= i ? strengthColors[strength] : tc.authBorder }} />)}</div>
              <p className="text-xs" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
            </div>
          )}
          {attempted && errors.pw && <p className="text-red-400 text-xs mt-1 pl-1">{errors.pw}</p>}
        </div>
        <div>
          <div className="relative">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }} />
            <input type={showCf ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm Password"
              className="w-full border rounded-2xl py-[14px] pl-11 pr-12 text-sm outline-none"
              style={{ background: tc.authInputBg, borderColor: attempted && errors.confirm ? "#ef4444" : confirm.length > 0 && confirm === pw ? "#22c55e" : tc.authBorder, color: tc.authText }} />
            <button onClick={() => setShowCf(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: tc.authIcon }}>{showCf ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
          {attempted && errors.confirm && <p className="text-red-400 text-xs mt-1 pl-1">{errors.confirm}</p>}
        </div>
      </div>
      <div className="rounded-xl p-3 mb-6" style={{ background: `${tc.accent}10`, border: `1px solid ${tc.accent}25` }}>
        <p className="text-xs" style={{ color: tc.accent }}>Password requirements: 8+ characters, mix of letters and numbers recommended.</p>
      </div>
      <button onClick={() => { setAttempted(true); if (canSubmit) navigate("home"); }}
        className="w-full py-4 rounded-2xl font-bold text-[15px] active:scale-95 transition-transform"
        style={{ background: canSubmit ? tc.accentGrad : tc.isDark ? '#222' : '#E5E7EB', boxShadow: canSubmit ? `0 8px 24px ${tc.accentShadow}` : "none", color: canSubmit ? "#fff" : tc.text3 }}>
        Create Account
      </button>
    </div>
  );
}

function OTPScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeTab, setActiveTab] = useState<"phone" | "email">(_otpType);
  const [resend, setResend] = useState(45);
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));
  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 1);
    const newOtp = [...otp]; newOtp[i] = d; setOtp(newOtp);
    if (d && i < 5) refs[i + 1].current?.focus();
  };
  useEffect(() => {
    if (resend <= 0) return;
    const t = setInterval(() => setResend(r => r - 1), 1000);
    return () => clearInterval(t);
  }, [resend]);
  const isPhone = activeTab === "phone";
  const target = _otpTarget || (isPhone ? "+27 *** ***1234" : "user@example.com");
  const maskedPhone = target.replace(/\d(?=\d{4})/g, "*");
  const tc = useTC();
  const allFilled = otp.every(d => d);
  return (
    <div className="min-h-screen font-['Inter'] px-6 pt-16 pb-10" style={{ background: tc.authSheet, color: tc.authText }}>
      <button onClick={() => navigate("signup")} className="w-10 h-10 rounded-full border flex items-center justify-center mb-8" style={{ background: tc.authInputBg, borderColor: tc.authBorder, color: tc.authText }}><ArrowLeft size={20} /></button>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${tc.accent}18`, border: `1px solid ${tc.accent}30` }}>
        <ShieldCheck size={30} style={{ color: tc.accent }} />
      </div>
      <h1 className="font-['Poppins'] font-bold text-[26px] mb-2" style={{ color: tc.authText }}>Verify Your {isPhone ? "Phone" : "Email"}</h1>
      <p className="text-sm mb-6" style={{ color: tc.authSub }}>We sent a 6-digit code to <span className="font-bold" style={{ color: tc.authText }}>{isPhone ? maskedPhone : target}</span></p>
      <div className="flex rounded-2xl p-1 mb-6 border" style={{ background: tc.authTabBg, borderColor: tc.authTabBd }}>
        {(["phone", "email"] as const).map(t => (
          <button key={t} onClick={() => { setActiveTab(t); setOtp(["","","","","",""]); setResend(45); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={activeTab === t ? { background: tc.authTabActive, color: tc.authTabActTxt } : { color: tc.authTabInTxt }}>
            {t === "phone" ? <><Phone size={14} /> Phone</> : <><Mail size={14} /> Email</>}
          </button>
        ))}
      </div>
      <div className="flex gap-2 justify-between mb-8">
        {otp.map((d, i) => (
          <input key={i} ref={refs[i]} value={d} onChange={e => setDigit(i, e.target.value)} maxLength={1} inputMode="numeric"
            className="w-12 h-14 border rounded-2xl text-center text-xl font-bold outline-none"
            style={{ background: tc.authInputBg, borderColor: d ? tc.accent : tc.authBorder, color: tc.authText }} />
        ))}
      </div>
      <button onClick={() => { if (allFilled) navigate(_otpType === "phone" ? "set-password" : "home"); }}
        className="w-full py-4 rounded-2xl font-bold text-[15px] active:scale-95 transition-transform mb-4"
        style={{ background: allFilled ? tc.accentGrad : tc.isDark ? '#333' : '#E5E7EB', boxShadow: allFilled ? `0 8px 24px ${tc.accentShadow}` : "none", color: allFilled ? '#fff' : tc.text3 }}>
        Verify & Continue
      </button>
      <p className="text-center text-sm" style={{ color: tc.authSub }}>
        {resend > 0
          ? <>Resend code in <span className="font-bold" style={{ color: tc.accent }}>0:{String(resend).padStart(2,"0")}</span></>
          : <button onClick={() => setResend(45)} className="font-bold" style={{ color: tc.accent }}>Resend OTP</button>
        }
      </p>
    </div>
  );
}

/* ─── SEARCH SCREEN ─── */
function SearchScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Clubs", "Tours", "Events", "Shop", "Dining"];
  const results = [
    { type: "Club", name: "ONYX SANDTON", sub: "Sandton, JHB · 4.8 ★", icon: Music },
    { type: "Club", name: "COCO SANDTON", sub: "Sandton, JHB · 4.7 ★", icon: Music },
    { type: "Club", name: "ZONE 6 VENUE", sub: "Soweto · 4.6 ★", icon: Music },
    { type: "Club", name: "KONG ROSEBANK", sub: "Rosebank · 4.5 ★", icon: Music },
    { type: "Tour", name: "Safari Experience", sub: "Kruger Park · From R2,900", icon: Map },
    { type: "Tour", name: "Helicopter Tour", sub: "Cape Town · From R4,500", icon: Map },
    { type: "Tour", name: "Stellenbosch Wine Tour", sub: "Stellenbosch · From R1,250", icon: Map },
    { type: "Event", name: "PHAT THURSDAYS", sub: "24 May · ICON SOWETO", icon: Calendar },
    { type: "Event", name: "NEON NIGHTS", sub: "24 May · Onyx Sandton", icon: Calendar },
    { type: "Shop", name: "SA PLUG Hoodie", sub: "R699 · In stock", icon: ShoppingCart },
    { type: "Shop", name: "Dom Pérignon Champagne", sub: "R1,200 · Limited", icon: ShoppingCart },
    { type: "Dining", name: "Marble Restaurant", sub: "Fine Dining · Sandton", icon: UtensilsCrossed },
    { type: "Dining", name: "Rooftop by Luma", sub: "Rooftop · Sandton City", icon: UtensilsCrossed },
  ];
  const filtered = results.filter(r =>
    (activeTab === "All" || r.type === activeTab.slice(0, -1) || r.type === activeTab) &&
    (query === "" || r.name.toLowerCase().includes(query.toLowerCase()))
  );
  const typeTarget: Record<string, Screen> = { Club: "clubdetail", Tour: "tourdetail", Event: "reservations", Shop: "shopdetail", Dining: "restaurantdetail" };
  return (
    <div className="min-h-screen font-['Inter']" style={{ background: tc.bg, color: tc.text }}>
      <div className="px-4 pt-6 pb-3 sticky top-0 backdrop-blur-md z-10" style={{ background: tc.headerBg }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate("home")} className="w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={20} /></button>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.text2 }} />
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search clubs, tours, events..." className="w-full rounded-xl py-3 pl-10 pr-10 text-sm outline-none" style={{ background: tc.inputBg, border: `1px solid ${tc.border}`, color: tc.text }} />
            {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: tc.text2 }}><X size={16} /></button>}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0"
              style={{ background: activeTab === t ? tc.accent : tc.inputBg, color: activeTab === t ? "#fff" : tc.text2, border: activeTab === t ? "none" : `1px solid ${tc.border}` }}>{t}</button>
          ))}
        </div>
      </div>
      <div className="px-4 py-3">
        {query === "" && (
          <div className="mb-6">
            <p className="text-xs font-medium mb-3" style={{ color: tc.text2 }}>TRENDING SEARCHES</p>
            {["Amapiano clubs JHB", "Cape Town wine tour", "VIP bottle packages", "Onyx Sandton", "Rooftop restaurants"].map((t, i) => (
              <button key={i} onClick={() => setQuery(t)} className="flex items-center gap-3 w-full py-2.5 border-b" style={{ borderColor: tc.border }}>
                <Search size={14} style={{ color: tc.text2 }} /><span className="text-sm" style={{ color: tc.text2 }}>{t}</span>
              </button>
            ))}
          </div>
        )}
        {filtered.length > 0 ? (
          <div>
            {query && <p className="text-xs mb-3" style={{ color: tc.text2 }}>{filtered.length} results for "<span style={{ color: tc.text }}>{query}</span>"</p>}
            <div className="space-y-2">
              {filtered.map((r, i) => (
                <button key={i} onClick={() => navigate(typeTarget[r.type] || "home")} className="flex items-center gap-3 w-full rounded-2xl p-3" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${tc.accent}12` }}><r.icon size={18} style={{ color: tc.accent }} /></div>
                  <div className="flex-1 text-left"><p className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>{r.name}</p><p className="text-xs" style={{ color: tc.text2 }}>{r.sub}</p></div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border font-bold" style={{ color: tc.accent, borderColor: tc.accent }}>{r.type}</span>
                </button>
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Search size={48} className="mb-4" style={{ color: tc.muted }} />
            <p className="font-['Poppins'] font-bold text-lg mb-1" style={{ color: tc.text }}>No results found</p>
            <p className="text-sm" style={{ color: tc.text2 }}>Try a different search term</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ─── CART SCREEN ─── */
function CartScreen({ cart, setCart, navigate }: { cart: CartItem[]; setCart: React.Dispatch<React.SetStateAction<CartItem[]>>; navigate: (s: Screen) => void }) {
  const tc = useTC();
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const updateQty = (id: number, delta: number) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  return (
    <div className="min-h-screen font-['Inter'] pb-36" style={{ background: tc.bg, color: tc.text }}>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 sticky top-0 backdrop-blur-md z-10 border-b" style={{ background: tc.headerBg, borderColor: tc.border }}>
        <button onClick={() => navigate("home")} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={20} /></button>
        <h1 className="font-['Poppins'] font-bold text-xl flex-1" style={{ color: tc.text }}>My Cart</h1>
        {cart.length > 0 && <button onClick={() => setCart([])} className="text-red-400 text-xs font-bold">Clear all</button>}
      </div>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <ShoppingCart size={64} className="mb-4" style={{ color: tc.muted }} />
          <h2 className="font-['Poppins'] font-bold text-xl mb-2" style={{ color: tc.text }}>Your cart is empty</h2>
          <p className="text-sm mb-8" style={{ color: tc.text2 }}>Add items from clubs, tours, or the shop</p>
          <button onClick={() => navigate("clubs")} className="px-8 py-3.5 rounded-xl font-bold text-white" style={{ background: tc.accentGrad }}>Browse Clubs</button>
        </div>
      ) : (
        <div className="px-4">
          <div className="space-y-3 mb-6">
            {cart.map(item => (
              <div key={item.id} className="rounded-2xl p-4 flex gap-3" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tc.card2 }}><ShoppingCart size={22} style={{ color: tc.accent }} /></div>
                <div className="flex-1">
                  <p className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>{item.name}</p>
                  <p className="text-xs mb-2" style={{ color: tc.text2 }}>{item.venue}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ color: tc.accent }}>R{(item.price * item.qty).toLocaleString()}</span>
                    <div className="flex items-center gap-2 rounded-xl px-2 py-1" style={{ background: tc.inputBg }}>
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center"><Minus size={14} style={{ color: tc.accent }} /></button>
                      <span className="text-sm font-bold w-4 text-center" style={{ color: tc.text }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center"><Plus size={14} style={{ color: tc.accent }} /></button>
                    </div>
                  </div>
                </div>
                <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="self-start text-red-400/60 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-4 mb-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="flex justify-between text-sm mb-2"><span style={{ color: tc.text2 }}>Subtotal</span><span style={{ color: tc.text }}>R{total.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm mb-2"><span style={{ color: tc.text2 }}>Service fee (5%)</span><span style={{ color: tc.text }}>R{Math.round(total * 0.05).toLocaleString()}</span></div>
            <div className="h-px my-3" style={{ background: tc.border }} />
            <div className="flex justify-between font-bold"><span style={{ color: tc.text }}>Total</span><span style={{ color: tc.accent }}>R{Math.round(total * 1.05).toLocaleString()}</span></div>
          </div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-xl border-t" style={{ background: tc.navBg, borderColor: tc.border }}>
          <button onClick={() => navigate("checkout-details")} className="w-full py-4 rounded-xl font-bold text-white text-sm uppercase tracking-wide" style={{ background: tc.accentGrad, boxShadow: tc.isDark ? `0 0 20px rgba(212,175,55,0.4)` : `0 0 20px rgba(108,79,187,0.35)` }}>
            Checkout — R{Math.round(total * 1.05).toLocaleString()}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── CHECKOUT SCREENS ─── */
function getCheckoutBooking() {
  const d = BOOKING_DATES[_bookingState.dateIdx] ?? BOOKING_DATES[1];
  const tbl = _bookingState.table || "VIP Table A";
  const base = getTablePrice(tbl);
  const total = base + Math.round(base * 0.1);
  return {
    title: "Onyx Sandton — Table Booking",
    venue: `${tbl} · Sandton, Johannesburg`,
    date: `${d.full} · ${_bookingState.time}`,
    guests: `${_bookingState.guests} Guest${_bookingState.guests !== 1 ? "s" : ""}`,
    table: tbl,
    price: `R${total.toLocaleString()}`,
    img: "/__mockup/images/onyx.png",
  };
}

function CheckoutStepper({ step }: { step: 1 | 2 | 3 }) {
  const tc = useTC();
  const steps = ["Details", "Payment", "Confirmation"];
  return (
    <div className="flex items-center justify-center py-4 px-4">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === step;
        const done = num < step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={active || done ? { background: tc.accent, color: "#fff" } : { background: "transparent", border: `1.5px solid ${tc.border2}`, color: tc.text3 }}>
                {done ? <Check size={12} strokeWidth={3} /> : num}
              </div>
              <span className="text-[10px] font-medium" style={{ color: active ? tc.text : tc.text3 }}>{label}</span>
            </div>
            {i < 2 && <div className="h-px w-10 mb-4 mx-1.5 flex-shrink-0" style={{ background: num < step ? tc.accent : tc.border2 }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function CheckoutDetailsScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [name, setName] = useState("Lerato Mokoena");
  const [phone, setPhone] = useState("+27 82 345 6789");
  const [email, setEmail] = useState("lerato.mokoena@example.com");
  return (
    <div className="min-h-screen font-['Inter']" style={{ background: tc.bg, color: tc.text }}>
      <div className="flex items-center px-4 pt-6 pb-3 sticky top-0 z-40 backdrop-blur-md border-b" style={{ background: tc.headerBg, borderColor: tc.border }}>
        <button onClick={() => navigate("cart")} className="w-9 h-9 rounded-full border flex items-center justify-center mr-3 flex-shrink-0" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={18} /></button>
        <h1 className="font-['Poppins'] font-bold text-lg flex-1 text-center pr-9" style={{ color: tc.text }}>Checkout</h1>
      </div>
      <CheckoutStepper step={1} />
      <div className="px-4 pb-32 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3"><h2 className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>{_modifyMode ? "Modification Summary" : "Order Summary"}</h2><button onClick={() => { _bookingEditMode = true; navigate("clubdetail"); }} className="text-sm font-semibold active:opacity-60" style={{ color: tc.accent }}>Edit</button></div>
          {_modifyMode ? (
            <div className="rounded-2xl p-4 space-y-3" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <div className="flex justify-between text-sm items-center">
                <span style={{ color: tc.text2 }}>Already Paid</span>
                <span className="font-semibold text-green-400">R{PAID_BOOKING_AMOUNT.toLocaleString()} ✓</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: tc.text2 }}>Extra items / upgrades</span>
                <span style={{ color: tc.text }}>R{(_modifyExtraAmount).toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t flex justify-between items-center" style={{ borderColor: tc.border }}>
                <span className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>Balance Due</span>
                <span className="font-['Poppins'] font-bold text-xl" style={{ color: tc.accent }}>R{_modifyExtraAmount.toLocaleString()}</span>
              </div>
            </div>
          ) : (() => { const cb = getCheckoutBooking(); return (
          <div className="rounded-2xl p-4 flex gap-3" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <img src={cb.img} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
            <div className="flex-1 min-w-0">
              <p className="font-['Poppins'] font-bold text-sm leading-tight mb-1" style={{ color: tc.text }}>{cb.title}</p>
              <p className="text-xs mb-2" style={{ color: tc.text2 }}>{cb.venue}</p>
              <div className="flex items-center gap-1.5 mb-1"><Calendar size={11} style={{ color: tc.accent }} /><span className="text-[11px]" style={{ color: tc.text2 }}>{cb.date}</span></div>
              <div className="flex items-center gap-1.5 mb-2"><Users size={11} style={{ color: tc.accent }} /><span className="text-[11px]" style={{ color: tc.text2 }}>{cb.guests}</span></div>
              <p className="font-['Poppins'] font-bold text-base text-right" style={{ color: tc.accent }}>{cb.price}</p>
            </div>
          </div>); })()}
        </div>
        <div>
          <h2 className="font-['Poppins'] font-bold text-base mb-3" style={{ color: tc.text }}>Customer Details</h2>
          <div className="space-y-3">
            {([{ label: "Full Name", value: name, set: setName, type: "text" }, { label: "Phone Number", value: phone, set: setPhone, type: "tel" }, { label: "Email Address", value: email, set: setEmail, type: "email" }] as { label: string; value: string; set: (v: string) => void; type: string }[]).map(({ label, value, set, type }) => (
              <div key={label} className="rounded-xl px-4 py-3" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
                <p className="text-[11px] mb-1" style={{ color: tc.text3 }}>{label}</p>
                <input type={type} value={value} onChange={e => set(e.target.value)} className="w-full bg-transparent text-sm font-medium outline-none" style={{ color: tc.text }} />
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => { setAgreed(!agreed); setTermsError(false); }} className="flex items-center gap-3 w-full text-left">
          <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all" style={{ borderColor: termsError ? '#ef4444' : agreed ? tc.accent : tc.border2, background: agreed ? tc.accent : "transparent" }}>
            {agreed && <Check size={11} color="white" strokeWidth={3} />}
          </div>
          <span className="text-sm" style={{ color: termsError ? '#ef4444' : tc.text2 }}>I agree to the <span style={{ color: termsError ? '#ef4444' : tc.accent }}>Terms & Conditions</span></span>
        </button>
        {termsError && <p className="text-xs text-red-400 mt-2 ml-8">Please accept the Terms & Conditions to continue.</p>}
      </div>
      <div className="fixed bottom-0 left-0 right-0 px-4 py-5 backdrop-blur-xl border-t" style={{ background: tc.navBg, borderColor: tc.border }}>
        <button
          onClick={() => { if (!agreed) { setTermsError(true); return; } navigate("checkout-payment"); }}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 text-[15px] active:scale-95 transition-transform"
          style={{ background: tc.accentGrad, boxShadow: `0 8px 24px ${tc.accentShadow}`, opacity: agreed ? 1 : 0.65 }}>
          Continue to Payment <ChevronRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function CheckoutPaymentScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [payMethod, setPayMethod] = useState<"card" | "apple" | "google">("card");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number; type: "pct" | "fixed" } | null>(null);
  const [promoError, setPromoError] = useState("");
  const baseTotal = _modifyMode ? _modifyExtraAmount : 1200;

  const applyPromo = () => {
    const c = promo.toUpperCase().trim();
    if (c === "SAPVIP10") { setPromoApplied({ code: c, discount: 10, type: "pct" }); setPromoError(""); }
    else if (c === "PLUG20") { setPromoApplied({ code: c, discount: 200, type: "fixed" }); setPromoError(""); }
    else if (c === "GOLD15") { setPromoApplied({ code: c, discount: 15, type: "pct" }); setPromoError(""); }
    else { setPromoError("Invalid promo code. Try SAPVIP10, PLUG20 or GOLD15"); setPromoApplied(null); }
  };
  const discountAmt = promoApplied ? (promoApplied.type === "pct" ? Math.round(baseTotal * promoApplied.discount / 100) : promoApplied.discount) : 0;
  const finalTotal = baseTotal - discountAmt;

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: tc.bg, color: tc.text }}>
      <div className="flex items-center px-4 pt-6 pb-3 sticky top-0 z-40 backdrop-blur-md border-b" style={{ background: tc.headerBg, borderColor: tc.border }}>
        <button onClick={() => navigate("checkout-details")} className="w-9 h-9 rounded-full border flex items-center justify-center mr-3 flex-shrink-0" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={18} /></button>
        <h1 className="font-['Poppins'] font-bold text-lg flex-1 text-center pr-9" style={{ color: tc.text }}>Checkout</h1>
      </div>
      <CheckoutStepper step={2} />
      <div className="px-4 pb-36 space-y-6">
        <div>
          <h2 className="font-['Poppins'] font-bold text-base mb-3" style={{ color: tc.text }}>Payment Method</h2>
          <div className="space-y-2.5">
            {[
              { id: "card" as const, label: "Card", sub: "Visa, Mastercard, Amex", icon: <CreditCard size={20} style={{ color: tc.accent }} /> },
              { id: "apple" as const, label: "Apple Pay", sub: null, icon: <svg width={20} height={20} viewBox="0 0 814 1000" fill={tc.text}><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 134.4-317.8 266.5-317.8 69.8 0 127.9 45.1 172.4 45.1 42.8 0 109.1-47.2 187.4-47.2 14.6 0 108.2 1.3 172.4 62.2zm-174.4-102.7c33.4-39.5 57.1-94.3 57.1-149.2 0-7.7-.6-15.4-1.9-22.4-54.2 1.9-117.8 36.5-155.6 80.5-30.6 35.8-60.3 90.7-60.3 146.8 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.3 1.3 13.4 1.3 48.7 0 109.1-33.4 145.4-76.2z"/></svg> },
              { id: "google" as const, label: "Google Pay", sub: null, icon: <GoogleIcon size={20} /> },
            ].map(({ id, icon, label, sub }) => {
              const sel = payMethod === id;
              return (
                <button key={id} onClick={() => setPayMethod(id)} className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all"
                  style={{ background: sel ? `${tc.accent}08` : tc.card, border: `1.5px solid ${sel ? tc.accent : tc.border}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: sel ? `${tc.accent}18` : tc.inputBg }}>{icon}</div>
                  <div className="flex-1 text-left"><p className="font-semibold text-sm" style={{ color: tc.text }}>{label}</p>{sub && <p className="text-[11px]" style={{ color: tc.text3 }}>{sub}</p>}</div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: sel ? tc.accent : tc.border2 }}>
                    {sel && <div className="w-2.5 h-2.5 rounded-full" style={{ background: tc.accent }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="font-['Poppins'] font-bold text-base mb-3" style={{ color: tc.text }}>Promo Code</h2>
          <div className="rounded-2xl flex items-center px-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <Tag size={15} style={{ color: tc.accent }} className="flex-shrink-0 mr-2" />
            <input value={promo} onChange={e => { setPromo(e.target.value); setPromoError(""); }} placeholder="SAPVIP10 · PLUG20 · GOLD15"
              className="flex-1 bg-transparent py-3.5 text-sm outline-none" style={{ color: tc.text }} />
            <button onClick={applyPromo} className="font-bold text-sm py-1.5 px-3 rounded-xl flex-shrink-0" style={{ color: tc.accent }}>Apply</button>
          </div>
          {promoError && <p className="text-red-400 text-xs mt-2 ml-1">{promoError}</p>}
          {promoApplied && <p className="text-green-400 text-xs mt-2 ml-1 font-bold">✓ {promoApplied.code} applied — R{discountAmt} off!</p>}
        </div>
        <div className="rounded-2xl p-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm"><span style={{ color: tc.text2 }}>Booking Total</span><span style={{ color: tc.text }}>R{baseTotal.toLocaleString()}</span></div>
            {promoApplied && <div className="flex justify-between text-sm"><span className="text-green-400">{promoApplied.code} discount</span><span className="text-green-400">-R{discountAmt}</span></div>}
          </div>
          <div className="flex justify-between items-start pt-3 border-t" style={{ borderColor: tc.border }}>
            <div><p className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>Total Amount</p><p className="text-xs mt-0.5" style={{ color: tc.text3 }}>Inclusive of taxes and fees</p></div>
            <p className="font-['Poppins'] font-bold text-2xl" style={{ color: tc.accent }}>R{finalTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 px-4 py-5 backdrop-blur-xl border-t" style={{ background: tc.navBg, borderColor: tc.border }}>
        <button onClick={() => navigate("checkout-confirmed")} className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 text-[15px] active:scale-95 transition-transform" style={{ background: tc.accentGrad, boxShadow: `0 8px 24px ${tc.accentShadow}` }}>
          <Lock size={16} color="white" strokeWidth={2.5} /> Pay R{finalTotal.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

/* ─── QR WITH ACTIONS ─── */
function QRWithActions({ size, bookingRef, venue }: { size: number; bookingRef: string; venue: string }) {
  const tc = useTC();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const handleSave = () => {
    const svg = wrapRef.current?.querySelector("svg");
    if (!svg) return;
    try {
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svg);
      const blob = new Blob([svgStr], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sa-plug-${bookingRef}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
  };

  const handleShare = async () => {
    const text = `SA PLUG Booking — ${venue}\nRef: ${bookingRef}\nPresent this QR at the venue entrance for VIP entry.`;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "SA PLUG Booking QR", text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch {}
  };

  return (
    <>
      <div ref={wrapRef} className="flex justify-center mb-3">
        <FakeQR size={size} />
      </div>
      <p className="text-center text-xs font-mono mb-3" style={{ color: tc.text3 }}>{bookingRef}</p>
      <div className="flex gap-2 w-full">
        <button onClick={handleSave}
          className="flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
          style={{ borderColor: saved ? "#22c55e" : tc.accent, color: saved ? "#22c55e" : tc.accent, background: saved ? "rgba(34,197,94,0.08)" : "transparent" }}>
          {saved ? <><Check size={14} />Saved!</> : <><Download size={14} />Save QR</>}
        </button>
        <button onClick={handleShare}
          className="flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
          style={{ borderColor: shared ? "#22c55e" : tc.border, color: shared ? "#22c55e" : tc.text2, background: shared ? "rgba(34,197,94,0.08)" : "transparent" }}>
          {shared ? <><Check size={14} />Shared!</> : <><Share2 size={14} />Share</>}
        </button>
      </div>
    </>
  );
}

function CheckoutConfirmedScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  useEffect(() => {
    // Clear modify-flow globals once the confirmed screen is shown
    const wasModify = _modifyMode;
    _modifyMode = false;
    _modifyExtraAmount = 0;
    return () => { if (wasModify) { /* already cleared */ } };
  }, []);
  const confetti = [
    { x: 8, y: 30, color: GOLD, r: 30, w: 9, h: 5 }, { x: 82, y: 18, color: "#FF6B6B", r: -20, w: 6, h: 9 },
    { x: 10, y: 60, color: "#4ECDC4", r: 45, w: 5, h: 8 }, { x: 86, y: 55, color: GOLD, r: -45, w: 8, h: 5 },
    { x: 72, y: 20, color: "#A78BFA", r: 15, w: 9, h: 6 }, { x: 20, y: 42, color: "#FCA5A5", r: -30, w: 6, h: 7 },
    { x: 90, y: 38, color: "#6EE7B7", r: 60, w: 5, h: 9 }, { x: 38, y: 10, color: "#FBBF24", r: -15, w: 8, h: 5 },
  ];
  return (
    <div className="min-h-screen font-['Inter'] pb-24" style={{ background: tc.bg, color: tc.text }}>
      <CheckoutStepper step={3} />
      <div className="relative flex flex-col items-center pt-4 pb-8 px-6">
        {confetti.map((c, i) => <div key={i} className="absolute rounded-sm opacity-75 pointer-events-none" style={{ left: `${c.x}%`, top: c.y, width: c.w, height: c.h, background: c.color, transform: `rotate(${c.r}deg)` }} />)}
        <div className="relative mb-5">
          <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ background: `${tc.accent}18`, border: `1.5px solid ${tc.accent}60` }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: tc.isDark ? "linear-gradient(135deg,#1C1500,#2A1F00)" : `linear-gradient(135deg,${tc.accent}10,${tc.accentTeal}10)`, border: `1px solid ${tc.accent}60` }}>
              <Sparkle size={38} color={tc.isDark ? GOLD : tc.accent} />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-2 flex items-center justify-center" style={{ borderColor: tc.bg }}><Check size={14} color="white" strokeWidth={3} /></div>
        </div>
        <h1 className="font-['Poppins'] font-bold text-2xl mb-2" style={{ color: tc.text }}>{_modifyMode ? "Booking Modified!" : "Booking Confirmed!"}</h1>
        <p className="text-sm text-center leading-relaxed" style={{ color: tc.text2 }}>{_modifyMode ? "Your changes have been saved.\nNo double charges — only the balance was collected." : "You're all set. Get ready for an\nunforgettable experience."}</p>
      </div>
      <div className="px-4 space-y-4">
        <div>
          <h2 className="font-['Poppins'] font-bold text-base mb-3" style={{ color: tc.text }}>Booking Summary</h2>
          {(() => { const cb = getCheckoutBooking(); return (
          <div className="rounded-2xl p-4 flex gap-3 mb-3" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <img src={cb.img} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
            <div className="flex-1 min-w-0">
              <p className="font-['Poppins'] font-bold text-sm leading-tight mb-1" style={{ color: tc.text }}>{cb.title}</p>
              <p className="text-xs mb-2" style={{ color: tc.text2 }}>{cb.venue}</p>
              <div className="flex items-center gap-1.5 mb-1"><Calendar size={10} style={{ color: tc.accent }} /><span className="text-[10px]" style={{ color: tc.text2 }}>{cb.date}</span></div>
            </div>
            <p className="font-['Poppins'] font-bold text-base self-end flex-shrink-0" style={{ color: tc.accent }}>{cb.price}</p>
          </div>); })()}
          <div className="rounded-2xl p-4 mb-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="flex justify-between items-center mb-3"><span className="font-bold text-sm" style={{ color: tc.text }}>Entry QR Code</span></div>
            <QRWithActions size={140} bookingRef="SAPVIP-482291" venue="ONYX SANDTON" /></div>
        </div>
        <button onClick={() => {
          const title = encodeURIComponent("SA PLUG Booking — ONYX SANDTON");
          const details = encodeURIComponent("VIP Table for 4 + Bottle Service | Ref: SAPVIP-482291");
          const location = encodeURIComponent("Sandton City, Johannesburg");
          const dates = "20260524T220000/20260525T020000";
          window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`, '_blank');
        }} className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm active:scale-95 transition-transform border" style={{ borderColor: tc.border, color: tc.text, background: tc.inputBg }}>
          <Calendar size={18} style={{ color: tc.accent }} /> Add to Calendar
        </button>
        <button onClick={() => navigate("profile-bookings")} className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 text-[15px] active:scale-95 transition-transform" style={{ background: tc.accentGrad, boxShadow: `0 8px 24px ${tc.accentShadow}` }}>
          View My Bookings <ChevronRight size={18} strokeWidth={3} />
        </button>
        <button onClick={() => navigate("home")} className="w-full py-4 rounded-2xl font-semibold text-[15px] border flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ borderColor: tc.border, color: tc.text, background: tc.inputBg }}>
          <HomeIcon size={18} style={{ color: tc.accent }} /> Back to Home
        </button>
      </div>
    </div>
  );
}

/* ─── CHAT SCREEN ─── */
function ChatScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "them", text: "Hey! Welcome to SA PLUG Support 🥂", time: "10:02 PM" },
    { from: "them", text: "How can I help you tonight? Looking for a table at Onyx?", time: "10:02 PM" },
    { from: "me", text: "Yes! Table for 4 tonight at Onyx Sandton please 🙏", time: "10:03 PM" },
    { from: "them", text: "Perfect! I've got a VIP table available at 10PM. Bottle service included. Shall I confirm?", time: "10:03 PM" },
  ]);
  const [activeConvo, setActiveConvo] = useState<string | null>("SA PLUG Support");
  const convos = [
    { name: "SA PLUG Support", last: "Table confirmed for tonight!", time: "10:03 PM", unread: 2, avatar: "🥂" },
    { name: "ONYX SANDTON", last: "Your table is ready from 10PM", time: "9:45 PM", unread: 0, avatar: "🎵" },
    { name: "Cape Town Tours", last: "Helicopter departs at 9AM ✓", time: "Yesterday", unread: 0, avatar: "🚁" },
  ];
  const send = () => {
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { from: "me", text: msg, time: "Now" }]);
    setMsg("");
    setTimeout(() => setMessages(prev => [...prev, { from: "them", text: "Got it! I'll arrange that right away. Your SA PLUG support team is on it 🔥", time: "Now" }]), 1000);
  };
  return (
    <div className="min-h-screen font-['Inter'] flex flex-col" style={{ background: tc.bg, color: tc.text }}>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b" style={{ background: tc.headerBg, borderColor: tc.border }}>
        <button onClick={() => navigate("home")} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={20} /></button>
        <h1 className="font-['Poppins'] font-bold text-xl flex-1" style={{ color: tc.text }}>{activeConvo || "Messages"}</h1>
        {activeConvo && <button onClick={() => setActiveConvo(null)}><X size={20} style={{ color: tc.text2 }} /></button>}
      </div>
      {!activeConvo ? (
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {convos.map((c, i) => (
            <button key={i} onClick={() => setActiveConvo(c.name)} className="flex items-center gap-3 w-full py-3.5 border-b" style={{ borderColor: tc.border }}>
              <div className="w-12 h-12 rounded-full border flex items-center justify-center text-xl flex-shrink-0" style={{ background: tc.card2, borderColor: tc.border }}>{c.avatar}</div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-0.5"><span className="font-bold text-sm" style={{ color: tc.text }}>{c.name}</span><span className="text-[10px]" style={{ color: tc.text2 }}>{c.time}</span></div>
                <span className="text-xs block truncate" style={{ color: tc.text2 }}>{c.last}</span>
              </div>
              {c.unread > 0 && <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: tc.accent }}>{c.unread}</div>}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[75%]">
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${m.from === "me" ? "rounded-br-sm text-white" : "rounded-bl-sm"}`}
                    style={m.from === "me" ? { background: tc.accentGrad } : { background: tc.card2, color: tc.text }}>
                    {m.text}
                  </div>
                  <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-right" : ""}`} style={{ color: tc.text3 }}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-xl border-t flex gap-2" style={{ background: tc.navBg, borderColor: tc.border }}>
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Message..." className="flex-1 rounded-xl py-3 px-4 text-sm outline-none" style={{ background: tc.inputBg, border: `1px solid ${tc.border}`, color: tc.text }} />
            <button onClick={send} className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tc.accentGrad }}><Send size={18} className="text-white" /></button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── CANCEL REASON MODAL ─── */
function CancelReasonModal({ venue, fee, refund, onKeep, onConfirm }: {
  venue: string; fee: string; refund: string;
  onKeep: () => void; onConfirm: (reason: string) => void;
}) {
  const tc = useTC();
  const reasons = ["Change of plans", "Found a better option", "Can't make it anymore", "Double booking", "Financial reasons", "Other"];
  const [selected, setSelected] = useState("");
  const [other, setOther] = useState("");
  const [error, setError] = useState(false);
  const finalReason = selected === "Other" ? other.trim() : selected;

  const handleConfirm = () => {
    if (!finalReason) { setError(true); return; }
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-sm rounded-t-3xl p-6 pb-10" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: tc.border2 }} />
        <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
          <X size={24} className="text-red-400" />
        </div>
        <h2 className="font-['Poppins'] font-bold text-lg text-center mb-1" style={{ color: tc.text }}>Cancel Booking?</h2>
        <p className="text-xs text-center mb-3" style={{ color: tc.text2 }}><span className="font-bold" style={{ color: tc.text }}>{venue}</span></p>
        <div className="rounded-xl p-3 mb-4 text-center" style={{ background: tc.isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <p className="text-xs font-bold text-red-400">{fee} cancellation fee applies</p>
          <p className="text-xs mt-0.5" style={{ color: tc.text2 }}>Refund of {refund} within 3–5 business days</p>
        </div>
        <p className="text-xs font-bold mb-2" style={{ color: error && !finalReason ? '#ef4444' : tc.text }}>
          {error && !finalReason ? "Please select a reason" : "Reason for cancellation"}
        </p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {reasons.filter(r => r !== "Other").map(r => (
            <button key={r} onClick={() => { setSelected(r); setError(false); }}
              className="py-2 px-3 rounded-xl text-xs font-medium text-left transition-all"
              style={{
                background: selected === r ? `${tc.accent}15` : tc.inputBg,
                border: `1px solid ${selected === r ? tc.accent : tc.border}`,
                color: selected === r ? tc.accent : tc.text2
              }}>{r}</button>
          ))}
        </div>
        <button onClick={() => { setSelected("Other"); setError(false); }}
          className="w-full py-2 px-3 rounded-xl text-xs font-medium text-left mb-2 transition-all"
          style={{
            background: selected === "Other" ? `${tc.accent}15` : tc.inputBg,
            border: `1px solid ${selected === "Other" ? tc.accent : tc.border}`,
            color: selected === "Other" ? tc.accent : tc.text2
          }}>Other…</button>
        {selected === "Other" && (
          <input
            value={other} onChange={e => { setOther(e.target.value); setError(false); }}
            placeholder="Tell us more (optional)"
            className="w-full rounded-xl px-3 py-2.5 text-xs outline-none mb-3"
            style={{ background: tc.inputBg, border: `1px solid ${tc.border}`, color: tc.text }}
          />
        )}
        <div className="flex gap-3 mt-3">
          <button onClick={onKeep} className="flex-1 py-3.5 rounded-2xl font-bold text-sm border" style={{ borderColor: tc.border, color: tc.text, background: tc.inputBg }}>Keep Booking</button>
          <button onClick={handleConfirm} className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-red-500/15 border border-red-500/30 text-red-400 active:scale-95 transition-transform">Yes, Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── BOOKING DETAIL + QR ─── */
function BookingDetailScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const { goBack } = useNav();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);

  const handleAddToCalendar = () => {
    const title = encodeURIComponent("ONYX SANDTON — SA PLUG Booking");
    const details = encodeURIComponent("VIP Table for 4 + Bottle Service\nRef: SAPVIP-482291");
    const location = encodeURIComponent("Sandton City, Johannesburg");
    const dates = "20260524T220000/20260525T020000";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`, '_blank');
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 3000);
  };

  return (
    <div className="min-h-screen font-['Inter'] pb-16 overflow-y-auto" style={{ background: tc.bg, color: tc.text }}>
      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <CancelReasonModal
          venue="ONYX SANDTON"
          fee="20%"
          refund="R2,000"
          onKeep={() => setShowCancelModal(false)}
          onConfirm={() => { setShowCancelModal(false); setCancelled(true); }}
        />
      )}

      <div className="flex items-center gap-3 px-4 pt-6 pb-4 sticky top-0 backdrop-blur-md z-10 border-b" style={{ background: tc.headerBg, borderColor: tc.border }}>
        <button onClick={goBack} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={20} /></button>
        <h1 className="font-['Poppins'] font-bold text-xl flex-1" style={{ color: tc.text }}>Booking Details</h1>
        <button style={{ color: tc.text2 }}><Share2 size={20} /></button>
      </div>
      <div className="px-4 pt-4">
        {cancelled && (
          <div className="rounded-2xl p-4 mb-4 flex items-center gap-3" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <X size={20} className="text-red-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-red-400">Booking Cancelled</p>
              <p className="text-xs" style={{ color: tc.text2 }}>Refund of R2,000 will be processed within 3–5 business days.</p>
            </div>
          </div>
        )}
        <div className="relative rounded-2xl overflow-hidden h-40 mb-5">
          <img src="/__mockup/images/hero.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <span className="text-[10px] font-bold px-2 py-1 rounded-md mb-2 inline-block text-white" style={{ background: cancelled ? "#ef4444" : tc.accent }}>{cancelled ? "CANCELLED" : "CONFIRMED"}</span>
            <h2 className="font-['Poppins'] font-bold text-xl text-white">ONYX SANDTON</h2>
          </div>
        </div>
        <div className="rounded-2xl p-4 mb-4 space-y-3" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          {[
            { label: "Date & Time", value: "Friday, 24 May 2026 · 10PM" },
            { label: "Booking Ref", value: "SAPVIP-482291" },
            { label: "Package", value: "VIP Table for 4 + Bottle Service" },
            { label: "Status", value: cancelled ? "✗ Cancelled" : "✓ Confirmed" },
            { label: "Total Paid", value: "R2,500" },
          ].map(({ label, value }, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm" style={{ color: tc.text2 }}>{label}</span>
              <span className="font-bold text-sm" style={{ color: label === "Status" ? (cancelled ? "#ef4444" : "#22c55e") : label === "Total Paid" ? tc.accent : tc.text }}>{value}</span>
            </div>
          ))}
        </div>
        {/* Add to Calendar */}
        {!cancelled && (
          <button onClick={handleAddToCalendar} className="w-full flex items-center gap-3 rounded-2xl p-4 mb-4 border transition-all" style={{ background: calendarAdded ? "rgba(34,197,94,0.1)" : tc.card, borderColor: calendarAdded ? "rgba(34,197,94,0.4)" : tc.border }}>
            <Calendar size={20} style={{ color: calendarAdded ? "#22c55e" : tc.accent }} />
            <div className="flex-1 text-left">
              <p className="font-bold text-sm" style={{ color: calendarAdded ? "#22c55e" : tc.text }}>{calendarAdded ? "Added to Calendar!" : "Add to Calendar"}</p>
              <p className="text-xs" style={{ color: tc.text2 }}>Fri, 24 May 2026 · 10PM — ONYX Sandton</p>
            </div>
            <ChevronRight size={16} style={{ color: calendarAdded ? "#22c55e" : tc.accent }} />
          </button>
        )}
        <div className="rounded-2xl p-6 mb-4 flex flex-col items-center" style={{ background: tc.card, border: `1px solid ${tc.accent}44`, boxShadow: `0 0 25px ${tc.accentShadow}` }}>
          <p className="font-['Poppins'] font-bold text-sm mb-1 text-center" style={{ color: tc.text }}>Entry QR Code</p>
          <p className="text-xs mb-5 text-center" style={{ color: tc.text2 }}>Show this at the venue door for VIP entry</p>
          <QRWithActions size={160} bookingRef="SAPVIP-482291" venue="ONYX SANDTON" />
        </div>
        <div className="rounded-2xl p-4 mb-4" style={{ background: `${tc.accent}08`, border: `1px solid ${tc.accent}30` }}>
          <p className="font-bold text-sm mb-1" style={{ color: tc.accent }}>Dress Code</p>
          <p className="text-xs" style={{ color: tc.text2 }}>Smart casual to formal. No sneakers. No caps. VIP dress code strictly enforced.</p>
        </div>
        <MapPreview venue="ONYX SANDTON" address="Sandton City, Johannesburg" />
        <div className="h-4" />
        {!cancelled ? (
          <div className="space-y-3 pb-4">
            <button onClick={() => { _bookingEditMode = true; _modifyMode = true; navigate("clubdetail"); }} className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white" style={{ background: tc.accentGrad }}>
              <Edit3 size={16} /> Modify Booking
            </button>
            <button onClick={() => setShowCancelModal(true)} className="w-full py-3.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold bg-red-500/5">Cancel Booking</button>
          </div>
        ) : (
          <button onClick={() => navigate("clubs")} className="w-full py-3.5 rounded-xl font-bold text-sm mb-4 text-white" style={{ background: tc.accentGrad }}>
            Book Again
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── DEALS SCREEN ─── */
function DealsScreen({ addToCart, navigate }: { addToCart: (item: Omit<CartItem, "qty">) => void; navigate: (s: Screen) => void }) {
  const tc = useTC();
  const deals = [
    { id: 101, name: "VIP Table + 2 Bottles", venue: "Onyx Sandton", orig: 6500, sale: 4500, label: "FLASH DEAL", img: "/__mockup/images/hero.png" },
    { id: 102, name: "Safari Weekend Package", venue: "Kruger National Park", orig: 8500, sale: 5999, label: "WEEKEND SPECIAL", img: "/__mockup/images/tour-safari.jpg" },
    { id: 103, name: "Helicopter + Wine Tasting", venue: "Cape Town", orig: 7200, sale: 5200, label: "COMBO DEAL", img: "/__mockup/images/tour-helicopter.jpg" },
    { id: 104, name: "Yacht Half Day", venue: "V&A Waterfront", orig: 4200, sale: 2800, label: "LAST SPOT", img: "/__mockup/images/tour-yacht.jpg" },
    { id: 105, name: "Fine Dining for 2", venue: "Marble Restaurant", orig: 3500, sale: 2200, label: "DATE NIGHT", img: "/__mockup/images/tour-wine.jpg" },
  ];
  const [added, setAdded] = useState<number[]>([]);
  return (
    <div className="min-h-screen font-['Inter'] pb-10" style={{ background: tc.bg, color: tc.text }}>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 sticky top-0 backdrop-blur-md z-10 border-b" style={{ background: tc.headerBg, borderColor: tc.border }}>
        <button onClick={() => navigate("shop")} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={20} /></button>
        <div className="flex-1">
          <h1 className="font-['Poppins'] font-bold text-xl" style={{ color: tc.text }}>Flash Deals</h1>
          <div className="flex items-center gap-1"><Zap size={12} className="text-red-400" /><span className="text-red-400 text-xs font-bold">Ends in 02:45:30</span></div>
        </div>
      </div>
      <div className="px-4 pt-4 space-y-4">
        {deals.map(d => {
          const pct = Math.round((1 - d.sale / d.orig) * 100);
          const isAdded = added.includes(d.id);
          return (
            <div key={d.id} className="rounded-2xl overflow-hidden" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <div className="relative h-40">
                <img src={d.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-[9px] font-bold px-2 py-1 rounded-md text-white" style={{ background: tc.accentTeal }}>{d.label}</span>
                  <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-red-500 text-white">-{pct}% OFF</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-['Poppins'] font-bold text-base mb-0.5" style={{ color: tc.text }}>{d.name}</h3>
                <p className="text-xs mb-3 flex items-center gap-1" style={{ color: tc.text2 }}><MapPin size={10} />{d.venue}</p>
                <div className="flex items-center justify-between">
                  <div><span className="text-xs line-through mr-2" style={{ color: tc.text3 }}>R{d.orig.toLocaleString()}</span><span className="font-bold text-lg" style={{ color: tc.accent }}>R{d.sale.toLocaleString()}</span></div>
                  <button onClick={() => { addToCart({ id: d.id, name: d.name, price: d.sale, venue: d.venue }); setAdded(prev => [...prev, d.id]); }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all"
                    style={{ background: isAdded ? "rgba(34,197,94,0.15)" : tc.accentGrad, color: isAdded ? "#22c55e" : "#fff", border: isAdded ? "1px solid rgba(34,197,94,0.5)" : "none" }}>
                    {isAdded ? <><Check size={14} />Added</> : <><Plus size={14} />Add to Cart</>}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── HOME SCREEN ─── */
function HomeScreen({ navigate, addToCart }: { navigate: (s: Screen) => void; addToCart: (i: Omit<CartItem,"qty">) => void }) {
  const tc = useTC();
  const banners: SlideItem[] = [
    { img: "/__mockup/images/hero.png", title: "Plan Your Perfect Night ✦", subtitle: "Clubs, tours, dining and more — all in one place.", cta: "Explore Now", onCta: () => navigate("clubs") },
    { img: "/__mockup/images/tour-capetown.jpg", title: "Curated Experiences", subtitle: "Handpicked moments. Made for you.", cta: "See What's New", onCta: () => navigate("tours") },
    { img: "/__mockup/images/tour-wine.jpg", title: "Discover Exceptional Dining", subtitle: "Premium restaurants across South Africa.", cta: "Reserve Table", onCta: () => navigate("dining") },
    { img: "/__mockup/images/onyx.png", title: "VIP Nightlife Access", subtitle: "Skip the queue. Own the night.", cta: "Book Now", onCta: () => navigate("clubs") },
  ];
  const events = [
    { date: "24", month: "MAY", name: "Neon Nights", venue: "ONYX Sandton", live: true },
    { date: "25", month: "MAY", name: "Sunset Beats", venue: "Zone 6 Venue", live: true },
    { date: "31", month: "MAY", name: "Friday Lights", venue: "Coco Sandton", live: true },
    { date: "01", month: "JUN", name: "The Society", venue: "TBA", live: false },
  ];
  const nights = [
    { name: "DJ Horizon", venue: "ONXY Sandton", price: "R150", img: "/__mockup/images/hero.png", tag: "LIVE" },
    { name: "Urban Glow", venue: "Zone 6 Venue", price: "R120", img: "/__mockup/images/onboard-1.png", tag: "LIVE" },
    { name: "After Dark", venue: "Coco Sandton", price: "R100", img: "/__mockup/images/welcome-bg.png", tag: "LIVE" },
    { name: "Luxe Friday", venue: "Rosebank", price: "R200", img: "/__mockup/images/coco.png", tag: "VIP" },
  ];
  const tours = [
    { name: "Safari Escape", price: "R1,250", img: "/__mockup/images/tour-safari.jpg" },
    { name: "Cape Explorer", price: "R850", img: "/__mockup/images/tour-capetown.jpg" },
    { name: "Wine Route", price: "R950", img: "/__mockup/images/tour-wine.jpg" },
    { name: "Helicopter", price: "R4,500", img: "/__mockup/images/tour-helicopter.jpg" },
  ];
  const exclusives = [
    { name: "VIP Bottle Service", sub: "Skip the line.", price: "R2,500+", img: "/__mockup/images/onyx.png" },
    { name: "Private Safari", sub: "Luxury. Wildlife.", price: "R2,800", img: "/__mockup/images/tour-safari.jpg" },
    { name: "Chef's Table", sub: "Fine dining.", price: "R1,450", img: "/__mockup/images/tour-wine.jpg" },
  ];
  const quickLinks = [
    { icon: "🎵", label: "Hidden Bars", to: "clubs" as Screen, cat: "VIP" },
    { icon: "🌆", label: "Rooftop Views", to: "dining" as Screen, cat: "Rooftop" },
    { icon: "🍽️", label: "Fine Dining", to: "dining" as Screen, cat: "Fine Dining" },
    { icon: "🛍️", label: "Shopping", to: "shop" as Screen, cat: "" },
    { icon: "🌍", label: "Day Tours", to: "tours" as Screen, cat: "Adventure" },
  ];
  return (
    <div className="min-h-screen font-['Inter'] pb-24 overflow-y-auto" style={{ background: tc.bg, color: tc.text }}>
      {/* Greeting */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: tc.text2 }}>Welcome back,</p>
          <h1 className="font-['Poppins'] font-bold text-xl" style={{ color: tc.text }}>Big Boy 👋</h1>
        </div>
        <button onClick={() => navigate("profile-notifications")} className="w-10 h-10 rounded-full border relative flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}>
          <Bell size={18} /><span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
      </div>
      {/* Hero Slider */}
      <div className="px-4 mb-5">
        <AutoSlider slides={banners} height={210} interval={4500} />
      </div>
      {/* Quick Categories */}
      <div className="flex gap-3 px-4 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {[
          { icon: Music, label: "Clubs", to: "clubs" as Screen },
          { icon: Palmtree, label: "Tours", to: "tours" as Screen },
          { icon: UtensilsCrossed, label: "Dining", to: "dining" as Screen },
          { icon: ShoppingBag, label: "Shop", to: "shop" as Screen },
        ].map((item, i) => (
          <button key={i} onClick={() => navigate(item.to)} className="flex flex-col items-center gap-2 flex-shrink-0 px-5 py-3 rounded-2xl border" style={{ background: tc.card, borderColor: tc.border, minWidth: 80 }}>
            <item.icon size={22} style={{ color: tc.accent }} />
            <span className="text-[11px] font-medium" style={{ color: tc.text2 }}>{item.label}</span>
          </button>
        ))}
      </div>
      {/* Upcoming Events */}
      <section className="mb-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <span className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>Upcoming Events</span>
          <button onClick={() => navigate("reservations")} className="text-xs flex items-center gap-0.5" style={{ color: tc.accent }}>View all <ChevronRight size={12} /></button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-none">
          {events.map((e, i) => (
            <div key={i} onClick={() => navigate("clubdetail")} className="min-w-[140px] rounded-2xl p-3 flex-shrink-0 cursor-pointer" style={{ background: tc.isDark ? '#0D0D0D' : '#1a1a2e', border: `1px solid ${tc.border}` }}>
              <div className="flex items-start justify-between mb-2">
                <div><div className="text-[10px] font-bold" style={{ color: tc.isDark ? GOLD : tc.accentTeal }}>{e.month}</div><div className="text-2xl font-['Poppins'] font-bold text-white">{e.date}</div></div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: e.live ? 'rgba(239,68,68,0.2)' : `${GOLD}22`, color: e.live ? '#f87171' : GOLD, border: e.live ? '1px solid rgba(239,68,68,0.4)' : `1px solid ${GOLD}44` }}>{e.live ? "LIVE" : "VIP"}</span>
              </div>
              <p className="font-['Poppins'] font-bold text-xs leading-tight mb-1 text-white">{e.name}</p>
              <p className="text-[10px] flex items-center gap-1" style={{ color: '#B3B3B3' }}><MapPin size={9} />{e.venue}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Book Tours */}
      <section className="mb-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <span className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>Book Tours</span>
          <button onClick={() => navigate("tours")} className="text-xs flex items-center gap-0.5" style={{ color: tc.accent }}>View all <ChevronRight size={12} /></button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-none">
          {tours.map((t, i) => (
            <div key={i} onClick={() => navigate("tourdetail")} className="min-w-[150px] h-28 rounded-2xl overflow-hidden relative flex-shrink-0 cursor-pointer">
              <img src={t.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3">
                <p className="font-['Poppins'] font-bold text-xs text-white">{t.name}</p>
                <p className="text-[10px]" style={{ color: tc.isDark ? GOLD : tc.accentTeal }}>From {t.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Nightlife Picks */}
      <section className="mb-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <span className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>Nightlife Picks</span>
          <button onClick={() => navigate("clubs")} className="text-xs flex items-center gap-0.5" style={{ color: tc.accent }}>View all <ChevronRight size={12} /></button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-none">
          {nights.map((n, i) => (
            <div key={i} onClick={() => navigate("clubdetail")} className="min-w-[120px] rounded-2xl overflow-hidden relative flex-shrink-0 cursor-pointer" style={{ height: 120 }}>
              <img src={n.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute top-2 left-2"><span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: n.tag === "LIVE" ? "rgba(239,68,68,0.9)" : GOLD, color: n.tag === "LIVE" ? "#fff" : "#000" }}>{n.tag}</span></div>
              <div className="absolute bottom-0 left-0 p-2.5">
                <p className="font-['Poppins'] font-bold text-xs text-white leading-tight">{n.name}</p>
                <p className="text-[9px] text-white/60">{n.venue}</p>
                <p className="text-[9px] font-bold" style={{ color: tc.isDark ? GOLD : tc.accentTeal }}>From {n.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Exclusive Experiences */}
      <section className="mb-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <span className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>Exclusive Experiences</span>
          <button onClick={() => navigate("tours")} className="text-xs flex items-center gap-0.5" style={{ color: tc.accent }}>View all <ChevronRight size={12} /></button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-none">
          {exclusives.map((e, i) => (
            <div key={i} onClick={() => navigate("tourdetail")} className="min-w-[160px] rounded-2xl overflow-hidden relative flex-shrink-0 cursor-pointer" style={{ height: 110, background: tc.card, border: `1px solid ${tc.border}` }}>
              <img src={e.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3">
                <p className="font-['Poppins'] font-bold text-xs text-white">{e.name}</p>
                <p className="text-[9px] text-white/60 mb-0.5">{e.sub}</p>
                <p className="text-[10px] font-bold" style={{ color: tc.isDark ? GOLD : tc.accentTeal }}>{e.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Local Favorites */}
      <section className="mb-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <span className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>Local Favorites</span>
          <button onClick={() => navigate("clubs")} className="text-xs flex items-center gap-0.5" style={{ color: tc.accent }}>View all <ChevronRight size={12} /></button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-none">
          {quickLinks.map((q, i) => (
            <button key={i} onClick={() => { if (q.cat) _pendingCat = q.cat; navigate(q.to); }} className="flex flex-col items-center gap-2 flex-shrink-0 px-4 py-3 rounded-2xl border active:scale-95 transition-transform" style={{ background: tc.card, borderColor: tc.border }}>
              <span className="text-2xl">{q.icon}</span>
              <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: tc.text2 }}>{q.label}</span>
            </button>
          ))}
        </div>
      </section>
      {/* Trending Tags */}
      <section className="px-4 mb-4">
        <p className="font-['Poppins'] font-bold text-base mb-3" style={{ color: tc.text }}>Trending</p>
        <div className="flex flex-wrap gap-2">
          {["#Rooftop", "#Amapiano", "#WeekendPlan", "#VIP", "#WineTour", "#SafariLife", "#JoziFridays", "#CapeTown", "#Soweto"].map((tag, i) => (
            <button key={i} onClick={() => navigate("search")} className="px-3 py-1.5 rounded-full text-xs font-bold border active:scale-95 transition-transform" style={{ borderColor: i % 3 === 0 ? tc.accent : tc.border, color: i % 3 === 0 ? (tc.isDark ? '#000' : '#fff') : tc.text2, background: i % 3 === 0 ? tc.accent : tc.inputBg }}>{tag}</button>
          ))}
        </div>
      </section>
      {/* Add to Calendar Section */}
      <section className="px-4 mb-6">
        <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${tc.accent}15` }}><Calendar size={22} style={{ color: tc.accent }} /></div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color: tc.text }}>Upcoming: Neon Nights</p>
            <p className="text-xs" style={{ color: tc.text2 }}>Tonight · ONYX Sandton · 10PM</p>
          </div>
          <button onClick={() => navigate("reservations")} className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold text-white" style={{ background: tc.accentTeal }}>View</button>
        </div>
      </section>
      <BottomNav active="home" navigate={navigate} />
    </div>
  );
}

/* ─── CLUBS SCREEN ─── */
function ClubsScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [activeFilter, setActiveFilter] = useState(() => { const c = _pendingCat; _pendingCat = ""; return c || "All"; });
  const filters = ["All", "VIP", "Rooftop", "Amapiano", "Afrobeats", "EDM", "Hip Hop"];
  const gridRef = useRef<HTMLElement>(null);

  const viewAll = (filter = "All") => {
    setActiveFilter(filter);
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const allClubs = [
    { img: "/__mockup/images/onyx.png", name: "Onyx Sandton", rating: "4.8", reviews: "1.2k", area: "Sandton", genres: ["Amapiano", "Hip Hop", "Afrobeats"], tags: ["VIP"] },
    { img: "/__mockup/images/coco.png", name: "Coco Sandton", rating: "4.7", reviews: "980", area: "Sandton", genres: ["Afrobeats", "Hip Hop", "R&B"], tags: [] },
    { img: "/__mockup/images/zone6.png", name: "Zone 6 Venue", rating: "4.6", reviews: "870", area: "Soweto", genres: ["Amapiano", "Gqom", "Hip Hop"], tags: [] },
    { img: "/__mockup/images/kong.png", name: "Kong Rosebank", rating: "4.5", reviews: "760", area: "Rosebank", genres: ["Hip Hop", "Afrobeats", "R&B"], tags: ["Rooftop"] },
    { img: "/__mockup/images/auth-bg.png", name: "ICON Soweto", rating: "4.4", reviews: "640", area: "Soweto", genres: ["Amapiano", "Afrobeats"], tags: ["VIP"] },
    { img: "/__mockup/images/splash-bg.png", name: "Status Nightclub", rating: "4.3", reviews: "520", area: "Sandton", genres: ["EDM", "Hip Hop"], tags: ["EDM", "Rooftop"] },
  ];

  const banners: SlideItem[] = [
    { img: "/__mockup/images/hero.png", title: "Tonight Belongs To You", subtitle: "The city. The music. The energy.", cta: "Explore Top Clubs", onCta: () => viewAll("All") },
    { img: "/__mockup/images/onboard-1.png", title: "Amapiano All Night 🎵", subtitle: "Live DJs. Premium sound. VIP access.", cta: "Book a Table", onCta: () => navigate("clubdetail") },
    { img: "/__mockup/images/welcome-bg.png", title: "VIP Bottle Service", subtitle: "Skip the queue. Own the night.", cta: "Reserve Now", onCta: () => navigate("clubdetail") },
  ];

  const filteredClubs = activeFilter === "All"
    ? allClubs
    : allClubs.filter(c => c.genres.some(g => g === activeFilter) || c.tags.includes(activeFilter));

  const genreColors: Record<string, { bg: string; color: string }> = {
    "Amapiano": { bg: "rgba(212,175,55,0.14)", color: "#D4AF37" },
    "Hip Hop": { bg: "rgba(255,255,255,0.08)", color: "#aaa" },
    "Afrobeats": { bg: "rgba(220,100,50,0.16)", color: "#E08060" },
    "R&B": { bg: "rgba(160,100,220,0.16)", color: "#B070E0" },
    "Gqom": { bg: "rgba(50,160,220,0.16)", color: "#50A0DC" },
    "EDM": { bg: "rgba(50,220,150,0.14)", color: "#40C090" },
  };

  return (
    <div className="min-h-screen font-['Inter'] pb-24 overflow-y-auto" style={{ background: tc.bg, color: tc.text }}>
      <div className="px-4 pt-5 pb-3">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-['Poppins'] font-bold text-2xl" style={{ color: tc.text }}>Clubs</h1>
          <button onClick={() => navigate("search")} className="w-9 h-9 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><Search size={18} /></button>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
            <input placeholder="Search clubs, venues or areas" onClick={() => navigate("search")} readOnly
              className="w-full rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none cursor-pointer" style={{ background: tc.card, border: `1px solid ${tc.border}`, color: tc.text }} />
          </div>
          <button className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0" style={{ background: tc.card, borderColor: tc.border, color: tc.text2 }}><SlidersHorizontal size={16} /></button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map(f => (
            <button key={f} onClick={() => viewAll(f)} className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all active:scale-95"
              style={activeFilter === f ? { background: tc.chipActiveBg, color: tc.chipActiveColor } : { background: tc.chipBg, color: tc.chipColor, border: `1px solid ${tc.border}` }}>{f}</button>
          ))}
        </div>
      </div>

      <div className="px-4 mb-6">
        <AutoSlider slides={banners} height={180} interval={5000} />
      </div>

      {/* Handpicked */}
      <section className="mb-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <span className="font-['Poppins'] font-bold text-[15px]" style={{ color: tc.text }}>Handpicked Clubs</span>
          <button onClick={() => viewAll("All")} className="text-xs font-medium flex items-center gap-0.5" style={{ color: tc.accent }}>View all <ChevronRight size={12} /></button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-1 scrollbar-none">
          {allClubs.map((c, i) => (
            <button key={i} onClick={() => navigate("clubdetail")} className="flex-shrink-0 w-[88px] text-left">
              <div className="relative w-[88px] h-[88px] rounded-2xl overflow-hidden mb-2">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute top-1.5 left-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-black" style={{ background: GOLD }}>VIP</span>
              </div>
              <p className="font-semibold text-[11px] leading-tight mb-0.5" style={{ color: tc.text }}>{c.name}</p>
              <p className="text-[10px] mb-0.5" style={{ color: tc.text3 }}>{c.area}</p>
              <div className="flex items-center gap-1"><Star size={8} fill={GOLD} color={GOLD} /><span className="text-[10px] font-bold" style={{ color: GOLD }}>{c.rating}</span></div>
            </button>
          ))}
        </div>
      </section>

      {/* Premium Banner */}
      <section className="px-4 mb-6">
        <div className="relative rounded-2xl overflow-hidden" style={{ background: tc.isDark ? "linear-gradient(135deg,#0C0A00,#1C1600)" : "linear-gradient(135deg,#F9F3DB,#FFF8E1)" }}>
          <img src="/__mockup/images/champagne.png" alt="" className="absolute right-0 top-0 h-full w-[52%] object-cover" style={{ opacity: 0.45 }} />
          <div className="absolute inset-0" style={{ background: tc.isDark ? "linear-gradient(90deg,#0C0A00 40%,rgba(12,10,0,0.5) 70%,transparent)" : "linear-gradient(90deg,#F9F3DB 40%,rgba(249,243,219,0.5) 70%,transparent)" }} />
          <div className="relative z-10 p-5 pb-6">
            <h3 className="font-['Poppins'] font-bold text-[18px] mb-1" style={{ color: tc.text }}>Premium Bottle Service</h3>
            <p className="text-xs mb-4" style={{ color: tc.text2 }}>Skip the line. Own the night.</p>
            {["VIP Table Booking", "Premium Bottles", "Dedicated Host"].map(f => (
              <div key={f} className="flex items-center gap-2.5 mb-2"><Check size={13} style={{ color: tc.accent }} strokeWidth={2.5} /><span className="text-sm" style={{ color: tc.text }}>{f}</span></div>
            ))}
            <button onClick={() => navigate("clubdetail")} className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold" style={{ borderColor: tc.accent, color: tc.accent }}>
              Book VIP Experience <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Top Clubs List (filtered) */}
      <section ref={gridRef} className="px-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="font-['Poppins'] font-bold text-[15px]" style={{ color: tc.text }}>
            {activeFilter === "All" ? "All Clubs" : `${activeFilter} Clubs`}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${tc.accent}12`, color: tc.accent }}>{filteredClubs.length} results</span>
        </div>
        {filteredClubs.length === 0 ? (
          <div className="py-10 text-center rounded-2xl" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <Music size={36} className="mx-auto mb-3" style={{ color: tc.muted }} />
            <p className="font-bold text-sm" style={{ color: tc.text }}>No clubs found for "{activeFilter}"</p>
            <button onClick={() => viewAll("All")} className="mt-2 text-xs font-bold" style={{ color: tc.accent }}>Show All Clubs</button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClubs.map((c, i) => (
              <div key={i} className="flex gap-3 rounded-2xl p-3" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
                <img src={c.img} alt={c.name} className="w-[76px] h-[76px] rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-['Poppins'] font-semibold text-[13px] leading-tight" style={{ color: tc.text }}>{c.name}</span>
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}44` }}>VIP</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1.5"><Star size={9} fill={GOLD} color={GOLD} /><span className="text-[11px] font-bold" style={{ color: GOLD }}>{c.rating}</span><span className="text-[11px]" style={{ color: tc.text3 }}>({c.reviews}) · {c.area}</span></div>
                  <div className="flex gap-1 flex-wrap">
                    {c.genres.map(g => <span key={g} className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ background: genreColors[g]?.bg ?? tc.tagBg, color: genreColors[g]?.color ?? tc.text2 }}>{g}</span>)}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0 justify-center">
                  <button onClick={() => navigate("clubdetail")} className="px-3 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap" style={{ background: tc.accentTeal, color: '#fff', boxShadow: `0 0 10px ${tc.accentShadow}` }}>Book Table</button>
                  <button onClick={() => navigate("clubdetail")} className="px-3 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap" style={{ border: `1px solid ${tc.border}`, color: tc.text2, background: tc.inputBg }}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNav active="clubs" navigate={navigate} />
    </div>
  );
}

/* ─── CLUB DETAIL SCREEN ─── */
function ClubDetailScreen({ navigate, addToCart, cartCount }: { navigate: (s: Screen) => void; addToCart: (i: Omit<CartItem,"qty">) => void; cartCount: number }) {
  const tc = useTC();
  const [subView, setSubView] = useState<"detail" | "menu" | "booking" | "reviews" | "gallery">("detail");
  const [liked, setLiked] = useState(false);
  const [menuCat, setMenuCat] = useState("Champagne");
  const [menuQtys, setMenuQtys] = useState<Record<string, number>>({});
  const [menuAdded, setMenuAdded] = useState<Record<string, boolean>>({});
  const [addOns, setAddOns] = useState([
    { id: 1, name: "VIP Bottle Service", desc: "Includes premium spirits, mixers & VIP host.", price: 2500, qty: 1, img: "/__mockup/images/hero.png" },
    { id: 2, name: "Onyx Experience Package", desc: "Entry for 4, 2 bottles, VIP seating & mixers.", price: 6000, qty: 1, img: "/__mockup/images/onyx.png" },
  ]);
  const [bookDateIdx, setBookDateIdx] = useState(() => _bookingState.dateIdx);
  const [bookTime, setBookTime] = useState(() => _bookingState.time);
  const [bookGuests, setBookGuests] = useState(() => _bookingState.guests);
  const [bookTable, setBookTable] = useState(() => _bookingState.table);
  const [bookError, setBookError] = useState("");
  const [isModify, setIsModify] = useState(false);
  const [tableDowngradeWarn, setTableDowngradeWarn] = useState(false);
  const [guestReduceWarn, setGuestReduceWarn] = useState(false);
  useEffect(() => {
    if (_bookingEditMode) { _bookingEditMode = false; setSubView("booking"); }
    if (_modifyMode) { setIsModify(true); }
  }, []);

  const MENU_CATS = ["Champagne", "Vodka", "Whiskey", "Cocktails", "Packages"];
  const MENU_ITEMS: Record<string, { name: string; sub: string; price: string }[]> = {
    Champagne: [
      { name: "Moët & Chandon Impérial", sub: "Brut", price: "R1,600" },
      { name: "Veuve Clicquot Yellow Label", sub: "Brut", price: "R2,200" },
      { name: "Dom Pérignon Vintage", sub: "Brut", price: "R6,500" },
      { name: "Luc Belaire Rosé", sub: "Rare Rosé", price: "R1,400" },
      { name: "Armand de Brignac Gold", sub: "Brut", price: "R9,800" },
    ],
    Vodka: [
      { name: "CÎROC Ultra Premium", sub: "750ml", price: "R1,500" },
      { name: "Belvedere Vodka", sub: "750ml", price: "R1,600" },
      { name: "Grey Goose", sub: "750ml", price: "R1,700" },
      { name: "Crystal Head", sub: "750ml", price: "R2,100" },
    ],
    Whiskey: [
      { name: "Johnnie Walker Blue Label", sub: "750ml", price: "R3,200" },
      { name: "Macallan 12 Year", sub: "750ml", price: "R2,800" },
      { name: "Hennessy VS Cognac", sub: "750ml", price: "R1,900" },
      { name: "Remy Martin XO", sub: "700ml", price: "R4,500" },
    ],
    Cocktails: [
      { name: "Pornstar Martini", sub: "Signature", price: "R180" },
      { name: "Espresso Martini", sub: "Signature", price: "R160" },
      { name: "Lychee Mojito", sub: "Refreshing", price: "R150" },
      { name: "SA Sour", sub: "Local Twist", price: "R140" },
    ],
    Packages: [
      { name: "Onyx VIP Package", sub: "2 bottles + reserved table + host", price: "R8,500" },
      { name: "Birthday Special", sub: "3 bottles + sparklers + cake", price: "R12,000" },
      { name: "Group Takeover", sub: "10+ pax, entire section, 5 bottles", price: "R25,000" },
    ],
  };

  const updateQty = (id: number, delta: number) => setAddOns(prev => prev.map(a => a.id === id ? { ...a, qty: Math.max(0, a.qty + delta) } : a).filter(a => a.qty > 0));
  const TABLE_MIN = 2500;
  const addOnsTotal = addOns.reduce((s, a) => s + a.price * a.qty, 0);
  const serviceFee = Math.round((TABLE_MIN + addOnsTotal) * 0.1);
  const total = TABLE_MIN + addOnsTotal + serviceFee;

  const clubReviews = [
    { name: "Lerato M.", rating: 5, date: "1 week ago", text: "Incredible vibes! The DJ was fire and the VIP service was next level. Will definitely be back!" },
    { name: "Sipho D.", rating: 4, date: "2 weeks ago", text: "Amazing spot. Bottle service was smooth and the crowd was amazing. Dress code is strictly enforced though." },
    { name: "Nomsa T.", rating: 5, date: "1 month ago", text: "Best club in Sandton by far. The sound system is insane and the champagne selection is top notch." },
  ];

  if (subView === "reviews") {
    return (
      <div className="min-h-screen font-['Inter'] pb-10" style={{ background: tc.bg, color: tc.text }}>
        <div className="flex items-center gap-3 px-4 pt-6 pb-4 sticky top-0 backdrop-blur-md border-b" style={{ background: tc.headerBg, borderColor: tc.border }}>
          <button onClick={() => setSubView("detail")} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={20} /></button>
          <h1 className="font-['Poppins'] font-bold text-xl" style={{ color: tc.text }}>Reviews</h1>
        </div>
        <div className="px-4 pt-4"><ReviewsSection rating={4.8} count={1245} reviews={clubReviews} /></div>
      </div>
    );
  }

  if (subView === "gallery") {
    const galleryImgs = [
      "/__mockup/images/onyx.png","/__mockup/images/hero.png","/__mockup/images/coco.png",
      "/__mockup/images/zone6.png","/__mockup/images/kong.png","/__mockup/images/tour-capetown.jpg",
      "/__mockup/images/tour-wine.jpg","/__mockup/images/onboard-1.png","/__mockup/images/tour-safari.jpg",
    ];
    return (
      <div className="min-h-screen font-['Inter'] pb-10" style={{ background: tc.bg, color: tc.text }}>
        <div className="flex items-center gap-3 px-4 pt-6 pb-4 sticky top-0 backdrop-blur-md border-b z-10" style={{ background: tc.headerBg, borderColor: tc.border }}>
          <button onClick={() => setSubView("detail")} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={20} /></button>
          <h1 className="font-['Poppins'] font-bold text-xl flex-1" style={{ color: tc.text }}>Gallery</h1>
          <span className="text-xs" style={{ color: tc.text2 }}>{galleryImgs.length} photos</span>
        </div>
        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {galleryImgs.map((src, i) => (
            <div key={i} className={`overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`} style={{ height: i === 0 ? 240 : 119 }}>
              <img src={src} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (subView === "menu") {
    const items = MENU_ITEMS[menuCat] ?? [];
    const menuEmoji = menuCat === "Champagne" ? "🍾" : menuCat === "Vodka" ? "🍶" : menuCat === "Whiskey" ? "🥃" : menuCat === "Cocktails" ? "🍹" : "🎁";
    const getKey = (i: number) => `${menuCat}-${i}`;
    const getQty = (i: number) => menuQtys[getKey(i)] ?? 1;
    const setQty = (i: number, v: number) => setMenuQtys(prev => ({ ...prev, [getKey(i)]: Math.max(1, v) }));
    const handleAdd = (item: { name: string; price: string }, i: number) => {
      const key = getKey(i);
      const qty = getQty(i);
      const unitPrice = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
      for (let q = 0; q < qty; q++) {
        addToCart({ id: (menuCat.charCodeAt(0) * 100) + i + 5000, name: item.name, price: unitPrice, venue: "ONYX SANDTON" });
      }
      setMenuAdded(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setMenuAdded(prev => ({ ...prev, [key]: false })), 2000);
    };
    return (
      <div className="h-screen font-['Inter'] flex flex-col overflow-hidden" style={{ background: tc.bg, color: tc.text }}>
        {/* Header */}
        <div className="flex-shrink-0 border-b" style={{ background: tc.bg, borderColor: tc.border }}>
          <div className="flex items-center gap-3 px-4 pt-6 pb-3">
            <button onClick={() => setSubView("detail")} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={20} /></button>
            <div className="flex-1 text-center"><p className="font-['Poppins'] font-bold text-[15px]" style={{ color: tc.text }}>Onyx Sandton</p><p className="text-xs" style={{ color: tc.text3 }}>Menu</p></div>
            <button onClick={() => navigate("cart")} className="w-10 h-10 rounded-full border flex items-center justify-center relative" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}>
              <ShoppingCart size={17} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{ background: tc.accent }}>{cartCount}</span>}
            </button>
          </div>
          <div className="flex overflow-x-auto px-4 pb-0 scrollbar-none">
            {MENU_CATS.map(c => (
              <button key={c} onClick={() => setMenuCat(c)} className="pb-3 px-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex-shrink-0"
                style={{ borderColor: menuCat === c ? tc.accent : "transparent", color: menuCat === c ? tc.text : tc.text3 }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto px-4 pt-5 scrollbar-none" style={{ paddingBottom: cartCount > 0 ? 100 : 32 }}>
          <h2 className="font-['Poppins'] font-bold text-base mb-4" style={{ color: tc.text }}>{menuCat}</h2>
          <div className="space-y-3">
            {items.map((item, i) => {
              const key = getKey(i);
              const qty = getQty(i);
              const isAdded = !!menuAdded[key];
              return (
                <div key={i} className="rounded-2xl p-3" style={{ background: tc.card, border: `1px solid ${isAdded ? tc.accentTeal : tc.border}`, transition: "border-color 0.3s" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl" style={{ background: tc.card2 }}>{menuEmoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm leading-tight mb-0.5" style={{ color: tc.text }}>{item.name}</p>
                      <p className="text-xs mb-1" style={{ color: tc.text3 }}>{item.sub}</p>
                      <p className="font-bold text-sm" style={{ color: tc.accent }}>{item.price}</p>
                    </div>
                    {isAdded && (
                      <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: `${tc.accentTeal}20`, color: tc.accentTeal }}>
                        <Check size={10} strokeWidth={3} /> Added
                      </span>
                    )}
                  </div>
                  {/* Qty + Add row */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-xl border px-2 py-1.5" style={{ background: tc.inputBg, borderColor: tc.border }}>
                      <button onClick={() => setQty(i, qty - 1)} className="w-6 h-6 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: qty <= 1 ? tc.card2 : `${tc.accent}15` }}>
                        <Minus size={11} style={{ color: qty <= 1 ? tc.muted : tc.accent }} />
                      </button>
                      <span className="text-sm font-bold w-5 text-center tabular-nums" style={{ color: tc.text }}>{qty}</span>
                      <button onClick={() => setQty(i, qty + 1)} className="w-6 h-6 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: `${tc.accent}15` }}>
                        <Plus size={11} style={{ color: tc.accent }} />
                      </button>
                    </div>
                    <button onClick={() => handleAdd(item, i)}
                      className="flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all"
                      style={{ background: isAdded ? tc.accentTeal : tc.accentGrad, color: "#fff", boxShadow: isAdded ? "none" : `0 4px 12px ${tc.accentShadow}` }}>
                      {isAdded ? <><Check size={12} strokeWidth={3} /> Added to Cart!</> : <><ShoppingCart size={12} /> Add {qty > 1 ? `${qty}×` : ""} to Cart</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="flex items-center justify-center gap-1.5 text-xs mt-6 mb-2" style={{ color: tc.muted }}><AlertCircle size={11} /> All prices are in ZAR and include VAT.</p>
        </div>

        {/* Sticky View Cart bar */}
        {cartCount > 0 && (
          <div className="flex-shrink-0 absolute bottom-0 left-0 right-0 px-4 pb-5 pt-3 backdrop-blur-xl border-t" style={{ background: tc.navBg, borderColor: tc.border }}>
            <button onClick={() => navigate("cart")} className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-between px-5 active:scale-[0.98] transition-transform" style={{ background: tc.accentGrad, boxShadow: `0 8px 24px ${tc.accentShadow}` }}>
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{cartCount}</span>
              <span>View Cart</span>
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (subView === "booking") {
    const tableMin = getTablePrice(bookTable || "VIP Table A");
    const bookAddOnsTotal = addOns.reduce((s, a) => s + a.price * a.qty, 0);
    const bookServiceFee = Math.round((tableMin + bookAddOnsTotal) * 0.1);
    const bookTotal = tableMin + bookAddOnsTotal + bookServiceFee;

    const extraForTable = isModify ? Math.max(0, tableMin - PAID_BOOKING_TABLE_PRICE) : 0;
    const extraForAddOns = isModify ? bookAddOnsTotal : 0;
    const extraBase = extraForTable + extraForAddOns;
    const extraServiceFee = isModify ? Math.round(extraBase * 0.1) : 0;
    const balanceDue = isModify ? extraBase + extraServiceFee : bookTotal;

    const handleProceed = () => {
      if (!bookTime || bookGuests < 1 || !bookTable) {
        setBookError("Please select a date, time, number of guests and a table to continue.");
        return;
      }
      if (tableDowngradeWarn) {
        setBookError("Please select a same or higher-tier table to continue.");
        return;
      }
      setBookError("");
      _bookingState = { dateIdx: bookDateIdx, time: bookTime, guests: bookGuests, table: bookTable };
      if (isModify) {
        _modifyExtraAmount = balanceDue;
        if (balanceDue === 0) {
          // No extra charge — skip payment, go straight to confirmation
          _modifyMode = false;
          navigate("checkout-confirmed");
          return;
        }
      }
      navigate("checkout-details");
    };

    return (
      <div className="h-screen font-['Inter'] flex flex-col overflow-hidden" style={{ background: tc.bg, color: tc.text }}>
        {/* Header */}
        <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-6 pb-4 border-b" style={{ background: tc.bg, borderColor: tc.border }}>
          <button onClick={() => setSubView("detail")} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={20} /></button>
          <div className="flex-1 text-center"><p className="font-['Poppins'] font-bold text-[15px]" style={{ color: tc.text }}>Book Your Table</p><p className="text-xs" style={{ color: tc.text3 }}>Onyx Sandton</p></div>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none">
          <div className="px-4 pt-5 pb-6 space-y-6">

            {/* ── MODIFY MODE BANNER ── */}
            {isModify && (
              <div className="flex items-start gap-3 rounded-2xl p-4" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
                <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={14} className="text-green-400" strokeWidth={3} /></div>
                <div>
                  <p className="font-bold text-sm text-green-400 mb-0.5">Paid: R{PAID_BOOKING_AMOUNT.toLocaleString()}</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: tc.text2 }}>You can only <span className="font-semibold">add</span> to your booking — no reductions or downgrades allowed after payment.</p>
                </div>
              </div>
            )}

            {/* ── STEP 1: DATE ── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black" style={{ background: GOLD }}>1</div>
                <h2 className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>Select Date</h2>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {BOOKING_DATES.map((d, i) => (
                  <button key={i} onClick={() => setBookDateIdx(i)}
                    className="flex-shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border transition-all active:scale-95"
                    style={{ background: bookDateIdx === i ? tc.accent : tc.inputBg, borderColor: bookDateIdx === i ? tc.accent : tc.border, color: bookDateIdx === i ? "#fff" : tc.text2, minWidth: 60 }}>
                    <span className="text-[10px] font-semibold">{d.day}</span>
                    <span className="text-sm font-bold">{d.date}</span>
                    <span className="text-[9px] mt-0.5" style={{ opacity: 0.7 }}>May</span>
                  </button>
                ))}
              </div>
            </section>

            {/* ── STEP 2: TIME ── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black" style={{ background: GOLD }}>2</div>
                <h2 className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>Select Time</h2>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {BOOKING_TIMES.map(t => (
                  <button key={t} onClick={() => setBookTime(t)}
                    className="py-2.5 rounded-xl text-[11px] font-bold border transition-all active:scale-95"
                    style={{ background: bookTime === t ? tc.accent : tc.inputBg, borderColor: bookTime === t ? tc.accent : tc.border, color: bookTime === t ? "#fff" : tc.text2 }}>
                    {t}
                  </button>
                ))}
              </div>
            </section>

            {/* ── STEP 3: GUESTS ── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black" style={{ background: GOLD }}>3</div>
                <h2 className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>Number of Guests</h2>
              </div>
              <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
                <div>
                  <p className="font-bold text-sm" style={{ color: tc.text }}>{bookGuests} Guest{bookGuests !== 1 ? "s" : ""}</p>
                  <p className="text-xs mt-0.5" style={{ color: tc.text3 }}>Min 1 · Max 20</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => {
                    if (isModify && bookGuests <= PAID_BOOKING_MIN_GUESTS) {
                      setGuestReduceWarn(true);
                      setTimeout(() => setGuestReduceWarn(false), 2500);
                      return;
                    }
                    setBookGuests(g => Math.max(1, g - 1));
                  }} className="w-9 h-9 rounded-full border flex items-center justify-center active:scale-90 transition-transform" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><Minus size={14} /></button>
                  <span className="font-['Poppins'] font-bold text-xl w-8 text-center" style={{ color: tc.text }}>{bookGuests}</span>
                  <button onClick={() => setBookGuests(g => Math.min(20, g + 1))} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: tc.accentGrad }}><Plus size={14} className="text-white" /></button>
                </div>
              </div>
              {isModify && guestReduceWarn && (
                <p className="text-xs text-red-400 mt-2 ml-1 flex items-center gap-1"><AlertCircle size={11} /> Cannot reduce guests after payment</p>
              )}
            </section>

            {/* ── STEP 4: TABLE ── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black" style={{ background: GOLD }}>4</div>
                <h2 className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>Select Table</h2>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {BOOKING_TABLES.map(tbl => {
                  const isSelected = bookTable === tbl.name;
                  const isVIP = tbl.type !== "Standard" && tbl.type !== "Booth";
                  return (
                    <button key={tbl.id} onClick={() => {
                      if (!tbl.available) return;
                      if (isModify && getTablePrice(tbl.name) < PAID_BOOKING_TABLE_PRICE) {
                        setTableDowngradeWarn(true);
                        setTimeout(() => setTableDowngradeWarn(false), 2500);
                        return;
                      }
                      setBookTable(tbl.name);
                      setTableDowngradeWarn(false);
                    }}
                      disabled={!tbl.available}
                      className="rounded-2xl p-3 text-left border transition-all active:scale-95 relative overflow-hidden"
                      style={{
                        background: !tbl.available ? tc.card2 : isSelected ? `${tc.accent}15` : tc.card,
                        borderColor: isSelected ? tc.accent : !tbl.available ? tc.border : tc.border2,
                        opacity: !tbl.available ? 0.55 : 1,
                      }}>
                      {isVIP && tbl.available && (
                        <span className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded text-black" style={{ background: GOLD }}>VIP</span>
                      )}
                      {isSelected && <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: tc.accent }}><Check size={9} className="text-white" strokeWidth={3} /></div>}
                      <p className="text-2xl mb-1">{tbl.type === "Exclusive" ? "👑" : tbl.type === "Premium" ? "⭐" : tbl.type === "Booth" ? "🛋️" : "🪑"}</p>
                      <p className="font-bold text-xs leading-tight mb-0.5" style={{ color: isSelected ? tc.accent : tc.text }}>{tbl.name}</p>
                      <p className="text-[10px]" style={{ color: tc.text3 }}>Up to {tbl.cap} guests</p>
                      <p className="text-[10px] font-semibold mt-1" style={{ color: tbl.available ? tc.accentTeal : tc.text3 }}>
                        {tbl.available ? `R${getTablePrice(tbl.name).toLocaleString()} min` : "Unavailable"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── DOWNGRADE WARNING ── */}
            {isModify && tableDowngradeWarn && (
              <div className="flex items-start gap-2.5 rounded-2xl p-3.5" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-red-400">Cannot downgrade table after payment. Please select <strong>VIP Table A</strong> or higher.</p>
              </div>
            )}

            {/* ── VALIDATION ERROR ── */}
            {bookError && (
              <div className="flex items-start gap-2.5 rounded-2xl p-3.5" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-red-400">{bookError}</p>
              </div>
            )}

            {/* ── ADD-ONS ── */}
            <section>
              <h2 className="font-['Poppins'] font-bold text-base mb-3" style={{ color: tc.text }}>Add-Ons & Packages</h2>
              <div className="space-y-3">
                {addOns.map(addon => (
                  <div key={addon.id} className="rounded-2xl p-3 flex gap-3" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"><img src={addon.img} alt={addon.name} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm leading-tight mb-1" style={{ color: tc.text }}>{addon.name}</p>
                      <p className="text-xs mb-2.5" style={{ color: tc.text2 }}>{addon.desc}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm" style={{ color: tc.accent }}>R{(addon.price * addon.qty).toLocaleString()}</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(addon.id, -1)} className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border }}><Minus size={12} style={{ color: tc.text }} /></button>
                          <span className="text-sm font-bold w-4 text-center tabular-nums" style={{ color: tc.text }}>{addon.qty}</span>
                          <button onClick={() => updateQty(addon.id, 1)} className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border }}><Plus size={12} style={{ color: tc.text }} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── ORDER SUMMARY ── */}
            <section>
              <h2 className="font-['Poppins'] font-bold text-base mb-3" style={{ color: tc.text }}>{isModify ? "Modification Summary" : "Order Summary"}</h2>
              <div className="rounded-2xl p-4 space-y-3" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
                {isModify ? (
                  <>
                    <div className="flex justify-between text-sm items-center">
                      <span style={{ color: tc.text2 }}>Already Paid</span>
                      <span className="font-semibold text-green-400">R{PAID_BOOKING_AMOUNT.toLocaleString()} ✓</span>
                    </div>
                    {extraForTable > 0 && <div className="flex justify-between text-sm"><span style={{ color: tc.text2 }}>Table Upgrade ({bookTable})</span><span style={{ color: tc.text }}>+R{extraForTable.toLocaleString()}</span></div>}
                    {extraForAddOns > 0 && addOns.map(a => <div key={a.id} className="flex justify-between text-sm"><span className="truncate pr-4" style={{ color: tc.text2 }}>{a.name}</span><span className="flex-shrink-0" style={{ color: tc.text }}>+R{(a.price * a.qty).toLocaleString()}</span></div>)}
                    {extraServiceFee > 0 && <div className="flex justify-between text-sm"><span style={{ color: tc.text2 }}>Service Fee on Extras (10%)</span><span style={{ color: tc.text }}>+R{extraServiceFee.toLocaleString()}</span></div>}
                    <div className="pt-3 border-t flex justify-between items-center" style={{ borderColor: tc.border }}>
                      <span className="font-['Poppins'] font-bold" style={{ color: tc.text }}>Balance Due</span>
                      <span className="font-['Poppins'] font-bold text-xl" style={{ color: balanceDue > 0 ? tc.accent : "#22c55e" }}>{balanceDue > 0 ? `R${balanceDue.toLocaleString()}` : "No Extra Charge"}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-sm"><span style={{ color: tc.text2 }}>Table Minimum Spend</span><span style={{ color: tc.text }}>R{tableMin.toLocaleString()}</span></div>
                    {addOns.map(a => <div key={a.id} className="flex justify-between text-sm"><span className="truncate pr-4" style={{ color: tc.text2 }}>{a.name}</span><span className="flex-shrink-0" style={{ color: tc.text }}>R{(a.price * a.qty).toLocaleString()}</span></div>)}
                    <div className="flex justify-between text-sm"><span style={{ color: tc.text2 }}>Service Fee (10%)</span><span style={{ color: tc.text }}>R{bookServiceFee.toLocaleString()}</span></div>
                    <div className="pt-3 border-t flex justify-between items-center" style={{ borderColor: tc.border }}>
                      <span className="font-['Poppins'] font-bold" style={{ color: tc.text }}>Total</span>
                      <span className="font-['Poppins'] font-bold text-xl" style={{ color: tc.accent }}>R{bookTotal.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </section>

            <div className="flex items-start gap-3 rounded-2xl p-4" style={{ background: `${tc.accent}08`, border: `1px solid ${tc.accent}28` }}>
              <Shield size={18} style={{ color: tc.accent }} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed" style={{ color: tc.text2 }}>A non-refundable deposit of <span className="font-bold" style={{ color: tc.text }}>R2,000</span> is required to confirm your booking.</p>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 backdrop-blur-xl border-t px-4 pt-4 pb-6" style={{ background: tc.navBg, borderColor: tc.border }}>
          <button onClick={handleProceed} className="w-full py-4 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2 mb-3 active:scale-[0.98] transition-transform" style={{ background: tc.accentGrad, boxShadow: `0 8px 28px ${tc.accentShadow}` }}>
            {isModify
              ? balanceDue > 0
                ? <><CreditCard size={18} /> Pay Extra: R{balanceDue.toLocaleString()}</>
                : <><Check size={18} /> Save Changes — No Extra Charge</>
              : <>Proceed to Payment <ChevronRight size={18} strokeWidth={3} /></>
            }
          </button>
          <div className="flex items-center justify-center gap-1.5"><Lock size={11} style={{ color: tc.muted }} /><span className="text-[11px]" style={{ color: tc.muted }}>Secure & Encrypted Checkout</span></div>
        </div>
      </div>
    );
  }

  const INFO_GRID = [
    { icon: Crown, label: "Dress Code", value: "Smart & Stylish" },
    { icon: Music, label: "Music", value: "Hip Hop, Amapiano" },
    { icon: Shield, label: "Age Limit", value: "21+" },
    { icon: Users, label: "Capacity", value: "800+ Guests" },
  ];

  return (
    <div className="h-screen font-['Inter'] overflow-y-auto scrollbar-none" style={{ background: tc.bg, color: tc.text }}>
      <div className="relative w-full" style={{ height: 280 }}>
        <img src="/__mockup/images/onyx.png" alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.9) 100%)" }} />
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 pt-6">
          <button onClick={() => navigate("clubs")} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center"><ArrowLeft size={20} className="text-white" /></button>
          <div className="flex gap-2">
            <button onClick={() => setLiked(l => !l)} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center"><Heart size={18} fill={liked ? GOLD : "none"} style={{ color: liked ? GOLD : "#fff" }} /></button>
            <button onClick={() => { const txt = "ONYX Sandton — SA's premier nightclub. Book VIP tables on SA PLUG!"; if (typeof navigator.share === "function") { navigator.share({ title: "Onyx Sandton", text: txt, url: window.location.href }).catch(() => {}); } else { navigator.clipboard?.writeText(txt); } }} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center"><Share2 size={18} className="text-white" /></button>
          </div>
        </div>
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-red-500 px-2.5 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-bold text-white tracking-wide">LIVE</span>
        </div>
      </div>
      <div className="px-5 pt-4 pb-10">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="font-['Poppins'] font-bold text-[22px] leading-tight" style={{ color: tc.text }}>Onyx Sandton</h1>
          <CheckCircle2 size={20} strokeWidth={2} style={{ color: tc.accentTeal }} />
        </div>
        <div className="flex items-center gap-2 mb-2 text-sm flex-wrap">
          <Star size={13} fill={GOLD} style={{ color: GOLD }} />
          <span className="font-bold" style={{ color: GOLD }}>4.8</span>
          <span style={{ color: tc.text3 }}>(1,245)</span>
          <span style={{ color: tc.border2 }}>•</span>
          <span style={{ color: tc.text2 }}>Open until <span className="font-semibold" style={{ color: tc.text }}>04:00</span></span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-sm" style={{ color: tc.text2 }}><MapPin size={13} /><span>Sandton, Johannesburg</span></div>
          <button className="text-xs font-bold" style={{ color: tc.accent }}>View on Map</button>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {["Nightclub", "Hip Hop", "Amapiano", "Live DJ"].map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium border" style={{ borderColor: tc.border, color: tc.text2, background: tc.tagBg }}>{tag}</span>
          ))}
        </div>
        <button onClick={() => setSubView("booking")} className="w-full py-4 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2 mb-3 active:scale-[0.98] transition-transform" style={{ background: tc.accentGrad, boxShadow: `0 8px 24px ${tc.accentShadow}` }}>
          <Calendar size={18} /> Book Table
        </button>
        <div className="flex gap-3 mb-7">
          <button onClick={() => setSubView("menu")} className="flex-1 py-3.5 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ borderColor: tc.border, background: tc.inputBg, color: tc.text }}>
            <UtensilsCrossed size={15} style={{ color: tc.accent }} /> Menu
          </button>
          <button className="flex-1 py-3.5 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ borderColor: tc.border, background: tc.inputBg, color: tc.text }}>
            <MapPin size={15} style={{ color: tc.accent }} /> Directions
          </button>
          <button onClick={() => setSubView("reviews")} className="flex-1 py-3.5 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ borderColor: tc.border, background: tc.inputBg, color: tc.text }}>
            <Star size={15} style={{ color: tc.accent }} /> Reviews
          </button>
        </div>
        <div className="mb-7">
          <h2 className="font-['Poppins'] font-bold text-base mb-2" style={{ color: tc.text }}>About Onyx Sandton</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: tc.text2 }}>Johannesburg's iconic nightlife destination. World-class DJs, premium sound and unforgettable energy every night of the week. Dress to impress.</p>
          <div className="grid grid-cols-2 gap-3">
            {INFO_GRID.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
                <div className="flex items-center gap-1.5 mb-1.5"><Icon size={13} style={{ color: tc.accent }} /><span className="text-[10px] uppercase tracking-wider" style={{ color: tc.muted }}>{label}</span></div>
                <p className="font-bold text-sm" style={{ color: tc.text }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-7">
          <h2 className="font-['Poppins'] font-bold text-base mb-3" style={{ color: tc.text }}>Location</h2>
          <MapPreview venue="ONYX SANDTON" address="Sandton City, Johannesburg" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>Gallery</h2>
            <button onClick={() => setSubView("gallery")} className="text-xs font-bold flex items-center gap-0.5" style={{ color: tc.accent }}>View all <ChevronRight size={13} /></button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {["/__mockup/images/onyx.png","/__mockup/images/hero.png","/__mockup/images/coco.png","/__mockup/images/zone6.png","/__mockup/images/kong.png"].map((src, i) => (
              <button key={i} onClick={() => setSubView("gallery")} className="w-[90px] h-[90px] rounded-xl overflow-hidden flex-shrink-0 border" style={{ borderColor: tc.border }}>
                <img src={src} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/__mockup/images/hero.png"; }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── TOURS SCREEN ─── */
function ToursScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [activeCat, setActiveCat] = useState(() => { const c = _pendingCat; _pendingCat = ""; return c || "All"; });
  const cats = ["All", "Safari", "City", "Wine", "Adventure", "Cultural"];
  const listRef = useRef<HTMLElement>(null);

  const viewAll = (cat = "All") => {
    setActiveCat(cat);
    setTimeout(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };
  const allTours = [
    { id: 10, name: "Sunset Safari Experience", loc: "Kruger National Park", price: 2900, rating: 4.8, dur: "3 Days", img: "/__mockup/images/tour-safari.jpg", cat: "Safari", reviews: 256 },
    { id: 11, name: "Cape Town City Tour", loc: "Cape Town", price: 950, rating: 4.6, dur: "Full Day", img: "/__mockup/images/tour-capetown.jpg", cat: "City", reviews: 128 },
    { id: 12, name: "Stellenbosch Wine Tour", loc: "Stellenbosch", price: 1250, rating: 4.7, dur: "Full Day", img: "/__mockup/images/tour-wine.jpg", cat: "Wine", reviews: 96 },
    { id: 13, name: "Garden Route Tour", loc: "Knysna, Western Cape", price: 1950, rating: 4.8, dur: "2 Days", img: "/__mockup/images/tour-capetown.jpg", cat: "Adventure", reviews: 112 },
    { id: 14, name: "Helicopter Tour", loc: "Cape Town", price: 4500, rating: 4.9, dur: "1 Hour", img: "/__mockup/images/tour-helicopter.jpg", cat: "Adventure", reviews: 89 },
    { id: 15, name: "Robben Island & History", loc: "Cape Town", price: 680, rating: 4.5, dur: "Half Day", img: "/__mockup/images/tour-capetown.jpg", cat: "Cultural", reviews: 204 },
    { id: 16, name: "Yacht Experience", loc: "V&A Waterfront", price: 3200, rating: 5.0, dur: "Half Day", img: "/__mockup/images/tour-yacht.jpg", cat: "Adventure", reviews: 67 },
    { id: 17, name: "Franschhoek Wine Tram", loc: "Franschhoek", price: 890, rating: 4.6, dur: "Full Day", img: "/__mockup/images/tour-wine.jpg", cat: "Wine", reviews: 143 },
  ];
  const filtered = activeCat === "All" ? allTours : allTours.filter(t => t.cat === activeCat);
  const banners: SlideItem[] = [
    { img: "/__mockup/images/tour-capetown.jpg", title: "Explore South Africa 🌍", subtitle: "Epic landscapes, vibrant cities and unforgettable moments.", cta: "Explore Tours", onCta: () => viewAll("All") },
    { img: "/__mockup/images/tour-safari.jpg", title: "Safari Experiences", subtitle: "Witness the Big Five in their natural habitat.", cta: "Book Safari", onCta: () => navigate("tourdetail") },
    { img: "/__mockup/images/tour-helicopter.jpg", title: "Sky High Adventures", subtitle: "Cape Town from above — breathtaking views.", cta: "View Details", onCta: () => navigate("tourdetail") },
    { img: "/__mockup/images/tour-wine.jpg", title: "Wine Country Tours", subtitle: "World-class wineries, scenic routes.", cta: "Explore Wine Tours", onCta: () => viewAll("Wine") },
  ];
  return (
    <div className="min-h-screen font-['Inter'] pb-24 overflow-y-auto" style={{ background: tc.bg, color: tc.text }}>
      <div className="px-4 pt-4 pb-3 flex justify-between items-center">
        <div><p className="text-xs" style={{ color: tc.text2 }}>Hi, Big Boy ✈</p><h1 className="font-['Poppins'] font-bold text-xl" style={{ color: tc.text }}>Book Tours</h1></div>
        <button onClick={() => navigate("profile-notifications")} className="w-10 h-10 rounded-full border relative flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><Bell size={18} /><span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" /></button>
      </div>
      <div className="px-4 mb-4">
        <AutoSlider slides={banners} height={200} interval={4500} />
      </div>
      {/* Category Filter */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-2 mb-5 scrollbar-none">
        {cats.map(c => (
          <button key={c} onClick={() => viewAll(c)} className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all active:scale-95"
            style={activeCat === c ? { background: tc.chipActiveBg, color: tc.chipActiveColor } : { background: tc.chipBg, color: tc.chipColor, border: `1px solid ${tc.border}` }}>{c}</button>
        ))}
      </div>
      {/* Featured */}
      <div className="px-4 mb-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>Featured Experience</h2>
          <button onClick={() => viewAll("All")} className="text-xs font-bold flex items-center gap-0.5" style={{ color: tc.accent }}>View all <ChevronRight size={13} /></button>
        </div>
        <div onClick={() => navigate("tourdetail")} className="relative rounded-2xl overflow-hidden cursor-pointer" style={{ height: 180 }}>
          <img src="/__mockup/images/tour-safari.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center"><Heart size={15} className="text-white" /></button>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <p className="font-['Poppins'] font-bold text-lg leading-tight text-white mb-1">Sunset Safari Experience</p>
            <p className="text-xs text-white/70 flex items-center gap-1 mb-2"><MapPin size={10} />Kruger National Park</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">From R2,900 pp</span>
              <button className="px-4 py-1.5 rounded-xl text-white text-xs font-bold" style={{ background: tc.accentGrad }}>View Details →</button>
            </div>
          </div>
          <div className="absolute bottom-14 left-4 flex gap-1">
            {[0,1,2,3,4].map(i => <div key={i} className="rounded-full" style={{ width: i===0?16:5, height: 5, background: i===0?tc.chipActiveBg:"rgba(255,255,255,0.4)" }} />)}
          </div>
        </div>
      </div>
      {/* Tour List */}
      <section ref={listRef} className="px-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>{activeCat === "All" ? "All Tours" : `${activeCat} Tours`}</h2>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${tc.accent}15`, color: tc.accent }}>{filtered.length} tours</span>
        </div>
        <div className="space-y-3">
          {filtered.map(t => (
            <div key={t.id} onClick={() => navigate("tourdetail")} className="flex gap-3 rounded-2xl overflow-hidden cursor-pointer" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <div className="w-24 h-24 flex-shrink-0 relative"><img src={t.img} alt="" className="absolute inset-0 w-full h-full object-cover" /></div>
              <div className="flex-1 py-3 pr-3">
                <h3 className="font-['Poppins'] font-bold text-sm mb-0.5" style={{ color: tc.text }}>{t.name}</h3>
                <p className="text-xs mb-0.5 flex items-center gap-1" style={{ color: tc.text2 }}><MapPin size={10} />{t.loc}</p>
                <div className="flex items-center gap-2 mb-2"><Star size={10} fill={GOLD} color={GOLD} /><span className="text-[10px] font-bold" style={{ color: GOLD }}>{t.rating}</span><span className="text-[10px]" style={{ color: tc.text3 }}>({t.reviews}) · {t.dur}</span></div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm" style={{ color: tc.accent }}>From R{t.price.toLocaleString()} pp</span>
                  <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white" style={{ background: tc.accentTeal }}>View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <BottomNav active="tours" navigate={navigate} />
    </div>
  );
}

/* ─── RESERVATIONS SCREEN ─── */
function ReservationsScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Past" | "Cancelled">("Upcoming");
  const [showCancelModal, setShowCancelModal] = useState<number | null>(null);
  const [cancelledIds, setCancelledIds] = useState<number[]>([]);

  const upcomingBase = [
    { id: 0, venue: "ONYX SANDTON", date: "Tonight, 10PM", guests: "Table for 4", pkg: "VIP Package", status: "CONFIRMED", color: "#22c55e" },
    { id: 1, venue: "CAPE TOWN TOUR", date: "Tomorrow 9AM", guests: "2 Guests", pkg: "Helicopter Tour", status: "CONFIRMED", color: "#22c55e" },
    { id: 2, venue: "COCO SANDTON", date: "Sat 25 May, 11PM", guests: "Table for 2", pkg: "Standard", status: "PENDING", color: "#f59e0b" },
    { id: 3, venue: "MARBLE RESTAURANT", date: "Sun 26 May, 7PM", guests: "Table for 2", pkg: "Fine Dining", status: "CONFIRMED", color: "#22c55e" },
  ];
  const past = [
    { id: 10, venue: "ONYX SANDTON", date: "10 Apr 2026", guests: "Table for 6", pkg: "VIP Package", status: "COMPLETED", color: "#B3B3B3" },
    { id: 11, venue: "SAFARI EXPERIENCE", date: "22 Mar 2026", guests: "4 Guests", pkg: "Luxury Safari", status: "COMPLETED", color: "#B3B3B3" },
    { id: 12, venue: "MARBLE RESTAURANT", date: "14 Feb 2026", guests: "Table for 2", pkg: "Valentine's Set", status: "COMPLETED", color: "#B3B3B3" },
    { id: 13, venue: "STELLENBOSCH WINE TOUR", date: "5 Jan 2026", guests: "2 Guests", pkg: "Wine & Dine", status: "COMPLETED", color: "#B3B3B3" },
  ];
  const cancelledStatic = [
    { id: 20, venue: "ZONE 6 VENUE", date: "1 Mar 2026", guests: "Table for 3", pkg: "Standard", status: "CANCELLED", color: "#ef4444" },
  ];

  const upcoming = upcomingBase.filter(b => !cancelledIds.includes(b.id));
  const cancelled = [...cancelledStatic, ...upcomingBase.filter(b => cancelledIds.includes(b.id)).map(b => ({ ...b, status: "CANCELLED", color: "#ef4444" }))];
  const bookings = activeTab === "Upcoming" ? upcoming : activeTab === "Past" ? past : cancelled;

  const confirmCancel = (id: number) => {
    setCancelledIds(prev => [...prev, id]);
    setShowCancelModal(null);
  };

  return (
    <div className="min-h-screen font-['Inter'] pb-24" style={{ background: tc.bg, color: tc.text }}>
      {/* Cancel Modal */}
      {showCancelModal !== null && (
        <CancelReasonModal
          venue={upcomingBase.find(b => b.id === showCancelModal)?.venue ?? "booking"}
          fee="20%"
          refund="80% of total"
          onKeep={() => setShowCancelModal(null)}
          onConfirm={() => confirmCancel(showCancelModal)}
        />
      )}
      <div className="px-4 pt-4 pb-3">
        <h1 className="font-['Poppins'] font-bold text-2xl mb-0.5" style={{ color: tc.text }}>My Reservations</h1>
        <p className="text-xs mb-4" style={{ color: tc.text2 }}>Upcoming & past bookings</p>
        <div className="flex gap-2 mb-5">
          {(["Upcoming", "Past", "Cancelled"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="px-4 py-2 rounded-full text-xs font-bold transition-all"
              style={{ background: activeTab === tab ? tc.accent : tc.tagBg, color: activeTab === tab ? "#fff" : tc.text2, border: activeTab === tab ? "none" : `1px solid ${tc.border}` }}>
              {tab}{tab === "Cancelled" && cancelled.length > 0 ? ` (${cancelled.length})` : ""}
            </button>
          ))}
        </div>
        {bookings.length === 0 ? (
          <div className="text-center py-12" style={{ color: tc.muted }}>
            <Calendar size={36} className="mx-auto mb-3" /><p className="font-bold text-sm">No {activeTab.toLowerCase()} bookings</p>
            {activeTab === "Upcoming" && <button onClick={() => navigate("clubs")} className="mt-3 text-xs font-bold" style={{ color: tc.accent }}>Browse Venues</button>}
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {bookings.map((b, i) => (
              <div key={i} className="rounded-2xl p-4" style={{ background: tc.card, border: `1px solid ${b.status === "CANCELLED" ? "rgba(239,68,68,0.3)" : tc.border}` }}>
                <div className="flex justify-between items-start mb-2">
                  <div><h3 className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>{b.venue}</h3><p className="text-xs mt-0.5" style={{ color: tc.text2 }}>{b.date}</p></div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: `${b.color}20`, color: b.color }}>{b.status}</span>
                </div>
                <div className="flex items-center gap-3 text-xs mb-3" style={{ color: tc.text2 }}>
                  <span className="flex items-center gap-1"><Users size={10} />{b.guests}</span><span>• {b.pkg}</span>
                </div>
                {b.status !== "CANCELLED" && b.status !== "COMPLETED" ? (
                  <div className="flex gap-2">
                    <button onClick={() => navigate("bookingdetail")} className="flex-1 py-2 rounded-xl text-xs font-bold border" style={{ borderColor: tc.accent, color: tc.accent }}>View Details</button>
                    <button onClick={() => navigate("bookingdetail")} className="flex-1 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1" style={{ background: tc.accentGrad }}><QrCode size={12} />QR Code</button>
                    <button onClick={() => setShowCancelModal(b.id)} className="px-3 py-2 rounded-xl text-xs font-bold border border-red-500/30 text-red-400 bg-red-500/5">Cancel</button>
                  </div>
                ) : b.status === "COMPLETED" ? (
                  <div className="flex gap-2">
                    <button onClick={() => navigate("bookingdetail")} className="flex-1 py-2 rounded-xl text-xs font-bold border" style={{ borderColor: tc.border, color: tc.text2 }}>Receipt</button>
                    <button onClick={() => navigate("clubs")} className="flex-1 py-2 rounded-xl text-xs font-bold border" style={{ borderColor: tc.accent, color: tc.accent }}>Rebook</button>
                  </div>
                ) : (
                  <button onClick={() => navigate("clubs")} className="w-full py-2 rounded-xl text-xs font-bold border" style={{ borderColor: tc.accent, color: tc.accent }}>Book Similar Venue</button>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Quick Book</p>
        <div className="grid grid-cols-2 gap-3">
          {[{ icon: Music, label: "Club Table", to: "clubs" }, { icon: Palmtree, label: "Tour", to: "tours" }, { icon: UtensilsCrossed, label: "Dining", to: "dining" }, { icon: Calendar, label: "Event Tickets", to: "home" }].map((q, i) => (
            <button key={i} onClick={() => navigate(q.to as Screen)} className="rounded-2xl p-4 flex flex-col items-center gap-2" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <q.icon size={24} style={{ color: tc.accent }} /><span className="text-xs font-bold" style={{ color: tc.text }}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>
      <BottomNav active="reservations" navigate={navigate} />
    </div>
  );
}

/* ─── SHOP SCREEN ─── */
const SHOP_PRODUCTS = [
  { id: 20, name: "SA PLUG Hoodie", price: 699, rating: 4.8, reviews: 128, cat: "Merchandise", emoji: "👕", desc: "Premium comfort. Iconic vibes.", sizes: ["S","M","L","XL"] },
  { id: 21, name: "SA PLUG Tee", price: 349, rating: 4.6, reviews: 94, cat: "Merchandise", emoji: "👕", desc: "Soft-touch premium cotton.", sizes: ["S","M","L","XL","XXL"] },
  { id: 22, name: "SA PLUG Cap", price: 299, rating: 4.7, reviews: 76, cat: "Merchandise", emoji: "🧢", desc: "Snapback. Embroidered logo.", sizes: ["One Size"] },
  { id: 31, name: "SA PLUG Bomber Jacket", price: 1299, rating: 4.9, reviews: 58, cat: "Merchandise", emoji: "🧥", desc: "Limited edition. Premium satin.", sizes: ["S","M","L","XL"] },
  { id: 32, name: "SA PLUG Joggers", price: 549, rating: 4.5, reviews: 67, cat: "Merchandise", emoji: "👖", desc: "Ultra-soft lounge wear.", sizes: ["S","M","L","XL","XXL"] },
  { id: 33, name: "SA PLUG Snapback", price: 249, rating: 4.6, reviews: 43, cat: "Merchandise", emoji: "🎩", desc: "Flat brim. Gold logo. Clean.", sizes: ["One Size"] },
  { id: 34, name: "SA PLUG Socks 3-Pack", price: 199, rating: 4.4, reviews: 82, cat: "Merchandise", emoji: "🧦", desc: "Premium comfort. Branded.", sizes: ["One Size"] },
  { id: 23, name: "Dom Pérignon Champagne", price: 1200, rating: 4.9, reviews: 55, cat: "Drinks", emoji: "🍾", desc: "Vintage brut champagne.", sizes: [] },
  { id: 24, name: "SA PLUG Vodka", price: 950, rating: 4.7, reviews: 43, cat: "Drinks", emoji: "🍶", desc: "Ultra-premium distilled vodka.", sizes: [] },
  { id: 25, name: "Premium Whiskey", price: 1100, rating: 4.8, reviews: 38, cat: "Drinks", emoji: "🥃", desc: "12-year aged single malt.", sizes: [] },
  { id: 35, name: "Moët & Chandon Rosé", price: 890, rating: 4.8, reviews: 61, cat: "Drinks", emoji: "🍷", desc: "Iconic rosé champagne.", sizes: [] },
  { id: 36, name: "Hennessy VSOP 750ml", price: 1350, rating: 4.9, reviews: 47, cat: "Drinks", emoji: "🍶", desc: "Rich cognac. Deep notes.", sizes: [] },
  { id: 37, name: "Craft Gin Bundle", price: 680, rating: 4.5, reviews: 29, cat: "Drinks", emoji: "🌿", desc: "SA craft gins. 2-bottle set.", sizes: [] },
  { id: 38, name: "Wine Connoisseur Set", price: 750, rating: 4.6, reviews: 33, cat: "Drinks", emoji: "🍷", desc: "Curated Stellenbosch wines. 3 bottles.", sizes: [] },
  { id: 26, name: "VIP Bottle Package", price: 2500, rating: 4.9, reviews: 89, cat: "Packages", emoji: "🎁", desc: "Skip the line. Own the night.", sizes: [] },
  { id: 27, name: "Premium Experience", price: 3800, rating: 4.9, reviews: 62, cat: "Packages", emoji: "⭐", desc: "VIP table, 3 bottles, host.", sizes: [] },
  { id: 39, name: "Birthday VIP Package", price: 5500, rating: 4.9, reviews: 44, cat: "Packages", emoji: "🎂", desc: "Cake, confetti, bottles, table.", sizes: [] },
  { id: 40, name: "Couple's Night Out", price: 1800, rating: 4.7, reviews: 71, cat: "Packages", emoji: "💑", desc: "Champagne, flowers, private booth.", sizes: [] },
  { id: 41, name: "Squad Night Package", price: 4200, rating: 4.8, reviews: 53, cat: "Packages", emoji: "🥂", desc: "Up to 8 guests. VIP area + 4 bottles.", sizes: [] },
  { id: 42, name: "Corporate Hospitality", price: 8500, rating: 4.9, reviews: 27, cat: "Packages", emoji: "🏢", desc: "Full venue buyout. Catering included.", sizes: [] },
  { id: 28, name: "Gift Card", price: 250, rating: 4.8, reviews: 201, cat: "Accessories", emoji: "🎴", desc: "Give the gift of luxury.", sizes: ["R250","R500","R1000"] },
  { id: 29, name: "SA PLUG Tote Bag", price: 280, rating: 4.5, reviews: 47, cat: "Accessories", emoji: "👜", desc: "Premium canvas. Branded.", sizes: [] },
  { id: 30, name: "VIP Wristband Pack", price: 120, rating: 4.6, reviews: 33, cat: "Accessories", emoji: "⌚", desc: "3-pack. Exclusive events access.", sizes: [] },
  { id: 43, name: "Phone Wallet Case", price: 349, rating: 4.5, reviews: 56, cat: "Accessories", emoji: "📱", desc: "Leather. Card slots. SA PLUG branded.", sizes: ["iPhone","Android Universal"] },
  { id: 44, name: "SA PLUG Keyring", price: 89, rating: 4.4, reviews: 94, cat: "Accessories", emoji: "🔑", desc: "Metal. Engraved logo.", sizes: [] },
  { id: 45, name: "Luxury Scented Candle", price: 420, rating: 4.7, reviews: 38, cat: "Accessories", emoji: "🕯️", desc: "Hand-poured. Oud & amber.", sizes: [] },
  { id: 46, name: "SA PLUG Sticker Pack", price: 49, rating: 4.3, reviews: 113, cat: "Accessories", emoji: "🏷️", desc: "10 premium vinyl stickers.", sizes: [] },
];

function ShopScreen({ navigate, addToCart }: { navigate: (s: Screen) => void; addToCart: (i: Omit<CartItem,"qty">) => void }) {
  const tc = useTC();
  const [activeCat, setActiveCat] = useState("All");
  const [added, setAdded] = useState<number[]>([]);
  const [featuredSize, setFeaturedSize] = useState("");
  const [featuredSizeError, setFeaturedSizeError] = useState(false);
  const cats = ["All", "Merchandise", "Drinks", "Packages", "Accessories"];
  const banners: SlideItem[] = [
    { img: "/__mockup/images/hero.png", title: "Elevate Your Night.", subtitle: "Official Merchandise & Premium Drinks.", cta: "Shop Now", onCta: () => setActiveCat("All") },
    { img: "/__mockup/images/onboard-1.png", title: "VIP Packages 🎁", subtitle: "Skip the line. Own the experience.", cta: "View Packages", onCta: () => setActiveCat("Packages") },
    { img: "/__mockup/images/tour-wine.jpg", title: "Premium Drinks", subtitle: "Champagne, Vodka, Whiskey & more.", cta: "Browse Drinks", onCta: () => setActiveCat("Drinks") },
  ];
  const filtered = activeCat === "All" ? SHOP_PRODUCTS : SHOP_PRODUCTS.filter(p => p.cat === activeCat);
  const featured = SHOP_PRODUCTS[0];

  return (
    <div className="min-h-screen font-['Inter'] pb-24 overflow-y-auto" style={{ background: tc.bg, color: tc.text }}>
      <div className="px-4 pt-4 pb-3 flex justify-between items-center">
        <h1 className="font-['Poppins'] font-bold text-2xl" style={{ color: tc.text }}>Shop</h1>
        <button onClick={() => navigate("profile-notifications")} className="w-10 h-10 rounded-full border relative flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><Bell size={18} /><span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" /></button>
      </div>
      {/* Search */}
      <div className="flex gap-2 px-4 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
          <input placeholder="Search products, drinks, and more..." onClick={() => navigate("search")} readOnly
            className="w-full rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none cursor-pointer" style={{ background: tc.card, border: `1px solid ${tc.border}`, color: tc.text }} />
        </div>
        <button className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0" style={{ background: tc.card, borderColor: tc.border, color: tc.text2 }}><Filter size={16} /></button>
      </div>
      {/* Banner Slider */}
      <div className="px-4 mb-4">
        <AutoSlider slides={banners} height={170} interval={5000} />
      </div>
      {/* Flash Sale */}
      <div className="px-4 mb-4">
        <button onClick={() => navigate("deals")} className="w-full rounded-2xl p-4 flex items-center justify-between" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-red-400" />
            <div className="text-left"><p className="text-[10px] mb-0.5" style={{ color: tc.text2 }}>FLASH SALE — up to 40% OFF</p><p className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>Ends in <span style={{ color: tc.accent }}>02:45:30</span></p></div>
          </div>
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold text-white" style={{ background: tc.accentGrad }}>View Deals</span>
        </button>
      </div>
      {/* Category Tabs */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {cats.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all"
            style={activeCat === c ? { background: tc.chipActiveBg, color: tc.chipActiveColor } : { background: tc.chipBg, color: tc.chipColor, border: `1px solid ${tc.border}` }}>{c}</button>
        ))}
      </div>
      {/* Featured Product */}
      {activeCat === "All" && (
        <div className="px-4 mb-5">
          <p className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Featured Product</p>
          <div onClick={() => { _selectedProductId = featured.id; navigate("shopdetail"); }} className="rounded-2xl p-4 flex gap-4 cursor-pointer" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0" style={{ background: tc.card2 }}>{featured.emoji}</div>
            <div className="flex-1">
              <p className="font-['Poppins'] font-bold text-base mb-1" style={{ color: tc.text }}>{featured.name}</p>
              <p className="text-xs mb-2" style={{ color: tc.text2 }}>{featured.desc}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg" style={{ color: tc.accent }}>R{featured.price}</span>
                <div className="flex items-center gap-1"><Star size={11} fill={GOLD} style={{ color: GOLD }} /><span className="text-xs font-bold" style={{ color: GOLD }}>{featured.rating}</span><span className="text-xs" style={{ color: tc.text3 }}>({featured.reviews})</span></div>
              </div>
              {featured.sizes.length > 0 && (
                <div className="flex gap-1.5 mb-2" onClick={e => e.stopPropagation()}>
                  {featured.sizes.slice(0,3).map(s => (
                    <button key={s} onClick={e => { e.stopPropagation(); setFeaturedSize(s); setFeaturedSizeError(false); }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded border transition-all"
                      style={{
                        borderColor: featuredSize === s ? tc.accent : featuredSizeError ? "rgba(239,68,68,0.5)" : tc.border,
                        color: featuredSize === s ? tc.accent : featuredSizeError ? "#ef4444" : tc.text2,
                        background: featuredSize === s ? `${tc.accent}10` : "transparent"
                      }}>{s}</button>
                  ))}
                </div>
              )}
              {featuredSizeError && <p className="text-[10px] text-red-400 mb-1.5">Please select a size first</p>}
              <button onClick={e => {
                e.stopPropagation();
                if (featured.sizes.length > 0 && !featuredSize) { setFeaturedSizeError(true); return; }
                addToCart({ id: featured.id, name: `${featured.name}${featuredSize ? ` (${featuredSize})` : ""}`, price: featured.price, venue: "SA PLUG Shop" });
                setAdded(prev => [...prev, featured.id]);
                setTimeout(() => setAdded(prev => prev.filter(id => id !== featured.id)), 2000);
                setFeaturedSize("");
              }}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-all active:scale-95"
                style={{ background: added.includes(featured.id) ? "#22c55e" : tc.accentGrad }}>
                {added.includes(featured.id) ? <><Check size={14} />Added!</> : <><Plus size={14} /> Add to Cart</>}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Product Grid */}
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <p className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>{activeCat === "All" ? "Best Sellers" : activeCat}</p>
          <span className="text-xs" style={{ color: tc.text2 }}>{filtered.length} items</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {filtered.map(p => {
            const isAdded = added.includes(p.id);
            return (
              <div key={p.id} onClick={() => { _selectedProductId = p.id; navigate("shopdetail"); }} className="rounded-2xl overflow-hidden cursor-pointer active:scale-[0.97] transition-transform" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
                <div className="h-24 flex items-center justify-center text-4xl" style={{ background: tc.card2 }}>{p.emoji}</div>
                <div className="p-2.5">
                  <p className="font-['Poppins'] font-bold text-[10px] leading-tight mb-1" style={{ color: tc.text }}>{p.name}</p>
                  <div className="flex items-center gap-1 mb-1.5"><Star size={8} fill={GOLD} style={{ color: GOLD }} /><span className="text-[9px] font-bold" style={{ color: GOLD }}>{p.rating}</span></div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs" style={{ color: tc.accent }}>R{p.price}</span>
                    {p.sizes.length > 0 ? (
                      <button onClick={e => { e.stopPropagation(); _selectedProductId = p.id; navigate("shopdetail"); }}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded border" style={{ borderColor: tc.accent, color: tc.accent }}>
                        Size
                      </button>
                    ) : (
                      <button onClick={e => { e.stopPropagation(); addToCart({ id: p.id, name: p.name, price: p.price, venue: "SA PLUG Shop" }); setAdded(prev => [...prev, p.id]); setTimeout(() => setAdded(prev => prev.filter(id => id !== p.id)), 2000); }}
                        className="w-6 h-6 rounded-lg flex items-center justify-center transition-all active:scale-90"
                        style={{ background: isAdded ? "rgba(34,197,94,0.2)" : tc.accentTeal }}>
                        {isAdded ? <Check size={10} className="text-green-400" /> : <Plus size={11} className="text-white" strokeWidth={3} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav active="shop" navigate={navigate} />
    </div>
  );
}

/* ─── SHOP DETAIL SCREEN ─── */
function ShopDetailScreen({ navigate, addToCart }: { navigate: (s: Screen) => void; addToCart: (i: Omit<CartItem,"qty">) => void }) {
  const tc = useTC();
  const { goBack } = useNav();
  const p = SHOP_PRODUCTS.find(x => x.id === _selectedProductId) || SHOP_PRODUCTS[0];
  const [liked, setLiked] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const needsSize = p.sizes.length > 0;
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);
  const shopReviews = [
    { name: "Mpho K.", rating: 5, date: "3 days ago", text: "Absolutely love it! Premium quality and the design is fire. Got so many compliments wearing this out." },
    { name: "Thandeka L.", rating: 4, date: "1 week ago", text: "Great hoodie, super comfortable. Sizing runs a bit large so I'd recommend going down a size." },
    { name: "Sipho N.", rating: 5, date: "2 weeks ago", text: "Top quality product. Arrived quickly and packaging was premium." },
  ];
  return (
    <div ref={scrollRef} className="h-screen font-['Inter'] overflow-y-auto scrollbar-none" style={{ background: tc.bg, color: tc.text }}>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 sticky top-0 backdrop-blur-md z-10 border-b" style={{ background: tc.headerBg, borderColor: tc.border }}>
        <button onClick={goBack} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={20} /></button>
        <h1 className="font-['Poppins'] font-bold text-lg flex-1" style={{ color: tc.text }}>Product Details</h1>
        <button onClick={() => setLiked(l => !l)}><Heart size={22} fill={liked ? GOLD : "none"} style={{ color: liked ? GOLD : tc.text2 }} /></button>
      </div>
      <div className="h-64 flex items-center justify-center text-8xl mb-2" style={{ background: tc.card2 }}>{p.emoji}</div>
      <div className="px-5 py-4 pb-40 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-['Poppins'] font-bold text-xl" style={{ color: tc.text }}>{p.name}</h2>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: `${tc.accentTeal}15`, color: tc.accentTeal, border: `1px solid ${tc.accentTeal}50` }}>In Stock</span>
          </div>
          <p className="text-sm mb-2" style={{ color: tc.text2 }}>{p.desc}</p>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} size={13} fill={i<=Math.round(p.rating)?GOLD:"none"} style={{ color: GOLD }} />)}</div>
            <span className="font-bold text-sm" style={{ color: GOLD }}>{p.rating}</span>
            <span className="text-sm" style={{ color: tc.text2 }}>({p.reviews} reviews)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-['Poppins'] font-bold text-3xl" style={{ color: tc.accent }}>R{p.price}</span>
          <span className="text-sm line-through" style={{ color: tc.muted }}>R{Math.round(p.price * 1.25)}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">-20%</span>
        </div>
        {needsSize && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="font-bold text-sm" style={{ color: sizeError ? "#ef4444" : tc.text }}>Size</p>
              {sizeError && <span className="text-xs text-red-400 font-medium">— please select a size</span>}
            </div>
            <div className="flex gap-2 flex-wrap">
              {p.sizes.map(s => (
                <button key={s} onClick={() => { setSelectedSize(s); setSizeError(false); }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95"
                  style={{
                    background: selectedSize === s ? tc.accent : sizeError ? "rgba(239,68,68,0.05)" : tc.inputBg,
                    color: selectedSize === s ? "#fff" : sizeError ? "#ef4444" : tc.text2,
                    borderColor: selectedSize === s ? tc.accent : sizeError ? "rgba(239,68,68,0.5)" : tc.border
                  }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="font-bold text-sm mb-2" style={{ color: tc.text }}>Quantity</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><Minus size={16} /></button>
            <span className="font-['Poppins'] font-bold text-xl w-8 text-center" style={{ color: tc.text }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: tc.accentGrad }}><Plus size={16} className="text-white" /></button>
          </div>
        </div>
        <div>
          <p className="font-bold text-sm mb-3" style={{ color: tc.text }}>Reviews</p>
          <ReviewsSection rating={p.rating} count={p.reviews} reviews={shopReviews} purchased={PURCHASED_PRODUCT_IDS.has(p.id)} />
        </div>
        <div>
          <p className="font-bold text-sm mb-3" style={{ color: tc.text }}>You May Also Like</p>
          <div className="flex gap-3 overflow-x-auto scrollbar-none">
            {SHOP_PRODUCTS.filter(x => x.id !== p.id).slice(0, 5).map(rel => (
              <button key={rel.id} onClick={() => { _selectedProductId = rel.id; navigate("shopdetail"); }} className="flex-shrink-0 w-28 rounded-2xl overflow-hidden text-left active:scale-95 transition-transform" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
                <div className="h-20 flex items-center justify-center text-3xl" style={{ background: tc.card2 }}>{rel.emoji}</div>
                <div className="p-2"><p className="font-bold text-[9px] leading-tight mb-1" style={{ color: tc.text }}>{rel.name}</p><p className="font-bold text-[10px]" style={{ color: tc.accent }}>R{rel.price}</p></div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 backdrop-blur-xl border-t" style={{ background: tc.navBg, borderColor: tc.border }}>
        <div className="flex items-center justify-between mb-3">
          <div><p className="text-xs" style={{ color: tc.text2 }}>Total ({qty} item{qty > 1 ? "s" : ""})</p><p className="font-['Poppins'] font-bold text-xl" style={{ color: tc.accent }}>R{(p.price * qty).toLocaleString()}</p></div>
        </div>
        <button
          onClick={() => {
            if (needsSize && !selectedSize) { setSizeError(true); return; }
            addToCart({ id: p.id, name: `${p.name}${selectedSize ? ` (${selectedSize})` : ""}`, price: p.price * qty, venue: "SA PLUG Shop" });
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="w-full py-4 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ background: added ? "#22c55e" : tc.accentGrad, boxShadow: `0 8px 28px ${tc.accentShadow}` }}>
          {added ? <><CheckCircle2 size={18} /> Added to Cart!</> : <><ShoppingCart size={18} /> Add to Cart{needsSize && !selectedSize ? " — Select Size" : ""}</>}
        </button>
      </div>
    </div>
  );
}

/* ─── PROFILE SCREEN ─── */
function ProfileScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const menu = [
    { icon: Calendar, label: "My Bookings", to: "profile-bookings" as Screen },
    { icon: Heart, label: "Saved Venues", to: "profile-saved" as Screen },
    { icon: CreditCard, label: "Payment Methods", to: "profile-payment" as Screen },
    { icon: Bell, label: "Notifications", to: "profile-notifications" as Screen },
    { icon: Crown, label: "VIP Membership", to: "profile-vip" as Screen },
    { icon: Settings, label: "Settings", to: "profile-settings" as Screen },
    { icon: HelpCircle, label: "Help & Support", to: "profile-help" as Screen },
  ];
  return (
    <div className="min-h-screen font-['Inter'] pb-24 overflow-y-auto" style={{ background: tc.bg, color: tc.text }}>
      <div className="relative pt-16 pb-6 px-4 flex flex-col items-center" style={{ background: tc.isDark ? "radial-gradient(ellipse at top,rgba(212,175,55,0.2) 0%,transparent 60%)" : "radial-gradient(ellipse at top,rgba(108,79,187,0.1) 0%,transparent 60%)" }}>
        <div className="relative flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 overflow-hidden mb-3 bg-white" style={{ borderColor: tc.isDark ? GOLD : tc.accent, boxShadow: `0 0 25px ${tc.isDark ? "rgba(212,175,55,0.4)" : `${tc.accent}40`}` }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=BigBoy" alt="Big Boy" className="w-full h-full object-cover" />
            </div>
            <button onClick={() => navigate("profile-edit")} className="absolute bottom-3 right-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: tc.isDark ? GOLD : tc.accent }}><Camera size={13} className="text-white" /></button>
          </div>
          <h1 className="font-['Poppins'] font-bold text-2xl mb-1" style={{ color: tc.text }}>Big Boy</h1>
          <p className="text-xs mb-2" style={{ color: tc.text2 }}>bigboy@saplug.co.za · +27 76 123 4567</p>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold mb-1" style={{ color: tc.isDark ? GOLD : tc.accent, borderColor: tc.isDark ? GOLD : tc.accent, background: tc.isDark ? `${GOLD}12` : `${tc.accent}12` }}><Crown size={12} />VIP Member</div>
          <div className="flex items-center gap-1"><Star size={12} fill={GOLD} color={GOLD} /><span className="text-xs" style={{ color: tc.isDark ? GOLD : tc.accent }}>4.9 Top Member</span></div>
        </div>
      </div>
      <div className="px-4">
        <div className="rounded-2xl p-4 mb-4" style={{ border: `1px solid ${tc.isDark ? GOLD : tc.accent}40`, background: tc.isDark ? `linear-gradient(135deg,${GOLD}18,${GOLD}06)` : `linear-gradient(135deg,${tc.accent}10,${tc.accentTeal}08)` }}>
          <div className="flex justify-between items-start mb-3">
            <div><p className="text-[10px] mb-0.5" style={{ color: tc.text2 }}>MEMBERSHIP STATUS</p><p className="font-['Poppins'] font-bold" style={{ color: tc.isDark ? GOLD : tc.accent }}>GOLD VIP MEMBER</p></div>
            <Crown size={24} style={{ color: tc.isDark ? GOLD : tc.accent }} />
          </div>
          <div className="flex justify-between text-xs mb-3" style={{ color: tc.text2 }}><span>Member since 2022</span><span className="font-bold" style={{ color: tc.isDark ? GOLD : tc.accent }}>12,450 pts</span></div>
          <button onClick={() => navigate("profile-vip")} className="w-full py-2.5 rounded-xl text-xs font-bold border" style={{ borderColor: tc.isDark ? GOLD : tc.accent, color: tc.isDark ? GOLD : tc.accent }}>UPGRADE TO PLATINUM</button>
        </div>
        <div className="flex gap-3 mb-5">
          {[{ label: "Bookings", val: 47, to: "profile-bookings" as Screen }, { label: "Reviews", val: 23, to: "profile-help" as Screen }, { label: "Saved", val: 18, to: "profile-saved" as Screen }].map((s, i) => (
            <button key={i} onClick={() => navigate(s.to)} className="flex-1 rounded-2xl p-3 text-center border" style={{ background: tc.card, borderColor: tc.border }}>
              <p className="font-['Poppins'] font-bold text-xl" style={{ color: tc.accent }}>{s.val}</p>
              <p className="text-[10px]" style={{ color: tc.text2 }}>{s.label}</p>
            </button>
          ))}
        </div>
        <div className="space-y-2 mb-4">
          {menu.map(({ icon: Icon, label, to }, i) => (
            <button key={i} onClick={() => navigate(to)} className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 border" style={{ background: tc.card, borderColor: tc.border }}>
              <Icon size={18} style={{ color: tc.accent }} />
              <span className="flex-1 text-left text-sm font-medium" style={{ color: tc.text }}>{label}</span>
              <ChevronRight size={16} style={{ color: tc.text3 }} />
            </button>
          ))}
        </div>
        <button onClick={() => navigate("welcome")} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-500/30 text-red-400 text-sm font-bold bg-red-500/5">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
      <BottomNav active="profile" navigate={navigate} />
    </div>
  );
}

/* ─── PROFILE SUB-SCREEN WRAPPER ─── */
function ProfileSubScreen({ title, children }: { title: string; navigate?: (s: Screen) => void; children: React.ReactNode; back?: Screen }) {
  const tc = useTC();
  const { goBack } = useNav();
  return (
    <div className="min-h-screen font-['Inter'] pb-10" style={{ background: tc.bg, color: tc.text }}>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 sticky top-0 backdrop-blur-md z-10 border-b" style={{ background: tc.headerBg, borderColor: tc.border }}>
        <button onClick={goBack} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={20} /></button>
        <h1 className="font-['Poppins'] font-bold text-xl" style={{ color: tc.text }}>{title}</h1>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

/* ─── PROFILE EDIT ─── */
function ProfileEdit({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [name, setName] = useState("Big Boy");
  const [email, setEmail] = useState("bigboy@saplug.co.za");
  const [phone, setPhone] = useState("+27 76 123 4567");
  const [bio, setBio] = useState("Nightlife enthusiast. Cape Town adventures. VIP experiences.");
  const [saved, setSaved] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=BigBoy");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) setPhotoUrl(ev.target.result as string); };
    reader.readAsDataURL(file);
  };
  return (
    <ProfileSubScreen title="Edit Profile" navigate={navigate}>
      <div className="flex flex-col items-center mb-6">
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 overflow-hidden bg-white" style={{ borderColor: tc.isDark ? GOLD : tc.accent }}>
            <img src={photoUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2" style={{ background: tc.isDark ? GOLD : tc.accent, borderColor: tc.bg }}><Camera size={14} className="text-white" /></button>
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="mt-2 text-xs font-bold" style={{ color: tc.accent }}>Change Photo</button>
      </div>
      <div className="space-y-4 mb-6">
        {[
          { label: "Full Name", value: name, set: setName, type: "text", icon: User },
          { label: "Email Address", value: email, set: setEmail, type: "email", icon: Mail },
          { label: "Phone Number", value: phone, set: setPhone, type: "tel", icon: Phone },
        ].map(({ label, value, set, type, icon: Icon }) => (
          <div key={label}>
            <p className="text-xs font-bold mb-1.5" style={{ color: tc.text2 }}>{label}</p>
            <div className="relative rounded-2xl border px-4 py-3 flex items-center gap-3" style={{ background: tc.card, borderColor: tc.border }}>
              <Icon size={16} style={{ color: tc.accent }} />
              <input type={type} value={value} onChange={e => set(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" style={{ color: tc.text }} />
              <Edit3 size={14} style={{ color: tc.muted }} />
            </div>
          </div>
        ))}
        <div>
          <p className="text-xs font-bold mb-1.5" style={{ color: tc.text2 }}>Bio</p>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none resize-none" style={{ background: tc.card, borderColor: tc.border, color: tc.text }} />
        </div>
      </div>
      {saved && <div className="flex items-center gap-2 rounded-xl p-3 mb-4" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}><CheckCircle2 size={16} className="text-green-400" /><span className="text-sm font-bold text-green-400">Profile saved successfully!</span></div>}
      <button onClick={() => setSaved(true)} className="w-full py-4 rounded-2xl font-bold text-white text-[15px]" style={{ background: tc.accentGrad, boxShadow: `0 8px 24px ${tc.accentShadow}` }}>Save Changes</button>
    </ProfileSubScreen>
  );
}

/* ─── PROFILE PASSWORD ─── */
function ProfilePassword({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showC, setShowC] = useState(false);
  const [showN, setShowN] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [saved, setSaved] = useState(false);
  const strength = newPw.length === 0 ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 : 3;
  const colors = ["", "#ef4444", "#f59e0b", "#22c55e"];
  const labels = ["", "Weak", "Medium", "Strong"];
  return (
    <ProfileSubScreen title="Change Password" navigate={navigate}>
      <div className="space-y-4 mb-6">
        {[
          { label: "Current Password", value: current, set: setCurrent, show: showC, setShow: setShowC },
          { label: "New Password", value: newPw, set: setNewPw, show: showN, setShow: setShowN },
          { label: "Confirm New Password", value: confirm, set: setConfirm, show: showCf, setShow: setShowCf },
        ].map(({ label, value, set, show, setShow }) => (
          <div key={label}>
            <p className="text-xs font-bold mb-1.5" style={{ color: tc.text2 }}>{label}</p>
            <div className="relative rounded-2xl border px-4 flex items-center" style={{ background: tc.card, borderColor: tc.border }}>
              <Lock size={16} style={{ color: tc.accent }} className="mr-3 flex-shrink-0" />
              <input type={show ? "text" : "password"} value={value} onChange={e => set(e.target.value)} className="flex-1 bg-transparent py-3.5 text-sm outline-none" style={{ color: tc.text }} />
              <button onClick={() => setShow(!show)} style={{ color: tc.muted }}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>
        ))}
        {newPw.length > 0 && (
          <div>
            <div className="flex gap-1 mb-1">
              {[1,2,3].map(i => <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= strength ? colors[strength] : tc.border }} />)}
            </div>
            <p className="text-xs font-bold" style={{ color: colors[strength] }}>Password Strength: {labels[strength]}</p>
          </div>
        )}
        <div className="rounded-xl p-3" style={{ background: `${tc.accent}08`, border: `1px solid ${tc.accent}28` }}>
          <p className="text-xs font-bold mb-1" style={{ color: tc.accent }}>Password Requirements</p>
          {["At least 8 characters", "One uppercase letter", "One number or symbol"].map((req, i) => (
            <p key={i} className="text-[11px] flex items-center gap-1.5" style={{ color: tc.text2 }}><Check size={10} style={{ color: tc.accent }} />{req}</p>
          ))}
        </div>
      </div>
      {saved && <div className="flex items-center gap-2 rounded-xl p-3 mb-4" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}><CheckCircle2 size={16} className="text-green-400" /><span className="text-sm font-bold text-green-400">Password changed successfully!</span></div>}
      <button onClick={() => setSaved(true)} className="w-full py-4 rounded-2xl font-bold text-white text-[15px]" style={{ background: tc.accentGrad, boxShadow: `0 8px 24px ${tc.accentShadow}` }}>Update Password</button>
    </ProfileSubScreen>
  );
}

/* ─── PROFILE PRIVACY ─── */
function ProfilePrivacy({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [settings, setSettings] = useState({
    profileVisible: true, activityStatus: true, locationSharing: false,
    dataAnalytics: true, marketingEmails: false, thirdPartySharing: false,
  });
  const toggle = (key: keyof typeof settings) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const items = [
    { key: "profileVisible" as const, label: "Profile Visibility", sub: "Allow others to find your profile" },
    { key: "activityStatus" as const, label: "Activity Status", sub: "Show when you're active" },
    { key: "locationSharing" as const, label: "Location Sharing", sub: "Share location for venue discovery" },
    { key: "dataAnalytics" as const, label: "Usage Analytics", sub: "Help improve the app experience" },
    { key: "marketingEmails" as const, label: "Marketing Emails", sub: "Receive promotional content" },
    { key: "thirdPartySharing" as const, label: "Third Party Data Sharing", sub: "Share data with partner venues" },
  ];
  return (
    <ProfileSubScreen title="Privacy Settings" navigate={navigate}>
      <div className="rounded-2xl p-4 mb-4" style={{ background: `${tc.accent}08`, border: `1px solid ${tc.accent}28` }}>
        <div className="flex items-start gap-3"><Shield size={18} style={{ color: tc.accent }} className="flex-shrink-0 mt-0.5" /><p className="text-sm" style={{ color: tc.text2 }}>SA PLUG processes your data in accordance with <span style={{ color: tc.accent }}>POPIA</span> regulations. You control what you share.</p></div>
      </div>
      <div className="space-y-3 mb-5">
        {items.map(({ key, label, sub }) => (
          <div key={key} className="rounded-2xl p-4 flex items-center gap-3 border" style={{ background: tc.card, borderColor: tc.border }}>
            <div className="flex-1"><p className="font-bold text-sm" style={{ color: tc.text }}>{label}</p><p className="text-xs" style={{ color: tc.text2 }}>{sub}</p></div>
            <button onClick={() => toggle(key)} className="w-12 h-6 rounded-full relative transition-all flex-shrink-0" style={{ background: settings[key] ? tc.accent : tc.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: settings[key] ? "28px" : "4px" }} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("legal-privacy")} className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 border mb-3" style={{ background: tc.card, borderColor: tc.border }}>
        <Shield size={16} style={{ color: tc.accent }} /><span className="flex-1 text-left text-sm font-medium" style={{ color: tc.text }}>Privacy Policy</span><ChevronRight size={16} style={{ color: tc.text3 }} />
      </button>
      <button className="w-full py-3.5 rounded-2xl border border-red-500/30 text-red-400 text-sm font-bold bg-red-500/5">Delete My Data</button>
    </ProfileSubScreen>
  );
}

/* ─── OTHER PROFILE SCREENS ─── */
function ProfileBookings({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const bookings = [
    { venue: "ONYX SANDTON", date: "24 May 2026 · 10PM", status: "CONFIRMED", color: "#22c55e" },
    { venue: "Helicopter Tour", date: "25 May 2026 · 9AM", status: "CONFIRMED", color: "#22c55e" },
    { venue: "COCO SANDTON", date: "31 May 2026 · 11PM", status: "PENDING", color: "#f59e0b" },
    { venue: "Safari Experience", date: "15 Jun 2026 · 6AM", status: "UPCOMING", color: "#3b82f6" },
    { venue: "Marble Restaurant", date: "20 Jun 2026 · 7PM", status: "UPCOMING", color: "#3b82f6" },
  ];
  return (
    <ProfileSubScreen title="My Bookings" navigate={navigate}>
      <div className="space-y-3">
        {bookings.map((b, i) => (
          <button key={i} onClick={() => navigate("bookingdetail")} className="w-full flex items-center gap-3 rounded-2xl p-4 text-left border" style={{ background: tc.card, borderColor: tc.border }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${b.color}20` }}><Calendar size={18} style={{ color: b.color }} /></div>
            <div className="flex-1"><p className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>{b.venue}</p><p className="text-xs" style={{ color: tc.text2 }}>{b.date}</p></div>
            <div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full block mb-1" style={{ background: `${b.color}20`, color: b.color }}>{b.status}</span>
              <QrCode size={16} style={{ color: tc.text3 }} className="mx-auto" />
            </div>
          </button>
        ))}
      </div>
    </ProfileSubScreen>
  );
}

function ProfileSaved({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const saved = [
    { name: "ONYX SANDTON", area: "Sandton", rating: 4.8, img: "/__mockup/images/hero.png" },
    { name: "COCO SANDTON", area: "Sandton", rating: 4.7, img: "/__mockup/images/welcome-bg.png" },
    { name: "ZONE 6 VENUE", area: "Soweto", rating: 4.6, img: "/__mockup/images/onboard-1.png" },
    { name: "Marble Restaurant", area: "Sandton", rating: 4.8, img: "/__mockup/images/auth-bg.png" },
    { name: "Rooftop by Luma", area: "Sandton City", rating: 4.7, img: "/__mockup/images/tour-wine.jpg" },
  ];
  return (
    <ProfileSubScreen title="Saved Venues" navigate={navigate}>
      <div className="space-y-3">
        {saved.map((item, i) => (
          <button key={i} onClick={() => navigate("clubdetail")} className="flex gap-3 w-full rounded-2xl overflow-hidden border" style={{ background: tc.card, borderColor: tc.border }}>
            <div className="relative w-20 h-20 flex-shrink-0"><img src={item.img} alt="" className="absolute inset-0 w-full h-full object-cover" /></div>
            <div className="flex-1 py-3 text-left">
              <p className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>{item.name}</p>
              <p className="text-xs mb-2" style={{ color: tc.text2 }}>{item.area}</p>
              <div className="flex items-center gap-1"><Star size={10} fill={GOLD} color={GOLD} /><span className="text-[10px] font-bold" style={{ color: GOLD }}>{item.rating}</span></div>
            </div>
            <div className="flex items-center pr-3"><Heart size={18} fill={GOLD} color={GOLD} /></div>
          </button>
        ))}
      </div>
    </ProfileSubScreen>
  );
}

function ProfilePayment({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [cards, setCards] = useState([
    { type: "Visa", last: "4521", exp: "12/27", primary: true },
    { type: "Mastercard", last: "8832", exp: "06/26", primary: false },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saved, setSaved] = useState(false);

  const formatCardNum = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };
  const detectType = (num: string) => {
    const n = num.replace(/\s/g, "");
    if (n.startsWith("4")) return "Visa";
    if (n.startsWith("5") || n.startsWith("2")) return "Mastercard";
    if (n.startsWith("3")) return "Amex";
    return "Card";
  };

  const handleSave = () => {
    if (!cardNum || !cardName || !expiry || !cvv) return;
    const last = cardNum.replace(/\s/g, "").slice(-4);
    const type = detectType(cardNum);
    setCards(prev => [...prev, { type, last, exp: expiry, primary: false }]);
    setSaved(true);
    setTimeout(() => {
      setShowForm(false);
      setSaved(false);
      setCardNum(""); setCardName(""); setExpiry(""); setCvv("");
    }, 1200);
  };

  const inputStyle = { background: tc.inputBg, border: `1px solid ${tc.border}`, color: tc.text };

  return (
    <ProfileSubScreen title="Payment Methods" navigate={navigate}>
      <div className="space-y-3 mb-5">
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl p-4 border" style={{ background: tc.card, borderColor: c.primary ? GOLD : tc.border }}>
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-bold" style={{ color: tc.text }}>{c.type} •••• {c.last}</div>
              {c.primary && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${GOLD}20`, color: GOLD }}>PRIMARY</span>}
            </div>
            <div className="flex justify-between text-xs" style={{ color: tc.text2 }}>
              <span>Expires {c.exp}</span>
              <button onClick={() => setCards(prev => prev.filter((_, j) => j !== i))} className="text-red-400 font-bold">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2" style={{ background: tc.accentGrad }}>
          <Plus size={16} /> Add New Card
        </button>
      ) : (
        <div className="rounded-2xl p-4 border space-y-3" style={{ background: tc.card, borderColor: tc.accent }}>
          <div className="flex justify-between items-center mb-1">
            <p className="font-['Poppins'] font-bold text-sm" style={{ color: tc.text }}>New Card Details</p>
            <button onClick={() => { setShowForm(false); setCardNum(""); setCardName(""); setExpiry(""); setCvv(""); }} style={{ color: tc.text3 }}><X size={18} /></button>
          </div>

          {/* Card preview strip */}
          <div className="rounded-xl p-4 mb-1" style={{ background: tc.accentGrad, minHeight: 56 }}>
            <p className="text-white/60 text-[10px] font-semibold tracking-widest mb-1">CARD NUMBER</p>
            <p className="text-white font-bold text-base tracking-widest font-mono">
              {cardNum || "•••• •••• •••• ••••"}
            </p>
            <div className="flex justify-between mt-2">
              <div>
                <p className="text-white/60 text-[9px] tracking-widest">CARD HOLDER</p>
                <p className="text-white text-xs font-bold uppercase">{cardName || "YOUR NAME"}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-[9px] tracking-widest">EXPIRES</p>
                <p className="text-white text-xs font-bold">{expiry || "MM/YY"}</p>
              </div>
            </div>
          </div>

          <input
            value={cardNum}
            onChange={e => setCardNum(formatCardNum(e.target.value))}
            placeholder="Card Number"
            inputMode="numeric"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none font-mono tracking-wider"
            style={inputStyle}
          />
          <input
            value={cardName}
            onChange={e => setCardName(e.target.value.toUpperCase())}
            placeholder="Cardholder Name"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={inputStyle}
          />
          <div className="flex gap-3">
            <input
              value={expiry}
              onChange={e => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              inputMode="numeric"
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
            <input
              value={cvv}
              onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="CVV"
              inputMode="numeric"
              type="password"
              className="w-24 rounded-xl px-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!cardNum || !cardName || !expiry || !cvv}
            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: saved ? "rgba(34,197,94,0.9)" : (!cardNum || !cardName || !expiry || !cvv) ? tc.border : tc.accentGrad,
              color: "white",
              opacity: (!cardNum || !cardName || !expiry || !cvv) && !saved ? 0.5 : 1,
            }}>
            {saved ? <><Check size={15} /> Card Saved!</> : <><Lock size={14} /> Save Card Securely</>}
          </button>
          <p className="text-center text-[10px]" style={{ color: tc.text3 }}>🔒 Your card details are encrypted and secure</p>
        </div>
      )}
    </ProfileSubScreen>
  );
}

function ProfileNotifications({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [settings, setSettings] = useState({ bookings: true, deals: true, events: false, messages: true, promo: false, vip: true });
  const items = [
    { key: "bookings" as const, label: "Booking Confirmations", sub: "Get notified about your reservations" },
    { key: "deals" as const, label: "Flash Deals & Offers", sub: "Never miss a limited-time deal" },
    { key: "events" as const, label: "Upcoming Events", sub: "Events happening near you" },
    { key: "messages" as const, label: "Messages", sub: "SA PLUG and venue messages" },
    { key: "promo" as const, label: "Promotions", sub: "Marketing and promotional content" },
    { key: "vip" as const, label: "VIP Alerts", sub: "Exclusive member-only notifications" },
  ];
  return (
    <ProfileSubScreen title="Notifications" navigate={navigate}>
      <div className="space-y-3">
        {items.map(({ key, label, sub }) => (
          <div key={key} className="rounded-2xl p-4 flex items-center gap-3 border" style={{ background: tc.card, borderColor: tc.border }}>
            <div className="flex-1"><p className="font-bold text-sm" style={{ color: tc.text }}>{label}</p><p className="text-xs" style={{ color: tc.text2 }}>{sub}</p></div>
            <button onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key] }))} className="w-12 h-6 rounded-full relative transition-all flex-shrink-0" style={{ background: settings[key] ? tc.accent : tc.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: settings[key] ? "28px" : "4px" }} />
            </button>
          </div>
        ))}
      </div>
    </ProfileSubScreen>
  );
}

function ProfileVIP({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const tiers = [
    {
      name: "GOLD", label: "Gold Member", pts: "0 – 15,000", price: "Free",
      color: "#D4AF37", icon: "🥇",
      perks: ["Priority bookings", "5% cashback on all bookings", "Free table upgrades", "Early event access"],
    },
    {
      name: "PLATINUM", label: "Platinum Member", pts: "15,001 – 50,000", price: "R299/mo",
      color: "#E5E4E2", icon: "💎",
      perks: ["10% cashback on all bookings", "Free VIP entry ×4/month", "Dedicated SA PLUG support", "Airport lounge access"],
    },
    {
      name: "BLACK", label: "Black Card Member", pts: "50,001+", price: "R799/mo",
      color: "#1a1a1a", icon: "🖤",
      perks: ["20% cashback on all bookings", "Unlimited VIP entry", "Private jet charter access", "Personal relationship manager"],
    },
  ];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payProcessing, setPayProcessing] = useState(false);
  const [payDone, setPayDone] = useState(false);
  const cards = [{ type: "Visa", last: "4521", exp: "12/27" }, { type: "Mastercard", last: "8832", exp: "06/26" }];
  const [selectedCard, setSelectedCard] = useState(0);

  const handleUpgrade = () => {
    if (selectedIdx === null) return;
    const tier = tiers[selectedIdx];
    if (tier.price === "Free") {
      setCurrentIdx(selectedIdx);
      setSelectedIdx(null);
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 3000);
    } else {
      setShowPayModal(true);
    }
  };

  const handlePayConfirm = () => {
    if (selectedIdx === null) return;
    setPayProcessing(true);
    setTimeout(() => {
      setPayProcessing(false);
      setPayDone(true);
      setTimeout(() => {
        setCurrentIdx(selectedIdx!);
        setSelectedIdx(null);
        setConfirmed(true);
        setShowPayModal(false);
        setPayDone(false);
        setTimeout(() => setConfirmed(false), 3000);
      }, 1200);
    }, 1800);
  };

  const ptsByTier = [12450, 32800, 67200];
  const maxByTier = [15000, 50000, 99999];
  const pct = Math.min(100, Math.round((ptsByTier[currentIdx] / maxByTier[currentIdx]) * 100));
  /* Use gold in dark mode, accent (purple) in light mode — throughout this screen */
  const vipGold = tc.isDark ? GOLD : tc.accent;
  const vipGoldBg = tc.isDark ? `${GOLD}12` : `${tc.accent}10`;
  const vipGoldBorder = tc.isDark ? `${GOLD}40` : `${tc.accent}35`;
  const vipGoldCircle = tc.isDark ? `${GOLD}20` : `${tc.accent}18`;
  const vipGoldShadowLg = tc.isDark ? "rgba(212,175,55,0.2)" : `rgba(108,79,187,0.15)`;
  const vipGoldShadowSm = tc.isDark ? "rgba(212,175,55,0.12)" : `rgba(108,79,187,0.1)`;
  const vipProgressBar = tc.isDark ? `linear-gradient(90deg, ${GOLD}, #C9A000)` : `linear-gradient(90deg, ${tc.accent}, ${tc.accentTeal})`;

  return (
    <ProfileSubScreen title="VIP Membership" navigate={navigate}>
      {/* Current status card */}
      <div className="rounded-2xl p-4 mb-5" style={{ background: vipGoldBg, border: `1px solid ${vipGoldBorder}` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: vipGoldCircle }}>{tiers[currentIdx].icon}</div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tc.text3 }}>Active Tier</p>
            <p className="font-['Poppins'] font-bold text-base" style={{ color: vipGold }}>{tiers[currentIdx].label}</p>
          </div>
          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: vipGold }}>ACTIVE</span>
        </div>
        <p className="text-xs font-bold mb-1" style={{ color: tc.text2 }}>LOYALTY POINTS</p>
        <p className="font-['Poppins'] font-bold text-3xl mb-2" style={{ color: vipGold }}>{ptsByTier[currentIdx].toLocaleString()} pts</p>
        <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: tc.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: vipProgressBar }} />
        </div>
        <p className="text-xs" style={{ color: tc.text2 }}>{pct}% to next tier</p>
      </div>

      {confirmed && (
        <div className="flex items-center gap-3 rounded-2xl p-3 mb-4" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
          <p className="text-sm font-bold text-green-400">Membership upgraded to {tiers[currentIdx].name}!</p>
        </div>
      )}

      {/* Tier selection */}
      <p className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Choose Your Tier</p>
      <div className="space-y-3 mb-5">
        {tiers.map((t, i) => {
          const isCurrent = i === currentIdx;
          const isSelected = i === selectedIdx;
          return (
            <button key={i} onClick={() => !isCurrent && setSelectedIdx(isSelected ? null : i)}
              className="w-full rounded-2xl p-4 border text-left transition-all active:scale-[0.98]"
              style={{
                borderColor: isCurrent ? vipGold : isSelected ? vipGold : tc.border,
                background: isCurrent ? vipGoldBg : isSelected ? (tc.isDark ? `${GOLD}08` : `${tc.accent}08`) : tc.card,
                boxShadow: isCurrent ? `0 0 20px ${vipGoldShadowLg}` : isSelected ? `0 0 12px ${vipGoldShadowSm}` : "none",
              }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{t.icon}</span>
                <div className="flex-1">
                  <p className="font-['Poppins'] font-bold text-sm" style={{ color: vipGold }}>{t.name}</p>
                  <p className="text-[10px]" style={{ color: tc.text3 }}>{t.pts} points</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm" style={{ color: tc.text }}>{t.price}</p>
                  {isCurrent
                    ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white inline-block mt-1" style={{ background: vipGold }}>CURRENT</span>
                    : <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ml-auto" style={{ borderColor: isSelected ? vipGold : tc.border, background: isSelected ? vipGold : "transparent" }}>
                        {isSelected && <Check size={10} className="text-white" />}
                      </div>
                  }
                </div>
              </div>
              <div className="space-y-1">
                {t.perks.map((p, j) => (
                  <p key={j} className="text-xs flex items-center gap-2" style={{ color: tc.text2 }}>
                    <Check size={11} style={{ color: vipGold, flexShrink: 0 }} />{p}
                  </p>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Upgrade CTA */}
      {selectedIdx !== null && selectedIdx !== currentIdx && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: `${tc.accent}08`, border: `1px solid ${tc.accent}30` }}>
          <p className="text-sm font-bold mb-1" style={{ color: tc.text }}>
            Upgrading to <span style={{ color: tc.accent }}>{tiers[selectedIdx].name}</span>
          </p>
          <p className="text-xs mb-3" style={{ color: tc.text2 }}>
            {tiers[selectedIdx].price === "Free" ? "No charge — enjoy your free tier." : `You will be billed ${tiers[selectedIdx].price}. Cancel anytime.`}
          </p>
          <button onClick={handleUpgrade}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm active:scale-95 transition-transform"
            style={{ background: tc.accentGrad, boxShadow: `0 6px 20px ${tc.accentShadow}` }}>
            {tiers[selectedIdx].price === "Free" ? `Confirm Free Upgrade` : `Proceed to Payment →`}
          </button>
        </div>
      )}

      <p className="text-xs text-center" style={{ color: tc.muted }}>Membership billed monthly · Cancel anytime · Points carry over</p>

      {/* VIP Payment Modal */}
      {showPayModal && selectedIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-sm rounded-t-3xl p-6 pb-10" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: tc.border2 }} />
            {payDone ? (
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mb-3">
                  <CheckCircle2 size={32} className="text-green-400" />
                </div>
                <p className="font-['Poppins'] font-bold text-lg text-green-400">Payment Successful!</p>
                <p className="text-xs mt-1" style={{ color: tc.text2 }}>Activating your {tiers[selectedIdx].name} membership…</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: vipGoldCircle }}>{tiers[selectedIdx].icon}</div>
                  <div>
                    <p className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>{tiers[selectedIdx].label}</p>
                    <p className="text-xs" style={{ color: tc.text2 }}>Billed monthly · Cancel anytime</p>
                  </div>
                  <p className="ml-auto font-['Poppins'] font-bold text-lg" style={{ color: tc.accent }}>{tiers[selectedIdx].price}</p>
                </div>
                <p className="text-xs font-bold mb-2" style={{ color: tc.text }}>Select Payment Card</p>
                <div className="space-y-2 mb-5">
                  {cards.map((c, i) => (
                    <button key={i} onClick={() => setSelectedCard(i)} className="w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all" style={{ background: selectedCard === i ? `${tc.accent}08` : tc.inputBg, border: `1.5px solid ${selectedCard === i ? tc.accent : tc.border}` }}>
                      <CreditCard size={18} style={{ color: selectedCard === i ? tc.accent : tc.text2 }} />
                      <span className="flex-1 text-left text-sm font-medium" style={{ color: tc.text }}>{c.type} •••• {c.last}</span>
                      <span className="text-xs" style={{ color: tc.text3 }}>{c.exp}</span>
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: selectedCard === i ? tc.accent : tc.border2 }}>
                        {selectedCard === i && <div className="w-2 h-2 rounded-full" style={{ background: tc.accent }} />}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handlePayConfirm}
                  disabled={payProcessing}
                  className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                  style={{ background: tc.accentGrad, boxShadow: `0 6px 20px ${tc.accentShadow}`, opacity: payProcessing ? 0.7 : 1 }}>
                  {payProcessing ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Processing…</>
                  ) : (
                    <><Lock size={15} /> Pay {tiers[selectedIdx].price} Now</>
                  )}
                </button>
                <button onClick={() => setShowPayModal(false)} className="w-full mt-3 py-3 text-sm font-medium" style={{ color: tc.text3 }}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </ProfileSubScreen>
  );
}

function ProfileSettings({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const theme = useContext(ThemeCtx);
  const setTheme = useContext(SetThemeCtx);
  const lang = useContext(LangCtx);
  const setLang = useContext(SetLangCtx);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState<"password" | "confirm">("password");
  const [deletePw, setDeletePw] = useState("");
  const [showDeletePw, setShowDeletePw] = useState(false);
  const currentLang = LANGS.find(l => l.code === lang) || LANGS[0];
  return (
    <ProfileSubScreen title="Settings" navigate={navigate}>
      <div className="space-y-3">
        {/* Theme Toggle */}
        <div className="rounded-2xl px-4 py-3.5 flex items-center gap-3 border" style={{ background: tc.card, borderColor: tc.border }}>
          {theme === 'dark' ? <Moon size={18} style={{ color: tc.accent }} /> : <Sun size={18} style={{ color: tc.accent }} />}
          <div className="flex-1 text-left"><p className="font-bold text-sm" style={{ color: tc.text }}>Appearance</p><p className="text-xs" style={{ color: tc.text2 }}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p></div>
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="w-12 h-6 rounded-full relative transition-all flex-shrink-0" style={{ background: theme === 'light' ? tc.accent : "rgba(255,255,255,0.15)" }}>
            <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all" style={{ left: theme === 'light' ? '28px' : '4px' }} />
          </button>
        </div>
        {/* Language */}
        <div className="rounded-2xl overflow-hidden border" style={{ background: tc.card, borderColor: tc.border }}>
          <button onClick={() => setShowLangPicker(s => !s)} className="w-full flex items-center gap-3 px-4 py-3.5">
            <Globe size={18} style={{ color: tc.accent }} />
            <div className="flex-1 text-left"><p className="font-bold text-sm" style={{ color: tc.text }}>Language</p><p className="text-xs" style={{ color: tc.text2 }}>{currentLang.flag} {currentLang.label}</p></div>
            <ChevronDown size={16} style={{ color: tc.text2, transform: showLangPicker ? "rotate(180deg)" : "none" }} />
          </button>
          {showLangPicker && (
            <div style={{ borderTop: `1px solid ${tc.border}` }}>
              {LANGS.map(l => (
                <button key={l.code} onClick={() => { setLang(l.code); setShowLangPicker(false); }} className="w-full flex items-center gap-3 px-4 py-3 border-b last:border-0" style={{ background: lang === l.code ? `${tc.accent}12` : "transparent", borderColor: tc.border }}>
                  <span className="text-lg">{l.flag}</span>
                  <div className="flex-1 text-left"><p className="text-sm font-bold" style={{ color: tc.text }}>{l.label}</p><p className="text-xs" style={{ color: tc.text3 }}>{l.native}</p></div>
                  {lang === l.code && <Check size={14} style={{ color: tc.accent }} />}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Account */}
        <p className="font-['Poppins'] font-bold text-xs uppercase tracking-wider pt-1 pb-1" style={{ color: tc.text3 }}>Account</p>
        {[
          { label: "Edit Profile", sub: "Name, photo, bio", icon: User, to: "profile-edit" as Screen },
          { label: "Change Password", sub: "Update your password", icon: Key, to: "profile-password" as Screen },
          { label: "Privacy Settings", sub: "Data and visibility", icon: Shield, to: "profile-privacy" as Screen },
        ].map(({ label, sub, icon: Icon, to }, i) => (
          <button key={i} onClick={() => navigate(to)} className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 border" style={{ background: tc.card, borderColor: tc.border }}>
            <Icon size={16} style={{ color: tc.accent }} />
            <div className="flex-1 text-left"><p className="font-bold text-sm" style={{ color: tc.text }}>{label}</p><p className="text-xs" style={{ color: tc.text2 }}>{sub}</p></div>
            <ChevronRight size={16} style={{ color: tc.text3 }} />
          </button>
        ))}
        {/* Legal */}
        <p className="font-['Poppins'] font-bold text-xs uppercase tracking-wider pt-1 pb-1" style={{ color: tc.text3 }}>Legal</p>
        {[
          { label: "Terms & Conditions", sub: "App usage rules & policies", to: "legal-terms" },
          { label: "Privacy Policy", sub: "How we handle your data (POPIA)", to: "legal-privacy" },
          { label: "Refund Policy", sub: "Cancellations and refunds", to: "legal-refund" },
          { label: "Payment Terms", sub: "Accepted methods & disputes", to: "legal-payment" },
          { label: "Partner Disclaimer", sub: "Venue independence notice", to: "legal-disclaimer" },
        ].map(({ label, sub, to }, i) => (
          <button key={i} onClick={() => navigate(to as Screen)} className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 border" style={{ background: tc.card, borderColor: tc.border }}>
            <Shield size={16} style={{ color: tc.accent }} />
            <div className="flex-1 text-left">
              <p className="font-bold text-sm" style={{ color: tc.text }}>{label}</p>
              <p className="text-xs" style={{ color: tc.text2 }}>{sub}</p>
            </div>
            <ChevronRight size={16} style={{ color: tc.text3 }} />
          </button>
        ))}
        {/* Danger */}
        <p className="font-['Poppins'] font-bold text-xs uppercase tracking-wider pt-1 pb-1" style={{ color: tc.text3 }}>Danger Zone</p>
        <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 border border-red-500/20 bg-red-500/5">
          <div className="flex-1 text-left"><p className="font-bold text-sm text-red-400">Delete Account</p><p className="text-xs" style={{ color: tc.text2 }}>Permanently remove your account and all data</p></div>
          <ChevronRight size={16} className="text-red-400/50" />
        </button>
      </div>
      {/* Delete Account Modal — two-step */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}>
          <div className="w-full max-w-sm rounded-3xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            {deleteStep === "password" ? (
              <>
                <button onClick={() => setShowDeleteModal(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: tc.inputBg }}><X size={14} style={{ color: tc.text2 }} /></button>
                <div className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-4"><Lock size={26} className="text-red-400" /></div>
                <h2 className="font-['Poppins'] font-bold text-lg text-center mb-1" style={{ color: tc.text }}>Confirm Your Identity</h2>
                <p className="text-xs text-center mb-5 leading-relaxed" style={{ color: tc.text2 }}>Enter your password to continue with account deletion</p>
                <div className="relative mb-4">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
                  <input type={showDeletePw ? "text" : "password"} value={deletePw} onChange={e => setDeletePw(e.target.value)} placeholder="Enter your password"
                    className="w-full rounded-2xl py-3.5 pl-11 pr-11 text-sm outline-none" style={{ background: tc.inputBg, border: `1px solid ${tc.border}`, color: tc.text }} />
                  <button onClick={() => setShowDeletePw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: tc.muted }}>{showDeletePw ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3.5 rounded-2xl font-bold text-sm border" style={{ borderColor: tc.border, color: tc.text, background: tc.inputBg }}>Cancel</button>
                  <button onClick={() => { if (deletePw.length >= 4) setDeleteStep("confirm"); }} className="flex-1 py-3.5 rounded-2xl font-bold text-sm" style={{ background: deletePw.length >= 4 ? "rgba(239,68,68,0.85)" : tc.inputBg, color: deletePw.length >= 4 ? "#fff" : tc.muted }}>Continue</button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4"><Trash2 size={30} className="text-red-400" /></div>
                <h2 className="font-['Poppins'] font-bold text-xl text-center mb-2" style={{ color: tc.text }}>Delete Account?</h2>
                <p className="text-sm text-center mb-4 leading-relaxed" style={{ color: tc.text2 }}>This will permanently delete your account, bookings, and all personal data. This action <span className="font-bold text-red-400">cannot be undone</span>.</p>
                <div className="rounded-xl p-3 mb-5" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                  <p className="text-xs font-bold text-red-400 text-center">⚠️ 12,450 loyalty points will be lost forever</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setDeleteStep("password"); setDeletePw(""); setShowDeleteModal(false); }} className="flex-1 py-3.5 rounded-2xl font-bold text-sm border" style={{ borderColor: tc.border, color: tc.text, background: tc.inputBg }}>Keep Account</button>
                  <button onClick={() => { setShowDeleteModal(false); setDeleteStep("password"); setDeletePw(""); navigate("welcome"); }} className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-red-500 text-white">Delete Forever</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </ProfileSubScreen>
  );
}

function ProfileHelp({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "How do I cancel a booking?", a: "Go to My Reservations, tap on the booking, and select Cancel Booking. Cancellations made 24h+ in advance receive an 80% refund." },
    { q: "How does VIP bottle service work?", a: "When you book a VIP table, you can pre-order bottles from our menu. Your dedicated host will deliver them to your table upon arrival." },
    { q: "Can I transfer my booking?", a: "Yes! Tap View Details on your booking and use the Share QR Code option to transfer to another person." },
    { q: "How do I earn points?", a: "You earn 1 point per R1 spent on bookings. Bonus points are awarded for reviews, referrals, and special promotions." },
    { q: "What is the promo code?", a: "Use SAPVIP10 for 10% off, PLUG20 for R200 off, or GOLD15 for 15% off your next booking." },
    { q: "How do I contact a venue directly?", a: "Tap on any venue and use the Chat option. You can also contact us via SA PLUG Support chat available 24/7." },
  ];
  return (
    <ProfileSubScreen title="Help & Support" navigate={navigate}>
      <button onClick={() => navigate("chat")} className="w-full flex items-center gap-3 rounded-2xl p-4 mb-5" style={{ background: `${tc.accent}08`, border: `1px solid ${tc.accent}30` }}>
        <MessageCircle size={22} style={{ color: tc.accent }} />
        <div className="flex-1 text-left"><p className="font-bold text-sm" style={{ color: tc.text }}>SA PLUG Help Center</p><p className="text-xs" style={{ color: tc.text2 }}>Available 24/7 · Avg reply: 2 mins</p></div>
        <ChevronRight size={16} style={{ color: tc.accent }} />
      </button>
      <p className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>FAQ</p>
      <div className="space-y-2">
        {faqs.map(({ q, a }, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border" style={{ background: tc.card, borderColor: tc.border }}>
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4">
              <span className="font-bold text-sm text-left flex-1" style={{ color: tc.text }}>{q}</span>
              <ChevronDown size={16} style={{ color: tc.text2, transform: open === i ? "rotate(180deg)" : "none" }} />
            </button>
            {open === i && <p className="text-sm px-4 pb-4 leading-relaxed" style={{ color: tc.text2 }}>{a}</p>}
          </div>
        ))}
      </div>
    </ProfileSubScreen>
  );
}

/* ─── DINING SCREEN ─── */
function DiningScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [activeCat, setActiveCat] = useState(() => { const c = _pendingCat; _pendingCat = ""; return c || "All"; });
  const gridRef = useRef<HTMLDivElement>(null);

  const viewAll = (cat = "All") => {
    setActiveCat(cat);
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };
  const cats = [
    { label: "All", emoji: "🍽️" },
    { label: "Fine Dining", emoji: "🥂" },
    { label: "Rooftop", emoji: "🌆" },
    { label: "African", emoji: "🌍" },
    { label: "Brunch", emoji: "☕" },
    { label: "Date Night", emoji: "🕯️" },
  ];
  const allRestaurants = [
    { name: "Marble", type: "Fine Dining", price: "From R1,200", rating: 4.8, reviews: 320, cats: ["Fine Dining", "Date Night"], img: "/__mockup/images/hero.png" },
    { name: "Saint", type: "Lounge", price: "From R900", rating: 4.6, reviews: 215, cats: ["Date Night"], img: "/__mockup/images/coco.png" },
    { name: "The Grillhouse", type: "Steakhouse", price: "From R1,100", rating: 4.6, reviews: 298, cats: ["Fine Dining"], img: "/__mockup/images/onyx.png" },
    { name: "Flames", type: "Contemporary", price: "From R800", rating: 4.5, reviews: 187, cats: ["Fine Dining", "Date Night"], img: "/__mockup/images/zone6.png" },
    { name: "Rooftop by Luma", type: "Rooftop", price: "From R1,500", rating: 4.7, reviews: 320, cats: ["Rooftop", "Date Night"], img: "/__mockup/images/tour-wine.jpg" },
    { name: "Moyo Melrose Arch", type: "African Cuisine", price: "From R600", rating: 4.4, reviews: 445, cats: ["African"], img: "/__mockup/images/tour-capetown.jpg" },
    { name: "Tashas Bryanston", type: "Brunch", price: "From R350", rating: 4.5, reviews: 512, cats: ["Brunch"], img: "/__mockup/images/onboard-1.png" },
    { name: "La Colombe", type: "French Fine Dining", price: "From R2,200", rating: 4.9, reviews: 189, cats: ["Fine Dining", "Date Night"], img: "/__mockup/images/tour-wine.jpg" },
  ];
  const filtered = activeCat === "All" ? allRestaurants : allRestaurants.filter(r => r.cats.includes(activeCat));
  const banners: SlideItem[] = [
    { img: "/__mockup/images/tour-capetown.jpg", title: "Discover Exceptional Dining", subtitle: "Handpicked restaurants. Unforgettable flavors.", cta: "Explore Now", onCta: () => viewAll("All") },
    { img: "/__mockup/images/tour-wine.jpg", title: "Fine Dining Experiences 🍷", subtitle: "World-class cuisine. Premium ambiance.", cta: "Reserve Table", onCta: () => navigate("restaurantdetail") },
    { img: "/__mockup/images/onyx.png", title: "Rooftop Dining 🌆", subtitle: "Panoramic views. Signature cocktails.", cta: "Book Now", onCta: () => navigate("restaurantdetail") },
  ];
  return (
    <div className="min-h-screen font-['Inter'] overflow-y-auto pb-24" style={{ background: tc.bg, color: tc.text }}>
      <div className="px-4 pt-5 pb-3 flex justify-between items-center">
        <div><p className="text-xs mb-0.5" style={{ color: tc.text2 }}>Hi, Big Boy ✈</p><h1 className="font-['Poppins'] font-bold text-xl" style={{ color: tc.text }}>Discover Dining</h1></div>
        <button onClick={() => navigate("profile-notifications")} className="w-10 h-10 rounded-full border relative flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><Bell size={18} /><span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" /></button>
      </div>
      <div className="px-4 mb-4">
        <AutoSlider slides={banners} height={200} interval={5000} />
      </div>
      {/* Categories */}
      <div className="flex gap-3 px-4 overflow-x-auto pb-2 mb-5 scrollbar-none">
        {cats.map(c => (
          <button key={c.label} onClick={() => viewAll(c.label)} className="flex flex-col items-center gap-1 flex-shrink-0 px-4 py-2.5 rounded-2xl border transition-all active:scale-95"
            style={{ background: activeCat === c.label ? `${tc.chipActiveBg}20` : tc.chipBg, borderColor: activeCat === c.label ? tc.chipActiveBg : tc.border }}>
            <span className="text-xl">{c.emoji}</span>
            <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color: activeCat === c.label ? tc.accent : tc.text3 }}>{c.label}</span>
          </button>
        ))}
      </div>
      {/* Featured */}
      <div className="px-4 mb-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>Featured Dining</h2>
          <button onClick={() => viewAll("All")} className="text-xs font-bold flex items-center gap-0.5" style={{ color: tc.accent }}>View all <ChevronRight size={13} /></button>
        </div>
        <div onClick={() => navigate("restaurantdetail")} className="rounded-2xl overflow-hidden cursor-pointer" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <div className="relative h-44">
            <img src="/__mockup/images/tour-wine.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center"><Bookmark size={15} className="text-white" /></button>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1.5"><h3 className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>Rooftop by Luma</h3><span className="text-[9px] font-bold px-2 py-0.5 rounded text-white" style={{ background: tc.accentTeal }}>NEW</span></div>
            <p className="text-xs mb-1.5" style={{ color: tc.text2 }}>Rooftop · Sandton City</p>
            <div className="flex items-center gap-1.5 mb-1.5"><Star size={11} fill={GOLD} style={{ color: GOLD }} /><span className="font-bold text-xs" style={{ color: GOLD }}>4.7</span><span className="text-xs" style={{ color: tc.text3 }}>(320)</span></div>
            <p className="text-xs mb-3" style={{ color: tc.text2 }}>Panoramic views, signature cocktails, and elevated dishes.</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm" style={{ color: tc.accent }}>From R1,500</span>
              <button className="px-4 py-2 rounded-xl text-white text-xs font-bold" style={{ background: tc.accentGrad }}>Reserve Table</button>
            </div>
          </div>
        </div>
      </div>
      {/* Restaurant Grid */}
      <div ref={gridRef} className="px-4 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-['Poppins'] font-bold text-base" style={{ color: tc.text }}>{activeCat === "All" ? "All Restaurants" : activeCat}</h2>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${tc.accent}12`, color: tc.accent }}>{filtered.length} places</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((r, i) => (
            <div key={i} onClick={() => navigate("restaurantdetail")} className="rounded-2xl overflow-hidden cursor-pointer" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <div className="h-28 relative"><img src={r.img} alt={r.name} className="absolute inset-0 w-full h-full object-cover" /></div>
              <div className="p-3">
                <p className="font-['Poppins'] font-bold text-sm mb-0.5" style={{ color: tc.text }}>{r.name}</p>
                <p className="text-[10px] mb-1" style={{ color: tc.text3 }}>{r.type}</p>
                <div className="flex items-center gap-1 mb-1"><Star size={9} fill={GOLD} style={{ color: GOLD }} /><span className="text-[10px] font-bold" style={{ color: GOLD }}>{r.rating}</span><span className="text-[10px]" style={{ color: tc.text3 }}>({r.reviews})</span></div>
                <p className="text-[10px] font-bold" style={{ color: tc.accent }}>{r.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="dining" navigate={navigate} />
    </div>
  );
}

/* ─── RESTAURANT DETAIL ─── */
function RestaurantDetailScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState("18:00");
  const [guests, setGuests] = useState(2);
  const [seating, setSeating] = useState("Rooftop");
  const [addOns, setAddOns] = useState<number[]>([]);
  const dates = [{ day: "Today", date: "Sat 24" }, { day: "Sun", date: "25 May" }, { day: "Mon", date: "26 May" }, { day: "Tue", date: "27 May" }, { day: "Wed", date: "28 May" }];
  const times = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
  const seatingOptions = ["Indoors", "Outdoors", "Rooftop", "No Pref"];
  const addOnItems = [
    { id: 1, name: "Celebration Setup", desc: "Balloons, candles & décor", price: 250, emoji: "🎉" },
    { id: 2, name: "Champagne Arrival", desc: "Premium bottle on arrival", price: 1200, emoji: "🍾" },
    { id: 3, name: "Birthday Dessert Plate", desc: "Personalised dessert platter", price: 150, emoji: "🎂" },
  ];
  const tabs = ["Overview", "Menu Highlights", "Reviews", "Gallery"];
  const basePrice = 1500;
  const addOnTotal = addOns.reduce((sum, id) => sum + (addOnItems.find(a => a.id === id)?.price || 0), 0);
  const serviceFee = Math.round((basePrice + addOnTotal) * 0.1);
  const total = basePrice + addOnTotal + serviceFee;
  const toggleAddon = (id: number) => setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const diningReviews = [
    { name: "Lerato M.", rating: 5, date: "2 weeks ago", text: "Absolutely breathtaking views and the food was divine. Best rooftop experience in Joburg!" },
    { name: "Sipho D.", rating: 4, date: "1 month ago", text: "Great atmosphere and excellent service. The lamb rack was cooked to perfection." },
    { name: "Nandi K.", rating: 5, date: "6 weeks ago", text: "Perfect date night spot. The champagne selection is extensive and staff are so attentive." },
  ];
  return (
    <div className="h-screen font-['Inter'] overflow-y-auto scrollbar-none" style={{ background: tc.bg, color: tc.text }}>
      <div className="relative w-full" style={{ height: 260 }}>
        <img src="/__mockup/images/tour-wine.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.95) 100%)" }} />
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 pt-12">
          <button onClick={() => navigate("dining")} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center"><ArrowLeft size={20} className="text-white" /></button>
          <div className="flex gap-2">
            <button onClick={() => setLiked(l => !l)} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center"><Heart size={18} fill={liked ? GOLD : "none"} style={{ color: liked ? GOLD : "#fff" }} /></button>
            <button onClick={() => { const txt = "Rooftop by Luma — Rooftop dining in Sandton. Book on SA PLUG!"; if (typeof navigator.share === "function") { navigator.share({ title: "Rooftop by Luma", text: txt, url: window.location.href }).catch(() => {}); } else { navigator.clipboard?.writeText(txt); } }} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center"><Share2 size={18} className="text-white" /></button>
          </div>
        </div>
      </div>
      <div className="px-5 pt-4 pb-36">
        <div className="flex items-center gap-2 mb-1"><h1 className="font-['Poppins'] font-bold text-xl" style={{ color: tc.text }}>Rooftop by Luma</h1><span className="text-xs font-bold px-2 py-0.5 rounded text-black" style={{ background: GOLD }}>VIP</span></div>
        <p className="text-xs mb-2" style={{ color: tc.text2 }}>🌆 Rooftop · Victoria Island, Lagos</p>
        <div className="flex items-center gap-2 mb-3">
          <Star size={12} fill={GOLD} style={{ color: GOLD }} /><span className="font-bold text-sm" style={{ color: GOLD }}>4.7</span><span className="text-xs" style={{ color: tc.text3 }}>(320 reviews)</span>
          <span style={{ color: tc.border2 }}>·</span><span className="text-xs" style={{ color: tc.text2 }}>Elegant · Romantic · Scenic</span>
        </div>
        <div className="flex gap-2 mb-4">
          <button className="flex-1 py-2.5 rounded-xl font-bold text-white text-xs" style={{ background: tc.accentGrad }}>🗓 Reserve Table</button>
          <button onClick={() => navigate("clubdetail")} className="flex-1 py-2.5 rounded-xl font-bold text-xs border" style={{ borderColor: tc.accent, color: tc.accent, background: tc.inputBg }}>📋 Menu</button>
          <button onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=Rooftop+by+Luma+Sandton+City+Johannesburg", "_blank")} className="flex-1 py-2.5 rounded-xl font-bold text-xs border active:opacity-70" style={{ borderColor: tc.border, color: tc.text2, background: tc.inputBg }}>📍 Directions</button>
        </div>
        <div className="flex gap-1 mb-5 rounded-2xl p-1" style={{ background: tc.card }}>
          {tabs.map(t => <button key={t} onClick={() => setActiveTab(t)} className="flex-1 py-2 rounded-xl text-[10px] font-bold transition-all" style={{ background: activeTab === t ? tc.accent : "transparent", color: activeTab === t ? "#fff" : tc.text3 }}>{t}</button>)}
        </div>
        {activeTab === "Overview" && (
          <div className="space-y-5">
            <div>
              <h3 className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Select Date</h3>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {dates.map((d, i) => (
                  <button key={i} onClick={() => setSelectedDate(i)} className="flex-shrink-0 flex flex-col items-center px-3.5 py-2 rounded-xl border transition-all"
                    style={{ background: selectedDate === i ? tc.accent : tc.inputBg, borderColor: selectedDate === i ? tc.accent : tc.border, color: selectedDate === i ? "#fff" : tc.text2, minWidth: 64 }}>
                    <span className="text-[10px] font-semibold">{d.day}</span><span className="text-xs font-bold">{d.date}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Select Time</h3>
              <div className="flex flex-wrap gap-2">
                {times.map(t => <button key={t} onClick={() => setSelectedTime(t)} className="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all" style={{ background: selectedTime === t ? tc.accent : tc.inputBg, borderColor: selectedTime === t ? tc.accent : tc.border, color: selectedTime === t ? "#fff" : tc.text2 }}>{t}</button>)}
              </div>
            </div>
            <div>
              <h3 className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Guests</h3>
              <div className="flex items-center gap-4">
                <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><Minus size={16} /></button>
                <span className="font-['Poppins'] font-bold text-xl w-8 text-center" style={{ color: tc.text }}>{guests}</span>
                <button onClick={() => setGuests(g => g + 1)} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: tc.accent }}><Plus size={16} className="text-white" /></button>
                <span className="text-sm" style={{ color: tc.text2 }}>{guests === 1 ? "Guest" : "Guests"}</span>
              </div>
            </div>
            <div>
              <h3 className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Seating Preference</h3>
              <div className="flex flex-wrap gap-2">
                {seatingOptions.map(s => <button key={s} onClick={() => setSeating(s)} className="px-4 py-2 rounded-xl text-xs font-bold border transition-all" style={{ background: seating === s ? `${tc.accent}15` : tc.inputBg, borderColor: seating === s ? tc.accent : tc.border, color: seating === s ? tc.accent : tc.text2 }}>{s}</button>)}
              </div>
            </div>
            <div>
              <h3 className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Add-ons (Optional)</h3>
              <div className="space-y-2">
                {addOnItems.map(a => (
                  <button key={a.id} onClick={() => toggleAddon(a.id)} className="w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all border"
                    style={{ background: addOns.includes(a.id) ? `${tc.accent}08` : tc.card, borderColor: addOns.includes(a.id) ? tc.accent : tc.border }}>
                    <span className="text-2xl flex-shrink-0">{a.emoji}</span>
                    <div className="flex-1"><p className="font-bold text-xs" style={{ color: tc.text }}>{a.name}</p><p className="text-[10px]" style={{ color: tc.text3 }}>{a.desc}</p></div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-xs" style={{ color: tc.accent }}>+R{a.price}</p>
                      <div className="w-5 h-5 rounded ml-auto mt-1 flex items-center justify-center" style={{ background: addOns.includes(a.id) ? tc.accent : tc.inputBg }}>
                        {addOns.includes(a.id) && <Check size={11} className="text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm"><span style={{ color: tc.text2 }}>Total ({guests} guests est.)</span><span style={{ color: tc.text }}>R{basePrice.toLocaleString()}</span></div>
                {addOns.map(id => { const a = addOnItems.find(x => x.id === id)!; return <div key={id} className="flex justify-between text-sm"><span style={{ color: tc.text2 }}>{a.name}</span><span style={{ color: tc.text }}>R{a.price}</span></div>; })}
                <div className="flex justify-between text-sm"><span style={{ color: tc.text2 }}>Service Fee (10%)</span><span style={{ color: tc.text }}>R{serviceFee}</span></div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: tc.border }}>
                <span className="font-['Poppins'] font-bold" style={{ color: tc.text }}>Estimated Total</span>
                <span className="font-['Poppins'] font-bold text-xl" style={{ color: tc.accent }}>R{total.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <h3 className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Location</h3>
              <MapPreview venue="Rooftop by Luma" address="Sandton City, Johannesburg" />
            </div>
          </div>
        )}
        {activeTab === "Menu Highlights" && (
          <div className="space-y-4">
            {[
              { cat: "Starters", items: [{ n: "Prawns in Garlic Butter", p: 320 }, { n: "Beef Carpaccio", p: 280 }, { n: "Burrata Salad", p: 260 }] },
              { cat: "Mains", items: [{ n: "Wagyu Ribeye (350g)", p: 980 }, { n: "Pan-Seared Sea Bass", p: 720 }, { n: "Lamb Rack", p: 860 }, { n: "Mushroom Risotto", p: 480 }] },
              { cat: "Desserts", items: [{ n: "Dark Chocolate Fondant", p: 185 }, { n: "Crème Brûlée", p: 155 }, { n: "Cheesecake", p: 145 }] },
            ].map(sec => (
              <div key={sec.cat}>
                <p className="font-['Poppins'] font-bold text-sm mb-2" style={{ color: tc.text }}>{sec.cat}</p>
                {sec.items.map(item => (
                  <div key={item.n} className="flex justify-between items-center py-2 border-b" style={{ borderColor: tc.border }}>
                    <span className="text-sm" style={{ color: tc.text }}>{item.n}</span>
                    <span className="font-bold text-sm" style={{ color: tc.accent }}>R{item.p}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {activeTab === "Reviews" && <ReviewsSection rating={4.7} count={320} reviews={diningReviews} />}
        {activeTab === "Gallery" && (
          <div className="grid grid-cols-2 gap-2">
            {["/__mockup/images/tour-wine.jpg","/__mockup/images/hero.png","/__mockup/images/coco.png","/__mockup/images/onyx.png","/__mockup/images/tour-capetown.jpg","/__mockup/images/zone6.png"].map((src, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${i===0?"col-span-2 h-48":"h-32"}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t px-4 pt-3 pb-8" style={{ background: tc.navBg, borderColor: tc.border }}>
        <button onClick={() => navigate("checkout-details")} className="w-full py-4 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2" style={{ background: tc.accentGrad, boxShadow: `0 8px 28px ${tc.accentShadow}` }}>
          Reserve Now — R{total.toLocaleString()} <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

/* ─── TOUR DETAIL SCREEN ─── */
function TourDetailScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const tc = useTC();
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedDate, setSelectedDate] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const totalGuests = adults + children;
  const [pkg, setPkg] = useState<"standard" | "luxury">("standard");
  const [addOns, setAddOns] = useState<number[]>([]);
  const dates = [{ day: "Mon", date: "24 May" }, { day: "Tue", date: "25 May" }, { day: "Wed", date: "26 May" }, { day: "Thu", date: "27 May" }, { day: "Fri", date: "28 May" }];
  const addOnItems = [
    { id: 1, name: "Hot Air Balloon Safari", desc: "Float above the savanna at sunrise", price: 2200, emoji: "🎈" },
    { id: 2, name: "Photography Pack", desc: "Professional wildlife photos", price: 650, emoji: "📸" },
    { id: 3, name: "Private Game Drive", desc: "Exclusive vehicle for your group", price: 1800, emoji: "🚙" },
  ];
  const tabs = ["Overview", "Itinerary", "Inclusions", "Reviews"];
  const pkgBase = pkg === "luxury" ? 4500 : 2900;
  const addOnTotal = addOns.reduce((sum, id) => sum + (addOnItems.find(a => a.id === id)?.price || 0), 0);
  const total = (pkgBase + addOnTotal) * totalGuests;
  const toggleAddon = (id: number) => setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const tourReviews = [
    { name: "Nomsa T.", rating: 5, date: "1 week ago", text: "Life-changing experience. Saw all of the Big Five on day one! The guides were exceptional." },
    { name: "Marcus P.", rating: 5, date: "3 weeks ago", text: "Worth every rand. The luxury lodge was stunning and the food was world-class." },
    { name: "Ayanda M.", rating: 4, date: "2 months ago", text: "Incredible experience. The sunrise game drive was unforgettable. Would love to go back." },
  ];
  return (
    <div className="h-screen font-['Inter'] overflow-y-auto scrollbar-none" style={{ background: tc.bg, color: tc.text }}>
      <div className="relative w-full" style={{ height: 260 }}>
        <img src="/__mockup/images/tour-safari.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.95) 100%)" }} />
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 pt-12">
          <button onClick={() => navigate("tours")} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center"><ArrowLeft size={20} className="text-white" /></button>
          <div className="flex gap-2">
            <button onClick={() => setLiked(l => !l)} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center"><Heart size={18} fill={liked ? GOLD : "none"} style={{ color: liked ? GOLD : "#fff" }} /></button>
            <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center"><Share2 size={18} className="text-white" /></button>
          </div>
        </div>
        <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white/70 text-xs"><Star size={12} fill={GOLD} style={{ color: GOLD }} /><span className="font-bold" style={{ color: GOLD }}>4.8</span><span>(256 reviews)</span></div>
      </div>
      <div className="px-5 pt-4 pb-36">
        <h1 className="font-['Poppins'] font-bold text-xl mb-1" style={{ color: tc.text }}>Safari Experience</h1>
        <p className="text-xs mb-3 flex items-center gap-1" style={{ color: tc.text2 }}><MapPin size={11} />Kruger National Park, South Africa</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[{ icon: Clock, label: "Duration", val: "3 Days" }, { icon: Users, label: "Group Size", val: "Max 10" }, { icon: MapPin, label: "Pickup", val: "Hotel" }].map(({ icon: Icon, label, val }, i) => (
            <div key={i} className="rounded-xl p-2.5 text-center border" style={{ background: tc.card, borderColor: tc.border }}>
              <Icon size={16} className="mx-auto mb-1" style={{ color: tc.accent }} />
              <p className="text-[9px] mb-0.5" style={{ color: tc.text3 }}>{label}</p>
              <p className="font-bold text-xs" style={{ color: tc.text }}>{val}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-1 mb-5 rounded-2xl p-1" style={{ background: tc.card }}>
          {tabs.map(t => <button key={t} onClick={() => setActiveTab(t)} className="flex-1 py-2 rounded-xl text-[11px] font-bold transition-all" style={{ background: activeTab === t ? tc.accent : "transparent", color: activeTab === t ? "#fff" : tc.text3 }}>{t}</button>)}
        </div>
        {activeTab === "Overview" && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed" style={{ color: tc.text2 }}>Experience the African wilderness like never before. Trek through Kruger National Park with expert guides, spot the Big Five, and sleep under the stars in luxury camps.</p>
            <div>
              <h3 className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Select Date</h3>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {dates.map((d, i) => <button key={i} onClick={() => setSelectedDate(i)} className="flex-shrink-0 flex flex-col items-center px-3.5 py-2 rounded-xl border transition-all" style={{ background: selectedDate === i ? tc.accent : tc.inputBg, borderColor: selectedDate === i ? tc.accent : tc.border, color: selectedDate === i ? "#fff" : tc.text2, minWidth: 60 }}><span className="text-[10px] font-semibold">{d.day}</span><span className="text-xs font-bold">{d.date}</span></button>)}
              </div>
            </div>
            <div>
              <h3 className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Guests</h3>
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: tc.border, background: tc.card }}>
                {/* Adults row */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: tc.border }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">👨</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: tc.text }}>Adults</p>
                      <p className="text-[10px]" style={{ color: tc.text2 }}>Age 18+</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setAdults(a => Math.max(1, a - 1))} className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border }}><Minus size={13} style={{ color: tc.text }} /></button>
                    <span className="font-['Poppins'] font-bold text-lg w-6 text-center" style={{ color: tc.text }}>{adults}</span>
                    <button onClick={() => setAdults(a => Math.min(10, a + 1))} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: tc.accentGrad }}><Plus size={13} className="text-white" /></button>
                  </div>
                </div>
                {/* Children row */}
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🧒</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: tc.text }}>Children</p>
                      <p className="text-[10px]" style={{ color: tc.text2 }}>Under 18</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setChildren(c => Math.max(0, c - 1))} className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border }}><Minus size={13} style={{ color: tc.text }} /></button>
                    <span className="font-['Poppins'] font-bold text-lg w-6 text-center" style={{ color: tc.text }}>{children}</span>
                    <button onClick={() => setChildren(c => Math.min(10, c + 1))} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: tc.accentGrad }}><Plus size={13} className="text-white" /></button>
                  </div>
                </div>
              </div>
              {/* Live summary */}
              <div className="mt-2.5 px-1 flex items-center gap-1.5">
                <Users size={12} style={{ color: tc.accent }} />
                <span className="text-xs font-semibold" style={{ color: tc.accent }}>
                  {adults} {adults === 1 ? "Adult" : "Adults"}{children > 0 ? `, ${children} ${children === 1 ? "Child" : "Children"}` : ""}
                </span>
                <span className="text-xs" style={{ color: tc.text2 }}>· {totalGuests} total guest{totalGuests !== 1 ? "s" : ""}</span>
              </div>
            </div>
            <div>
              <h3 className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Choose Package</h3>
              <div className="space-y-2">
                {[{ key: "standard", name: "Standard Package", desc: "Shared vehicle, 3★ camp, all meals", price: "From R2,900 pp" }, { key: "luxury", name: "Luxury Package", desc: "Private vehicle, 5★ lodge, fine dining", price: "From R4,500 pp" }].map(p => (
                  <button key={p.key} onClick={() => setPkg(p.key as "standard" | "luxury")} className="w-full flex items-center gap-3 rounded-xl p-3.5 text-left transition-all border" style={{ borderColor: pkg === p.key ? tc.accent : tc.border, background: pkg === p.key ? `${tc.accent}08` : tc.card }}>
                    <div className="flex-1"><p className="font-bold text-sm" style={{ color: tc.text }}>{p.name}</p><p className="text-xs mt-0.5" style={{ color: tc.text2 }}>{p.desc}</p></div>
                    <div className="text-right"><p className="font-bold text-xs" style={{ color: tc.accent }}>{p.price}</p>
                      <div className="w-5 h-5 rounded-full border ml-auto mt-1.5 flex items-center justify-center" style={{ borderColor: pkg === p.key ? tc.accent : tc.border2, background: pkg === p.key ? tc.accent : "transparent" }}>
                        {pkg === p.key && <Check size={11} className="text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Add-ons</h3>
              <div className="space-y-2">
                {addOnItems.map(a => (
                  <button key={a.id} onClick={() => toggleAddon(a.id)} className="w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all border" style={{ borderColor: addOns.includes(a.id) ? tc.accent : tc.border, background: addOns.includes(a.id) ? `${tc.accent}08` : tc.card }}>
                    <span className="text-2xl flex-shrink-0">{a.emoji}</span>
                    <div className="flex-1"><p className="font-bold text-xs" style={{ color: tc.text }}>{a.name}</p><p className="text-[10px]" style={{ color: tc.text2 }}>{a.desc}</p></div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-xs" style={{ color: tc.accent }}>+R{a.price.toLocaleString()} pp</p>
                      <div className="w-5 h-5 rounded ml-auto mt-1 flex items-center justify-center" style={{ background: addOns.includes(a.id) ? tc.accent : tc.inputBg }}>
                        {addOns.includes(a.id) && <Check size={11} className="text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm"><span style={{ color: tc.text2 }}>{pkg === "luxury" ? "Luxury" : "Standard"} × {totalGuests} guest{totalGuests !== 1 ? "s" : ""}</span><span style={{ color: tc.text }}>R{(pkgBase * totalGuests).toLocaleString()}</span></div>
                {addOns.map(id => { const a = addOnItems.find(x => x.id === id)!; return <div key={id} className="flex justify-between text-sm"><span style={{ color: tc.text2 }}>{a.name} × {totalGuests}</span><span style={{ color: tc.text }}>R{(a.price * totalGuests).toLocaleString()}</span></div>; })}
              </div>
              <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: tc.border }}>
                <span className="font-['Poppins'] font-bold" style={{ color: tc.text }}>Total</span>
                <span className="font-['Poppins'] font-bold text-xl" style={{ color: tc.accent }}>R{total.toLocaleString()}</span>
              </div>
            </div>
            <div><h3 className="font-['Poppins'] font-bold text-sm mb-3" style={{ color: tc.text }}>Pickup Location</h3><MapPreview venue="Kruger National Park Gate" address="Phalaborwa, Limpopo" /></div>
          </div>
        )}
        {activeTab === "Itinerary" && (
          <div className="space-y-3">
            {[{ day: "Day 1", title: "Arrival & Orientation", desc: "Hotel pickup → Kruger gates → evening game drive → luxury camp dinner" },
              { day: "Day 2", title: "Full Safari Day", desc: "Dawn game drive (Big Five spotting) → midday camp → sunset boat cruise on the dam" },
              { day: "Day 3", title: "Sunrise Drive & Departure", desc: "Final morning game drive → brunch → airport transfer back to your city" }].map((d, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: tc.accent }}>{i+1}</div>{i<2&&<div className="w-0.5 flex-1 mt-1" style={{ background: tc.border }} />}</div>
                <div className="pb-4"><p className="font-['Poppins'] font-bold text-sm" style={{ color: tc.accent }}>{d.day}: {d.title}</p><p className="text-xs mt-1 leading-relaxed" style={{ color: tc.text2 }}>{d.desc}</p></div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "Inclusions" && (
          <div className="space-y-2">
            <p className="font-['Poppins'] font-bold text-sm mb-1" style={{ color: tc.accent }}>Included ✓</p>
            {["All accommodation (3 nights)", "Return airport transfers", "Professional Big Five guide", "All meals (breakfast, lunch, dinner)", "Game drives in 4×4 vehicle", "Park entrance fees"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5"><CheckCircle2 size={14} style={{ color: tc.accent }} /><span className="text-sm" style={{ color: tc.text }}>{item}</span></div>
            ))}
            <p className="font-['Poppins'] font-bold text-sm mt-4 mb-1 text-red-400">Not Included ✗</p>
            {["Personal travel insurance", "Optional add-on experiences", "Gratuities for guides"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5" style={{ color: tc.text2 }}><X size={14} className="text-red-400 flex-shrink-0" /><span className="text-sm">{item}</span></div>
            ))}
          </div>
        )}
        {activeTab === "Reviews" && <ReviewsSection rating={4.8} count={256} reviews={tourReviews} />}
      </div>
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t px-4 pt-3 pb-8" style={{ background: tc.navBg, borderColor: tc.border }}>
        <button onClick={() => navigate("checkout-details")} className="w-full py-4 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2" style={{ background: tc.accentGrad, boxShadow: `0 8px 28px ${tc.accentShadow}` }}>
          Book Now — R{total.toLocaleString()} <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

/* ─── LEGAL SCREENS ─── */
function LegalScreen({ title, sections, effectiveDate }: { title: string; navigate?: (s: Screen) => void; back?: Screen; sections: { heading: string; body: string }[]; effectiveDate?: string }) {
  const tc = useTC();
  const { goBack } = useNav();
  return (
    <div className="min-h-screen font-['Inter']" style={{ background: tc.bg, color: tc.text }}>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 sticky top-0 backdrop-blur-md z-10 border-b" style={{ background: tc.headerBg, borderColor: tc.border }}>
        <button onClick={goBack} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ background: tc.inputBg, borderColor: tc.border, color: tc.text }}><ArrowLeft size={20} /></button>
        <h1 className="font-['Poppins'] font-bold text-lg" style={{ color: tc.text }}>{title}</h1>
      </div>
      <div className="px-5 py-6 pb-12">
        <div className="flex items-center gap-2 mb-2 p-3 rounded-xl" style={{ background: `${tc.accent}08`, border: `1px solid ${tc.accent}28` }}>
          <Shield size={16} style={{ color: tc.accent }} />
          <p className="text-xs" style={{ color: tc.text2 }}>Governed by South African law. By using SA PLUG, you agree to these terms.</p>
        </div>
        <p className="text-xs mb-6 pl-1" style={{ color: tc.muted }}>Effective date: {effectiveDate || "1 May 2026"}</p>
        <div className="space-y-6">
          {sections.map(({ heading, body }, i) => (
            <div key={i}>
              <h2 className="font-['Poppins'] font-bold text-sm mb-2" style={{ color: tc.accent }}>{heading}</h2>
              <p className="text-sm leading-relaxed" style={{ color: tc.text2 }}>{body}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-8 text-center" style={{ color: tc.muted }}>SA PLUG (Pty) Ltd · Reg No. 2022/123456/07 · Sandton, South Africa</p>
        <p className="text-xs mt-1 text-center" style={{ color: tc.muted }}>support@saplug.co.za · Last updated May 2026</p>
      </div>
    </div>
  );
}

const TERMS_SECTIONS = [
  { heading: "1. Eligibility", body: "You must be 18 years or older to use SA PLUG. By creating an account, you confirm you meet this age requirement and agree to provide accurate information." },
  { heading: "2. Platform Role", body: "SA PLUG is a booking and discovery platform connecting you with independent clubs, restaurants, tour operators, and event organisers. We are not a venue or service provider." },
  { heading: "3. Bookings", body: "All bookings are subject to availability. SA PLUG reserves the right to cancel bookings due to unforeseen circumstances, in which case a full refund will be issued." },
  { heading: "4. User Conduct", body: "You agree to treat all venues, staff, and fellow patrons with respect. Misuse of the platform, fraudulent bookings, or abusive behaviour may result in permanent account suspension." },
  { heading: "5. Privacy", body: "Your data is processed in accordance with our Privacy Policy and South African POPIA regulations. We do not sell your personal information to third parties." },
  { heading: "6. Governing Law", body: "These terms are governed by and construed in accordance with the laws of the Republic of South Africa. Any disputes will be resolved in South African courts." },
];
const PAYMENT_SECTIONS = [
  { heading: "Accepted Payment Methods", body: "SA PLUG accepts major credit and debit cards (Visa, Mastercard, Amex), EFT, and selected mobile payment options. All transactions are processed in South African Rand (ZAR)." },
  { heading: "Payment Processing", body: "Payments are processed by our PCI-compliant third-party payment gateway. SA PLUG does not store your full card details on our servers." },
  { heading: "Cancellation Fees", body: "If you cancel more than 12 hours before your booking: a 20% cancellation fee applies. If you cancel within 12 hours of the booking: no refund is issued. No-shows are non-refundable." },
  { heading: "Deposits", body: "Some premium bookings (VIP tables, exclusive packages) require a non-refundable deposit to confirm. This amount is deducted from your total." },
  { heading: "Disputes", body: "For payment disputes, contact support@saplug.co.za within 7 days of the transaction. We aim to resolve all disputes within 5 business days." },
];
const DISCLAIMER_SECTIONS = [
  { heading: "Venue Independence", body: "All clubs, restaurants, tour operators, and event organisers listed on SA PLUG operate independently. SA PLUG does not control their operations, policies, or conduct." },
  { heading: "Service Quality", body: "SA PLUG strives to list only reputable partners, but cannot guarantee the quality, safety, or experience at any specific venue. Reviews and ratings reflect user opinions." },
  { heading: "Venue Changes", body: "Venues may change their menus, pricing, dress codes, or operating hours without notice. SA PLUG is not liable for any discrepancies between listed and actual conditions." },
  { heading: "Liability Limitation", body: "SA PLUG's maximum liability is limited to the value of the booking in question. We are not liable for any consequential, indirect, or incidental damages." },
  { heading: "Partner Obligations", body: "Partner venues are required to honour confirmed bookings. In the rare case a venue fails to do so, contact SA PLUG immediately for assistance and refund processing." },
];
const REFUND_SECTIONS = [
  { heading: "Standard Cancellation Policy", body: "Cancellations made more than 12 hours before your scheduled booking will incur a 20% cancellation fee. The remaining 80% will be refunded within 3–5 business days." },
  { heading: "Late Cancellations", body: "Cancellations made within 12 hours of your booking start time are non-refundable. This policy exists to protect venues and ensure fair compensation for last-minute changes." },
  { heading: "No-Shows", body: "If you do not attend your booking and have not cancelled, the booking is considered a no-show and is fully non-refundable." },
  { heading: "Venue Cancellations", body: "If a venue cancels your confirmed booking, you will receive a full refund within 3–5 business days, plus a SA PLUG credit voucher as compensation." },
  { heading: "How to Cancel", body: "To cancel a booking, go to My Reservations → View Details → Cancel Booking. Cancellations must be made through the app to be valid." },
  { heading: "Refund Processing", body: "Refunds are returned to your original payment method. Processing times may vary by bank: typically 3–5 business days for card payments, up to 7 days for EFT." },
];

const PRIVACY_SECTIONS = [
  { heading: "1. Who We Are", body: "SA PLUG (Pty) Ltd ('SA PLUG', 'we', 'us') operates the SA PLUG mobile platform. We are registered in the Republic of South Africa and comply with the Protection of Personal Information Act (POPIA) No. 4 of 2013." },
  { heading: "2. Information We Collect", body: "We collect information you provide directly: name, email address, phone number, date of birth, and payment details. We also collect usage data such as bookings, searches, saved venues, and app interactions to improve your experience." },
  { heading: "3. How We Use Your Data", body: "Your information is used to: process and confirm bookings; send booking confirmation and reminders; personalise recommendations; notify you of deals and events (if opted in); process payments securely; and comply with South African legal obligations." },
  { heading: "4. Sharing Your Information", body: "We share your data only with: (a) venues and operators to fulfil your booking, (b) our payment processor for transaction security, and (c) service providers who assist us under strict data processing agreements. We never sell your personal information to third parties." },
  { heading: "5. Your Rights Under POPIA", body: "You have the right to access, correct, or delete your personal information at any time. You may request a copy of your data or object to its processing by emailing privacy@saplug.co.za. We will respond within 30 days." },
  { heading: "6. Data Retention", body: "We retain your personal data for as long as your account is active or as required by South African law. Booking records are retained for a minimum of 5 years for tax and legal compliance. You may request deletion of your account at any time." },
  { heading: "7. Cookies & Tracking", body: "The SA PLUG app uses session tokens and local device storage to maintain your login state and preferences. We do not use third-party advertising trackers. Analytics data is anonymised and aggregated." },
  { heading: "8. Security", body: "We implement industry-standard security measures including TLS encryption, PCI-DSS compliant payment handling, and access controls. In the event of a data breach that affects your personal information, we will notify you within 72 hours as required by POPIA." },
  { heading: "9. Children's Privacy", body: "SA PLUG is intended for users aged 18 and older. We do not knowingly collect personal data from anyone under 18 years of age. If you believe a minor has created an account, please contact us immediately." },
  { heading: "10. Contact Us", body: "For all privacy-related enquiries, contact our Information Officer at: privacy@saplug.co.za. Postal address: SA PLUG (Pty) Ltd, 1st Floor, Sandton City Office Tower, Sandton, Johannesburg, 2196, South Africa." },
];

/* ─── ROOT APP ─── */
export function App() {
  const [history, setHistory] = useState<Screen[]>(["splash"]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState('en');
  const [shopDetailKey, setShopDetailKey] = useState(0);
  const [shopIdStack, setShopIdStack] = useState<number[]>([]);

  const screen = history[history.length - 1];

  const navigate = (s: Screen) => {
    if (s === "shopdetail") {
      setShopDetailKey(k => k + 1);
      setShopIdStack(prev => [...prev, _selectedProductId]);
      window.scrollTo(0, 0);
    }
    setHistory(prev => [...prev, s]);
  };

  const goBack = () => {
    if (screen === "shopdetail") {
      const newStack = shopIdStack.slice(0, -1);
      const prevScreen = history[history.length - 2];
      if (prevScreen === "shopdetail" && newStack.length > 0) {
        // Restore the previous product and force a fresh mount
        _selectedProductId = newStack[newStack.length - 1];
        setShopDetailKey(k => k + 1);
      }
      setShopIdStack(newStack);
    }
    setHistory(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  };

  const addToCart = (item: Omit<CartItem, "qty">) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const mainTabs = ["home", "clubs", "tours", "dining", "reservations", "shop", "clubdetail", "search", "deals", "shopdetail"];
  const showHeader = mainTabs.includes(screen) && screen !== "search";

  const screenMap: Record<Screen, React.ReactNode> = {
    splash: <SplashScreen navigate={navigate} />,
    onboarding: <OnboardingScreen navigate={navigate} />,
    welcome: <WelcomeScreen navigate={navigate} />,
    signin: <SignInScreen navigate={navigate} />,
    signup: <SignUpScreen navigate={navigate} />,
    forgot: <ForgotScreen navigate={navigate} />,
    otp: <OTPScreen navigate={navigate} />,
    home: <HomeScreen navigate={navigate} addToCart={addToCart} />,
    clubs: <ClubsScreen navigate={navigate} />,
    clubdetail: <ClubDetailScreen navigate={navigate} addToCart={addToCart} cartCount={cartCount} />,
    tours: <ToursScreen navigate={navigate} />,
    dining: <DiningScreen navigate={navigate} />,
    restaurantdetail: <RestaurantDetailScreen navigate={navigate} />,
    tourdetail: <TourDetailScreen navigate={navigate} />,
    shopdetail: <ShopDetailScreen navigate={navigate} addToCart={addToCart} />,
    reservations: <ReservationsScreen navigate={navigate} />,
    shop: <ShopScreen navigate={navigate} addToCart={addToCart} />,
    profile: <ProfileScreen navigate={navigate} />,
    cart: <CartScreen cart={cart} setCart={setCart} navigate={navigate} />,
    "checkout-details": <CheckoutDetailsScreen navigate={navigate} />,
    "checkout-payment": <CheckoutPaymentScreen navigate={navigate} />,
    "checkout-confirmed": <CheckoutConfirmedScreen navigate={navigate} />,
    chat: <ChatScreen navigate={navigate} />,
    search: <SearchScreen navigate={navigate} />,
    bookingdetail: <BookingDetailScreen navigate={navigate} />,
    deals: <DealsScreen addToCart={addToCart} navigate={navigate} />,
    "profile-bookings": <ProfileBookings navigate={navigate} />,
    "profile-saved": <ProfileSaved navigate={navigate} />,
    "profile-payment": <ProfilePayment navigate={navigate} />,
    "profile-notifications": <ProfileNotifications navigate={navigate} />,
    "profile-vip": <ProfileVIP navigate={navigate} />,
    "profile-settings": <ProfileSettings navigate={navigate} />,
    "profile-help": <ProfileHelp navigate={navigate} />,
    "profile-edit": <ProfileEdit navigate={navigate} />,
    "profile-password": <ProfilePassword navigate={navigate} />,
    "profile-privacy": <ProfilePrivacy navigate={navigate} />,
    "legal-terms": <LegalScreen title="Terms & Conditions" sections={TERMS_SECTIONS} />,
    "legal-payment": <LegalScreen title="Payment Terms" sections={PAYMENT_SECTIONS} />,
    "legal-disclaimer": <LegalScreen title="Partner Disclaimer" sections={DISCLAIMER_SECTIONS} />,
    "legal-refund": <LegalScreen title="Refund Policy" sections={REFUND_SECTIONS} />,
    "legal-privacy": <LegalScreen title="Privacy Policy" sections={PRIVACY_SECTIONS} effectiveDate="1 May 2026" />,
    "set-password": <SetPasswordScreen navigate={navigate} />,
  };

  const isDark = theme === 'dark';

  return (
    <ThemeCtx.Provider value={theme}>
      <SetThemeCtx.Provider value={setTheme}>
        <LangCtx.Provider value={lang}>
          <SetLangCtx.Provider value={setLang}>
            <NavCtx.Provider value={{ navigate, goBack }}>
              <div className="min-h-screen overflow-hidden" style={{ background: isDark ? '#000' : '#F2F2F2' }}>
                <style>{`
                  * { -webkit-tap-highlight-color: transparent; }
                  .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
                  .scrollbar-none::-webkit-scrollbar { display: none; }
                  @keyframes fadeIn { from { opacity: 0; transform: translateX(6px); } to { opacity: 1; transform: translateX(0); } }
                `}</style>
                {showHeader && <Header navigate={navigate} cartCount={cartCount} />}
                <div key={screen === "shopdetail" ? `shopdetail-${shopDetailKey}` : screen} style={{ animation: "fadeIn 0.18s ease-out" }}>
                  {screenMap[screen]}
                </div>
              </div>
            </NavCtx.Provider>
          </SetLangCtx.Provider>
        </LangCtx.Provider>
      </SetThemeCtx.Provider>
    </ThemeCtx.Provider>
  );
}

export default App;
