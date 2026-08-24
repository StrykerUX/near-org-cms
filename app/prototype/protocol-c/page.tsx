import type { Metadata } from "next";
import ProtocolLabCView from "@/components/views/ProtocolLabCView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolCPage() {
  return <ProtocolLabCView />;
}
