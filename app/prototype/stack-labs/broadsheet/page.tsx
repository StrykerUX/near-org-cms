import type { Metadata } from "next";
import StackLabShell from "@/components/sections/stack-labs/StackLabShell";
import StackBroadsheet from "@/components/sections/stack-labs/StackBroadsheet";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function StackBroadsheetPage() {
  return (
    <StackLabShell current="broadsheet">
      <StackBroadsheet />
    </StackLabShell>
  );
}
