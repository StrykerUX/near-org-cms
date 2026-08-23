import type { Metadata } from "next";
import ChainAbPropuestaCView from "@/components/views/ChainAbPropuestaCView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ChainAbPropuestaCPage() {
  return <ChainAbPropuestaCView />;
}
