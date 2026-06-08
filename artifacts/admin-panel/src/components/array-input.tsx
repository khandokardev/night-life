import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface ArrayInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function ArrayInput({ label, values, onChange, placeholder }: ArrayInputProps) {
  const add = () => onChange([...values, ""]);
  const update = (i: number, v: string) => onChange(values.map((x, idx) => idx === i ? v : x));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <Button type="button" size="sm" variant="outline" onClick={add}>
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      {values.length === 0 && (
        <p className="text-xs text-muted-foreground italic">No {label.toLowerCase()} added.</p>
      )}
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={v}
            placeholder={placeholder}
            onChange={e => update(i, e.target.value)}
            className="bg-background"
          />
          <Button type="button" size="icon" variant="ghost" onClick={() => remove(i)}>
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      ))}
    </div>
  );
}
