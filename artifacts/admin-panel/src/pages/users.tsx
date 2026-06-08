import { useState } from "react";
import {
  useAdminUsers, useCreateAdminUser, useUpdateAdminUser,
  useDeleteAdminUser, useResetPassword, useUserBookings,
  type AdminUser,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  UserPlus, Search, Trash2, KeyRound, PauseCircle, PlayCircle,
  BookOpen, Shield, Users as UsersIcon, MoreVertical, Ban, CheckCircle2,
  ShieldAlert, UserCheck, Edit, Eye, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "support", label: "Support Agent" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
  { value: "owner", label: "Owner" },
];

function roleBadgeClass(role: string) {
  switch (role) {
    case "owner": return "border-yellow-400/60 text-yellow-300 bg-yellow-500/10";
    case "super_admin": return "border-red-400/60 text-red-300 bg-red-500/10";
    case "admin": return "border-primary/60 text-primary bg-primary/10";
    case "editor": return "border-blue-400/60 text-blue-300 bg-blue-500/10";
    case "support": return "border-purple-400/60 text-purple-300 bg-purple-500/10";
    default: return "border-border text-muted-foreground";
  }
}

function roleLabel(role: string) {
  return ROLE_OPTIONS.find(r => r.value === role)?.label ?? role;
}

function statusBadge(user: AdminUser) {
  if (user.bannedAt) return <Badge className="text-xs bg-red-900/40 text-red-300 border border-red-500/40">Banned</Badge>;
  if (user.suspended) return <Badge className="text-xs bg-orange-900/40 text-orange-300 border border-orange-500/40">Suspended</Badge>;
  return <Badge className="text-xs bg-green-900/40 text-green-300 border border-green-500/40">Active</Badge>;
}

function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-ZA", { dateStyle: "medium" });
}

function fmtDateTime(d: string | null | undefined) {
  if (!d) return "Never";
  return new Date(d).toLocaleString("en-ZA", { dateStyle: "short", timeStyle: "short" });
}

// ── Add User Dialog ───────────────────────────────────────────────────────────
function AddUserDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateAdminUser();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "user" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.password.trim()) { toast.error("Name and password are required"); return; }
    if (!form.email.trim() && !form.phone.trim()) { toast.error("Email or phone is required"); return; }
    try {
      await create.mutateAsync({ name: form.name, email: form.email || undefined, phone: form.phone || undefined, password: form.password, role: form.role });
      toast.success("User created");
      onClose();
      setForm({ name: "", email: "", phone: "", password: "", role: "user" });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create user");
    }
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="dark max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Manually register a user account.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {[
            { key: "name", label: "Full Name *", placeholder: "John Doe", type: "text" },
            { key: "email", label: "Email", placeholder: "john@example.com", type: "email" },
            { key: "phone", label: "Phone", placeholder: "+27 11 000 0000", type: "text" },
            { key: "password", label: "Password *", placeholder: "Min 6 characters", type: "password" },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <Label className="text-xs text-muted-foreground">{label}</Label>
              <Input type={type} placeholder={placeholder} value={(form as any)[key]} onChange={e => set(key, e.target.value)} className="mt-1 bg-muted/30" />
            </div>
          ))}
          <div>
            <Label className="text-xs text-muted-foreground">Role</Label>
            <Select value={form.role} onValueChange={v => set("role", v)}>
              <SelectTrigger className="mt-1 bg-muted/30"><SelectValue /></SelectTrigger>
              <SelectContent>{ROLE_OPTIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={create.isPending} className="bg-primary text-primary-foreground">
            {create.isPending ? "Creating…" : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit User Dialog ──────────────────────────────────────────────────────────
function EditUserDialog({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  const update = useUpdateAdminUser();
  const [form, setForm] = useState({ name: user?.name ?? "", role: user?.role ?? "user", email: user?.email ?? "", phone: user?.phone ?? "" });

  if (!user) return null;

  const handleSave = async () => {
    try {
      await update.mutateAsync({ id: user.id, name: form.name, role: form.role, email: form.email || undefined, phone: form.phone || undefined });
      toast.success("User updated");
      onClose();
    } catch { toast.error("Failed to update user"); }
  };

  return (
    <Dialog open={!!user} onOpenChange={o => !o && onClose()}>
      <DialogContent className="dark max-w-md">
        <DialogHeader><DialogTitle>Edit User</DialogTitle><DialogDescription>{user.email ?? user.phone}</DialogDescription></DialogHeader>
        <div className="space-y-3 py-2">
          {[
            { key: "name", label: "Full Name", type: "text" },
            { key: "email", label: "Email", type: "email" },
            { key: "phone", label: "Phone", type: "text" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <Label className="text-xs text-muted-foreground">{label}</Label>
              <Input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="mt-1 bg-muted/30" />
            </div>
          ))}
          <div>
            <Label className="text-xs text-muted-foreground">Role</Label>
            <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
              <SelectTrigger className="mt-1 bg-muted/30"><SelectValue /></SelectTrigger>
              <SelectContent>{ROLE_OPTIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={update.isPending} className="bg-primary text-primary-foreground">
            {update.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Reset Password Dialog ─────────────────────────────────────────────────────
function ResetPasswordDialog({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  const reset = useResetPassword();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");

  if (!user) return null;

  const handleReset = async () => {
    if (pw.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (pw !== confirm) { toast.error("Passwords do not match"); return; }
    try {
      await reset.mutateAsync({ id: user.id, password: pw });
      toast.success("Password reset successfully");
      onClose(); setPw(""); setConfirm("");
    } catch { toast.error("Failed to reset password"); }
  };

  return (
    <Dialog open={!!user} onOpenChange={o => !o && onClose()}>
      <DialogContent className="dark max-w-sm">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Set a new password for {user.name}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <Label className="text-xs text-muted-foreground">New Password</Label>
            <Input type="password" placeholder="Min 6 characters" value={pw} onChange={e => setPw(e.target.value)} className="mt-1 bg-muted/30" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Confirm Password</Label>
            <Input type="password" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-1 bg-muted/30" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleReset} disabled={reset.isPending} className="bg-primary text-primary-foreground">
            {reset.isPending ? "Resetting…" : "Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete User Dialog ────────────────────────────────────────────────────────
function DeleteUserDialog({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  const del = useDeleteAdminUser();
  if (!user) return null;
  const handleDelete = async () => {
    try { await del.mutateAsync(user.id); toast.success("User deleted"); onClose(); }
    catch (err: any) { toast.error(err?.message ?? "Failed to delete user"); }
  };
  return (
    <Dialog open={!!user} onOpenChange={o => !o && onClose()}>
      <DialogContent className="dark max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>Permanently delete <strong>{user.name}</strong>? All their data will be removed. This cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={del.isPending}>{del.isPending ? "Deleting…" : "Delete Permanently"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── User Detail Dialog ────────────────────────────────────────────────────────
function UserDetailDialog({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  const { data: bookings, isLoading } = useUserBookings(user?.id ?? null);
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={o => !o && onClose()}>
      <DialogContent className="dark max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold">{user.name}</p>
              <p className="text-xs text-muted-foreground font-normal">{user.email ?? user.phone ?? "No contact"}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Profile Info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "User ID", value: `#${user.id}` },
              { label: "Role", value: roleLabel(user.role) },
              { label: "Status", value: user.bannedAt ? "Banned" : user.suspended ? "Suspended" : "Active" },
              { label: "Verification", value: user.verificationStatus },
              { label: "Registered", value: fmtDate(user.createdAt) },
              { label: "Last Login", value: fmtDateTime(user.lastLoginAt) },
              { label: "Login Count", value: `${user.loginCount} times` },
              { label: "Total Bookings", value: `${user.bookingCount}` },
              { label: "Email", value: user.email ?? "—" },
              { label: "Phone", value: user.phone ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-muted/20 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
                <p className="text-sm font-medium mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Bookings */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Booking History</p>
            <div className="border border-border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
              {isLoading ? (
                <p className="text-sm text-muted-foreground p-4">Loading bookings…</p>
              ) : !(bookings as any[])?.length ? (
                <p className="text-sm text-muted-foreground p-4 text-center">No bookings yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-xs">ID</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(bookings as any[]).map(b => (
                      <TableRow key={b.id} className="border-border">
                        <TableCell className="text-xs font-mono text-muted-foreground">#{b.id}</TableCell>
                        <TableCell className="text-xs capitalize">{b.bookingType ?? b.type ?? "—"}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{b.status}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{fmtDate(b.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Users Page ───────────────────────────────────────────────────────────
export default function Users() {
  const { data: users, isLoading, refetch } = useAdminUsers();
  const update = useUpdateAdminUser();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "banned">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [resetUser, setResetUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null);

  const all = (users ?? []) as AdminUser[];

  const filtered = all.filter(u => {
    if (statusFilter === "active" && (u.suspended || u.bannedAt)) return false;
    if (statusFilter === "suspended" && (!u.suspended || u.bannedAt)) return false;
    if (statusFilter === "banned" && !u.bannedAt) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q)
      || (u.email ?? "").toLowerCase().includes(q)
      || (u.phone ?? "").includes(q)
      || String(u.id).includes(q);
  });

  const handleToggleSuspend = async (user: AdminUser) => {
    try {
      await update.mutateAsync({ id: user.id, suspended: !user.suspended });
      toast.success(user.suspended ? "User unsuspended" : "User suspended");
    } catch { toast.error("Failed to update user"); }
  };

  const handleToggleBan = async (user: AdminUser) => {
    const isBanned = !!user.bannedAt;
    try {
      await update.mutateAsync({ id: user.id, banned: !isBanned });
      toast.success(isBanned ? "User unbanned" : "User banned");
    } catch { toast.error("Failed to update ban status"); }
  };

  const stats = [
    { label: "Total Users", value: all.length, icon: UsersIcon, color: "text-primary" },
    { label: "Active", value: all.filter(u => !u.suspended && !u.bannedAt).length, icon: UserCheck, color: "text-green-400" },
    { label: "Suspended", value: all.filter(u => u.suspended && !u.bannedAt).length, icon: PauseCircle, color: "text-orange-400" },
    { label: "Banned", value: all.filter(u => !!u.bannedAt).length, icon: Ban, color: "text-red-400" },
    { label: "Staff", value: all.filter(u => u.role !== "user").length, icon: Shield, color: "text-blue-400" },
    { label: "Verified", value: all.filter(u => u.verificationStatus === "verified").length, icon: CheckCircle2, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">All app users, synchronized automatically from the database.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground gap-1.5">
            <UserPlus className="h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-border bg-card">
            <CardContent className="p-3 flex flex-col gap-1">
              <Icon className={`h-4 w-4 ${color}`} />
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm bg-muted/30"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
              <TabsList className="bg-muted/30 h-8">
                <TabsTrigger value="all" className="text-xs h-7">All ({all.length})</TabsTrigger>
                <TabsTrigger value="active" className="text-xs h-7">Active</TabsTrigger>
                <TabsTrigger value="suspended" className="text-xs h-7">Suspended</TabsTrigger>
                <TabsTrigger value="banned" className="text-xs h-7">Banned</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading users…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs w-[180px]">User</TableHead>
                    <TableHead className="text-xs">Contact</TableHead>
                    <TableHead className="text-xs">Role</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Registered</TableHead>
                    <TableHead className="text-xs">Last Login</TableHead>
                    <TableHead className="text-xs text-center">Logins</TableHead>
                    <TableHead className="text-xs text-center">Bookings</TableHead>
                    <TableHead className="text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(user => (
                    <TableRow key={user.id} className={`border-border ${user.bannedAt ? "opacity-50" : user.suspended ? "opacity-70" : ""}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate max-w-[120px]">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">#{user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="truncate max-w-[160px]">{user.email ?? "—"}</div>
                        <div>{user.phone ?? "—"}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${roleBadgeClass(user.role)}`}>
                          {roleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>{statusBadge(user)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{fmtDate(user.createdAt)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{fmtDateTime(user.lastLoginAt)}</TableCell>
                      <TableCell className="text-xs text-center font-medium">{user.loginCount}</TableCell>
                      <TableCell className="text-xs text-center font-medium">{user.bookingCount}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="dark w-44">
                            <DropdownMenuItem onClick={() => setDetailUser(user)}>
                              <Eye className="h-3.5 w-3.5 mr-2" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditUser(user)}>
                              <Edit className="h-3.5 w-3.5 mr-2" /> Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setResetUser(user)}>
                              <KeyRound className="h-3.5 w-3.5 mr-2" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleSuspend(user)}>
                              {user.suspended && !user.bannedAt
                                ? <><PlayCircle className="h-3.5 w-3.5 mr-2 text-green-400" /> Unsuspend</>
                                : <><PauseCircle className="h-3.5 w-3.5 mr-2 text-orange-400" /> Suspend</>}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleBan(user)}>
                              {user.bannedAt
                                ? <><ShieldAlert className="h-3.5 w-3.5 mr-2 text-green-400" /> Unban User</>
                                : <><Ban className="h-3.5 w-3.5 mr-2 text-red-400" /> Ban User</>}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteUser(user)} className="text-red-400 focus:text-red-300">
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddUserDialog open={showAdd} onClose={() => setShowAdd(false)} />
      <EditUserDialog user={editUser} onClose={() => setEditUser(null)} />
      <ResetPasswordDialog user={resetUser} onClose={() => setResetUser(null)} />
      <DeleteUserDialog user={deleteUser} onClose={() => setDeleteUser(null)} />
      <UserDetailDialog user={detailUser} onClose={() => setDetailUser(null)} />
    </div>
  );
}
