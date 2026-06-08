import {
  useListTours, getListToursQueryKey,
  useCreateTour, useUpdateTour, useDeleteTour,
  useListCategories, getListCategoriesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash, Edit, Save, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { Tour } from "@workspace/api-client-react";
import { ArrayInput } from "@/components/array-input";
import { ImageUploadArray } from "@/components/image-upload-array";

type FormData = {
  name: string; description: string; images: string[];
  price: string; address: string; mapsUrl: string; phone: string; contactEmail: string;
  duration: string; maxGroupSize: number; meetingPoint: string;
  includes: string[]; tags: string[];
  categoryId: number | undefined;
  available: boolean; isFeatured: boolean; isTrending: boolean; isPopular: boolean;
};
const empty = (): FormData => ({
  name: "", description: "", images: [], price: "", address: "", mapsUrl: "",
  phone: "", contactEmail: "", duration: "", maxGroupSize: 0, meetingPoint: "",
  includes: [], tags: [], categoryId: undefined,
  available: true, isFeatured: false, isTrending: false, isPopular: false,
});

export default function Tours() {
  const { data: items, isLoading } = useListTours({ query: { queryKey: getListToursQueryKey() } });
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const createMutation = useCreateTour();
  const updateMutation = useUpdateTour();
  const deleteMutation = useDeleteTour();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [form, setForm] = useState<FormData>(empty());
  const set = (patch: Partial<FormData>) => setForm(f => ({ ...f, ...patch }));

  const handleOpenNew = () => { setEditing(null); setForm(empty()); setOpen(true); };
  const handleOpenEdit = (t: Tour) => {
    setEditing(t);
    setForm({
      name: t.name || "", description: t.description || "",
      images: (t.images as string[] | null) || [],
      price: t.price || "", address: t.address || "", mapsUrl: t.mapsUrl || "",
      phone: t.phone || "", contactEmail: t.contactEmail || "",
      duration: t.duration || "", maxGroupSize: t.maxGroupSize ?? 0, meetingPoint: t.meetingPoint || "",
      includes: ((t as any).includes as string[] | null) || [],
      tags: (t.tags as string[] | null) || [],
      categoryId: t.categoryId || undefined,
      available: t.available ?? true, isFeatured: t.isFeatured ?? false,
      isTrending: t.isTrending ?? false, isPopular: t.isPopular ?? false,
    });
    setOpen(true);
  };

  const payload = () => ({ ...form, price: form.price || undefined, mapsUrl: form.mapsUrl || undefined, phone: form.phone || undefined, contactEmail: form.contactEmail || undefined });

  const handleSave = () => {
    const opts = {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListToursQueryKey() }); toast({ title: editing ? "Tour updated" : "Tour created" }); setOpen(false); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    };
    if (editing) updateMutation.mutate({ id: editing.id, data: payload() }, opts);
    else createMutation.mutate({ data: payload() }, opts);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this tour?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListToursQueryKey() }); toast({ title: "Deleted" }); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Tours</h1>
        <Button onClick={handleOpenNew}><PlusCircle className="w-4 h-4 mr-2" /> New Tour</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Tour" : "New Tour"}</DialogTitle>
            <DialogDescription>Manage tour details, itinerary, and media.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="flags">Visibility</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Tour Name *</label>
                <Input value={form.name} onChange={e => set({ name: e.target.value })} placeholder="Tour name" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Description</label>
                <Textarea value={form.description} onChange={e => set({ description: e.target.value })} rows={4} placeholder="Describe this tour..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Price (ZAR)</label>
                  <Input type="number" value={form.price} onChange={e => set({ price: e.target.value })} placeholder="1500" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Duration</label>
                  <Input value={form.duration} onChange={e => set({ duration: e.target.value })} placeholder="4 hours" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Max Group Size</label>
                  <Input type="number" value={form.maxGroupSize} onChange={e => set({ maxGroupSize: parseInt(e.target.value) || 0 })} placeholder="20" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Meeting Point</label>
                  <Input value={form.meetingPoint} onChange={e => set({ meetingPoint: e.target.value })} placeholder="Sandton City, JHB" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Phone</label>
                  <Input value={form.phone} onChange={e => set({ phone: e.target.value })} placeholder="+27 11 000 0000" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Contact Email</label>
                  <Input value={form.contactEmail} onChange={e => set({ contactEmail: e.target.value })} placeholder="tours@saplug.co.za" /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Category</label>
                <Select value={form.categoryId?.toString()} onValueChange={v => set({ categoryId: parseInt(v) })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                </Select></div>
            </TabsContent>
            <TabsContent value="media" className="space-y-4">
              <ImageUploadArray label="Tour Images" values={form.images} onChange={v => set({ images: v })} />
            </TabsContent>
            <TabsContent value="details" className="space-y-4">
              <ArrayInput label="What's Included" values={form.includes} onChange={v => set({ includes: v })} placeholder="e.g. Transport, Guide, Lunch" />
              <ArrayInput label="Tags" values={form.tags} onChange={v => set({ tags: v })} placeholder="e.g. adventure, private" />
            </TabsContent>
            <TabsContent value="flags" className="space-y-3">
              {([["available", "Active / Visible"], ["isFeatured", "Featured"], ["isTrending", "Trending"], ["isPopular", "Popular"]] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between border p-3 rounded bg-muted/20">
                  <label className="text-sm font-medium">{label}</label>
                  <Switch checked={!!form[key]} onCheckedChange={v => set({ [key]: v })} />
                </div>
              ))}
            </TabsContent>
          </Tabs>
          <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending} className="mt-2">
            <Save className="w-4 h-4 mr-2" /> Save Tour
          </Button>
        </DialogContent>
      </Dialog>

      <div className="border border-border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Name</TableHead><TableHead>Duration</TableHead><TableHead>Price</TableHead>
              <TableHead>Group Size</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )) : items?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No tours yet. Add one!</TableCell></TableRow>
            ) : items?.map(t => (
              <TableRow key={t.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{t.duration || "—"}</TableCell>
                <TableCell className="text-sm">{t.price ? `R${t.price}` : "—"}</TableCell>
                <TableCell className="text-sm">{t.maxGroupSize ? `Max ${t.maxGroupSize}` : "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge className={t.available ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                      {t.available ? "Active" : "Hidden"}
                    </Badge>
                    {t.isFeatured && <Badge variant="outline" className="text-xs border-primary text-primary"><Star className="w-3 h-3 mr-0.5" />Featured</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(t)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}><Trash className="w-4 h-4" /></Button>
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
