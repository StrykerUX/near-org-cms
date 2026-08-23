import type { Metadata } from "next";
import ChainAbPropuestaBView from "@/components/views/ChainAbPropuestaBView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ChainAbPropuestaBPage() {
  return <ChainAbPropuestaBView />;
}
