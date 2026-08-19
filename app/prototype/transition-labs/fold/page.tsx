import type { Metadata } from "next";
import TransitionLabShell from "@/components/sections/transition-labs/TransitionLabShell";
import CutFold from "@/components/sections/transition-labs/CutFold";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TransitionGPage() {
  return (
    <TransitionLabShell current="fold">
      <CutFold />
    </TransitionLabShell>
  );
}
