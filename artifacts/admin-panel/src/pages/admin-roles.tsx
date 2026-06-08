import { useState } from "react";
import {
  useAdminUsers, useCreateAdminUser, useUpdateAdminUser,
  useDeleteAdminUser, useResetPassword, type AdminUser,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  UserPlus, Shield, MoreVertical, Trash2, KeyRound, PauseCircle,
  PlayCircle, Crown, ShieldCheck, ShieldAlert, Edit, Users, Headphones, Pencil
} from "lucide-react";
import { toast } from "sonner";

const STAFF_ROLES = [
  { value: "owner", label: "Owner", icon: Crown, color: "text-yellow-300", bg: "bg-yellow-500/10 border-yellow-400/40", desc: "Full system access. Cannot be restricted." },
  { value: "super_admin", label: "Super Admin", icon: ShieldAlert, color: "text-red-300", bg: "bg-red-500/10 border-red-400/40", desc: "All admin actions. Can manage admins." },
  { value: "admin", label: "Admin", icon: ShieldCheck, color: "text-primary", bg: "bg-primary/10 border-primary/40", desc: "Manage content, users, bookings, reviews." },
  { value: "editor", label: "Editor", icon: Pencil, color: "text-blue-300", bg: "bg-blue-500/10 border-blue-400/40", desc: "Create and edit content only." },
  { value: "support", label: "Support Agent", icon: Headphones, color: "text-purple-300", bg: "bg-purple-500/10 border-purple-400/40", desc: "View users, handle chat and bookings." },
];

function roleInfo(role: string) {
  return STAFF_ROLES.find(r => r.value === role) ?? STAFF_ROLES[2];
}

function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-ZA", { dateStyle: "medium" });
}

function fmtDateTime(d: string | null | undefined) {
  if (!d) return "Never";
  return new Date(d).toLocaleString("en-ZA", { dateStyle: "short", timeStyle: "short" });
}

// ── Create Admin Dialog ───────────────────────────────────────────────────────
function CreateAdminDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateAdminUser();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "admin" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.password.trim()) { toast.error("Name and password are required"); return; }
    if (!form.email.trim() && !form.phone.trim()) { toast.error("Email or phone is required"); return; }
    try {
      await create.mutateAsync({ name: form.name, email: form.email || undefined, phone: form.phone || undefined, password: form.password, role: form.role });
      toast.success(`${roleInfo(form.role).label} created successfully`);
      onClose();
      setForm({ name: "", email: "", phone: "", password: "", role: "admin" });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create admin");
    }
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="dark max-w-md">
        <DialogHeader>
          <DialogTitle>Create Admin Account</DialogTitle>
          <DialogDescription>Add a new staff member with a specific role.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {[
            { key: "name", label: "Full Name *", placeholder: "Jane Smith", type: "text" },
            { key: "email", label: "Email", placeholder: "jane@saplug.co.za", type: "email" },
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
              <SelectContent>
                {STAFF_ROLES.map(r => (
                  <SelectItem key={r.value} value={r.value}>
                    <div className="flex flex-col">
                      <span>{r.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.role && (
              <p className="text-xs text-muted-foreground mt-1.5 pl-1">{roleInfo(form.role).desc}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={create.isPending} className="bg-primary text-primary-foreground">
            {create.isPending ? "Creating…" : "Create Admin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Change Role Dialog ────────────────────────────────────────────────────────
function ChangeRoleDialog({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  const update = useUpdateAdminUser();
  const [role, setRole] = useState(user?.role ?? "admin");

  if (!user) return null;

  const handleSave = async () => {
    try {
      await update.mutateAsync({ id: user.id, role });
      toast.success(`Role updated to ${roleInfo(role).label}`);
      onClose();
    } catch { toast.error("Failed to update role"); }
  };

  return (
    <Dialog open={!!user} onOpenChange={o => !o && onClose()}>
      <DialogContent className="dark max-w-sm">
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>Update the access level for {user.name}.</DialogDescription>
        </DialogHeader>
        <div className="py-2 space-y-2">
          <Label className="text-xs text-muted-foreground">New Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="bg-muted/30"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STAFF_ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
              <SelectItem value="user">User (remove admin access)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground pl-1">
            {role === "user" ? "This will remove all admin access from this account." : roleInfo(role).desc}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={update.isPending} className="bg-primary text-primary-foreground">
            {update.isPending ? "Saving…" : "Save Role"}
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
      toast.success("Password reset"); onClose(); setPw(""); setConfirm("");
    } catch { toast.error("Failed to reset password"); }
  };

  return (
    <Dialog open={!!user} onOpenChange={o => !o && onClose()}>
      <DialogContent className="dark max-w-sm">
        <DialogHeader><DialogTitle>Reset Password</DialogTitle><DialogDescription>Set a new password for {user.name}.</DialogDescription></DialogHeader>
        <div className="space-y-3 py-2">
          <div><Label className="text-xs text-muted-foreground">New Password</Label><Input type="password" value={pw} onChange={e => setPw(e.target.value)} className="mt-1 bg-muted/30" /></div>
          <div><Label className="text-xs text-muted-foreground">Confirm Password</Label><Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-1 bg-muted/30" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleReset} disabled={reset.isPending} className="bg-primary text-primary-foreground">{reset.isPending ? "Resetting…" : "Reset Password"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Remove Admin Dialog ───────────────────────────────────────────────────────
function RemoveAdminDialog({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  const update = useUpdateAdminUser();
  if (!user) return null;

  const handleRemove = async () => {
    try {
      await update.mutateAsync({ id: user.id, role: "user" });
      toast.success(`${user.name} removed from admin roles`);
      onClose();
    } catch { toast.error("Failed to remove admin"); }
  };

  return (
    <Dialog open={!!user} onOpenChange={o => !o && onClose()}>
      <DialogContent className="dark max-w-sm">
        <DialogHeader>
          <DialogTitle>Remove Admin Access</DialogTitle>
          <DialogDescription>Remove admin access from <strong>{user.name}</strong>? They will become a regular user.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleRemove} disabled={update.isPending}>{update.isPending ? "Removing…" : "Remove Admin"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Admin Roles Page ─────────────────────────────────────────────────────
export default function AdminRoles() {
  const { data: users, isLoading } = useAdminUsers();
  const update = useUpdateAdminUser();
  const del = useDeleteAdminUser();

  const [showCreate, setShowCreate] = useState(false);
  const [changeRoleUser, setChangeRoleUser] = useState<AdminUser | null>(null);
  const [resetUser, setResetUser] = useState<AdminUser | null>(null);
  const [removeUser, setRemoveUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);

  const staff = (users ?? []).filter(u => u.role !== "user") as AdminUser[];

  const handleToggleSuspend = async (user: AdminUser) => {
    try {
      await update.mutateAsync({ id: user.id, suspended: !user.suspended });
      toast.success(user.suspended ? "Admin unsuspended" : "Admin suspended");
    } catch { toast.error("Failed to update status"); }
  };

  const handleDelete = async (user: AdminUser) => {
    try { await del.mutateAsync(user.id); toast.success("Admin deleted"); setDeleteUser(null); }
    catch (err: any) { toast.error(err?.message ?? "Failed to delete"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Roles</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage staff accounts, roles and permissions.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-primary text-primary-foreground gap-1.5">
          <UserPlus className="h-4 w-4" /> Create Admin
        </Button>
      </div>

      {/* Role Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {STAFF_ROLES.map(({ value, label, icon: Icon, color, bg, desc }) => {
          const count = staff.filter(u => u.role === value).length;
          return (
            <Card key={value} className={`border bg-card ${bg}`}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className={`text-xs font-semibold ${color}`}>{label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Staff Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Staff Members ({staff.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading staff…</div>
          ) : staff.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No admin staff yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Create your first admin account above.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Contact</TableHead>
                  <TableHead className="text-xs">Role</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Last Login</TableHead>
                  <TableHead className="text-xs">Added</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map(user => {
                  const ri = roleInfo(user.role);
                  const Icon = ri.icon;
                  return (
                    <TableRow key={user.id} className={`border-border ${user.suspended ? "opacity-60" : ""}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div>{user.email ?? "—"}</div>
                        <div>{user.phone ?? "—"}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs border ${ri.bg} ${ri.color}`}>
                          <Icon className="h-3 w-3 mr-1" />
                          {ri.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.suspended
                          ? <Badge className="text-xs bg-orange-900/40 text-orange-300 border border-orange-500/40">Suspended</Badge>
                          : <Badge className="text-xs bg-green-900/40 text-green-300 border border-green-500/40">Active</Badge>}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{fmtDateTime(user.lastLoginAt)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{fmtDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-3.5 w-3.5" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="dark w-44">
                            <DropdownMenuItem onClick={() => setChangeRoleUser(user)}>
                              <Edit className="h-3.5 w-3.5 mr-2" /> Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setResetUser(user)}>
                              <KeyRound className="h-3.5 w-3.5 mr-2" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleSuspend(user)}>
                              {user.suspended
                                ? <><PlayCircle className="h-3.5 w-3.5 mr-2 text-green-400" /> Unsuspend</>
                                : <><PauseCircle className="h-3.5 w-3.5 mr-2 text-orange-400" /> Suspend</>}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRemoveUser(user)} className="text-orange-400 focus:text-orange-300">
                              <Shield className="h-3.5 w-3.5 mr-2" /> Remove Admin
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteUser(user)} className="text-red-400 focus:text-red-300">
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateAdminDialog open={showCreate} onClose={() => setShowCreate(false)} />
      <ChangeRoleDialog user={changeRoleUser} onClose={() => setChangeRoleUser(null)} />
      <ResetPasswordDialog user={resetUser} onClose={() => setResetUser(null)} />
      <RemoveAdminDialog user={removeUser} onClose={() => setRemoveUser(null)} />

      {/* Delete confirmation */}
      <Dialog open={!!deleteUser} onOpenChange={o => !o && setDeleteUser(null)}>
        <DialogContent className="dark max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Admin Account</DialogTitle>
            <DialogDescription>Permanently delete <strong>{deleteUser?.name}</strong>? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteUser && handleDelete(deleteUser)} disabled={del.isPending}>
              {del.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
