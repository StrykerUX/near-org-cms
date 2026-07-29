"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Trash2, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@cms/components/ui/dialog";
import { Button } from "@cms/components/ui/button";
import { Input } from "@cms/components/ui/input";
import { Label } from "@cms/components/ui/label";

interface UtmPreset {
  id: string;
  label: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
}

export default function LinkUtmQrModal({
  linktreeId,
  linkId,
  linkUrl,
  open,
  onClose,
}: {
  linktreeId: string;
  linkId: string;
  linkUrl: string;
  open: boolean;
  onClose: () => void;
}) {
  const [presets, setPresets] = useState<UtmPreset[]>([]);
  const [presetLabel, setPresetLabel] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");

  const presetsUrl = `/api/linktrees/${linktreeId}/links/${linkId}/utm-presets`;

  useEffect(() => {
    if (!open) return;
    fetch(presetsUrl)
      .then((res) => res.json())
      .then((data) => setPresets(data.presets ?? []))
      .catch(() => {});
  }, [open, presetsUrl]);

  const trackingUrl = (() => {
    if (typeof window === "undefined") return "";
    const url = new URL(`/api/linktree-click/${linkId}`, window.location.origin);
    if (utmSource) url.searchParams.set("utm_source", utmSource);
    if (utmMedium) url.searchParams.set("utm_medium", utmMedium);
    if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
    if (utmTerm) url.searchParams.set("utm_term", utmTerm);
    if (utmContent) url.searchParams.set("utm_content", utmContent);
    return url.toString();
  })();

  useEffect(() => {
    if (!trackingUrl) return;
    QRCode.toDataURL(trackingUrl, { width: 240, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [trackingUrl]);

  function loadPreset(preset: UtmPreset) {
    setUtmSource(preset.utmSource ?? "");
    setUtmMedium(preset.utmMedium ?? "");
    setUtmCampaign(preset.utmCampaign ?? "");
    setUtmTerm(preset.utmTerm ?? "");
    setUtmContent(preset.utmContent ?? "");
  }

  async function savePreset() {
    if (!presetLabel.trim()) {
      toast.error("Give the preset a label first");
      return;
    }
    const res = await fetch(presetsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: presetLabel,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
      }),
    });
    if (!res.ok) {
      toast.error("Failed to save preset");
      return;
    }
    const preset = await res.json();
    setPresets((prev) => [preset, ...prev]);
    setPresetLabel("");
    toast.success("Preset saved");
  }

  async function deletePreset(presetId: string) {
    const res = await fetch(`${presetsUrl}/${presetId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete preset");
      return;
    }
    setPresets((prev) => prev.filter((p) => p.id !== presetId));
  }

  function copyUrl() {
    navigator.clipboard.writeText(trackingUrl);
    toast.success("Copied to clipboard");
  }

  function downloadQr() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "linktree-link-qr.png";
    a.click();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>UTM & QR</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <p className="text-xs text-muted-foreground font-mono break-all">Destination: {linkUrl}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Source</Label>
              <Input value={utmSource} onChange={(e) => setUtmSource(e.target.value)} placeholder="newsletter" className="bg-muted/30 border-border/70" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Medium</Label>
              <Input value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} placeholder="email" className="bg-muted/30 border-border/70" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Campaign</Label>
              <Input value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} placeholder="launch" className="bg-muted/30 border-border/70" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Term</Label>
              <Input value={utmTerm} onChange={(e) => setUtmTerm(e.target.value)} className="bg-muted/30 border-border/70" />
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-xs">Content</Label>
              <Input value={utmContent} onChange={(e) => setUtmContent(e.target.value)} className="bg-muted/30 border-border/70" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={trackingUrl}
              className="text-xs font-mono bg-muted/30 border-border/70"
            />
            <Button type="button" variant="outline" size="icon" onClick={copyUrl} title="Copy URL">
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {qrDataUrl && (
            <div className="flex items-center gap-4">
              <img src={qrDataUrl} alt="QR code" className="w-32 h-32 rounded-lg border border-border" />
              <Button type="button" variant="outline" size="sm" onClick={downloadQr}>
                <Download className="w-4 h-4 mr-1.5" /> Download PNG
              </Button>
            </div>
          )}

          <div className="space-y-2 border-t border-border pt-4">
            <Label className="text-xs font-semibold uppercase tracking-wide">Presets</Label>
            <div className="flex items-center gap-2">
              <Input
                value={presetLabel}
                onChange={(e) => setPresetLabel(e.target.value)}
                placeholder="Preset name"
                className="bg-muted/30 border-border/70"
              />
              <Button type="button" size="sm" onClick={savePreset}>Save</Button>
            </div>
            {presets.length > 0 && (
              <ul className="space-y-1">
                {presets.map((preset) => (
                  <li key={preset.id} className="flex items-center justify-between text-sm border border-border/70 rounded-lg px-3 py-1.5">
                    <button type="button" onClick={() => loadPreset(preset)} className="text-left flex-1 hover:underline">
                      {preset.label}
                    </button>
                    <button type="button" onClick={() => deletePreset(preset.id)} className="text-muted-foreground hover:text-destructive transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
