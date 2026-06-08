import { useGetSettings, getGetSettingsQueryKey, useUpsertSetting } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";

type FieldType = "text" | "url" | "email" | "color" | "boolean" | "textarea" | "number";

interface FieldDef {
  label: string;
  type: FieldType;
  placeholder?: string;
}

const SCHEMA: Record<string, Record<string, FieldDef>> = {
  "App": {
    "app.name": { label: "App Name", type: "text", placeholder: "SA PLUG" },
    "app.tagline": { label: "Tagline", type: "text", placeholder: "Premium Nightlife & Lifestyle" },
    "app.maintenance_mode": { label: "Maintenance Mode", type: "boolean" },
  },
  "Payment Settings": {
    "payments.currency": { label: "Currency", type: "text", placeholder: "ZAR" },
    "payments.stripe_enabled": { label: "Stripe Enabled", type: "boolean" },
    "payments.stripe_mode": { label: "Stripe Mode (test/live)", type: "text", placeholder: "test" },
    "payments.stripe_public_key": { label: "Stripe Public Key", type: "text", placeholder: "pk_test_..." },
    "payments.min_booking_amount": { label: "Min Booking Amount (ZAR)", type: "number", placeholder: "0" },
  },
  "Firebase Configuration": {
    "firebase.project_id": { label: "Project ID", type: "text" },
    "firebase.api_key": { label: "API Key", type: "text" },
    "firebase.auth_domain": { label: "Auth Domain", type: "text" },
    "firebase.storage_bucket": { label: "Storage Bucket", type: "text" },
    "firebase.messaging_sender_id": { label: "Messaging Sender ID", type: "text" },
    "firebase.app_id": { label: "App ID", type: "text" },
  },
};

export default function Settings() {
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const upsertMutation = useUpsertSetting();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (settings) setLocalValues(settings as Record<string, string>);
  }, [settings]);

  const getValue = (key: string) => localValues[key] ?? "";

  const handleChange = (key: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (key: string) => {
    setSaving(prev => ({ ...prev, [key]: true }));
    upsertMutation.mutate(
      { data: { key, value: getValue(key) } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
          toast({ title: "Saved", description: `${key} updated.` });
        },
        onError: (err: any) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        },
        onSettled: () => setSaving(prev => ({ ...prev, [key]: false })),
      },
    );
  };

  const renderField = (key: string, def: FieldDef) => {
    const value = getValue(key);

    if (def.type === "boolean") {
      return (
        <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
          <div>
            <p className="text-sm font-medium">{def.label}</p>
            <p className="text-xs text-muted-foreground font-mono">{key}</p>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={value === "true"}
              onCheckedChange={v => {
                handleChange(key, v ? "true" : "false");
                upsertMutation.mutate(
                  { data: { key, value: v ? "true" : "false" } },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
                      toast({ title: "Saved" });
                    },
                    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
                  },
                );
              }}
            />
          </div>
        </div>
      );
    }

    if (def.type === "textarea") {
      return (
        <div key={key} className="space-y-2 py-3 border-b border-border last:border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{def.label}</p>
              <p className="text-xs text-muted-foreground font-mono">{key}</p>
            </div>
            <Button size="sm" onClick={() => handleSave(key)} disabled={saving[key]}>
              <Save className="w-3 h-3 mr-1" /> Save
            </Button>
          </div>
          <Textarea
            value={value}
            placeholder={def.placeholder}
            onChange={e => handleChange(key, e.target.value)}
            className="bg-background text-sm"
            rows={3}
          />
        </div>
      );
    }

    if (def.type === "color") {
      return (
        <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
          <div>
            <p className="text-sm font-medium">{def.label}</p>
            <p className="text-xs text-muted-foreground font-mono">{key}</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || "#D4AF37"}
              onChange={e => handleChange(key, e.target.value)}
              onBlur={() => handleSave(key)}
              className="w-10 h-8 rounded border border-border cursor-pointer bg-background"
            />
            <Input
              value={value}
              onChange={e => handleChange(key, e.target.value)}
              className="bg-background w-32 font-mono text-sm"
              placeholder="#D4AF37"
            />
            <Button size="sm" onClick={() => handleSave(key)} disabled={saving[key]}>
              <Save className="w-3 h-3 mr-1" /> Save
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div key={key} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{def.label}</p>
          <p className="text-xs text-muted-foreground font-mono">{key}</p>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Input
            type={def.type === "url" ? "text" : def.type}
            value={value}
            placeholder={def.placeholder}
            onChange={e => handleChange(key, e.target.value)}
            className="bg-background text-sm"
          />
          <Button size="sm" onClick={() => handleSave(key)} disabled={saving[key]}>
            <Save className="w-3 h-3 mr-1" /> Save
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">App Settings</h1>
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map(j => <Skeleton key={j} className="h-10 w-full" />)}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">App Settings</h1>
      <p className="text-muted-foreground text-sm">Manage all application settings. Changes take effect immediately.</p>

      {Object.entries(SCHEMA).map(([section, fields]) => (
        <Card key={section} className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-primary">{section}</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(fields).map(([key, def]) => renderField(key, def))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
