import {
  useListClubs, getListClubsQueryKey,
  useCreateClub, useUpdateClub, useDeleteClub,
  useListCategories, getListCategoriesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash, Edit, Save, Star, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { Club } from "@workspace/api-client-react";
import { ArrayInput } from "@/components/array-input";
import { ImageUploadArray } from "@/components/image-upload-array";

type FormData = {
  name: string; description: string;
  images: string[];
  price: string; address: string; mapsUrl: string; phone: string; contactEmail: string;
  dressCode: string; openingHours: string; minSpend: string;
  tags: string[];
  categoryId: number | undefined;
  available: boolean; isFeatured: boolean; isTrending: boolean; isPopular: boolean;
};

const empty = (): FormData => ({
  name: "", description: "", images: [], price: "", address: "", mapsUrl: "", phone: "",
  contactEmail: "", dressCode: "", openingHours: "", minSpend: "", tags: [],
  categoryId: undefined, available: true, isFeatured: false, isTrending: false, isPopular: false,
});

export default function Clubs() {
  const { data: clubs, isLoading } = useListClubs({ query: { queryKey: getListClubsQueryKey() } });
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const createMutation = useCreateClub();
  const updateMutation = useUpdateClub();
  const deleteMutation = useDeleteClub();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Club | null>(null);
  const [form, setForm] = useState<FormData>(empty());
  const set = (patch: Partial<FormData>) => setForm(f => ({ ...f, ...patch }));

  const handleOpenNew = () => { setEditing(null); setForm(empty()); setOpen(true); };
  const handleOpenEdit = (c: Club) => {
    setEditing(c);
    setForm({
      name: c.name || "", description: c.description || "",
      images: (c.images as string[] | null) || [],
      price: c.price || "", address: c.address || "", mapsUrl: c.mapsUrl || "",
      phone: c.phone || "", contactEmail: c.contactEmail || "",
      dressCode: c.dressCode || "", openingHours: c.openingHours || "",
      minSpend: c.minSpend || "", tags: (c.tags as string[] | null) || [],
      categoryId: c.categoryId || undefined,
      available: c.available ?? true, isFeatured: c.isFeatured ?? false,
      isTrending: c.isTrending ?? false, isPopular: c.isPopular ?? false,
    });
    setOpen(true);
  };

  const payload = () => ({
    ...form,
    price: form.price || undefined,
    minSpend: form.minSpend || undefined,
    mapsUrl: form.mapsUrl || undefined,
    phone: form.phone || undefined,
    contactEmail: form.contactEmail || undefined,
  });

  const handleSave = () => {
    const opts = {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListClubsQueryKey() });
        toast({ title: editing ? "Club updated" : "Club created" });
        setOpen(false);
      },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    };
    if (editing) updateMutation.mutate({ id: editing.id, data: payload() }, opts);
    else createMutation.mutate({ data: payload() }, opts);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this club?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListClubsQueryKey() }); toast({ title: "Club deleted" }); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Clubs</h1>
        <Button onClick={handleOpenNew}><PlusCircle className="w-4 h-4 mr-2" /> New Club</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Club" : "New Club"}</DialogTitle>
            <DialogDescription>Manage club details, images, and settings.</DialogDescription>
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
                <Input value={form.name} onChange={e => set({ name: e.target.value })} placeholder="Club name" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Description</label>
                <Textarea value={form.description} onChange={e => set({ description: e.target.value })} rows={4} placeholder="About this club..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Address</label>
                  <Input value={form.address} onChange={e => set({ address: e.target.value })} placeholder="123 Main St, JHB" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Google Maps URL</label>
                  <Input value={form.mapsUrl} onChange={e => set({ mapsUrl: e.target.value })} placeholder="https://maps.google.com/..." /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Phone</label>
                  <Input value={form.phone} onChange={e => set({ phone: e.target.value })} placeholder="+27 11 000 0000" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Contact Email</label>
                  <Input value={form.contactEmail} onChange={e => set({ contactEmail: e.target.value })} placeholder="info@club.co.za" /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Category</label>
                <Select value={form.categoryId?.toString()} onValueChange={v => set({ categoryId: parseInt(v) })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                </Select></div>
            </TabsContent>
            <TabsContent value="media" className="space-y-4">
              <ImageUploadArray label="Images / Gallery" values={form.images} onChange={v => set({ images: v })} />
            </TabsContent>
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Price / Min Spend Info</label>
                  <Input value={form.price} onChange={e => set({ price: e.target.value })} placeholder="From R200" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Min Spend (ZAR)</label>
                  <Input type="number" value={form.minSpend} onChange={e => set({ minSpend: e.target.value })} placeholder="500" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Dress Code</label>
                  <Input value={form.dressCode} onChange={e => set({ dressCode: e.target.value })} placeholder="Smart casual" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Opening Hours</label>
                  <Input value={form.openingHours} onChange={e => set({ openingHours: e.target.value })} placeholder="Fri–Sat 10pm–4am" /></div>
              </div>
              <ArrayInput label="Tags" values={form.tags} onChange={v => set({ tags: v })} placeholder="e.g. rooftop, live music" />
            </TabsContent>
            <TabsContent value="flags" className="space-y-3">
              {([
                ["available", "Active / Visible"],
                ["isFeatured", "Featured"],
                ["isTrending", "Trending"],
                ["isPopular", "Popular"],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between border p-3 rounded bg-muted/20">
                  <label className="text-sm font-medium">{label}</label>
                  <Switch checked={!!form[key]} onCheckedChange={v => set({ [key]: v })} />
                </div>
              ))}
            </TabsContent>
          </Tabs>
          <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending} className="mt-2">
            <Save className="w-4 h-4 mr-2" /> Save Club
          </Button>
        </DialogContent>
      </Dialog>

      <div className="border border-border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Dress Code</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )) : clubs?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No clubs yet. Add one!</TableCell></TableRow>
            ) : clubs?.map(club => (
              <TableRow key={club.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium">{club.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm truncate max-w-xs">{club.address || "—"}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{club.dressCode || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {club.isFeatured && <Badge variant="outline" className="text-xs border-primary text-primary"><Star className="w-3 h-3 mr-0.5" />Featured</Badge>}
                    {club.isTrending && <Badge variant="outline" className="text-xs"><TrendingUp className="w-3 h-3 mr-0.5" />Trending</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={club.available ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                    {club.available ? "Active" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(club)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(club.id)}><Trash className="w-4 h-4" /></Button>
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
