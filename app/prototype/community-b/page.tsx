import type { Metadata } from "next";
import CommunityBView from "@/components/views/CommunityBView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function CommunityBPage() {
  return <CommunityBView />;
}
