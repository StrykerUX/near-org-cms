"use client";

import Link from "next/link";
import { Eye, Pencil, BarChart3 } from "lucide-react";
import { Button } from "@cms/components/ui/button";
import { LinktreeDeleteButton } from "@cms/components/admin/LinktreeDeleteButton";
import { DuplicateLinktreeButton } from "@cms/components/admin/DuplicateLinktreeButton";
import { formatAdminDate } from "@cms/lib/utils";

interface SerializedLinktree {
  id: string;
  name: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  linkCount: number;
  totalClicks: number;
  updatedAt: string;
  owner: { name: string };
}

interface LinktreesBulkTableProps {
  linktrees: SerializedLinktree[];
  userRole: string;
}

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

export function LinktreesBulkTable({ linktrees, userRole }: LinktreesBulkTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Owner</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Links</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Clicks</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Updated</th>
            <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {linktrees.map((linktree) => (
            <tr key={linktree.id} className="hover:bg-muted/20 transition">
              <td className="px-6 py-3">
                <p className="font-medium truncate max-w-xs">{linktree.name}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5 truncate max-w-xs">/{linktree.slug}</p>
              </td>
              <td className="px-6 py-3 text-sm">{linktree.owner.name}</td>
              <td className="px-6 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    linktree.status === "PUBLISHED"
                      ? "text-primary bg-primary/10"
                      : linktree.status === "DRAFT"
                        ? "text-muted-foreground bg-muted/50"
                        : "text-muted-foreground/60 bg-muted/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      linktree.status === "PUBLISHED"
                        ? "bg-primary"
                        : linktree.status === "DRAFT"
                          ? "bg-muted-foreground/50"
                          : "bg-muted-foreground/30"
                    }`}
                  />
                  {linktree.status.charAt(0) + linktree.status.slice(1).toLowerCase()}
                </span>
              </td>
              <td className="px-6 py-3 text-sm text-muted-foreground">{linktree.linkCount}</td>
              <td className="px-6 py-3 text-sm text-muted-foreground">{linktree.totalClicks}</td>
              <td className="px-6 py-3 text-sm text-muted-foreground">
                <span title={formatAdminDate(linktree.updatedAt)} className="cursor-default">
                  {relativeDate(linktree.updatedAt)}
                </span>
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center justify-end gap-1">
                  {linktree.status === "PUBLISHED" && (
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-70 hover:opacity-100 hover:bg-muted"
                      title="View public page"
                    >
                      <Link href={`/${linktree.slug}`} target="_blank">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-70 hover:opacity-100 hover:bg-muted"
                    title="Analytics"
                  >
                    <Link href={`/admin/linktrees/${linktree.id}/analytics`}>
                      <BarChart3 className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-70 hover:opacity-100 hover:bg-muted"
                    title="Edit linktree"
                  >
                    <Link href={`/admin/linktrees/${linktree.id}/edit`}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                  {userRole !== "VIEWER" && (
                    <>
                      <DuplicateLinktreeButton linktreeId={linktree.id} />
                      <LinktreeDeleteButton linktreeId={linktree.id} linktreeName={linktree.name} />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
