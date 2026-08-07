import type { Metadata } from "next";
import FlowCompareView from "@/components/views/FlowCompareView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function FlowComparePage() {
  return <FlowCompareView />;
}
