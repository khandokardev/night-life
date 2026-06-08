import { useListAllReviews, getListAllReviewsQueryKey, useModerateReview } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Star, MessageSquare } from "lucide-react";
import { useState, useMemo } from "react";

export default function Reviews() {
  const { data: reviews, isLoading } = useListAllReviews({ query: { queryKey: getListAllReviewsQueryKey() } });
  const moderateMutation = useModerateReview();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return (reviews || []).filter(r => {
      const matchSearch = !search || r.body?.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || (filter === "pending" && !r.approved) || (filter === "approved" && r.approved);
      return matchSearch && matchFilter;
    });
  }, [reviews, search, filter]);

  const moderate = (id: number, approved: boolean) => {
    moderateMutation.mutate({ id, data: { approved } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAllReviewsQueryKey() }); toast({ title: approved ? "Review approved" : "Review rejected" }); },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  const pendingCount = reviews?.filter(r => !r.approved).length || 0;
  const approvedCount = reviews?.filter(r => r.approved).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Reviews</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-amber-400"><MessageSquare className="w-4 h-4" />{pendingCount} pending</span>
          <span className="flex items-center gap-1 text-green-400"><CheckCircle className="w-4 h-4" />{approvedCount} approved</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Input placeholder="Search review content..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm bg-card" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>User</TableHead><TableHead>Content</TableHead><TableHead>Rating</TableHead>
              <TableHead>Review</TableHead><TableHead>Date</TableHead>
              <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No reviews found.</TableCell></TableRow>
            ) : filtered.map(r => (
              <TableRow key={r.id} className="border-border hover:bg-muted/50">
                <TableCell className="text-sm">User #{r.userId}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  <span className="capitalize">{r.refType || "—"}</span> #{r.refId}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < (r.rating || 0) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm truncate">{r.body || "—"}</p>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-ZA") : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={r.approved ? "border-green-500/30 text-green-400" : "border-amber-500/30 text-amber-400"}>
                    {r.approved ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {!r.approved && (
                      <Button size="sm" variant="outline" className="text-green-400 border-green-500/30 hover:bg-green-500/10"
                        onClick={() => moderate(r.id, true)} disabled={moderateMutation.isPending}>
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    )}
                    {r.approved && (
                      <Button size="sm" variant="outline" className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                        onClick={() => moderate(r.id, false)} disabled={moderateMutation.isPending}>
                        <XCircle className="w-4 h-4 mr-1" /> Reject
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
