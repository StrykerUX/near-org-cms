import type { Metadata } from "next";
import StackLabShell from "@/components/sections/stack-labs/StackLabShell";
import StackTraveling from "@/components/sections/stack-labs/StackTraveling";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function StackTravelingPage() {
  return (
    <StackLabShell current="traveling">
      <StackTraveling />
    </StackLabShell>
  );
}
