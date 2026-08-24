import type { Metadata } from "next";
import AnalyticsMixView from "@/components/views/AnalyticsMixView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function AnalyticsMixPage() {
  return <AnalyticsMixView />;
}
