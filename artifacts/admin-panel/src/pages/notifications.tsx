import { useListAllNotifications, getListAllNotificationsQueryKey, useSendNotification } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, Bell } from "lucide-react";
import { useState } from "react";

export default function Notifications() {
  const { data: notifications, isLoading } = useListAllNotifications({ query: { queryKey: getListAllNotificationsQueryKey() } });
  const sendMutation = useSendNotification();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState({ title: "", body: "", type: "system" as "booking" | "promotion" | "system", userId: "" });
  const set = (patch: Partial<typeof form>) => setForm(f => ({ ...f, ...patch }));

  const handleSend = () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast({ title: "Title and body are required", variant: "destructive" });
      return;
    }
    const data: any = { title: form.title, body: form.body, type: form.type };
    if (form.userId.trim()) data.userId = parseInt(form.userId);
    sendMutation.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAllNotificationsQueryKey() });
        toast({ title: "Notification sent" });
        setForm({ title: "", body: "", type: "system", userId: "" });
      },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  const TYPE_COLOR: Record<string, string> = {
    booking: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    promotion: "bg-primary/20 text-primary border-primary/30",
    system: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Notifications</h1>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="w-4 h-4 text-primary" /> Send Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Title *</label>
              <Input value={form.title} onChange={e => set({ title: e.target.value })} placeholder="Notification title" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Message *</label>
              <Textarea value={form.body} onChange={e => set({ body: e.target.value })} placeholder="Notification message..." rows={3} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={form.type} onValueChange={v => set({ type: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="booking">Booking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target User ID <span className="text-muted-foreground">(leave blank for all)</span></label>
              <Input type="number" value={form.userId} onChange={e => set({ userId: e.target.value })} placeholder="e.g. 42 (or leave blank)" />
            </div>
          </div>
          <Button onClick={handleSend} disabled={sendMutation.isPending}>
            <Send className="w-4 h-4 mr-2" />
            {sendMutation.isPending ? "Sending..." : "Send Notification"}
          </Button>
        </CardContent>
      </Card>

      <div className="border border-border rounded-md bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-medium text-sm text-muted-foreground">Notification History</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Title</TableHead><TableHead>Message</TableHead><TableHead>Type</TableHead>
              <TableHead>Target</TableHead><TableHead>Sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )) : notifications?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No notifications sent yet.
              </TableCell></TableRow>
            ) : [...(notifications || [])].reverse().map(n => (
              <TableRow key={n.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium text-sm">{n.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{n.body}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs capitalize ${TYPE_COLOR[n.type] || ""}`}>{n.type}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {n.userId ? `User #${n.userId}` : "All Users"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-ZA") : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
