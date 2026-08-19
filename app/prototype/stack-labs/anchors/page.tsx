import type { Metadata } from "next";
import StackLabShell from "@/components/sections/stack-labs/StackLabShell";
import StackAnchors from "@/components/sections/stack-labs/StackAnchors";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function StackAnchorsPage() {
  return (
    <StackLabShell current="anchors">
      <StackAnchors />
    </StackLabShell>
  );
}
