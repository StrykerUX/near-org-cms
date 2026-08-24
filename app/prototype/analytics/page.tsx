import type { Metadata } from "next";
import AnalyticsLabsIndexView from "@/components/views/AnalyticsLabsIndexView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function AnalyticsLabsIndexPage() {
  return <AnalyticsLabsIndexView />;
}
