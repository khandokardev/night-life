import { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }
    setUploading(true);
    setError(null);
    setProgress(0);

    const token = localStorage.getItem("saPlugAdminToken");
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      setUploading(false);
      setProgress(0);
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          onChange(data.url);
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
      setUploading(false);
      setError("Network error during upload");
    };

    xhr.open("POST", "/api/admin/upload");
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(formData);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative group rounded-lg border border-border overflow-hidden bg-muted/20">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-40 object-cover"
            onError={e => (e.currentTarget.style.display = "none")}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-red-500/80 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#D4AF37] transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg cursor-pointer transition-colors h-40 flex flex-col items-center justify-center gap-2",
            dragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/60 hover:bg-muted/30",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading… {progress}%</p>
              <div className="absolute bottom-3 left-4 right-4 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Click to upload</p>
                <p className="text-xs text-muted-foreground mt-0.5">or drag & drop here</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WebP · max 15 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}
