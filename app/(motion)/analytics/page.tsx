import type { Metadata } from "next";
import AnalyticsView from "@/components/views/AnalyticsView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
