import type { Metadata } from "next";
import FoundationBView from "@/components/views/FoundationBView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function FoundationBPage() {
  return <FoundationBView />;
}
