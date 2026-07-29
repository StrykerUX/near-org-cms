"use client";

import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, Link2 } from "lucide-react";
import { LINKTREE_ICONS, resolveLinktreeIcon } from "@cms/lib/linktree-icons";
import LinkUtmQrModal from "./LinkUtmQrModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@cms/components/ui/alert-dialog";

export interface LinktreeLinkState {
  id?: string;
  _key: string;
  title: string;
  url: string;
  icon: string | null;
  isActive: boolean;
  forwardUtm: boolean;
  startsAt: string;
  endsAt: string;
}

export interface LinktreeSectionState {
  id?: string;
  _key: string;
  title: string;
  displayType: "COLUMN" | "ROW" | "ICONS" | "ICONS_LABEL";
  isActive: boolean;
  links: LinktreeLinkState[];
}

function makeKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function createEmptyLink(): LinktreeLinkState {
  return {
    _key: makeKey(),
    title: "",
    url: "",
    icon: null,
    isActive: true,
    forwardUtm: false,
    startsAt: "",
    endsAt: "",
  };
}

export function createEmptySection(): LinktreeSectionState {
  return {
    _key: makeKey(),
    title: "New section",
    displayType: "COLUMN",
    isActive: true,
    links: [],
  };
}

const UNGROUPED = "__ungrouped__";

interface Props {
  linktreeId?: string;
  sections: LinktreeSectionState[];
  ungroupedLinks: LinktreeLinkState[];
  onChange: (sections: LinktreeSectionState[], ungroupedLinks: LinktreeLinkState[]) => void;
}

function findContainer(
  sections: LinktreeSectionState[],
  ungroupedLinks: LinktreeLinkState[],
  linkKey: string
): string | null {
  if (ungroupedLinks.some((l) => l._key === linkKey)) return UNGROUPED;
  const section = sections.find((s) => s.links.some((l) => l._key === linkKey));
  return section ? section._key : null;
}

function getContainerLinks(
  sections: LinktreeSectionState[],
  ungroupedLinks: LinktreeLinkState[],
  containerId: string
): LinktreeLinkState[] {
  if (containerId === UNGROUPED) return ungroupedLinks;
  return sections.find((s) => s._key === containerId)?.links ?? [];
}

export default function LinktreeEditor({ linktreeId, sections, ungroupedLinks, onChange }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const [utmModalLink, setUtmModalLink] = useState<LinktreeLinkState | null>(null);

  function updateSections(next: LinktreeSectionState[]) {
    onChange(next, ungroupedLinks);
  }
  function updateUngrouped(next: LinktreeLinkState[]) {
    onChange(sections, next);
  }

  function handleSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s._key === active.id);
    const newIndex = sections.findIndex((s) => s._key === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    updateSections(arrayMove(sections, oldIndex, newIndex));
  }

  function handleLinkDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeKey = String(active.id);
    const overKey = String(over.id);
    if (activeKey === overKey) return;

    const sourceContainer = findContainer(sections, ungroupedLinks, activeKey);
    if (!sourceContainer) return;

    // `over` can be either another link (drop next to it) or an empty container itself.
    const overIsContainer = overKey.startsWith("container:");
    const destContainer = overIsContainer
      ? overKey.replace("container:", "")
      : findContainer(sections, ungroupedLinks, overKey) ?? sourceContainer;

    const sourceLinks = getContainerLinks(sections, ungroupedLinks, sourceContainer);
    const link = sourceLinks.find((l) => l._key === activeKey);
    if (!link) return;

    if (sourceContainer === destContainer) {
      const oldIndex = sourceLinks.findIndex((l) => l._key === activeKey);
      const newIndex = overIsContainer ? sourceLinks.length - 1 : sourceLinks.findIndex((l) => l._key === overKey);
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = arrayMove(sourceLinks, oldIndex, newIndex);
      applyContainerUpdate(sourceContainer, reordered);
      return;
    }

    const destLinks = getContainerLinks(sections, ungroupedLinks, destContainer);
    const newSourceLinks = sourceLinks.filter((l) => l._key !== activeKey);
    const insertIndex = overIsContainer ? destLinks.length : destLinks.findIndex((l) => l._key === overKey);
    const newDestLinks = [...destLinks];
    newDestLinks.splice(insertIndex === -1 ? destLinks.length : insertIndex, 0, link);

    applyContainerUpdate(sourceContainer, newSourceLinks);
    applyContainerUpdate(destContainer, newDestLinks);
  }

  function applyContainerUpdate(containerId: string, links: LinktreeLinkState[]) {
    if (containerId === UNGROUPED) {
      updateUngrouped(links);
    } else {
      updateSections(sections.map((s) => (s._key === containerId ? { ...s, links } : s)));
    }
  }

  function addSection() {
    updateSections([...sections, createEmptySection()]);
  }
  function removeSection(key: string) {
    const section = sections.find((s) => s._key === key);
    if (!section) return;
    // Links in a removed section become ungrouped, matching onDelete: SetNull server-side.
    updateSections(sections.filter((s) => s._key !== key));
    updateUngrouped([...ungroupedLinks, ...section.links]);
  }
  function updateSection(key: string, patch: Partial<LinktreeSectionState>) {
    updateSections(sections.map((s) => (s._key === key ? { ...s, ...patch } : s)));
  }

  function addLink(containerId: string) {
    const link = createEmptyLink();
    applyContainerUpdate(containerId, [...getContainerLinks(sections, ungroupedLinks, containerId), link]);
  }
  function removeLink(containerId: string, key: string) {
    applyContainerUpdate(
      containerId,
      getContainerLinks(sections, ungroupedLinks, containerId).filter((l) => l._key !== key)
    );
  }
  function updateLink(containerId: string, key: string, patch: Partial<LinktreeLinkState>) {
    applyContainerUpdate(
      containerId,
      getContainerLinks(sections, ungroupedLinks, containerId).map((l) =>
        l._key === key ? { ...l, ...patch } : l
      )
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Links</h2>
        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <Plus className="w-3.5 h-3.5" /> Add section
        </button>
      </div>

      <DndContext id="linktree-dnd-ungrouped" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLinkDragEnd}>
        <LinksContainer
          containerId={UNGROUPED}
          title="Ungrouped links"
          links={ungroupedLinks}
          onAddLink={() => addLink(UNGROUPED)}
          onRemoveLink={(key) => removeLink(UNGROUPED, key)}
          onUpdateLink={(key, patch) => updateLink(UNGROUPED, key, patch)}
          onOpenUtm={setUtmModalLink}
          linktreeId={linktreeId}
        />
      </DndContext>

      <DndContext id="linktree-dnd-sections" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
        <SortableContext items={sections.map((s) => s._key)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {sections.map((section) => (
              <SortableSection
                key={section._key}
                section={section}
                onRemove={() => removeSection(section._key)}
                onUpdate={(patch) => updateSection(section._key, patch)}
              >
                <DndContext id={`linktree-dnd-section-${section._key}`} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLinkDragEnd}>
                  <LinksContainer
                    containerId={section._key}
                    links={section.links}
                    onAddLink={() => addLink(section._key)}
                    onRemoveLink={(key) => removeLink(section._key, key)}
                    onUpdateLink={(key, patch) => updateLink(section._key, key, patch)}
                    onOpenUtm={setUtmModalLink}
                    linktreeId={linktreeId}
                  />
                </DndContext>
              </SortableSection>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {utmModalLink && linktreeId && utmModalLink.id && (
        <LinkUtmQrModal
          linktreeId={linktreeId}
          linkId={utmModalLink.id}
          linkUrl={utmModalLink.url}
          open
          onClose={() => setUtmModalLink(null)}
        />
      )}
    </div>
  );
}

function SortableSection({
  section,
  onRemove,
  onUpdate,
  children,
}: {
  section: LinktreeSectionState;
  onRemove: () => void;
  onUpdate: (patch: Partial<LinktreeSectionState>) => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section._key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="border border-border rounded-xl bg-card">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <button type="button" {...attributes} {...listeners} className="text-muted-foreground/50 hover:text-muted-foreground cursor-grab">
          <GripVertical className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={section.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
          placeholder="Section title"
        />
        <select
          value={section.displayType}
          onChange={(e) => onUpdate({ displayType: e.target.value as LinktreeSectionState["displayType"] })}
          className="text-xs border border-border/70 rounded px-1.5 py-1 bg-muted/30"
        >
          <option value="COLUMN">Column</option>
          <option value="ROW">Row</option>
          <option value="ICONS">Icons only</option>
          <option value="ICONS_LABEL">Icons + label</option>
        </select>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={section.isActive}
            onChange={(e) => onUpdate({ isActive: e.target.checked })}
          />
          Active
        </label>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button type="button" className="text-muted-foreground hover:text-destructive transition" title="Delete section">
              <Trash2 className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete &ldquo;{section.title || "this section"}&rdquo;?</AlertDialogTitle>
              <AlertDialogDescription>
                The section will be removed. Its links won&apos;t be deleted — they&apos;ll move to &ldquo;Ungrouped links&rdquo;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onRemove}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function LinksContainer({
  containerId,
  title,
  links,
  onAddLink,
  onRemoveLink,
  onUpdateLink,
  onOpenUtm,
  linktreeId,
}: {
  containerId: string;
  title?: string;
  links: LinktreeLinkState[];
  onAddLink: () => void;
  onRemoveLink: (key: string) => void;
  onUpdateLink: (key: string, patch: Partial<LinktreeLinkState>) => void;
  onOpenUtm: (link: LinktreeLinkState) => void;
  linktreeId?: string;
}) {
  const { setNodeRef } = useDroppable({ id: `container:${containerId}` });

  return (
    <div ref={setNodeRef} className="space-y-2">
      {title && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</span>
        </div>
      )}
      <SortableContext items={links.map((l) => l._key)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {links.map((link) => (
            <SortableLinkRow
              key={link._key}
              link={link}
              onRemove={() => onRemoveLink(link._key)}
              onUpdate={(patch) => onUpdateLink(link._key, patch)}
              onOpenUtm={() => onOpenUtm(link)}
              utmDisabled={!linktreeId || !link.id}
            />
          ))}
        </div>
      </SortableContext>
      <button
        type="button"
        onClick={onAddLink}
        className="w-full border border-dashed border-border rounded-lg py-2 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" /> Add link
      </button>
    </div>
  );
}

function SortableLinkRow({
  link,
  onRemove,
  onUpdate,
  onOpenUtm,
  utmDisabled,
}: {
  link: LinktreeLinkState;
  onRemove: () => void;
  onUpdate: (patch: Partial<LinktreeLinkState>) => void;
  onOpenUtm: () => void;
  utmDisabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link._key,
  });
  const [expanded, setExpanded] = useState(false);
  const SelectedIcon = resolveLinktreeIcon(link.icon);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="border border-border/70 rounded-lg bg-background">
      <div className="flex items-center gap-2 px-2 py-2">
        <button type="button" {...attributes} {...listeners} className="text-muted-foreground/50 hover:text-muted-foreground cursor-grab shrink-0">
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5 shrink-0">
          <SelectedIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={link.icon ?? ""}
            onChange={(e) => onUpdate({ icon: e.target.value || null })}
            className="text-xs border border-border/70 rounded px-2 py-1 bg-muted/30 w-36"
            title="Icon"
          >
            <option value="">No icon</option>
            {LINKTREE_ICONS.map((icon) => (
              <option key={icon.key} value={icon.key}>
                {icon.label}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={link.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Title"
          className="flex-1 min-w-0 text-sm bg-transparent focus:outline-none"
        />
        <input
          type="text"
          value={link.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="https://…"
          className="flex-1 min-w-0 text-sm bg-transparent font-mono text-muted-foreground focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-muted-foreground hover:text-foreground transition shrink-0"
        >
          {expanded ? "Less" : "More"}
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button type="button" className="text-muted-foreground hover:text-destructive transition shrink-0" title="Remove link">
              <Trash2 className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete &ldquo;{link.title || "this link"}&rdquo;?</AlertDialogTitle>
              <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onRemove}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {expanded && (
        <div className="px-2 pb-2 pt-1 border-t border-border/50 flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={link.isActive} onChange={(e) => onUpdate({ isActive: e.target.checked })} />
            Active
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={link.forwardUtm} onChange={(e) => onUpdate({ forwardUtm: e.target.checked })} />
            Forward UTM to destination
          </label>
          <label className="flex items-center gap-1.5">
            Starts
            <input
              type="datetime-local"
              value={link.startsAt}
              onChange={(e) => onUpdate({ startsAt: e.target.value })}
              className="border border-border/70 rounded px-1 py-0.5 bg-muted/30 dark:[color-scheme:dark]"
            />
          </label>
          <label className="flex items-center gap-1.5">
            Ends
            <input
              type="datetime-local"
              value={link.endsAt}
              onChange={(e) => onUpdate({ endsAt: e.target.value })}
              className="border border-border/70 rounded px-1 py-0.5 bg-muted/30 dark:[color-scheme:dark]"
            />
          </label>
          <button
            type="button"
            onClick={onOpenUtm}
            disabled={utmDisabled}
            title={utmDisabled ? "Save the linktree first" : "UTM & QR"}
            className="inline-flex items-center gap-1 text-primary hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
          >
            <Link2 className="w-3 h-3" /> UTM & QR
          </button>
        </div>
      )}
    </div>
  );
}
