import type { Metadata } from "next";
import TransitionLabShell from "@/components/sections/transition-labs/TransitionLabShell";
import CutSidestep from "@/components/sections/transition-labs/CutSidestep";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TransitionLPage() {
  return (
    <TransitionLabShell current="sidestep">
      <CutSidestep />
    </TransitionLabShell>
  );
}
