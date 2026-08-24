import type { Metadata } from "next";
import FoundationCView from "@/components/views/FoundationCView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function FoundationCPage() {
  return <FoundationCView />;
}
