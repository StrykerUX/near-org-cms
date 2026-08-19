import type { Metadata } from "next";
import StackLabShell from "@/components/sections/stack-labs/StackLabShell";
import StackAxis from "@/components/sections/stack-labs/StackAxis";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function StackFPage() {
  return (
    <StackLabShell current="axis">
      <StackAxis />
    </StackLabShell>
  );
}
