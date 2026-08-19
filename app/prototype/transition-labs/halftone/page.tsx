import type { Metadata } from "next";
import TransitionLabShell from "@/components/sections/transition-labs/TransitionLabShell";
import CutHalftone from "@/components/sections/transition-labs/CutHalftone";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TransitionIPage() {
  return (
    <TransitionLabShell current="halftone">
      <CutHalftone />
    </TransitionLabShell>
  );
}
