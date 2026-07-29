import type { CSSProperties } from "react";
import { resolveLinktreeIcon } from "@cms/lib/linktree-icons";

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized.split("").map((c) => c + c).join("")
      : normalized;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface LinktreeLinkData {
  id?: string;
  title: string;
  url: string;
  icon?: string | null;
  isActive?: boolean;
}

export interface LinktreeSectionData {
  id?: string;
  title: string;
  displayType: "COLUMN" | "ROW" | "ICONS" | "ICONS_LABEL";
  isActive?: boolean;
  links: LinktreeLinkData[];
}

export interface LinktreePublicViewProps {
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  bgColor?: string | null;
  bgImage?: string | null;
  textColor?: string | null;
  buttonBgColor?: string | null;
  buttonTextColor?: string | null;
  overlayColor?: string | null;
  overlayOpacity?: number | null;
  glassEffect?: boolean | null;
  sections: LinktreeSectionData[];
  ungroupedLinks: LinktreeLinkData[];
  /** When true, links render as inert previews instead of navigating away (admin live preview). */
  preview?: boolean;
}

function LinkButton({
  link,
  buttonBgColor,
  buttonTextColor,
  glassEffect = false,
  compact = false,
  showLabel = true,
  preview = false,
}: {
  link: LinktreeLinkData;
  buttonBgColor?: string | null;
  buttonTextColor?: string | null;
  glassEffect?: boolean | null;
  compact?: boolean;
  showLabel?: boolean;
  preview?: boolean;
}) {
  const Icon = link.icon ? resolveLinktreeIcon(link.icon) : null;
  const accent = buttonBgColor || "#FFFFFF";
  const useGlass = !!glassEffect;

  const style: CSSProperties = {
    color: buttonTextColor || "#0A0A0A",
    fontSize: "var(--font-size-body)",
    ...(useGlass
      ? ({
          "--lt-glass-bg": hexToRgba(accent, 0.12),
          "--lt-glass-bg-hover": hexToRgba(accent, 0.2),
          "--lt-glass-border": hexToRgba(accent, 0.25),
          "--lt-glass-accent": hexToRgba(accent, 0.45),
          "--lt-glass-shadow": hexToRgba(accent, 0.18),
        } as CSSProperties)
      : { backgroundColor: accent }),
  };

  const glassClass = useGlass ? "linktree-glass" : "";

  const content = compact || !showLabel ? (
    Icon && <Icon className="w-6 h-6" />
  ) : (
    <>
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 shrink-0" />}
      <span className="relative w-full overflow-hidden text-center leading-none">
        <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
          {link.title}
        </span>
        <span className="absolute left-0 top-0 block w-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
          {link.title}
        </span>
      </span>
    </>
  );

  const className = compact
    ? `flex items-center justify-center gap-2 rounded-full w-14 h-14 shadow-sm transition ${useGlass ? glassClass : "hover:opacity-90"}`
    : `group relative flex items-center rounded-xl px-4 py-3.5 w-full font-medium shadow-sm transition ${glassClass}`;

  if (preview) {
    return (
      <div className={className} style={style}>
        {content}
      </div>
    );
  }

  return (
    <a
      href={link.id ? `/api/linktree-click/${link.id}` : link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {content}
    </a>
  );
}

function SectionView({
  section,
  buttonBgColor,
  buttonTextColor,
  glassEffect,
  preview,
}: {
  section: LinktreeSectionData;
  buttonBgColor?: string | null;
  buttonTextColor?: string | null;
  glassEffect?: boolean | null;
  preview?: boolean;
}) {
  const activeLinks = section.links.filter((l) => l.isActive !== false);
  if (!activeLinks.length) return null;

  return (
    <div className="w-full space-y-3">
      {section.title && (
        <h2 className="text-sm font-semibold uppercase tracking-widest opacity-70">
          {section.title}
        </h2>
      )}
      {section.displayType === "ICONS" && (
        <div className="flex flex-wrap justify-center gap-3">
          {activeLinks.map((link, i) => (
            <LinkButton
              key={link.id ?? i}
              link={link}
              buttonBgColor={buttonBgColor}
              buttonTextColor={buttonTextColor}
              glassEffect={glassEffect}
              compact
              showLabel={false}
              preview={preview}
            />
          ))}
        </div>
      )}
      {section.displayType === "ICONS_LABEL" && (
        <div className="grid grid-cols-2 gap-3">
          {activeLinks.map((link, i) => (
            <LinkButton
              key={link.id ?? i}
              link={link}
              buttonBgColor={buttonBgColor}
              buttonTextColor={buttonTextColor}
              glassEffect={glassEffect}
              preview={preview}
            />
          ))}
        </div>
      )}
      {section.displayType === "ROW" && (
        <div className="flex flex-wrap justify-center gap-3">
          {activeLinks.map((link, i) => (
            <LinkButton
              key={link.id ?? i}
              link={link}
              buttonBgColor={buttonBgColor}
              buttonTextColor={buttonTextColor}
              glassEffect={glassEffect}
              preview={preview}
            />
          ))}
        </div>
      )}
      {section.displayType === "COLUMN" && (
        <div className="flex flex-col gap-3">
          {activeLinks.map((link, i) => (
            <LinkButton
              key={link.id ?? i}
              link={link}
              buttonBgColor={buttonBgColor}
              buttonTextColor={buttonTextColor}
              glassEffect={glassEffect}
              preview={preview}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LinktreePublicView({
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
  sections,
  ungroupedLinks,
  preview = false,
}: LinktreePublicViewProps) {
  const activeSections = sections.filter((s) => s.isActive !== false);
  const activeUngrouped = ungroupedLinks.filter((l) => l.isActive !== false);

  return (
    <div
      className={`relative w-full ${preview ? "h-full min-h-full" : "min-h-dvh"}`}
      style={{
        backgroundColor: bgColor || "#0A0A0A",
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: overlayColor || "#000000",
          opacity: (overlayOpacity ?? 0) / 100,
        }}
      />

      <div
        className="relative flex flex-col items-center px-6 py-12 gap-8"
        style={{ color: textColor || "#FFFFFF" }}
      >
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName || "Avatar"}
              className="w-20 h-20 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-2xl font-semibold">
              {displayName?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          {displayName && (
            <h1 className="font-semibold" style={{ fontSize: "var(--font-size-h3)" }}>
              {displayName}
            </h1>
          )}
          {bio && (
            <p className="opacity-80 whitespace-pre-line" style={{ fontSize: "var(--font-size-body)" }}>
              {bio}
            </p>
          )}
        </div>

        <div className="w-full max-w-sm flex flex-col gap-6">
          {activeUngrouped.length > 0 && (
            <SectionView
              section={{ title: "", displayType: "COLUMN", links: activeUngrouped }}
              buttonBgColor={buttonBgColor}
              buttonTextColor={buttonTextColor}
              glassEffect={glassEffect}
              preview={preview}
            />
          )}
          {activeSections.map((section, i) => (
            <SectionView
              key={section.id ?? i}
              section={section}
              buttonBgColor={buttonBgColor}
              buttonTextColor={buttonTextColor}
              glassEffect={glassEffect}
              preview={preview}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
