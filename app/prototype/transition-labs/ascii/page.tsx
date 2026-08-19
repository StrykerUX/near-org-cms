import type { Metadata } from "next";
import TransitionLabShell from "@/components/sections/transition-labs/TransitionLabShell";
import TransAscii from "@/components/sections/transition-labs/TransAscii";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TransitionCPage() {
  return (
    <TransitionLabShell current="ascii">
      <TransAscii />
    </TransitionLabShell>
  );
}
