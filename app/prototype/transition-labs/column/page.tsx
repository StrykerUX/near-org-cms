import type { Metadata } from "next";
import TransitionLabShell from "@/components/sections/transition-labs/TransitionLabShell";
import TransColumn from "@/components/sections/transition-labs/TransColumn";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TransitionEPage() {
  return (
    <TransitionLabShell current="column">
      <TransColumn />
    </TransitionLabShell>
  );
}
