import type { Metadata } from "next";
import TransitionLabShell from "@/components/sections/transition-labs/TransitionLabShell";
import TransWipe from "@/components/sections/transition-labs/TransWipe";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TransitionAPage() {
  return (
    <TransitionLabShell current="wipe">
      <TransWipe />
    </TransitionLabShell>
  );
}
