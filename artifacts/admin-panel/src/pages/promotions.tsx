import { useListAllPromotions, getListAllPromotionsQueryKey, useCreatePromotion, useUpdatePromotion, useDeletePromotion } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash, Edit, Save, Megaphone, ToggleLeft, ToggleRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";

type FormData = {
  title: string; body: string; imageUrl: string;
  type: "banner" | "push" | "targeted";
  targetAll: boolean; active: boolean;
  startsAt: string; endsAt: string;
};
const empty = (): FormData => ({
  title: "", body: "", imageUrl: "", type: "banner",
  targetAll: true, active: true, startsAt: "", endsAt: "",
});

export default function Promotions() {
  const { data: items, isLoading } = useListAllPromotions({ query: { queryKey: getListAllPromotionsQueryKey() } });
  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();
  const deleteMutation = useDeletePromotion();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<FormData>(empty());
  const set = (patch: Partial<FormData>) => setForm(f => ({ ...f, ...patch }));

  const handleOpenNew = () => { setEditing(null); setForm(empty()); setOpen(true); };
  const handleOpenEdit = (p: any) => {
    setEditing(p);
    setForm({
      title: p.title || "", body: p.body || "", imageUrl: p.imageUrl || "",
      type: p.type || "banner", targetAll: p.targetAll ?? true, active: p.active ?? true,
      startsAt: p.startsAt ? new Date(p.startsAt).toISOString().split("T")[0] : "",
      endsAt: p.endsAt ? new Date(p.endsAt).toISOString().split("T")[0] : "",
    });
    setOpen(true);
  };

  const payload = () => ({
    ...form,
    body: form.body || undefined,
    imageUrl: form.imageUrl || undefined,
    startsAt: form.startsAt || undefined,
    endsAt: form.endsAt || undefined,
  });

  const handleSave = () => {
    if (!form.title.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    const opts = {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAllPromotionsQueryKey() }); toast({ title: editing ? "Promotion updated" : "Promotion created" }); setOpen(false); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    };
    if (editing) updateMutation.mutate({ id: editing.id, data: { active: form.active, title: form.title } }, opts);
    else createMutation.mutate({ data: payload() }, opts);
  };

  const toggleActive = (id: number, active: boolean) => {
    updateMutation.mutate({ id, data: { active } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAllPromotionsQueryKey() }); toast({ title: active ? "Promotion activated" : "Promotion paused" }); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this promotion?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAllPromotionsQueryKey() }); toast({ title: "Deleted" }); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Promotions</h1>
        <Button onClick={handleOpenNew}><PlusCircle className="w-4 h-4 mr-2" /> New Promotion</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Promotion" : "New Promotion"}</DialogTitle>
            <DialogDescription>Create banners, push campaigns, or targeted promotions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><label className="text-sm font-medium">Title *</label>
              <Input value={form.title} onChange={e => set({ title: e.target.value })} placeholder="Promotion title" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Message / Body</label>
              <Textarea value={form.body} onChange={e => set({ body: e.target.value })} rows={3} placeholder="Promotion details..." /></div>
            <ImageUpload label="Banner Image" value={form.imageUrl} onChange={v => set({ imageUrl: v })} />
            <div className="space-y-2"><label className="text-sm font-medium">Type</label>
              <Select value={form.type} onValueChange={v => set({ type: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">Banner (in-app)</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                  <SelectItem value="targeted">Targeted</SelectItem>
                </SelectContent>
              </Select></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Start Date</label>
                <Input type="date" value={form.startsAt} onChange={e => set({ startsAt: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">End Date</label>
                <Input type="date" value={form.endsAt} onChange={e => set({ endsAt: e.target.value })} /></div>
            </div>
            <div className="flex items-center justify-between border p-3 rounded bg-muted/20">
              <label className="text-sm font-medium">Active</label>
              <Switch checked={form.active} onCheckedChange={v => set({ active: v })} />
            </div>
            <div className="flex items-center justify-between border p-3 rounded bg-muted/20">
              <label className="text-sm font-medium">Target All Users</label>
              <Switch checked={form.targetAll} onCheckedChange={v => set({ targetAll: v })} />
            </div>
          </div>
          <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
            <Save className="w-4 h-4 mr-2" /> Save Promotion
          </Button>
        </DialogContent>
      </Dialog>

      <div className="border border-border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Banner</TableHead><TableHead>Title</TableHead><TableHead>Type</TableHead>
              <TableHead>Schedule</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
            )) : items?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No promotions yet. Create one!
              </TableCell></TableRow>
            ) : items?.map(p => (
              <TableRow key={p.id} className="border-border hover:bg-muted/50">
                <TableCell>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt="" className="w-16 h-10 object-cover rounded border border-border" onError={e => (e.currentTarget.style.display = "none")} />
                  ) : <div className="w-16 h-10 bg-muted/40 rounded border border-border flex items-center justify-center"><Megaphone className="w-4 h-4 text-muted-foreground" /></div>}
                </TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{p.title}</p>
                  {p.body && <p className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">{p.body}</p>}
                </TableCell>
                <TableCell><Badge variant="outline" className="text-xs capitalize">{p.type}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {p.startsAt ? new Date(p.startsAt).toLocaleDateString("en-ZA") : "—"}
                  {p.endsAt ? ` → ${new Date(p.endsAt).toLocaleDateString("en-ZA")}` : ""}
                </TableCell>
                <TableCell>
                  <Badge className={p.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                    {p.active ? "Active" : "Paused"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => toggleActive(p.id, !p.active)} title={p.active ? "Pause" : "Activate"}>
                      {p.active ? <ToggleRight className="w-4 h-4 text-primary" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(p)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}><Trash className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
