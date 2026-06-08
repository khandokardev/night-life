import {
  useListCategories, getListCategoriesQueryKey,
  useCreateCategory, useUpdateCategory, useDeleteCategory,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash, Edit, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import type { Category } from "@workspace/api-client-react";

const EMOJI_PRESETS = ["🎉", "🍽️", "🌃", "🎭", "🛍️", "🎵", "🌊", "🎪", "🍸", "🌺", "🎸", "🏖️", "🎊", "🌴", "💃", "🕺", "🎯", "🍾", "🎶", "⭐"];

type FormData = { name: string; icon: string; order: number; active: boolean };
const empty = (): FormData => ({ name: "", icon: "🎉", order: 0, active: true });

export default function Categories() {
  const { data: items, isLoading } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormData>(empty());
  const set = (patch: Partial<FormData>) => setForm(f => ({ ...f, ...patch }));

  const handleOpenNew = () => { setEditing(null); setForm(empty()); setOpen(true); };
  const handleOpenEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name || "", icon: c.icon || "🎉", order: c.order ?? 0, active: c.active ?? true });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    const opts = {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() }); toast({ title: editing ? "Category updated" : "Category created" }); setOpen(false); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    };
    if (editing) updateMutation.mutate({ id: editing.id, data: form }, opts);
    else createMutation.mutate({ data: form }, opts);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this category? Linked items will lose their category.")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() }); toast({ title: "Deleted" }); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Categories</h1>
        <Button onClick={handleOpenNew}><PlusCircle className="w-4 h-4 mr-2" /> New Category</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription>Categories organise your content in the mobile app.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input value={form.name} onChange={e => set({ name: e.target.value })} placeholder="e.g. Nightclubs" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">Icon — Emoji or Image</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_PRESETS.map(e => (
                  <button key={e} type="button" onClick={() => set({ icon: e })}
                    className={`text-xl p-1 rounded border ${form.icon === e ? "border-primary bg-primary/20" : "border-border hover:bg-muted/50"}`}
                  >{e}</button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Or upload a custom icon image:</p>
              <ImageUpload value={form.icon?.startsWith("http") || form.icon?.startsWith("/api") ? form.icon : ""} onChange={v => set({ icon: v })} />
              {form.icon && !form.icon.startsWith("http") && !form.icon.startsWith("/api") && (
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg border border-border">
                  <span className="text-2xl">{form.icon}</span>
                  <span className="text-sm text-muted-foreground">Selected emoji</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order (lower = first)</label>
              <Input type="number" value={form.order} onChange={e => set({ order: parseInt(e.target.value) || 0 })} placeholder="0" />
            </div>
            <div className="flex items-center justify-between border p-3 rounded bg-muted/20">
              <label className="text-sm font-medium">Active / Visible</label>
              <Switch checked={form.active} onCheckedChange={v => set({ active: v })} />
            </div>
          </div>
          <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
            <Save className="w-4 h-4 mr-2" /> Save Category
          </Button>
        </DialogContent>
      </Dialog>

      <div className="border border-border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Icon</TableHead><TableHead>Name</TableHead><TableHead>Order</TableHead>
              <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )) : items?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No categories yet. Add one!</TableCell></TableRow>
            ) : items?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(c => (
              <TableRow key={c.id} className="border-border hover:bg-muted/50">
                <TableCell>
                  {c.icon?.startsWith("http") ? (
                    <img src={c.icon} alt="" className="w-8 h-8 rounded object-cover" />
                  ) : (
                    <span className="text-2xl">{c.icon}</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{c.order}</TableCell>
                <TableCell>
                  <Badge className={c.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                    {c.active ? "Active" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(c)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}><Trash className="w-4 h-4" /></Button>
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
