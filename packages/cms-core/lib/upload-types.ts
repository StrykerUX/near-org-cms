const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DOWNLOAD_MAX_SIZE = 50 * 1024 * 1024; // 50MB

export interface FileTypeConfig {
  ext: string;
  mimeType: string;
  maxSize: number;
  validExtensions: string[];
}

export const ALLOWED_TYPES: Record<string, FileTypeConfig> = {
  "image/jpeg": { ext: "jpg", mimeType: "image/jpeg", maxSize: IMAGE_MAX_SIZE, validExtensions: ["jpg", "jpeg"] },
  "image/png": { ext: "png", mimeType: "image/png", maxSize: IMAGE_MAX_SIZE, validExtensions: ["png"] },
  "image/webp": { ext: "webp", mimeType: "image/webp", maxSize: IMAGE_MAX_SIZE, validExtensions: ["webp"] },
  "image/gif": { ext: "gif", mimeType: "image/gif", maxSize: IMAGE_MAX_SIZE, validExtensions: ["gif"] },
  "image/svg+xml": { ext: "svg", mimeType: "image/svg+xml", maxSize: IMAGE_MAX_SIZE, validExtensions: ["svg"] },
  "application/pdf": { ext: "pdf", mimeType: "application/pdf", maxSize: DOWNLOAD_MAX_SIZE, validExtensions: ["pdf"] },
  "application/zip": { ext: "zip", mimeType: "application/zip", maxSize: DOWNLOAD_MAX_SIZE, validExtensions: ["zip"] },
  "application/x-zip-compressed": { ext: "zip", mimeType: "application/zip", maxSize: DOWNLOAD_MAX_SIZE, validExtensions: ["zip"] },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    ext: "docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    maxSize: DOWNLOAD_MAX_SIZE,
    validExtensions: ["docx"],
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    ext: "pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    maxSize: DOWNLOAD_MAX_SIZE,
    validExtensions: ["pptx"],
  },
  "video/mp4": { ext: "mp4", mimeType: "video/mp4", maxSize: DOWNLOAD_MAX_SIZE, validExtensions: ["mp4"] },
  // .ai/.psd rarely get a reliable browser-reported mimetype; these entries cover the cases where one is reported.
  "application/postscript": { ext: "ai", mimeType: "application/illustrator", maxSize: DOWNLOAD_MAX_SIZE, validExtensions: ["ai"] },
  "image/vnd.adobe.photoshop": { ext: "psd", mimeType: "application/x-photoshop", maxSize: DOWNLOAD_MAX_SIZE, validExtensions: ["psd"] },
  "text/csv": { ext: "csv", mimeType: "text/csv", maxSize: DOWNLOAD_MAX_SIZE, validExtensions: ["csv"] },
  "application/vnd.ms-excel": { ext: "csv", mimeType: "text/csv", maxSize: DOWNLOAD_MAX_SIZE, validExtensions: ["csv"] },
};

// Browsers frequently report an unreliable/generic mimetype (or none) for these extensions —
// zip/ai/fig/psd fall back to extension-based resolution when that happens. .fig has no
// standard mimetype at all, so it resolves *only* through this path.
const AMBIGUOUS_MIMETYPES = new Set(["application/octet-stream", ""]);

const EXTENSION_FALLBACK: Record<string, FileTypeConfig> = {
  zip: ALLOWED_TYPES["application/zip"],
  ai: { ext: "ai", mimeType: "application/illustrator", maxSize: DOWNLOAD_MAX_SIZE, validExtensions: ["ai"] },
  fig: { ext: "fig", mimeType: "application/x-figma", maxSize: DOWNLOAD_MAX_SIZE, validExtensions: ["fig"] },
  psd: { ext: "psd", mimeType: "application/x-photoshop", maxSize: DOWNLOAD_MAX_SIZE, validExtensions: ["psd"] },
  csv: ALLOWED_TYPES["text/csv"],
};

export function resolveFileType(file: File): FileTypeConfig | null {
  if (AMBIGUOUS_MIMETYPES.has(file.type)) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    return (ext && EXTENSION_FALLBACK[ext]) || null;
  }
  return ALLOWED_TYPES[file.type] ?? null;
}

export const CACHE_CONTROL = "public, max-age=300, must-revalidate";

export function contentDispositionHeader(
  filename: string,
  disposition: "inline" | "attachment" = "inline"
): string {
  const asciiFallback = filename.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");
  const encoded = encodeURIComponent(filename);
  return `${disposition}; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}

const uploadRateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = uploadRateLimit.get(userId);
  if (!entry || now > entry.resetAt) {
    uploadRateLimit.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}
