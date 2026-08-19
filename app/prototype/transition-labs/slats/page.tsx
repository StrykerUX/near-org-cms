import type { Metadata } from "next";
import TransitionLabShell from "@/components/sections/transition-labs/TransitionLabShell";
import CutSlats from "@/components/sections/transition-labs/CutSlats";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TransitionFPage() {
  return (
    <TransitionLabShell current="slats">
      <CutSlats />
    </TransitionLabShell>
  );
}
