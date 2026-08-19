import type { Metadata } from "next";
import StackLabShell from "@/components/sections/stack-labs/StackLabShell";
import StackTriptych from "@/components/sections/stack-labs/StackTriptych";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function StackGPage() {
  return (
    <StackLabShell current="triptych">
      <StackTriptych />
    </StackLabShell>
  );
}
