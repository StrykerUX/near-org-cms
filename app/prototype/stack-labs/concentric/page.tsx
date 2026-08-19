import type { Metadata } from "next";
import StackLabShell from "@/components/sections/stack-labs/StackLabShell";
import StackConcentric from "@/components/sections/stack-labs/StackConcentric";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function StackGPage() {
  return (
    <StackLabShell current="concentric">
      <StackConcentric />
    </StackLabShell>
  );
}
