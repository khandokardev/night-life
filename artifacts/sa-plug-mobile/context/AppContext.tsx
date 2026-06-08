import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem     = { id: number; name: string; price: number; qty: number; venue: string };
export type AuthUser     = { name: string; email?: string; phone?: string; avatar?: string | null };
export type Review       = { id: string; itemKey: string; userName: string; rating: number; text: string; date: string };
export type NotifPrefs   = { app: boolean; promotions: boolean; bookingUpdates: boolean };
export type SecurityPrefs = { savePassword: boolean; rememberDevice: boolean };

type StoredAccount = { name: string; email?: string; phone?: string; password?: string };

const ACCOUNTS_KEY  = 'sa_plug_accounts';
const AUTH_KEY      = 'sa_plug_auth';
const REVIEWS_KEY   = 'sa_plug_reviews';
const CHECKOUT_KEY  = 'sa_plug_checkout_done';
const NOTIF_KEY     = 'sa_plug_notif_prefs';
const SECURITY_KEY  = 'sa_plug_security_prefs';

const DEFAULT_NOTIF: NotifPrefs     = { app: true, promotions: false, bookingUpdates: true };
const DEFAULT_SECURITY: SecurityPrefs = { savePassword: false, rememberDevice: false };

type AppContextType = {
  theme: 'dark' | 'light';
  themeReady: boolean;
  toggleTheme: () => void;
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  clearCart: () => void;
  wishlistIds: number[];
  toggleWishlist: (id: number) => void;
  isLoggedIn: boolean;
  isGuest: boolean;
  user: AuthUser | null;
  pendingUser: Partial<StoredAccount> | null;
  authenticate: (u: AuthUser) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  setPendingUser: (u: Partial<StoredAccount> | null) => void;
  logout: () => void;
  loginAsGuest: () => void;
  login: (email: string, password: string) => Promise<{ ok: boolean; user?: AuthUser; error?: string }>;
  loginByPhone: (phone: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { name: string; email?: string; phone?: string; password?: string }) => Promise<{ ok: boolean; error?: string }>;
  checkEmailExists: (email: string) => Promise<boolean>;
  checkPhoneExists: (phone: string) => Promise<boolean>;
  reviews: Review[];
  hasCompletedCheckout: boolean;
  addReview: (rev: Omit<Review, 'id'>) => void;
  markCheckoutComplete: () => void;
  getItemReviews: (key: string) => Review[];
  notifPrefs: NotifPrefs;
  updateNotifPrefs: (patch: Partial<NotifPrefs>) => void;
  securityPrefs: SecurityPrefs;
  updateSecurityPrefs: (patch: Partial<SecurityPrefs>) => void;
};

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme]             = useState<'dark' | 'light'>('dark');
  const [themeReady, setThemeReady]   = useState(false);
  const [cart, setCart]               = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [isGuest, setIsGuest]         = useState(false);
  const [user, setUser]               = useState<AuthUser | null>(null);
  const [pendingUser, setPendingUserState] = useState<Partial<StoredAccount> | null>(null);
  const [reviews, setReviews]                           = useState<Review[]>([]);
  const [hasCompletedCheckout, setHasCompletedCheckout] = useState(false);
  const [notifPrefs, setNotifPrefs]       = useState<NotifPrefs>(DEFAULT_NOTIF);
  const [securityPrefs, setSecurityPrefs] = useState<SecurityPrefs>(DEFAULT_SECURITY);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('sa_plug_theme'),
      AsyncStorage.getItem(AUTH_KEY),
      AsyncStorage.getItem(ACCOUNTS_KEY),
      AsyncStorage.getItem(REVIEWS_KEY),
      AsyncStorage.getItem(CHECKOUT_KEY),
      AsyncStorage.getItem(NOTIF_KEY),
      AsyncStorage.getItem(SECURITY_KEY),
    ]).then(([savedTheme, savedAuth, savedAccounts, savedReviews, savedCheckout, savedNotif, savedSecurity]) => {
      if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);
      if (savedAuth) {
        try { const u = JSON.parse(savedAuth) as AuthUser; setUser(u); setIsLoggedIn(true); } catch {}
      }
      if (!savedAccounts) AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify([]));
      if (savedReviews) {
        try { setReviews(JSON.parse(savedReviews) as Review[]); } catch {}
      }
      if (savedCheckout === 'true') setHasCompletedCheckout(true);
      if (savedNotif) {
        try { setNotifPrefs({ ...DEFAULT_NOTIF, ...JSON.parse(savedNotif) }); } catch {}
      }
      if (savedSecurity) {
        try { setSecurityPrefs({ ...DEFAULT_SECURITY, ...JSON.parse(savedSecurity) }); } catch {}
      }
      setThemeReady(true);
    }).catch(() => setThemeReady(true));
  }, []);

  const toggleTheme = () => setTheme(prev => {
    const next = prev === 'dark' ? 'light' : 'dark';
    AsyncStorage.setItem('sa_plug_theme', next);
    return next;
  });

  const authenticate = (u: AuthUser) => {
    setUser(u); setIsLoggedIn(true); setIsGuest(false);
    AsyncStorage.setItem(AUTH_KEY, JSON.stringify(u));
  };

  const updateUser = (patch: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(AUTH_KEY, JSON.stringify(next));
      return next;
    });
  };

  const setPendingUser = (u: Partial<StoredAccount> | null) => setPendingUserState(u);

  const logout = () => {
    setUser(null); setIsLoggedIn(false); setIsGuest(false); setPendingUserState(null);
    AsyncStorage.removeItem(AUTH_KEY);
  };

  const loginAsGuest = () => {
    setIsGuest(true); setIsLoggedIn(false); setUser({ name: 'Guest' });
  };

  const getAccounts = async (): Promise<StoredAccount[]> => {
    try {
      const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
      return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
    } catch {
      return [];
    }
  };

  const login = async (email: string, password: string): Promise<{ ok: boolean; user?: AuthUser; error?: string }> => {
    if (!email.trim()) return { ok: false, error: 'Please enter your email address.' };
    if (!password)     return { ok: false, error: 'Please enter your password.' };
    try {
      const accounts = await getAccounts();
      const match = accounts.find(a =>
        a.email?.toLowerCase() === email.trim().toLowerCase() && a.password === password
      );
      if (!match) return { ok: false, error: 'Invalid email or password. Please verify your credentials.' };
      const u: AuthUser = { name: match.name, email: match.email };
      authenticate(u);
      return { ok: true, user: u };
    } catch {
      return { ok: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (data: { name: string; email?: string; phone?: string; password?: string }): Promise<{ ok: boolean; error?: string }> => {
    try {
      const accounts = await getAccounts();
      if (data.email) {
        const exists = accounts.find(a => a.email?.toLowerCase() === data.email!.toLowerCase());
        if (exists) return { ok: false, error: 'An account with this email already exists.' };
      }
      if (data.phone) {
        const exists = accounts.find(a => a.phone === data.phone);
        if (exists) return { ok: false, error: 'An account with this phone number already exists.' };
      }
      const updated = [...accounts, data];
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updated));
      return { ok: true };
    } catch {
      return { ok: false, error: 'Registration failed. Please try again.' };
    }
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const accounts = await getAccounts();
      return accounts.some(a => a.email?.toLowerCase() === email.trim().toLowerCase());
    } catch {
      return false;
    }
  };

  const checkPhoneExists = async (phone: string): Promise<boolean> => {
    try {
      const accounts = await getAccounts();
      return accounts.some(a => a.phone === phone.trim());
    } catch {
      return false;
    }
  };

  const loginByPhone = async (phone: string): Promise<{ ok: boolean; error?: string }> => {
    if (!phone.trim()) return { ok: false, error: 'Please enter your phone number.' };
    try {
      const accounts = await getAccounts();
      const match = accounts.find(a => a.phone === phone.trim());
      if (!match) return { ok: false, error: 'No account found with this phone number. Please sign up first.' };
      setPendingUserState({ name: match.name, phone: match.phone });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Login failed. Please try again.' };
    }
  };

  const addToCart = (item: Omit<CartItem, 'qty'>) =>
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQty = (id: number, delta: number) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));

  const clearCart = () => setCart([]);

  const toggleWishlist = (id: number) =>
    setWishlistIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const addReview = (rev: Omit<Review, 'id'>) =>
    setReviews(prev => {
      const next = [...prev, { ...rev, id: Date.now().toString() }];
      AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(next));
      return next;
    });

  const markCheckoutComplete = () => {
    setHasCompletedCheckout(true);
    AsyncStorage.setItem(CHECKOUT_KEY, 'true');
  };

  const getItemReviews = (key: string) => reviews.filter(r => r.itemKey === key);

  const updateNotifPrefs = (patch: Partial<NotifPrefs>) => {
    setNotifPrefs(prev => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateSecurityPrefs = (patch: Partial<SecurityPrefs>) => {
    setSecurityPrefs(prev => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(SECURITY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(() => ({
    theme, themeReady, toggleTheme,
    cart, cartCount, addToCart, removeFromCart, updateQty, clearCart,
    wishlistIds, toggleWishlist,
    isLoggedIn, isGuest, user, pendingUser,
    authenticate, updateUser, setPendingUser, logout, loginAsGuest,
    login, loginByPhone, register, checkEmailExists, checkPhoneExists,
    reviews, hasCompletedCheckout, addReview, markCheckoutComplete, getItemReviews,
    notifPrefs, updateNotifPrefs,
    securityPrefs, updateSecurityPrefs,
  }), [
    theme, themeReady,
    cart, cartCount,
    wishlistIds,
    isLoggedIn, isGuest, user, pendingUser,
    reviews, hasCompletedCheckout,
    notifPrefs, securityPrefs,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
