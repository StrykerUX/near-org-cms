import type { Metadata } from "next";
import AnalyticsCView from "@/components/views/AnalyticsCView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function AnalyticsCPage() {
  return <AnalyticsCView />;
}
