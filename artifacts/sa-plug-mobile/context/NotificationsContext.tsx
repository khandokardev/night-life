import React, { createContext, useCallback, useContext, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type NotifType =
  | 'promotion'
  | 'membership'
  | 'booking'
  | 'order'
  | 'event'
  | 'app_update'
  | 'new_service'
  | 'account';

export type Notification = {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  timestamp: string; // ISO 8601 — backend-ready
  read: boolean;
  route?: string;    // internal navigation route on tap
};

type NotificationsContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearRead: () => void;
  clearAll: () => void;
  // Future API integration point:
  // refreshNotifications: () => Promise<void>;
};

// ─── Demo data ─────────────────────────────────────────────────────────────────
// Replace this with an API call when the backend is ready:
// const fetchNotifications = async (token: string): Promise<Notification[]> =>
//   fetch(`${API_BASE}/api/v1/notifications`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());

const now = Date.now();
const ago = (ms: number) => new Date(now - ms).toISOString();
const h = 3600000;
const d = 86400000;

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'booking',
    title: 'Booking Confirmed',
    body: 'Your VIP Table at ONYX Sandton for 24 May is confirmed. Ref: SAPVIP-482291.',
    timestamp: ago(1 * h),
    read: false,
    route: '/booking-detail',
  },
  {
    id: 'n2',
    type: 'promotion',
    title: '20% Off This Weekend',
    body: 'Book any VIP table experience before Sunday and save 20%. Limited spots remaining.',
    timestamp: ago(4 * h),
    read: false,
    route: '/(tabs)/clubs',
  },
  {
    id: 'n3',
    type: 'event',
    title: 'Neon Nights — Tomorrow Night',
    body: 'Your saved event at ONYX Sandton starts tomorrow at 10 PM. Bring your QR code for entry.',
    timestamp: ago(8 * h),
    read: false,
    route: '/(tabs)/clubs',
  },
  {
    id: 'n4',
    type: 'membership',
    title: 'VIP Membership Renewed',
    body: 'Your SA PLUG Gold membership has been renewed for another 12 months. Welcome back to the inner circle.',
    timestamp: ago(1 * d + 2 * h),
    read: true,
    route: '/profile-vip',
  },
  {
    id: 'n5',
    type: 'order',
    title: 'Order Shipped',
    body: 'Your SA PLUG Branded Cap has been dispatched. Estimated delivery in 2–3 business days.',
    timestamp: ago(1 * d + 4 * h),
    read: true,
    route: '/(tabs)/shop',
  },
  {
    id: 'n6',
    type: 'app_update',
    title: 'New Feature: QR Entry',
    body: 'You can now save and share your entry QR codes directly from your booking confirmation.',
    timestamp: ago(3 * d),
    read: true,
  },
  {
    id: 'n7',
    type: 'new_service',
    title: 'Private Safari Now Available',
    body: 'Exclusive private safari experiences have been added to the SA PLUG catalog. Book yours today.',
    timestamp: ago(4 * d),
    read: true,
    route: '/(tabs)/tours',
  },
  {
    id: 'n8',
    type: 'account',
    title: 'Security Alert',
    body: 'Your account was accessed from a new device. If this wasn\'t you, update your password immediately.',
    timestamp: ago(6 * d),
    read: true,
    route: '/profile-password',
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────
const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearRead = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationsContext.Provider value={{
      notifications, unreadCount,
      markAsRead, markAllRead, clearRead, clearAll,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
