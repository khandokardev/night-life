import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customInstance } from "@/lib/mutator";

export interface AdminTransaction {
  id: number;
  userId: number;
  bookingId: number | null;
  stripePaymentIntentId: string | null;
  amount: number;
  currency: string;
  status: string;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface StripeStatus {
  configured: boolean;
  valid: boolean;
  webhookSet: boolean;
  mode: "test" | "live" | null;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  suspended: boolean;
  bannedAt: string | null;
  verificationStatus: string;
  lastLoginAt: string | null;
  loginCount: number;
  bookingCount: number;
  createdAt: string;
}

export interface EnhancedAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalReviews: number;
  pendingReviews: number;
  activePromotions: number;
  totalTransactions: number;
  totalRevenue: number;
  pendingChats: number;
  recentRegistrations: Array<{ id: number; name: string; email: string | null; role: string; createdAt: string }>;
}

export const TRANSACTIONS_KEY = ["admin", "transactions"] as const;
export const STRIPE_STATUS_KEY = ["admin", "stripe-status"] as const;
export const ADMIN_USERS_KEY = ["admin", "users"] as const;

export function useAdminTransactions() {
  return useQuery<AdminTransaction[]>({
    queryKey: TRANSACTIONS_KEY,
    queryFn: () => customInstance<AdminTransaction[]>({ url: "/api/admin/transactions", method: "GET" }),
  });
}

export function useStripeStatus() {
  return useQuery<StripeStatus>({
    queryKey: STRIPE_STATUS_KEY,
    queryFn: () => customInstance<StripeStatus>({ url: "/api/admin/stripe/status", method: "GET" }),
    retry: false,
    staleTime: 60_000,
  });
}

export function useRefundTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      customInstance<AdminTransaction>({ url: `/api/admin/transactions/${id}/refund`, method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: TRANSACTIONS_KEY }),
  });
}

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ADMIN_USERS_KEY,
    queryFn: () => customInstance<AdminUser[]>({ url: "/api/admin/users", method: "GET" }),
    staleTime: 15_000,
  });
}

export function useCreateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; email?: string; phone?: string; password: string; role: string }) =>
      customInstance<AdminUser>({ url: "/api/admin/users", method: "POST", data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_USERS_KEY }),
  });
}

export function useUpdateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; name?: string; email?: string; phone?: string; role?: string; suspended?: boolean; banned?: boolean }) =>
      customInstance<AdminUser>({ url: `/api/admin/users/${id}`, method: "PATCH", data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_USERS_KEY }),
  });
}

export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      customInstance<{ ok: boolean }>({ url: `/api/admin/users/${id}`, method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_USERS_KEY }),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      customInstance<{ ok: boolean }>({ url: `/api/admin/users/${id}/reset-password`, method: "POST", data: { password } }),
  });
}

export function useUserBookings(userId: number | null) {
  return useQuery({
    queryKey: ["admin", "user-bookings", userId],
    queryFn: () => customInstance<unknown[]>({ url: `/api/admin/users/${userId}/bookings`, method: "GET" }),
    enabled: !!userId,
  });
}

export function useEnhancedAnalytics() {
  return useQuery<EnhancedAnalytics>({
    queryKey: ["admin", "analytics-enhanced"],
    queryFn: () => customInstance<EnhancedAnalytics>({ url: "/api/admin/analytics", method: "GET" }),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
