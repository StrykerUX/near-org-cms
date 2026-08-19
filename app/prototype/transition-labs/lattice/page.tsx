import type { Metadata } from "next";
import TransitionLabShell from "@/components/sections/transition-labs/TransitionLabShell";
import TransLattice from "@/components/sections/transition-labs/TransLattice";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TransitionDPage() {
  return (
    <TransitionLabShell current="lattice">
      <TransLattice />
    </TransitionLabShell>
  );
}
