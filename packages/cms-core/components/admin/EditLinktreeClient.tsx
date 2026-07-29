"use client";

import { useState } from "react";
import Link from "next/link";
import slugify from "slugify";
import { ArrowLeft, ImageIcon, X, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import MediaPickerModal from "@cms/components/admin/MediaPickerModal";
import LinktreeEditor, { type LinktreeSectionState, type LinktreeLinkState } from "@cms/components/admin/linktree/LinktreeEditor";
import LinktreePublicView from "@cms/components/linktree/LinktreePublicView";
import IPhonePreviewFrame from "@cms/components/linktree/IPhonePreviewFrame";
import LinktreeAnalyticsClient from "@cms/components/admin/linktree/LinktreeAnalyticsClient";
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

function TextStyleToggle({
  label,
  bold,
  italic,
  onBoldChange,
  onItalicChange,
}: {
  label: string;
  bold: boolean;
  italic: boolean;
  onBoldChange: (v: boolean) => void;
  onItalicChange: (v: boolean) => void;
}) {
  const chipClass = (active: boolean) =>
    `w-7 h-7 rounded border text-xs transition ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "border-border/70 text-muted-foreground hover:text-foreground"
    }`;
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex gap-1.5">
        <button type="button" onClick={() => onBoldChange(!bold)} className={`${chipClass(bold)} font-bold`} title="Bold">
          B
        </button>
        <button type="button" onClick={() => onItalicChange(!italic)} className={`${chipClass(italic)} italic`} title="Italic">
          I
        </button>
      </div>
    </div>
  );
}

function SizeToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "SM" | "MD" | "LG";
  onChange: (v: "SM" | "MD" | "LG") => void;
}) {
  const sizes: { key: "SM" | "MD" | "LG"; label: string }[] = [
    { key: "SM", label: "S" },
    { key: "MD", label: "M" },
    { key: "LG", label: "B" },
  ];
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex gap-1.5">
        {sizes.map((size) => (
          <button
            key={size.key}
            type="button"
            onClick={() => onChange(size.key)}
            className={`w-7 h-7 rounded border text-xs font-medium transition ${
              value === size.key
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export interface EditLinktreeInitialData {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  bgColor: string;
  bgImage: string;
  textColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  overlayColor: string;
  overlayOpacity: number;
  overlayColor2: string;
  overlayOpacity2: number;
  glassEffect: boolean;
  sectionTitleBold: boolean;
  sectionTitleItalic: boolean;
  buttonTextBold: boolean;
  buttonTextItalic: boolean;
  titleFontSize: "SM" | "MD" | "LG";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sections: LinktreeSectionState[];
  ungroupedLinks: LinktreeLinkState[];
}

export default function EditLinktreeClient({ initial }: { initial: EditLinktreeInitialData }) {
  const { isDirty, setIsDirty, requestNavigation } = useNavigationGuard();
  const markDirty = () => setIsDirty(true);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "design" | "settings">("profile");
  const [mainTab, setMainTab] = useState<"editor" | "preview" | "analytics">("editor");

  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [bio, setBio] = useState(initial.bio);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  const [bgColor, setBgColor] = useState(initial.bgColor);
  const [bgImage, setBgImage] = useState(initial.bgImage);
  const [isBgImagePickerOpen, setIsBgImagePickerOpen] = useState(false);
  const [textColor, setTextColor] = useState(initial.textColor);
  const [buttonBgColor, setButtonBgColor] = useState(initial.buttonBgColor);
  const [buttonTextColor, setButtonTextColor] = useState(initial.buttonTextColor);
  const [overlayColor, setOverlayColor] = useState(initial.overlayColor);
  const [overlayOpacity, setOverlayOpacity] = useState(initial.overlayOpacity);
  const [overlayColor2, setOverlayColor2] = useState(initial.overlayColor2);
  const [overlayOpacity2, setOverlayOpacity2] = useState(initial.overlayOpacity2);
  const [glassEffect, setGlassEffect] = useState(initial.glassEffect);
  const [sectionTitleBold, setSectionTitleBold] = useState(initial.sectionTitleBold);
  const [sectionTitleItalic, setSectionTitleItalic] = useState(initial.sectionTitleItalic);
  const [buttonTextBold, setButtonTextBold] = useState(initial.buttonTextBold);
  const [buttonTextItalic, setButtonTextItalic] = useState(initial.buttonTextItalic);
  const [titleFontSize, setTitleFontSize] = useState<"SM" | "MD" | "LG">(initial.titleFontSize);

  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(initial.status);

  const [sections, setSections] = useState<LinktreeSectionState[]>(initial.sections);
  const [ungroupedLinks, setUngroupedLinks] = useState<LinktreeLinkState[]>(initial.ungroupedLinks);

  const displaySlug = slug || titleToSlug(name);

  async function handleSubmit(statusOverride?: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
    setIsLoading(true);
    const finalStatus = statusOverride || status;

    try {
      const response = await fetch(`/api/linktrees/${initial.id}`, {
        method: "PUT",
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
          overlayColor2,
          overlayOpacity2,
          glassEffect,
          sectionTitleBold,
          sectionTitleItalic,
          buttonTextBold,
          buttonTextItalic,
          titleFontSize,
          status: finalStatus,
          sections: serializeSections(sections),
          ungroupedLinks: ungroupedLinks.map((link, i) => serializeLink(link, i)),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to save linktree");
        return;
      }

      const saved = await response.json();
      // Re-attach the ids the server assigned to newly created sections/links
      // (positions line up 1:1 since we just sent this same order).
      setSections((prev) =>
        prev.map((section, i) => ({
          ...section,
          id: saved.sections?.[i]?.id ?? section.id,
          links: section.links.map((link, j) => ({
            ...link,
            id: saved.sections?.[i]?.links?.[j]?.id ?? link.id,
          })),
        }))
      );
      setUngroupedLinks((prev) =>
        prev.map((link, i) => ({ ...link, id: saved.links?.[i]?.id ?? link.id }))
      );
      setStatus(finalStatus);
      setIsDirty(false);
      toast.success("Saved");
    } catch (err) {
      console.error(err);
      toast.error("Error saving linktree");
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
            <span className="text-sm font-medium text-foreground truncate">{name || "Untitled"}</span>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/linktrees/${initial.id}/analytics`}>
                <BarChart3 className="w-4 h-4 mr-1.5" />
                Analytics
              </Link>
            </Button>
            {status === "PUBLISHED" && (
              <Button asChild variant="ghost" size="sm">
                <Link href={`/${initial.slug}`} target="_blank">View public page</Link>
              </Button>
            )}
            <Button type="button" onClick={() => handleSubmit("DRAFT")} disabled={isLoading} variant="outline" size="sm" className="relative">
              Save Draft
              {isDirty && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />}
            </Button>
            <Button type="button" onClick={() => handleSubmit("PUBLISHED")} disabled={isLoading} size="sm" className="relative">
              {status === "PUBLISHED" ? "Save" : "Publish"}
              {isDirty && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Editor / Preview / Analytics */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          <div className="flex items-center gap-6 border-b border-border px-6 shrink-0">
            {(["editor", "preview", "analytics"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMainTab(tab)}
                className={`py-3 text-sm font-medium border-b-2 -mb-px transition ${
                  mainTab === tab
                    ? "text-foreground border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab === "editor" ? "Editor" : tab === "preview" ? "Preview" : "Analytics"}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto">
            {mainTab === "editor" && (
              <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { markDirty(); setName(e.target.value); }}
                  placeholder="Linktree name (internal)"
                  className="w-full text-3xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50"
                />
                <div className="flex items-center text-sm font-mono text-muted-foreground">
                  <span>near.ai/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => { markDirty(); setSlug(e.target.value.toLowerCase()); }}
                    placeholder={titleToSlug(name)}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 focus:underline"
                  />
                </div>

                <LinktreeEditor
                  linktreeId={initial.id}
                  sections={sections}
                  ungroupedLinks={ungroupedLinks}
                  onChange={(nextSections, nextUngrouped) => {
                    markDirty();
                    setSections(nextSections);
                    setUngroupedLinks(nextUngrouped);
                  }}
                />
              </div>
            )}

            {mainTab === "preview" && (
              <div className="flex items-center justify-center p-10 min-h-full">
                <IPhonePreviewFrame>
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
                    overlayColor2={overlayColor2}
                    overlayOpacity2={overlayOpacity2}
                    glassEffect={glassEffect}
                    sectionTitleBold={sectionTitleBold}
                    sectionTitleItalic={sectionTitleItalic}
                    buttonTextBold={buttonTextBold}
                    buttonTextItalic={buttonTextItalic}
                    titleFontSize={titleFontSize}
                    sections={sections}
                    ungroupedLinks={ungroupedLinks}
                    preview
                  />
                </IPhonePreviewFrame>
              </div>
            )}

            {mainTab === "analytics" && (
              <div className="p-6">
                <LinktreeAnalyticsClient linktreeId={initial.id} linktreeName={name} embedded />
              </div>
            )}
          </div>
        </div>

        <aside className="w-[380px] shrink-0 border-l border-border bg-card flex flex-col sticky top-[53px] h-[calc(100vh-53px)]">
          <div className="flex border-b border-border shrink-0">
            {(["profile", "design", "settings"] as const).map((tab) => (
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
                {tab === "profile" ? "Profile" : tab === "design" ? "Design" : "Settings"}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto flex-1 p-6 space-y-6">
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
                {/* Background: base color, image, and the overlay gradient rendered on top of it */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Background</Label>
                  <ColorPickerField label="Background Color" value={bgColor} defaultValue="#0A0A0A" onChange={(v) => { setBgColor(v); markDirty(); }} />
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
                  <div className="space-y-2 pt-1">
                    <span className="text-xs text-muted-foreground">Overlay gradient (rendered on top of the background)</span>
                    <ColorPickerField label="Overlay Color 1" value={overlayColor} defaultValue="#000000" onChange={(v) => { setOverlayColor(v); markDirty(); }} />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Overlay Opacity 1</span>
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
                    <ColorPickerField label="Overlay Color 2" value={overlayColor2} defaultValue="#000000" onChange={(v) => { setOverlayColor2(v); markDirty(); }} />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Overlay Opacity 2</span>
                        <span className="text-xs font-mono text-muted-foreground">{overlayOpacity2}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={overlayOpacity2}
                        onChange={(e) => { setOverlayOpacity2(Number(e.target.value)); markDirty(); }}
                        className="w-full accent-primary"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Gradient from Color 1 (top) to Color 2 (bottom)</p>
                  </div>
                </div>

                {/* Typography: title size, general text color, section labels */}
                <div className="space-y-3 border-t border-border pt-6">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Typography</Label>
                  <SizeToggle label="Title Size" value={titleFontSize} onChange={(v) => { setTitleFontSize(v); markDirty(); }} />
                  <ColorPickerField label="Text Color" value={textColor} defaultValue="#FFFFFF" onChange={(v) => { setTextColor(v); markDirty(); }} />
                  <TextStyleToggle
                    label="Section Title Style"
                    bold={sectionTitleBold}
                    italic={sectionTitleItalic}
                    onBoldChange={(v) => { setSectionTitleBold(v); markDirty(); }}
                    onItalicChange={(v) => { setSectionTitleItalic(v); markDirty(); }}
                  />
                </div>

                {/* Buttons: fill, text, style, and the optional glass treatment */}
                <div className="space-y-3 border-t border-border pt-6">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Buttons</Label>
                  <ColorPickerField label="Button Background" value={buttonBgColor} defaultValue="#FFFFFF" onChange={(v) => { setButtonBgColor(v); markDirty(); }} />
                  <ColorPickerField label="Button Text" value={buttonTextColor} defaultValue="#0A0A0A" onChange={(v) => { setButtonTextColor(v); markDirty(); }} />
                  <TextStyleToggle
                    label="Button Text Style"
                    bold={buttonTextBold}
                    italic={buttonTextItalic}
                    onBoldChange={(v) => { setButtonTextBold(v); markDirty(); }}
                    onItalicChange={(v) => { setButtonTextItalic(v); markDirty(); }}
                  />
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xs text-foreground">Glass effect</span>
                      <p className="text-xs text-muted-foreground">Tinted glass background instead of solid fill</p>
                    </div>
                    <Switch checked={glassEffect} onCheckedChange={(v) => { setGlassEffect(v); markDirty(); }} />
                  </div>
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
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-xs font-semibold uppercase tracking-wide">URL Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => { markDirty(); setSlug(e.target.value.toLowerCase()); }}
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
