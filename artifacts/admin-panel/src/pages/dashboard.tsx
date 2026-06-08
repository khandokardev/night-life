import { useEnhancedAnalytics } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, BookOpen, Star, Megaphone, CheckCircle, Clock, XCircle,
  TrendingUp, DollarSign, MessageSquare, UserCheck, UserPlus, Activity
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

function StatCard({
  title, value, sub, icon: Icon, highlight, color, href,
}: {
  title: string; value: number | string; sub?: string;
  icon: any; highlight?: boolean; color?: string; href?: string;
}) {
  const inner = (
    <Card className={`bg-card border-border transition-colors ${highlight ? "border-primary/50" : ""} ${href ? "hover:border-primary/30 cursor-pointer" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${color ?? "bg-muted/40"}`}>
          <Icon className={`h-4 w-4 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold tracking-tight ${highlight ? "text-primary" : ""}`}>{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", { dateStyle: "medium" });
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n / 100);
}

export default function Dashboard() {
  const { data: a, isLoading, error } = useEnhancedAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[120px]" /><Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent><Skeleton className="h-8 w-[60px]" /><Skeleton className="h-3 w-[80px] mt-1" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">Failed to load analytics. Please refresh the page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingBookings = a?.pendingBookings ?? 0;
  const cancelledBookings = (a?.totalBookings ?? 0) - (a?.confirmedBookings ?? 0) - (a?.pendingBookings ?? 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time platform overview</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary font-medium">Live</span>
        </div>
      </div>

      {/* User Stats */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Users</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users" value={a?.totalUsers ?? 0}
            sub="All registered accounts"
            icon={Users} highlight color="bg-primary/15" href="/users"
          />
          <StatCard
            title="Active Users" value={a?.activeUsers ?? 0}
            sub="Logged in last 30 days"
            icon={UserCheck} color="bg-green-500/15"
          />
          <StatCard
            title="New Today" value={a?.newUsersToday ?? 0}
            sub="Registered today"
            icon={UserPlus} highlight={(a?.newUsersToday ?? 0) > 0} color="bg-blue-500/15"
          />
          <StatCard
            title="Pending Chats" value={a?.pendingChats ?? 0}
            sub="Support conversations"
            icon={MessageSquare} highlight={(a?.pendingChats ?? 0) > 0} color="bg-orange-500/15" href="/chat"
          />
        </div>
      </div>

      {/* Bookings & Revenue */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Bookings & Revenue</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings" value={a?.totalBookings ?? 0}
            icon={BookOpen} color="bg-indigo-500/15" href="/bookings"
          />
          <StatCard
            title="Confirmed" value={a?.confirmedBookings ?? 0}
            sub={`${pendingBookings} still pending`}
            icon={CheckCircle} color="bg-green-500/15"
          />
          <StatCard
            title="Pending Review" value={a?.pendingBookings ?? 0}
            icon={Clock} highlight={(a?.pendingBookings ?? 0) > 0} color="bg-amber-500/15" href="/bookings"
          />
          <StatCard
            title="Total Revenue" value={fmtCurrency(a?.totalRevenue ?? 0)}
            sub="Stripe confirmed payments"
            icon={DollarSign} highlight={(a?.totalRevenue ?? 0) > 0} color="bg-emerald-500/15"
          />
        </div>
      </div>

      {/* Content & Marketing */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Content & Marketing</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Reviews" value={a?.totalReviews ?? 0}
            icon={Star} color="bg-yellow-500/15"
          />
          <StatCard
            title="Pending Reviews" value={a?.pendingReviews ?? 0}
            sub="Awaiting moderation"
            icon={Star} highlight={(a?.pendingReviews ?? 0) > 0} color="bg-red-500/15" href="/reviews"
          />
          <StatCard
            title="Active Promotions" value={a?.activePromotions ?? 0}
            icon={Megaphone} highlight={(a?.activePromotions ?? 0) > 0} color="bg-purple-500/15" href="/promotions"
          />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Booking Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Booking Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Confirmed", value: a?.confirmedBookings ?? 0, total: a?.totalBookings ?? 1, color: "bg-green-500", textColor: "text-green-400", icon: CheckCircle },
              { label: "Pending", value: pendingBookings, total: a?.totalBookings ?? 1, color: "bg-amber-500", textColor: "text-amber-400", icon: Clock },
              { label: "Cancelled", value: Math.max(0, cancelledBookings), total: a?.totalBookings ?? 1, color: "bg-red-500", textColor: "text-red-400", icon: XCircle },
            ].map(({ label, value, total, color, textColor, icon: Icon }) => {
              const pct = total > 0 ? Math.round((Math.max(0, value) / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${textColor}`} />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${textColor}`}>{value}</span>
                      <span className="text-xs text-muted-foreground">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {(a?.totalBookings ?? 0) === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">No bookings yet — they will appear here automatically.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary" /> Recent Registrations
              </CardTitle>
              <Link href="/users">
                <span className="text-xs text-primary hover:underline">View all →</span>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {(a?.recentRegistrations?.length ?? 0) === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No users registered yet.</p>
            ) : (
              <div className="space-y-3">
                {a?.recentRegistrations?.map(user => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email ?? "No email"}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${user.role !== "user" ? "border-primary/40 text-primary" : ""}`}>
                        {user.role}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{fmtDate(user.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Manage Users", href: "/users", icon: Users, desc: "View & manage accounts" },
              { label: "View Bookings", href: "/bookings", icon: BookOpen, desc: "Approve or cancel" },
              { label: "Moderate Reviews", href: "/reviews", icon: Star, desc: "Review pending content" },
              { label: "Support Chat", href: "/chat", icon: MessageSquare, desc: "Reply to users" },
            ].map(({ label, href, icon: Icon, desc }) => (
              <Link key={href} href={href}>
                <div className="flex flex-col gap-1 p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-all group cursor-pointer">
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">{label}</span>
                  <span className="text-xs text-muted-foreground">{desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
