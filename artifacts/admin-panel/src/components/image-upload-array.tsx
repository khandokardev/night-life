import { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadingItem {
  id: string;
  progress: number;
  preview: string;
}

interface ImageUploadArrayProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  className?: string;
  maxImages?: number;
}

export function ImageUploadArray({
  values,
  onChange,
  label,
  className,
  maxImages = 20,
}: ImageUploadArrayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const id = Math.random().toString(36).slice(2);
    const preview = URL.createObjectURL(file);
    setUploading(prev => [...prev, { id, progress: 0, preview }]);
    setError(null);

    const token = localStorage.getItem("saPlugAdminToken");
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setUploading(prev => prev.map(u => u.id === id ? { ...u, progress: pct } : u));
      }
    };

    xhr.onload = () => {
      URL.revokeObjectURL(preview);
      setUploading(prev => prev.filter(u => u.id !== id));
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          onChange([...values, data.url]);
        } catch {
          setError("Upload failed: bad response");
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          setError(data.error ?? "Upload failed");
        } catch {
          setError("Upload failed");
        }
      }
    };

    xhr.onerror = () => {
      URL.revokeObjectURL(preview);
      setUploading(prev => prev.filter(u => u.id !== id));
      setError("Network error during upload");
    };

    xhr.open("POST", "/api/admin/upload");
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(formData);
  }, [values, onChange]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const remaining = maxImages - values.length - uploading.length;
    Array.from(files).slice(0, remaining).forEach(uploadFile);
  }, [values.length, uploading.length, maxImages, uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeImage = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  const canAddMore = values.length + uploading.length < maxImages;

  return (
    <div className={cn("space-y-3", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => { handleFiles(e.target.files); e.target.value = ""; }}
      />

      {(values.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-3 gap-2">
          {values.map((url, idx) => (
            <div key={`${url}-${idx}`} className="relative group aspect-video rounded-lg border border-border overflow-hidden bg-muted/20">
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
                onError={e => (e.currentTarget.style.display = "none")}
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {uploading.map(u => (
            <div key={u.id} className="relative aspect-video rounded-lg border border-border overflow-hidden bg-muted/20">
              <img src={u.preview} alt="" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
                <span className="text-white text-xs">{u.progress}%</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                <div className="h-full bg-[#D4AF37] transition-all" style={{ width: `${u.progress}%` }} />
              </div>
            </div>
          ))}

          {canAddMore && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/60 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs">Add</span>
            </button>
          )}
        </div>
      )}

      {values.length === 0 && uploading.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg cursor-pointer transition-colors h-36 flex flex-col items-center justify-center gap-2",
            dragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/60 hover:bg-muted/30"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Click to upload images</p>
            <p className="text-xs text-muted-foreground mt-0.5">or drag & drop multiple files here</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WebP · max 15 MB each</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}

      {values.length > 0 && (
        <p className="text-xs text-muted-foreground">{values.length} image{values.length !== 1 ? "s" : ""} uploaded</p>
      )}
    </div>
  );
}
