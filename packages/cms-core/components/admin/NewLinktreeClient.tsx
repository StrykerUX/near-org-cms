"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { ArrowLeft, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import MediaPickerModal from "@cms/components/admin/MediaPickerModal";
import LinktreeEditor, { type LinktreeSectionState, type LinktreeLinkState } from "@cms/components/admin/linktree/LinktreeEditor";
import LinktreePublicView from "@cms/components/linktree/LinktreePublicView";
import { Button } from "@cms/components/ui/button";
import { Input } from "@cms/components/ui/input";
import { Label } from "@cms/components/ui/label";
import { Textarea } from "@cms/components/ui/textarea";
import { Switch } from "@cms/components/ui/switch";
import { expandHexColor } from "@cms/lib/utils";
import { useNavigationGuard } from "@cms/components/admin/NavigationGuardProvider";

function titleToSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

function serializeLink(link: LinktreeLinkState, position: number) {
  return {
    id: link.id,
    title: link.title,
    url: link.url,
    icon: link.icon,
    position,
    isActive: link.isActive,
    forwardUtm: link.forwardUtm,
    startsAt: link.startsAt || null,
    endsAt: link.endsAt || null,
  };
}

function serializeSections(sections: LinktreeSectionState[]) {
  return sections.map((section, position) => ({
    id: section.id,
    title: section.title,
    position,
    isActive: section.isActive,
    displayType: section.displayType,
    links: section.links.map((link, i) => serializeLink(link, i)),
  }));
}

function ColorPickerField({
  label,
  value,
  defaultValue,
  onChange,
}: {
  label: string;
  value: string;
  defaultValue: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded border border-border cursor-pointer overflow-hidden flex-shrink-0"
          style={{ backgroundColor: value || defaultValue }}
        >
          <input
            type="color"
            value={value || defaultValue}
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 w-full h-full cursor-pointer"
            title={`Pick ${label.toLowerCase()}`}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onChange(expandHexColor(e.target.value))}
          placeholder={defaultValue}
          maxLength={9}
          className="text-xs font-mono flex-1 bg-transparent border border-border/70 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
        />
        {value !== defaultValue && (
          <button
            type="button"
            onClick={() => onChange(defaultValue)}
            className="text-muted-foreground hover:text-foreground transition"
            title="Reset"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function NewLinktreeClient() {
  const router = useRouter();
  const { isDirty, setIsDirty, requestNavigation } = useNavigationGuard();
  const markDirty = () => setIsDirty(true);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "design" | "settings" | "preview">("profile");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  const [bgColor, setBgColor] = useState("#0A0A0A");
  const [bgImage, setBgImage] = useState("");
  const [isBgImagePickerOpen, setIsBgImagePickerOpen] = useState(false);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [buttonBgColor, setButtonBgColor] = useState("#FFFFFF");
  const [buttonTextColor, setButtonTextColor] = useState("#0A0A0A");
  const [overlayColor, setOverlayColor] = useState("#000000");
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [glassEffect, setGlassEffect] = useState(false);

  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");

  const [sections, setSections] = useState<LinktreeSectionState[]>([]);
  const [ungroupedLinks, setUngroupedLinks] = useState<LinktreeLinkState[]>([]);

  const displaySlug = slug || titleToSlug(name);

  async function handleSubmit(statusOverride?: "DRAFT" | "PUBLISHED") {
    if (!name.trim()) {
      toast.error("Give this linktree a name first");
      return;
    }
    setIsLoading(true);
    const finalStatus = statusOverride || status;

    try {
      const response = await fetch("/api/linktrees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: displaySlug,
          displayName,
          bio,
          avatarUrl,
          bgColor,
          bgImage,
          textColor,
          buttonBgColor,
          buttonTextColor,
          overlayColor,
          overlayOpacity,
          glassEffect,
          status: finalStatus,
          sections: serializeSections(sections),
          ungroupedLinks: ungroupedLinks.map((link, i) => serializeLink(link, i)),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to create linktree");
        return;
      }

      const linktree = await response.json();
      setIsDirty(false);
      router.push(`/admin/linktrees/${linktree.id}/edit`);
    } catch (err) {
      console.error(err);
      toast.error("Error creating linktree");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="-m-8 flex flex-col h-screen bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between h-[53px] px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => requestNavigation("/admin/linktrees")}
              className="text-muted-foreground hover:text-foreground transition flex-shrink-0"
              title="Back to Linktrees"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="text-sm text-muted-foreground">Linktrees</span>
            <span className="text-sm text-muted-foreground/50">/</span>
            <span className="text-sm font-medium text-foreground truncate">{name || "New Linktree"}</span>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <Button type="button" onClick={() => handleSubmit("DRAFT")} disabled={isLoading} variant="outline" size="sm" className="relative">
              Save Draft
              {isDirty && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />}
            </Button>
            <Button type="button" onClick={() => handleSubmit("PUBLISHED")} disabled={isLoading} size="sm" className="relative">
              Publish
              {isDirty && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — sections/links editor, the central piece */}
        <div className="flex-1 overflow-auto bg-background">
          <div className="p-6 space-y-6 max-w-2xl mx-auto w-full">
            <div
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => { markDirty(); setName(e.currentTarget.textContent ?? ""); }}
              data-placeholder="Linktree name (internal)..."
              className="w-full text-3xl font-bold bg-transparent text-foreground focus:outline-none outline-none break-words empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"
            />
            <div className="text-sm text-muted-foreground font-mono">near.ai/{displaySlug || "…"}</div>

            <LinktreeEditor
              sections={sections}
              ungroupedLinks={ungroupedLinks}
              onChange={(nextSections, nextUngrouped) => {
                markDirty();
                setSections(nextSections);
                setUngroupedLinks(nextUngrouped);
              }}
            />
          </div>
        </div>

        {/* RIGHT — metadata tabs */}
        <aside className="w-[380px] shrink-0 border-l border-border bg-card flex flex-col sticky top-[53px] h-[calc(100vh-53px)]">
          <div className="flex border-b border-border shrink-0">
            {(["profile", "design", "settings", "preview"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wide transition border-b-2 -mb-px ${
                  activeTab === tab
                    ? "text-foreground border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab === "profile" ? "Profile" : tab === "design" ? "Design" : tab === "settings" ? "Settings" : "Preview"}
              </button>
            ))}
          </div>

          <div className={`overflow-y-auto flex-1 ${activeTab === "preview" ? "flex flex-col items-center p-6" : "space-y-6 p-6"}`}>
            {activeTab === "preview" && (
              <div className="w-[300px] h-[600px] rounded-[2rem] border border-border shadow-xl overflow-hidden shrink-0">
                <div className="h-full overflow-y-auto">
                  <LinktreePublicView
                    displayName={displayName}
                    bio={bio}
                    avatarUrl={avatarUrl}
                    bgColor={bgColor}
                    bgImage={bgImage}
                    textColor={textColor}
                    buttonBgColor={buttonBgColor}
                    buttonTextColor={buttonTextColor}
                    overlayColor={overlayColor}
                    overlayOpacity={overlayOpacity}
                    glassEffect={glassEffect}
                    sections={sections}
                    ungroupedLinks={ungroupedLinks}
                    preview
                  />
                </div>
              </div>
            )}
            {activeTab === "profile" && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Avatar</Label>
                  {avatarUrl ? (
                    <div className="relative w-20">
                      <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setAvatarUrl(""); markDirty(); }}
                        className="absolute top-0 right-0 bg-black/50 hover:bg-black/70 text-white rounded-full p-0.5 transition"
                        title="Remove avatar"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAvatarPickerOpen(true)}
                      className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-foreground transition"
                    >
                      <ImageIcon size={18} />
                    </button>
                  )}
                  <MediaPickerModal
                    open={isAvatarPickerOpen}
                    onClose={() => setIsAvatarPickerOpen(false)}
                    onSelect={(urlOrUrls) => {
                      const url = Array.isArray(urlOrUrls) ? urlOrUrls[0] : urlOrUrls;
                      setAvatarUrl(url);
                      markDirty();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-xs font-semibold uppercase tracking-wide">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => { markDirty(); setDisplayName(e.target.value); }}
                    placeholder="Shown on the public page"
                    className="bg-muted/30 border-border/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs font-semibold uppercase tracking-wide">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => { markDirty(); setBio(e.target.value); }}
                    placeholder="Short description"
                    rows={3}
                    className="bg-muted/30 border-border/70"
                  />
                </div>
              </>
            )}

            {activeTab === "design" && (
              <>
                <div className="space-y-3">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Colors</Label>
                  <ColorPickerField label="Background" value={bgColor} defaultValue="#0A0A0A" onChange={(v) => { setBgColor(v); markDirty(); }} />
                  <ColorPickerField label="Text" value={textColor} defaultValue="#FFFFFF" onChange={(v) => { setTextColor(v); markDirty(); }} />
                  <ColorPickerField label="Button Background" value={buttonBgColor} defaultValue="#FFFFFF" onChange={(v) => { setButtonBgColor(v); markDirty(); }} />
                  <ColorPickerField label="Button Text" value={buttonTextColor} defaultValue="#0A0A0A" onChange={(v) => { setButtonTextColor(v); markDirty(); }} />
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xs text-foreground">Glass effect</span>
                      <p className="text-xs text-muted-foreground">Tinted glass background instead of solid fill</p>
                    </div>
                    <Switch checked={glassEffect} onCheckedChange={(v) => { setGlassEffect(v); markDirty(); }} />
                  </div>
                  <ColorPickerField label="Overlay" value={overlayColor} defaultValue="#000000" onChange={(v) => { setOverlayColor(v); markDirty(); }} />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Overlay Opacity</span>
                      <span className="text-xs font-mono text-muted-foreground">{overlayOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={overlayOpacity}
                      onChange={(e) => { setOverlayOpacity(Number(e.target.value)); markDirty(); }}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Background Image</span>
                  {bgImage ? (
                    <div className="relative">
                      <img src={bgImage} alt="Background" className="w-full h-20 rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => { setBgImage(""); markDirty(); }}
                        className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded p-0.5 transition"
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsBgImagePickerOpen(true)}
                      className="w-full border-2 border-dashed border-border rounded-lg py-3 flex items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition text-xs"
                    >
                      <ImageIcon size={14} />
                      Pick background image
                    </button>
                  )}
                  <MediaPickerModal
                    open={isBgImagePickerOpen}
                    onClose={() => setIsBgImagePickerOpen(false)}
                    onSelect={(urlOrUrls) => {
                      const url = Array.isArray(urlOrUrls) ? urlOrUrls[0] : urlOrUrls;
                      setBgImage(url);
                      markDirty();
                    }}
                  />
                </div>
              </>
            )}

            {activeTab === "settings" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wide">Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => { markDirty(); setStatus(e.target.value as any); }}
                    className="w-full border border-border/70 rounded-[var(--radius)] px-3 py-2 text-sm bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-xs font-semibold uppercase tracking-wide">URL Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => { markDirty(); setSlug(e.target.value.toLowerCase()); }}
                    placeholder={titleToSlug(name)}
                    className="bg-muted/30 border-border/70"
                  />
                  <div className="text-xs text-muted-foreground font-mono">near.ai/{displaySlug || "…"}</div>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
