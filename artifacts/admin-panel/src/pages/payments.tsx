import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminTransactions, useStripeStatus, useRefundTransaction, type AdminTransaction } from "@/lib/api";
import { useGetSettings, useUpsertSetting, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { CreditCard, CheckCircle, XCircle, AlertCircle, RefreshCw, DollarSign, TrendingUp, Receipt, ExternalLink } from "lucide-react";
import { toast } from "sonner";

function statusBadge(status: string) {
  const map: Record<string, string> = {
    succeeded: "bg-green-500/20 text-green-400 border-green-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    failed: "bg-red-500/20 text-red-400 border-red-500/30",
    refunded: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function fmtAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" });
}

function StripeStatusCard() {
  const { data, isLoading, refetch } = useStripeStatus();

  if (isLoading) return (
    <Card className="border-border bg-card">
      <CardContent className="p-6 flex items-center gap-3 text-muted-foreground">
        <RefreshCw className="h-4 w-4 animate-spin" /> Checking Stripe status…
      </CardContent>
    </Card>
  );

  const configured = data?.configured ?? false;
  const valid = data?.valid ?? false;
  const webhookSet = data?.webhookSet ?? false;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          Stripe Connection
        </CardTitle>
        <CardDescription>
          {configured && valid
            ? `Connected in ${data?.mode === "live" ? "LIVE" : "TEST"} mode`
            : configured
            ? "Key found but could not validate — check the key is correct"
            : "Not configured — set STRIPE_SECRET_KEY environment variable to enable payments"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Secret Key", ok: configured },
            { label: "Key Valid", ok: valid },
            { label: "Webhook Secret", ok: webhookSet },
          ].map(({ label, ok }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              {ok
                ? <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                : <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
              <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
            </div>
          ))}
        </div>

        {configured && valid && (
          <Badge variant="outline" className={data?.mode === "live"
            ? "border-green-500/40 text-green-400"
            : "border-yellow-500/40 text-yellow-400"}>
            {data?.mode === "live" ? "🟢 LIVE MODE" : "🟡 TEST MODE"}
          </Badge>
        )}

        {!configured && (
          <Alert className="border-yellow-500/30 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-300 text-sm">
              Set <code className="font-mono text-xs bg-muted px-1 rounded">STRIPE_SECRET_KEY</code> in your environment variables to enable Stripe payments.
              {" "}Also set <code className="font-mono text-xs bg-muted px-1 rounded">STRIPE_WEBHOOK_SECRET</code> for webhook validation.
            </AlertDescription>
          </Alert>
        )}

        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-1">
          <RefreshCw className="h-3 w-3 mr-1" /> Re-check
        </Button>
      </CardContent>
    </Card>
  );
}

function PaymentConfig() {
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const upsert = useUpsertSetting();

  const [form, setForm] = useState<Record<string, string>>({});

  const getValue = (key: string) => form[key] ?? settings?.[key] ?? "";
  const handleChange = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));
  const handleSave = async (key: string) => {
    await upsert.mutateAsync({ data: { key, value: form[key] ?? settings?.[key] ?? "" } });
    toast.success("Saved");
  };

  if (isLoading) return <div className="text-muted-foreground text-sm">Loading settings…</div>;

  const fields = [
    { key: "payments.currency", label: "Default Currency", placeholder: "ZAR", type: "text" },
    { key: "payments.stripe_public_key", label: "Stripe Publishable Key", placeholder: "pk_test_… or pk_live_…", type: "text" },
    { key: "payments.stripe_mode", label: "Stripe Mode", placeholder: "test", type: "text" },
    { key: "payments.min_booking_amount", label: "Minimum Booking Amount (in cents)", placeholder: "0", type: "number" },
    { key: "payments.stripe_enabled", label: "Stripe Enabled (true/false)", placeholder: "true", type: "text" },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Payment Configuration</CardTitle>
        <CardDescription>Stored in app settings. The secret keys are set via environment variables, not here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key} className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
              <Input
                type={type}
                placeholder={placeholder}
                value={getValue(key)}
                onChange={e => handleChange(key, e.target.value)}
                className="bg-muted/30 text-sm"
              />
            </div>
            <Button size="sm" variant="outline" onClick={() => handleSave(key)} disabled={upsert.isPending}>
              Save
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TransactionTable() {
  const { data: txs, isLoading } = useAdminTransactions();
  const refund = useRefundTransaction();
  const [search, setSearch] = useState("");
  const [confirmRefund, setConfirmRefund] = useState<AdminTransaction | null>(null);

  const filtered = (txs ?? []).filter(tx =>
    search === "" ||
    String(tx.id).includes(search) ||
    (tx.stripePaymentIntentId ?? "").toLowerCase().includes(search.toLowerCase()) ||
    tx.status.includes(search.toLowerCase())
  );

  const totalSucceeded = (txs ?? [])
    .filter(t => t.status === "succeeded")
    .reduce((s, t) => s + t.amount, 0);

  const handleRefund = async () => {
    if (!confirmRefund) return;
    try {
      await refund.mutateAsync(confirmRefund.id);
      toast.success("Refund issued successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Refund failed");
    } finally {
      setConfirmRefund(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary/60" />
            <div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-bold text-foreground">
                {fmtAmount(totalSucceeded, (txs ?? [])[0]?.currency ?? "ZAR")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <Receipt className="h-8 w-8 text-blue-400/60" />
            <div>
              <p className="text-xs text-muted-foreground">Total Transactions</p>
              <p className="text-lg font-bold text-foreground">{(txs ?? []).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-400/60" />
            <div>
              <p className="text-xs text-muted-foreground">Succeeded</p>
              <p className="text-lg font-bold text-green-400">
                {(txs ?? []).filter(t => t.status === "succeeded").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Transaction History</CardTitle>
            <Input
              placeholder="Search by ID or intent…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-56 h-8 text-sm bg-muted/30"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-muted-foreground text-sm flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" /> Loading transactions…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              {(txs ?? []).length === 0
                ? "No transactions yet. Once payments are made they will appear here."
                : "No transactions match your search."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs">ID</TableHead>
                  <TableHead className="text-xs">User</TableHead>
                  <TableHead className="text-xs">Amount</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Stripe Intent</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(tx => (
                  <TableRow key={tx.id} className="border-border">
                    <TableCell className="text-xs font-mono text-muted-foreground">#{tx.id}</TableCell>
                    <TableCell className="text-xs">User #{tx.userId}</TableCell>
                    <TableCell className="text-xs font-mono">{fmtAmount(tx.amount, tx.currency)}</TableCell>
                    <TableCell>{statusBadge(tx.status)}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground max-w-32 truncate">
                      {tx.stripePaymentIntentId ? (
                        <a
                          href={`https://dashboard.stripe.com/payments/${tx.stripePaymentIntentId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          {tx.stripePaymentIntentId.slice(0, 16)}…
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{fmtDate(tx.createdAt)}</TableCell>
                    <TableCell>
                      {tx.status === "succeeded" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs text-red-400 border-red-400/30 hover:bg-red-400/10"
                          onClick={() => setConfirmRefund(tx)}
                        >
                          Refund
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!confirmRefund} onOpenChange={open => !open && setConfirmRefund(null)}>
        <DialogContent className="dark">
          <DialogHeader>
            <DialogTitle>Confirm Refund</DialogTitle>
            <DialogDescription>
              Issue a full refund of {confirmRefund ? fmtAmount(confirmRefund.amount, confirmRefund.currency) : ""} for transaction #{confirmRefund?.id}?
              This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRefund(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRefund} disabled={refund.isPending}>
              {refund.isPending ? "Processing…" : "Issue Refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Payments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payments & Stripe</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage Stripe configuration, view transactions, and issue refunds.</p>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="bg-muted/30">
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <StripeStatusCard />
          <TransactionTable />
        </TabsContent>

        <TabsContent value="config" className="space-y-4 mt-4">
          <StripeStatusCard />
          <PaymentConfig />
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                Required Environment Variables
              </CardTitle>
              <CardDescription>Set these on your hosting server (Hostinger, etc.) — never in the database.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { key: "STRIPE_SECRET_KEY", desc: "Stripe secret key (sk_test_… or sk_live_…). Required for all payment processing." },
                { key: "STRIPE_WEBHOOK_SECRET", desc: "Stripe webhook signing secret (whsec_…). Required to validate incoming webhook events." },
              ].map(({ key, desc }) => (
                <div key={key} className="bg-muted/30 rounded p-3">
                  <code className="text-primary text-sm font-mono">{key}</code>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">
                After setting keys, add a Stripe webhook endpoint pointing to{" "}
                <code className="font-mono text-xs bg-muted px-1 rounded">https://yourdomain.com/api/payments/webhook</code>
                {" "}and subscribe to <code className="font-mono text-xs bg-muted px-1 rounded">payment_intent.succeeded</code> and{" "}
                <code className="font-mono text-xs bg-muted px-1 rounded">payment_intent.payment_failed</code>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
