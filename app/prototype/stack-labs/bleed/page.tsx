import type { Metadata } from "next";
import StackLabShell from "@/components/sections/stack-labs/StackLabShell";
import StackBleed from "@/components/sections/stack-labs/StackBleed";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function StackBleedPage() {
  return (
    <StackLabShell current="bleed">
      <StackBleed />
    </StackLabShell>
  );
}
