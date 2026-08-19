import type { Metadata } from "next";
import TransitionLabShell from "@/components/sections/transition-labs/TransitionLabShell";
import TransCounter from "@/components/sections/transition-labs/TransCounter";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TransitionBPage() {
  return (
    <TransitionLabShell current="counter">
      <TransCounter />
    </TransitionLabShell>
  );
}
