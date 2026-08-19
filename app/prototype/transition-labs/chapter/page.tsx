import type { Metadata } from "next";
import TransitionLabShell from "@/components/sections/transition-labs/TransitionLabShell";
import CutChapter from "@/components/sections/transition-labs/CutChapter";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TransitionKPage() {
  return (
    <TransitionLabShell current="chapter">
      <CutChapter />
    </TransitionLabShell>
  );
}
