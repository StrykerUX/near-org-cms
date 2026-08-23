import type { Metadata } from "next";
import FoundationAView from "@/components/views/FoundationAView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function FoundationAPage() {
  return <FoundationAView />;
}
