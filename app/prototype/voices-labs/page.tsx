import type { Metadata } from "next";
import VoicesLabsView from "@/components/views/VoicesLabsView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function VoicesLabsPage() {
  return <VoicesLabsView />;
}
