import type { Metadata } from "next";
import ProtocolLabBView from "@/components/views/ProtocolLabBView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolBPage() {
  return <ProtocolLabBView />;
}
