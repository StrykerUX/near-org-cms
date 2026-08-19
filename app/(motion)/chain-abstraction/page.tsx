import type { Metadata } from "next";
import ChainAbstractionView from "@/components/views/ChainAbstractionView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ChainAbstractionPage() {
  return <ChainAbstractionView />;
}
