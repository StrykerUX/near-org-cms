"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function DuplicateLinktreeButton({ linktreeId }: { linktreeId: string }) {
  const router = useRouter();
  const [isDuplicating, setIsDuplicating] = useState(false);

  async function handleDuplicate() {
    setIsDuplicating(true);
    try {
      const res = await fetch(`/api/linktrees/${linktreeId}/duplicate`, { method: "POST" });
      if (!res.ok) {
        toast.error("Failed to duplicate linktree");
        return;
      }
      toast.success("Linktree duplicated");
      router.refresh();
    } catch {
      toast.error("Failed to duplicate linktree");
    } finally {
      setIsDuplicating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDuplicate}
      disabled={isDuplicating}
      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground opacity-70 hover:opacity-100 hover:bg-muted transition disabled:opacity-50"
      title="Duplicate linktree"
    >
      <Copy className="w-4 h-4" />
    </button>
  );
}
