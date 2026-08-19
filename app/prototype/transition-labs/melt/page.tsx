import type { Metadata } from "next";
import TransitionLabShell from "@/components/sections/transition-labs/TransitionLabShell";
import CutMelt from "@/components/sections/transition-labs/CutMelt";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TransitionJPage() {
  return (
    <TransitionLabShell current="melt">
      <CutMelt />
    </TransitionLabShell>
  );
}
