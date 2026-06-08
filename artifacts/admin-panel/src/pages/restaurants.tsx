import {
  useListRestaurants, getListRestaurantsQueryKey,
  useCreateRestaurant, useUpdateRestaurant, useDeleteRestaurant,
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
import type { Restaurant } from "@workspace/api-client-react";
import { ArrayInput } from "@/components/array-input";
import { ImageUploadArray } from "@/components/image-upload-array";

type FormData = {
  name: string; description: string;
  images: string[];
  price: string; address: string; mapsUrl: string; phone: string; contactEmail: string;
  cuisine: string; openingHours: string; dressCode: string;
  reservationRequired: boolean;
  tags: string[];
  categoryId: number | undefined;
  available: boolean; isFeatured: boolean; isTrending: boolean; isPopular: boolean;
};

const empty = (): FormData => ({
  name: "", description: "", images: [], price: "", address: "", mapsUrl: "",
  phone: "", contactEmail: "", cuisine: "", openingHours: "", dressCode: "",
  reservationRequired: false, tags: [], categoryId: undefined,
  available: true, isFeatured: false, isTrending: false, isPopular: false,
});

export default function Restaurants() {
  const { data: items, isLoading } = useListRestaurants({ query: { queryKey: getListRestaurantsQueryKey() } });
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const createMutation = useCreateRestaurant();
  const updateMutation = useUpdateRestaurant();
  const deleteMutation = useDeleteRestaurant();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [form, setForm] = useState<FormData>(empty());
  const set = (patch: Partial<FormData>) => setForm(f => ({ ...f, ...patch }));

  const handleOpenNew = () => { setEditing(null); setForm(empty()); setOpen(true); };
  const handleOpenEdit = (r: Restaurant) => {
    setEditing(r);
    setForm({
      name: r.name || "", description: r.description || "",
      images: (r.images as string[] | null) || [],
      price: r.price || "", address: r.address || "", mapsUrl: r.mapsUrl || "",
      phone: r.phone || "", contactEmail: r.contactEmail || "",
      cuisine: r.cuisine || "", openingHours: r.openingHours || "", dressCode: r.dressCode || "",
      reservationRequired: r.reservationRequired ?? false,
      tags: (r.tags as string[] | null) || [],
      categoryId: r.categoryId || undefined,
      available: r.available ?? true, isFeatured: r.isFeatured ?? false,
      isTrending: r.isTrending ?? false, isPopular: r.isPopular ?? false,
    });
    setOpen(true);
  };

  const payload = () => ({ ...form, price: form.price || undefined, mapsUrl: form.mapsUrl || undefined, phone: form.phone || undefined, contactEmail: form.contactEmail || undefined });

  const handleSave = () => {
    const opts = {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListRestaurantsQueryKey() }); toast({ title: editing ? "Restaurant updated" : "Restaurant created" }); setOpen(false); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    };
    if (editing) updateMutation.mutate({ id: editing.id, data: payload() }, opts);
    else createMutation.mutate({ data: payload() }, opts);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this restaurant?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListRestaurantsQueryKey() }); toast({ title: "Deleted" }); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Restaurants</h1>
        <Button onClick={handleOpenNew}><PlusCircle className="w-4 h-4 mr-2" /> New Restaurant</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Restaurant" : "New Restaurant"}</DialogTitle>
            <DialogDescription>Manage restaurant details, images, and settings.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="flags">Visibility</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Name *</label>
                <Input value={form.name} onChange={e => set({ name: e.target.value })} placeholder="Restaurant name" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Description</label>
                <Textarea value={form.description} onChange={e => set({ description: e.target.value })} rows={4} placeholder="About this restaurant..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Cuisine Type</label>
                  <Input value={form.cuisine} onChange={e => set({ cuisine: e.target.value })} placeholder="Italian, Japanese, etc." /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Price Range</label>
                  <Input value={form.price} onChange={e => set({ price: e.target.value })} placeholder="R200–R500 p/p" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Address</label>
                  <Input value={form.address} onChange={e => set({ address: e.target.value })} placeholder="123 Main St, JHB" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Google Maps URL</label>
                  <Input value={form.mapsUrl} onChange={e => set({ mapsUrl: e.target.value })} placeholder="https://maps.google.com/..." /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Phone</label>
                  <Input value={form.phone} onChange={e => set({ phone: e.target.value })} placeholder="+27 11 000 0000" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Contact Email</label>
                  <Input value={form.contactEmail} onChange={e => set({ contactEmail: e.target.value })} placeholder="info@restaurant.co.za" /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Category</label>
                <Select value={form.categoryId?.toString()} onValueChange={v => set({ categoryId: parseInt(v) })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                </Select></div>
            </TabsContent>
            <TabsContent value="media" className="space-y-4">
              <ImageUploadArray label="Cover & Gallery Images" values={form.images} onChange={v => set({ images: v })} />
            </TabsContent>
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Opening Hours</label>
                  <Input value={form.openingHours} onChange={e => set({ openingHours: e.target.value })} placeholder="Mon–Sun 12pm–11pm" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Dress Code</label>
                  <Input value={form.dressCode} onChange={e => set({ dressCode: e.target.value })} placeholder="Smart casual" /></div>
              </div>
              <div className="flex items-center justify-between border p-3 rounded bg-muted/20">
                <label className="text-sm font-medium">Reservation Required</label>
                <Switch checked={form.reservationRequired} onCheckedChange={v => set({ reservationRequired: v })} />
              </div>
              <ArrayInput label="Tags" values={form.tags} onChange={v => set({ tags: v })} placeholder="e.g. outdoor, vegan-friendly" />
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
            <Save className="w-4 h-4 mr-2" /> Save Restaurant
          </Button>
        </DialogContent>
      </Dialog>

      <div className="border border-border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Name</TableHead><TableHead>Cuisine</TableHead><TableHead>Address</TableHead>
              <TableHead>Flags</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )) : items?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No restaurants yet. Add one!</TableCell></TableRow>
            ) : items?.map(r => (
              <TableRow key={r.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{r.cuisine || "—"}</TableCell>
                <TableCell className="text-muted-foreground text-sm truncate max-w-xs">{r.address || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {r.isFeatured && <Badge variant="outline" className="text-xs border-primary text-primary"><Star className="w-3 h-3 mr-0.5" />Featured</Badge>}
                    {r.reservationRequired && <Badge variant="outline" className="text-xs">Reservation</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={r.available ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                    {r.available ? "Active" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(r)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(r.id)}><Trash className="w-4 h-4" /></Button>
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
