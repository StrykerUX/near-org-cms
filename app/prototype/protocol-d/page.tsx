import type { Metadata } from "next";
import ProtocolLabDView from "@/components/views/ProtocolLabDView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolLabDPage() {
  return <ProtocolLabDView />;
}
