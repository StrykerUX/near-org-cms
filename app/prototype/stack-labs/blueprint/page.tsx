import type { Metadata } from "next";
import StackLabShell from "@/components/sections/stack-labs/StackLabShell";
import StackBlueprint from "@/components/sections/stack-labs/StackBlueprint";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function StackBlueprintPage() {
  return (
    <StackLabShell current="blueprint">
      <StackBlueprint />
    </StackLabShell>
  );
}
