import { useListAllBookings, getListAllBookingsQueryKey, useUpdateBookingStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, BookOpen } from "lucide-react";
import { useState, useMemo } from "react";

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function Bookings() {
  const { data: bookings, isLoading } = useListAllBookings({ query: { queryKey: getListAllBookingsQueryKey() } });
  const updateMutation = useUpdateBookingStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return (bookings || []).filter(b => {
      const matchSearch = !search || String(b.id).includes(search) || String(b.userId).includes(search) || (b.refName?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  const updateStatus = (id: number, status: "pending" | "confirmed" | "cancelled") => {
    updateMutation.mutate({ id, data: { status } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAllBookingsQueryKey() }); toast({ title: `Booking ${status}` }); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  const pending = bookings?.filter(b => b.status === "pending").length || 0;
  const confirmed = bookings?.filter(b => b.status === "confirmed").length || 0;
  const cancelled = bookings?.filter(b => b.status === "cancelled").length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Bookings</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-amber-400"><Clock className="w-4 h-4" />{pending} pending</span>
          <span className="flex items-center gap-1 text-green-400"><CheckCircle className="w-4 h-4" />{confirmed} confirmed</span>
          <span className="flex items-center gap-1 text-red-400"><XCircle className="w-4 h-4" />{cancelled} cancelled</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Input placeholder="Search by ID, user, or content..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm bg-card" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>ID</TableHead><TableHead>User</TableHead><TableHead>Type</TableHead>
              <TableHead>Content ID</TableHead><TableHead>Date</TableHead>
              <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No bookings found.
              </TableCell></TableRow>
            ) : filtered.map(b => (
              <TableRow key={b.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-mono text-sm">#{b.id}</TableCell>
                <TableCell className="text-sm">User #{b.userId}</TableCell>
                <TableCell><Badge variant="outline" className="text-xs capitalize">{b.bookingType || "—"}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-sm">{b.refName || `#${b.refId}`}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-ZA") : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${STATUS_COLOR[b.status] || ""}`}>
                    {b.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {b.status !== "confirmed" && (
                      <Button size="sm" variant="outline" className="text-green-400 border-green-500/30 hover:bg-green-500/10"
                        onClick={() => updateStatus(b.id, "confirmed")} disabled={updateMutation.isPending}>
                        <CheckCircle className="w-4 h-4 mr-1" /> Confirm
                      </Button>
                    )}
                    {b.status !== "cancelled" && (
                      <Button size="sm" variant="outline" className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                        onClick={() => updateStatus(b.id, "cancelled")} disabled={updateMutation.isPending}>
                        <XCircle className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    )}
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
