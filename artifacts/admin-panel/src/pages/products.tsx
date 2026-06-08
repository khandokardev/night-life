import {
  useListProducts, getListProductsQueryKey,
  useCreateProduct, useUpdateProduct, useDeleteProduct,
  useListCategories, getListCategoriesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash, Edit, Save, Star, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { Product } from "@workspace/api-client-react";
import { ArrayInput } from "@/components/array-input";
import { ImageUploadArray } from "@/components/image-upload-array";

type FormData = {
  name: string; description: string;
  images: string[];
  price: string; stock: number; brand: string; sku: string;
  sizes: string[]; colours: string[]; tags: string[];
  categoryId: number | undefined;
  available: boolean; isFeatured: boolean; isPopular: boolean; isTrending: boolean;
};

const empty = (): FormData => ({
  name: "", description: "", images: [], price: "", stock: 0,
  brand: "", sku: "", sizes: [], colours: [], tags: [],
  categoryId: undefined, available: true, isFeatured: false, isPopular: false, isTrending: false,
});

export default function Products() {
  const { data: items, isLoading } = useListProducts({ query: { queryKey: getListProductsQueryKey() } });
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(empty());
  const set = (patch: Partial<FormData>) => setForm(f => ({ ...f, ...patch }));

  const handleOpenNew = () => { setEditing(null); setForm(empty()); setOpen(true); };
  const handleOpenEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name || "", description: p.description || "",
      images: (p.images as string[] | null) || [],
      price: p.price || "", stock: p.stock ?? 0,
      brand: p.brand || "", sku: p.sku || "",
      sizes: ((p as any).sizes as string[] | null) || [],
      colours: ((p as any).colours as string[] | null) || [],
      tags: (p.tags as string[] | null) || [],
      categoryId: p.categoryId || undefined,
      available: p.available ?? true, isFeatured: p.isFeatured ?? false,
      isPopular: p.isPopular ?? false, isTrending: p.isTrending ?? false,
    });
    setOpen(true);
  };

  const payload = () => ({ ...form, price: form.price || undefined, brand: form.brand || undefined, sku: form.sku || undefined });

  const handleSave = () => {
    const opts = {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }); toast({ title: editing ? "Product updated" : "Product created" }); setOpen(false); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    };
    if (editing) updateMutation.mutate({ id: editing.id, data: payload() }, opts);
    else createMutation.mutate({ data: payload() }, opts);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this product?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }); toast({ title: "Deleted" }); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Products</h1>
        <Button onClick={handleOpenNew}><PlusCircle className="w-4 h-4 mr-2" /> New Product</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle>
            <DialogDescription>Manage product details, images, and variants.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="flags">Visibility</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Product Name *</label>
                <Input value={form.name} onChange={e => set({ name: e.target.value })} placeholder="Product name" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Description</label>
                <Textarea value={form.description} onChange={e => set({ description: e.target.value })} rows={4} placeholder="Product description..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Price (ZAR)</label>
                  <Input type="number" step="0.01" value={form.price} onChange={e => set({ price: e.target.value })} placeholder="299.99" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Brand</label>
                  <Input value={form.brand} onChange={e => set({ brand: e.target.value })} placeholder="Brand name" /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Category</label>
                <Select value={form.categoryId?.toString()} onValueChange={v => set({ categoryId: parseInt(v) })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                </Select></div>
            </TabsContent>
            <TabsContent value="media" className="space-y-4">
              <ImageUploadArray label="Product Images" values={form.images} onChange={v => set({ images: v })} />
            </TabsContent>
            <TabsContent value="inventory" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Stock Quantity</label>
                  <Input type="number" value={form.stock} onChange={e => set({ stock: parseInt(e.target.value) || 0 })} placeholder="100" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">SKU</label>
                  <Input value={form.sku} onChange={e => set({ sku: e.target.value })} placeholder="PROD-001" /></div>
              </div>
            </TabsContent>
            <TabsContent value="variants" className="space-y-4">
              <ArrayInput label="Available Sizes" values={form.sizes} onChange={v => set({ sizes: v })} placeholder="e.g. S, M, L, XL" />
              <ArrayInput label="Available Colours" values={form.colours} onChange={v => set({ colours: v })} placeholder="e.g. Black, White, Gold" />
              <ArrayInput label="Tags" values={form.tags} onChange={v => set({ tags: v })} placeholder="e.g. luxury, unisex" />
            </TabsContent>
            <TabsContent value="flags" className="space-y-3">
              {([["available", "Active / Visible"], ["isFeatured", "Featured"], ["isPopular", "Popular"], ["isTrending", "Trending"]] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between border p-3 rounded bg-muted/20">
                  <label className="text-sm font-medium">{label}</label>
                  <Switch checked={!!form[key]} onCheckedChange={v => set({ [key]: v })} />
                </div>
              ))}
            </TabsContent>
          </Tabs>
          <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending} className="mt-2">
            <Save className="w-4 h-4 mr-2" /> Save Product
          </Button>
        </DialogContent>
      </Dialog>

      <div className="border border-border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Name</TableHead><TableHead>Brand</TableHead><TableHead>Price</TableHead>
              <TableHead>Stock</TableHead><TableHead>Flags</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )) : items?.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No products yet. Add one!</TableCell></TableRow>
            ) : items?.map(p => (
              <TableRow key={p.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{p.brand || "—"}</TableCell>
                <TableCell className="text-sm">{p.price ? `R${p.price}` : "—"}</TableCell>
                <TableCell>
                  <span className={p.stock === 0 ? "text-red-400 font-medium" : "text-sm"}>{p.stock ?? 0}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {p.isFeatured && <Badge variant="outline" className="text-xs border-primary text-primary"><Star className="w-3 h-3 mr-0.5" />Featured</Badge>}
                    {p.stock === 0 && <Badge variant="destructive" className="text-xs"><Package className="w-3 h-3 mr-0.5" />Out of Stock</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={p.available ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                    {p.available ? "Active" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
