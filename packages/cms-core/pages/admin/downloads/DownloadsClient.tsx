"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@cms/components/ui/button";
import {
  FileText,
  Archive,
  FileType,
  Video,
  File as FileIcon,
  PenTool,
  Figma,
  FileImage,
  FileSpreadsheet,
  Search,
  Loader2,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";
import { toast } from "sonner";

interface DownloadItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt: string | null;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
}

function publicUrl(item: DownloadItem): string {
  if (!item.slug) return item.url;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/downloads/${item.slug}`;
}

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

const ACCEPT_TYPES =
  "application/pdf,.pdf,application/zip,application/x-zip-compressed,.zip,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,application/vnd.openxmlformats-officedocument.presentationml.presentation,.pptx,video/mp4,.mp4,.ai,.fig,.psd,text/csv,application/vnd.ms-excel,.csv";

function FileTypeIcon({ mimeType, className = "w-8 h-8" }: { mimeType: string; className?: string }) {
  if (mimeType === "application/pdf") return <FileText className={className} />;
  if (mimeType.includes("zip")) return <Archive className={className} />;
  if (mimeType.includes("wordprocessingml") || mimeType.includes("presentationml"))
    return <FileType className={className} />;
  if (mimeType.startsWith("video/")) return <Video className={className} />;
  if (mimeType.includes("illustrator")) return <PenTool className={className} />;
  if (mimeType.includes("figma")) return <Figma className={className} />;
  if (mimeType.includes("photoshop")) return <FileImage className={className} />;
  if (mimeType === "text/csv") return <FileSpreadsheet className={className} />;
  return <FileIcon className={className} />;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DownloadsClient({ canBulkDelete }: { canBulkDelete: boolean }) {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DownloadItem | null>(null);
  const [editFilename, setEditFilename] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<{ name: string; status: "pending" | "uploading" | "done" | "error" }[]>([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  function wasUpdated(item: DownloadItem) {
    return new Date(item.updatedAt).getTime() - new Date(item.createdAt).getTime() > 1000;
  }

  async function fetchDownloads(p: number, append = false, q = "") {
    const params = new URLSearchParams({ page: String(p), type: "other" });
    if (q) params.set("q", q);
    const res = await fetch(`/api/media?${params}`);
    if (!res.ok) return;
    const data = await res.json();
    setItems((prev) => (append ? [...prev, ...data.items] : data.items));
    setTotal(data.total);
    setPage(p);
  }

  useEffect(() => {
    setIsLoading(true);
    setItems([]);
    const timer = setTimeout(() => {
      fetchDownloads(1, false, search).finally(() => setIsLoading(false));
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search]);

  function closeUploadModal() {
    if (isUploading) return; // prevent closing mid-upload
    setShowUploadModal(false);
    setDragOver(false);
    setUploadQueue([]);
  }

  function handleFilesSelected(files: File[]) {
    if (files.length === 0) return;
    const ok = files.filter((f) => f.size <= MAX_SIZE);
    const oversized = files.filter((f) => f.size > MAX_SIZE);

    if (oversized.length > 0) {
      toast.error(`${oversized.map((f) => f.name).join(", ")} excede el límite de 50MB`);
    }
    if (ok.length > 0) {
      handleUploadMany(ok);
    } else {
      closeUploadModal();
    }
  }

  async function handleUploadMany(files: File[]) {
    setIsUploading(true);
    setUploadQueue(files.map((f) => ({ name: f.name, status: "pending" })));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadQueue((prev) => prev.map((q, idx) => idx === i ? { ...q, status: "uploading" } : q));
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.ok) {
          successCount++;
          setUploadQueue((prev) => prev.map((q, idx) => idx === i ? { ...q, status: "done" } : q));
        } else {
          errorCount++;
          setUploadQueue((prev) => prev.map((q, idx) => idx === i ? { ...q, status: "error" } : q));
        }
      } catch {
        errorCount++;
        setUploadQueue((prev) => prev.map((q, idx) => idx === i ? { ...q, status: "error" } : q));
      }
    }

    await fetchDownloads(1);
    setIsUploading(false);

    if (errorCount === 0) {
      toast.success(`${successCount} archivo${successCount !== 1 ? "s" : ""} subido${successCount !== 1 ? "s" : ""}`);
      closeUploadModal();
    } else if (successCount === 0) {
      toast.error("Todas las subidas fallaron. Revisa el tipo/tamaño de archivo e intenta de nuevo.");
    } else {
      toast.warning(`${successCount} subidos, ${errorCount} fallidos`);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setTotal((t) => t - 1);
      setSelectedItem(null);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectAll() {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;

    setIsBulkDeleting(true);
    try {
      const res = await fetch("/api/media/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (res.ok) {
        const data = await res.json();
        setItems((prev) => prev.filter((i) => !selectedIds.has(i.id)));
        setTotal((t) => Math.max(0, t - data.deleted));
        setSelectedIds(new Set());
        setShowBulkDeleteConfirm(false);
        if (data.failed > 0) {
          console.warn(`Failed to delete ${data.failed} items`);
        }
      }
    } finally {
      setIsBulkDeleting(false);
    }
  }

  async function handleSave() {
    if (!selectedItem) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/media/${selectedItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: editFilename, alt: editAlt, slug: editSlug.trim() || null }),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        setSelectedItem(updated);
        if (updated.r2SyncFailed) {
          toast.warning("Guardado, pero no se pudo sincronizar el nombre con el almacenamiento. Intenta de nuevo.");
        } else {
          toast.success("Guardado");
        }
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "No se pudo guardar");
      }
    } catch {
      toast.error("No se pudo guardar");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReplace(file: File) {
    if (!selectedItem) return;
    setIsReplacing(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/media/${selectedItem.id}/replace`, { method: "POST", body: fd });
      if (res.ok) {
        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        setSelectedItem(updated);
        toast.success("Archivo reemplazado");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "No se pudo reemplazar el archivo");
      }
    } catch {
      toast.error("No se pudo reemplazar el archivo");
    } finally {
      setIsReplacing(false);
    }
  }

  async function copyUrl(item: DownloadItem) {
    await navigator.clipboard.writeText(publicUrl(item));
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function openOptions(item: DownloadItem) {
    setSelectedItem(item);
    setEditFilename(item.filename);
    setEditAlt(item.alt ?? "");
    setEditSlug(item.slug ?? "");
    setConfirmDelete(false);
  }

  function closeModal() {
    setSelectedItem(null);
    setConfirmDelete(false);
  }

  const hasMore = items.length < total;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Downloads</h1>
        <Button
          onClick={() => setShowUploadModal(true)}
          disabled={isUploading}
        >
          {isUploading ? "Subiendo..." : "Subir archivo"}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre de archivo…"
          className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        search ? (
          <div className="w-full border border-border rounded-lg py-24 flex flex-col items-center gap-3 text-muted-foreground">
            <Search className="w-10 h-10 opacity-30" />
            <span className="text-sm">No hay resultados para tu búsqueda.</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="w-full border-2 border-dashed border-border rounded-lg py-24 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/50 hover:text-foreground transition"
          >
            <FileIcon className="w-10 h-10 opacity-40" />
            <span className="text-sm">Aún no hay descargables. Haz clic para subir tu primer archivo.</span>
          </button>
        )
      ) : (
        <>
          {canBulkDelete && items.length > 0 && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
              <input
                type="checkbox"
                checked={selectedIds.size === items.length && items.length > 0}
                onChange={selectAll}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">
                {selectedIds.size === 0 ? "Seleccionar elementos" : `${selectedIds.size} seleccionados`}
              </span>
            </div>
          )}

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-4 p-4 border border-border rounded-lg hover:border-primary/40 hover:shadow-sm transition"
              >
                {canBulkDelete && (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4 cursor-pointer shrink-0"
                  />
                )}
                <div
                  className="shrink-0 w-14 h-14 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground cursor-pointer"
                  onClick={() => openOptions(item)}
                >
                  <FileTypeIcon mimeType={item.mimeType} />
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openOptions(item)}>
                  <p className="text-sm font-medium truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(item.size)} · {item.filename.split(".").pop()?.toUpperCase()} · {new Date(item.createdAt).toLocaleDateString()}
                    {wasUpdated(item) && <> · Actualizado: {new Date(item.updatedAt).toLocaleDateString()}</>}
                  </p>
                  {item.alt && (
                    <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{item.alt}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => copyUrl(item)}
                  className="shrink-0 text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted transition"
                >
                  {copiedId === item.id ? "Copiado!" : "Copiar URL"}
                </button>
                <button
                  type="button"
                  onClick={() => openOptions(item)}
                  className="shrink-0 text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted transition"
                >
                  Opciones
                </button>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => fetchDownloads(page + 1, true, search)}
              >
                Cargar más
              </Button>
            </div>
          )}
        </>
      )}

      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={closeUploadModal}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        >
          <div
            className="relative bg-background border border-border rounded-2xl shadow-xl w-full max-w-3xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold">Subir archivo</h2>
              <button
                type="button"
                onClick={closeUploadModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {isUploading && uploadQueue.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subiendo…</span>
                      <span className="tabular-nums">
                        {uploadQueue.filter((q) => q.status === "done" || q.status === "error").length} / {uploadQueue.length}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{
                          width: `${(uploadQueue.filter((q) => q.status === "done" || q.status === "error").length / uploadQueue.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {uploadQueue.map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm ${
                          item.status === "done"      ? "border-green-500/30 bg-green-500/5"
                          : item.status === "error"   ? "border-destructive/30 bg-destructive/5"
                          : item.status === "uploading" ? "border-primary/40 bg-primary/5"
                          : "border-border bg-muted/20"
                        }`}
                      >
                        {item.status === "uploading" && <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />}
                        {item.status === "done"      && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                        {item.status === "error"     && <CircleAlert className="w-4 h-4 text-destructive shrink-0" />}
                        {item.status === "pending"   && <div className="w-4 h-4 rounded-full border-2 border-border shrink-0" />}
                        <span className="truncate text-foreground/80">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const files = Array.from(e.dataTransfer.files);
                    if (files.length) handleFilesSelected(files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`min-h-[480px] flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed cursor-pointer transition ${
                    dragOver
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <FileIcon className="w-16 h-16 opacity-30" />
                  <p className="text-xl font-semibold">Arrastra tus archivos aquí</p>
                  <p className="text-base">o haz clic para elegir</p>
                  <p className="text-sm text-muted-foreground mt-2">PDF · ZIP · DOCX · PPTX · MP4 · AI · FIG · PSD · CSV — hasta 50MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ACCEPT_TYPES}
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length) handleFilesSelected(files);
                      e.target.value = "";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-[900px] mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closeModal}
              className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-muted text-foreground shadow-md transition text-lg leading-none z-10"
            >
              ×
            </button>
            <div
              className="bg-background border border-border rounded-2xl shadow-xl w-full overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-1 min-h-0">
                <div className="w-[35%] bg-muted/30 flex items-center justify-center p-10">
                  <FileTypeIcon mimeType={selectedItem.mimeType} className="w-24 h-24 opacity-50" />
                </div>

                <div className="w-[65%] flex flex-col border-l border-border">
                  <div className="flex-1 px-5 py-5 space-y-4">
                    <p className="text-base font-semibold truncate" title={selectedItem.filename}>
                      {selectedItem.filename}
                    </p>
                    <p className="text-sm text-muted-foreground -mt-2">
                      {formatBytes(selectedItem.size)} · {selectedItem.filename.split(".").pop()?.toUpperCase()}
                      {wasUpdated(selectedItem) && <> · Actualizado: {new Date(selectedItem.updatedAt).toLocaleDateString()}</>}
                    </p>
                    <hr className="border-border" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">
                        Nombre de archivo
                      </label>
                      <input
                        type="text"
                        value={editFilename}
                        onChange={(e) => setEditFilename(e.target.value)}
                        className="w-full text-base border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">
                        Descripción
                      </label>
                      <input
                        type="text"
                        value={editAlt}
                        onChange={(e) => setEditAlt(e.target.value)}
                        placeholder="Describe este archivo…"
                        className="w-full text-base border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">
                        Public URL
                      </label>
                      <div className="flex items-center gap-1 text-base border border-border rounded-lg px-3 py-2 bg-background focus-within:ring-1 focus-within:ring-primary">
                        <span className="text-muted-foreground shrink-0">near.ai/downloads/</span>
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value.toLowerCase())}
                          placeholder="opcional"
                          className="flex-1 min-w-0 bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 px-5 py-4 border-t border-border">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => copyUrl(selectedItem)}
                        className="flex-[2] text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted transition text-center"
                      >
                        {copiedId === selectedItem.id ? "Copiado!" : "Copiar URL"}
                      </button>
                      <a
                        href={publicUrl(selectedItem)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-[2] text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted transition text-center"
                      >
                        Abrir en nueva pestaña
                      </a>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="flex-1 text-sm px-3 py-2 rounded-lg border border-border text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
                      >
                        Eliminar
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => replaceInputRef.current?.click()}
                      disabled={isReplacing}
                      className="w-full text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted transition disabled:opacity-50"
                    >
                      {isReplacing
                        ? "Reemplazando…"
                        : `Reemplazar archivo (.${selectedItem.filename.split(".").pop()?.toLowerCase()})`}
                    </button>
                    <input
                      ref={replaceInputRef}
                      type="file"
                      accept={`.${selectedItem.filename.split(".").pop()?.toLowerCase()}`}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplace(file);
                        e.target.value = "";
                      }}
                    />

                    <hr className="border-border" />
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full text-sm px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      {isSaving ? "Guardando…" : "Guardar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {canBulkDelete && selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <span className="text-sm font-medium">
              {selectedIds.size} elemento{selectedIds.size !== 1 ? "s" : ""} seleccionado{selectedIds.size !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(true)}
                className="px-4 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition disabled:opacity-50"
                disabled={isBulkDeleting}
              >
                {isBulkDeleting ? "Eliminando..." : "Eliminar seleccionados"}
              </button>
            </div>
          </div>
        </div>
      )}

      {canBulkDelete && showBulkDeleteConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
          onClick={() => setShowBulkDeleteConfirm(false)}
        >
          <div
            className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <p className="font-semibold text-base">¿Eliminar {selectedIds.size} archivo{selectedIds.size !== 1 ? "s" : ""}?</p>
              <p className="text-sm text-muted-foreground">
                Estos archivos se eliminarán permanentemente del almacenamiento. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="flex-1 text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
                className="flex-1 text-sm px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition disabled:opacity-50"
              >
                {isBulkDeleting ? "Eliminando..." : "Eliminar todo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && selectedItem && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <p className="font-semibold text-base">¿Eliminar este archivo?</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{selectedItem.filename}</span> se eliminará permanentemente. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(selectedItem.id)}
                className="flex-1 text-sm px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
