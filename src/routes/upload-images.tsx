import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { Upload, X, CheckCircle, Loader2, Image, ArrowLeft, Camera } from "lucide-react";

export const Route = createFileRoute("/upload-images")({
  head: () => ({
    meta: [{ title: "Upload Images | LUMEN Client Dashboard" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    request: (search["request"] as string) || "",
  }),
  component: UploadImagesPage,
});

type ImageRequest = {
  id: number;
  order_id: number;
  message: string;
  status: string;
  product_name?: string;
  created_at: string;
};

type UploadedImage = {
  id: number;
  filename: string;
  url: string;
  size: number;
  created_at: string;
};

function UploadImagesPage() {
  const { request: requestId } = Route.useSearch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageRequest, setImageRequest] = useState<ImageRequest | null>(null);
  const [existingUploads, setExistingUploads] = useState<UploadedImage[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (requestId) loadRequest();
  }, [requestId]);

  async function loadRequest() {
    try {
      const res = await fetch(`/api/upload-images?requestId=${requestId}`);
      if (res.status === 401) {
        navigate({ to: "/login" });
        return;
      }
      const data = await res.json();
      setExistingUploads(data.images || []);

      // Load request details
      const orderRes = await fetch("/api/dashboard");
      if (orderRes.ok) {
        const dashboard = await orderRes.json();
        // Find the order associated with this request
        // (We'll get request info from the admin API)
      }
    } catch {
      // Request might not exist
    } finally {
      setLoading(false);
    }
  }

  function handleFiles(newFiles: FileList | File[]) {
    const fileArray = Array.from(newFiles).filter((f) =>
      f.type.startsWith("image/")
    );
    if (fileArray.length === 0) {
      setError("Please select image files only.");
      return;
    }
    setError("");
    setFiles((prev) => [...prev, ...fileArray]);

    // Generate previews
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, (e.target?.result as string) || ""]);
      };
      reader.readAsDataURL(file);
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (files.length === 0) return;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.set("requestId", requestId);
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/upload-images", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setSuccess(true);
      setFiles([]);
      setPreviews([]);
      // Reload existing uploads
      const imgRes = await fetch(`/api/upload-images?requestId=${requestId}`);
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        setExistingUploads(imgData.images || []);
      }
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Image Upload
          </p>
          <h1 className="mt-3 font-display text-4xl text-foreground">
            Upload Your Photos
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We need a few more images to create your walkthrough. Upload them below.
          </p>
        </div>

        {success && (
          <div className="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-gold">
            <CheckCircle className="inline h-4 w-4 mr-2" />
            Images uploaded successfully! We'll get started on your walkthrough shortly.
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-8 cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
            isDragging
              ? "border-gold bg-gold/5"
              : "border-border hover:border-gold/50 hover:bg-surface/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
          <Camera className={`mx-auto h-12 w-12 ${isDragging ? "text-gold" : "text-muted-foreground/40"}`} />
          <p className="mt-4 text-sm text-foreground">
            {isDragging ? (
              "Drop your images here"
            ) : (
              <>
                Drag & drop images here, or{" "}
                <span className="text-gold font-medium">browse</span>
              </>
            )}
          </p>
          <p className="mt-2 text-xs text-muted-foreground/50">
            JPG, PNG, HEIC — up to 50MB each
          </p>
        </div>

        {/* File previews */}
        {files.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {files.length} image{files.length !== 1 ? "s" : ""} selected
            </p>
            <div className="grid grid-cols-3 gap-3">
              {previews.map((preview, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-border">
                  <img src={preview} alt="" className="aspect-square w-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                    <p className="text-[10px] text-white truncate">{files[i]?.name}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
        )}

        {/* Already uploaded */}
        {existingUploads.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">
              Previously Uploaded ({existingUploads.length})
            </p>
            <div className="grid grid-cols-3 gap-3">
              {existingUploads.map((img) => (
                <div key={img.id} className="rounded-xl overflow-hidden border border-border">
                  <img src={img.url} alt={img.filename} className="aspect-square w-full object-cover" />
                  <div className="p-2">
                    <p className="text-[10px] text-muted-foreground truncate">{img.filename}</p>
                    <p className="text-[10px] text-muted-foreground/50">
                      {(img.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
