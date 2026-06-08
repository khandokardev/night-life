import {
  useListEvents, getListEventsQueryKey,
  useCreateEvent, useUpdateEvent, useDeleteEvent,
  useListCategories, getListCategoriesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash, Edit, Save, Star, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { Event } from "@workspace/api-client-react";
import { ArrayInput } from "@/components/array-input";
import { ImageUploadArray } from "@/components/image-upload-array";

type FormData = {
  name: string; description: string; images: string[];
  price: string; address: string; venue: string; phone: string; contactEmail: string;
  eventDate: string; eventTime: string; dressCode: string; ticketUrl: string;
  lineup: string[]; tags: string[];
  categoryId: number | undefined;
  available: boolean; isFeatured: boolean; isTrending: boolean; isPopular: boolean;
};
const empty = (): FormData => ({
  name: "", description: "", images: [], price: "", address: "", venue: "",
  phone: "", contactEmail: "", eventDate: "", eventTime: "", dressCode: "", ticketUrl: "",
  lineup: [], tags: [], categoryId: undefined,
  available: true, isFeatured: false, isTrending: false, isPopular: false,
});

export default function Events() {
  const { data: items, isLoading } = useListEvents({ query: { queryKey: getListEventsQueryKey() } });
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState<FormData>(empty());
  const set = (patch: Partial<FormData>) => setForm(f => ({ ...f, ...patch }));

  const handleOpenNew = () => { setEditing(null); setForm(empty()); setOpen(true); };
  const handleOpenEdit = (e: Event) => {
    setEditing(e);
    setForm({
      name: e.name || "", description: e.description || "",
      images: (e.images as string[] | null) || [],
      price: e.price || "", address: e.address || "", venue: e.venue || "",
      phone: e.phone || "", contactEmail: e.contactEmail || "",
      eventDate: e.eventDate || "", eventTime: e.eventTime || "",
      dressCode: e.dressCode || "", ticketUrl: e.ticketUrl || "",
      lineup: (e.lineup as string[] | null) || [],
      tags: (e.tags as string[] | null) || [],
      categoryId: e.categoryId || undefined,
      available: e.available ?? true, isFeatured: e.isFeatured ?? false,
      isTrending: e.isTrending ?? false, isPopular: e.isPopular ?? false,
    });
    setOpen(true);
  };

  const payload = () => ({ ...form, price: form.price || undefined, phone: form.phone || undefined, contactEmail: form.contactEmail || undefined, ticketUrl: form.ticketUrl || undefined });

  const handleSave = () => {
    const opts = {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() }); toast({ title: editing ? "Event updated" : "Event created" }); setOpen(false); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    };
    if (editing) updateMutation.mutate({ id: editing.id, data: payload() }, opts);
    else createMutation.mutate({ data: payload() }, opts);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this event?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() }); toast({ title: "Deleted" }); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Events</h1>
        <Button onClick={handleOpenNew}><PlusCircle className="w-4 h-4 mr-2" /> New Event</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Event" : "New Event"}</DialogTitle>
            <DialogDescription>Manage event details, lineup, and media.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="lineup">Lineup</TabsTrigger>
              <TabsTrigger value="flags">Visibility</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Event Name *</label>
                <Input value={form.name} onChange={e => set({ name: e.target.value })} placeholder="Event name" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Description</label>
                <Textarea value={form.description} onChange={e => set({ description: e.target.value })} rows={3} placeholder="Event description..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Date</label>
                  <Input type="date" value={form.eventDate} onChange={e => set({ eventDate: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Time</label>
                  <Input type="time" value={form.eventTime} onChange={e => set({ eventTime: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Venue</label>
                  <Input value={form.venue} onChange={e => set({ venue: e.target.value })} placeholder="Venue name" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Address</label>
                  <Input value={form.address} onChange={e => set({ address: e.target.value })} placeholder="123 Main St, JHB" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Ticket Price (ZAR)</label>
                  <Input type="number" value={form.price} onChange={e => set({ price: e.target.value })} placeholder="350" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Dress Code</label>
                  <Input value={form.dressCode} onChange={e => set({ dressCode: e.target.value })} placeholder="All black" /></div>
                <div className="space-y-2 col-span-2"><label className="text-sm font-medium">Ticket Purchase URL</label>
                  <Input value={form.ticketUrl} onChange={e => set({ ticketUrl: e.target.value })} placeholder="https://tickets.co.za/..." /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Phone</label>
                  <Input value={form.phone} onChange={e => set({ phone: e.target.value })} placeholder="+27 11 000 0000" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Contact Email</label>
                  <Input value={form.contactEmail} onChange={e => set({ contactEmail: e.target.value })} placeholder="events@saplug.co.za" /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Category</label>
                <Select value={form.categoryId?.toString()} onValueChange={v => set({ categoryId: parseInt(v) })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                </Select></div>
            </TabsContent>
            <TabsContent value="media" className="space-y-4">
              <ImageUploadArray label="Event Images / Flyers" values={form.images} onChange={v => set({ images: v })} />
            </TabsContent>
            <TabsContent value="lineup" className="space-y-4">
              <ArrayInput label="Artist / DJ Lineup" values={form.lineup} onChange={v => set({ lineup: v })} placeholder="e.g. DJ Black Coffee" />
              <ArrayInput label="Tags" values={form.tags} onChange={v => set({ tags: v })} placeholder="e.g. Afrotech, Live" />
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
            <Save className="w-4 h-4 mr-2" /> Save Event
          </Button>
        </DialogContent>
      </Dialog>

      <div className="border border-border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Name</TableHead><TableHead>Date & Time</TableHead><TableHead>Venue</TableHead>
              <TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )) : items?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No events yet. Add one!</TableCell></TableRow>
            ) : items?.map(ev => (
              <TableRow key={ev.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div>{ev.name}</div>
                  {ev.ticketUrl && <a href={ev.ticketUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-0.5"><ExternalLink className="w-3 h-3" />Tickets</a>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {ev.eventDate ? `${ev.eventDate}${ev.eventTime ? ` ${ev.eventTime}` : ""}` : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{ev.venue || "—"}</TableCell>
                <TableCell className="text-sm">{ev.price ? `R${ev.price}` : "Free"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge className={ev.available ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                      {ev.available ? "Active" : "Hidden"}
                    </Badge>
                    {ev.isFeatured && <Badge variant="outline" className="text-xs border-primary text-primary"><Star className="w-3 h-3 mr-0.5" />Featured</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(ev)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(ev.id)}><Trash className="w-4 h-4" /></Button>
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
