import type { Metadata } from "next";
import AnalyticsAView from "@/components/views/AnalyticsAView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function AnalyticsAPage() {
  return <AnalyticsAView />;
}
