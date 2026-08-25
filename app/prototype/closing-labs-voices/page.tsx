import type { Metadata } from "next";
import ClosingLabsVoicesView from "@/components/views/ClosingLabsVoicesView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ClosingLabsVoicesPage() {
  return <ClosingLabsVoicesView />;
}
