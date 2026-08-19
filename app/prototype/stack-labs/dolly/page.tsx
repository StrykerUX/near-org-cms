import type { Metadata } from "next";
import StackLabShell from "@/components/sections/stack-labs/StackLabShell";
import StackDolly from "@/components/sections/stack-labs/StackDolly";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function StackHPage() {
  return (
    <StackLabShell current="dolly">
      <StackDolly />
    </StackLabShell>
  );
}
