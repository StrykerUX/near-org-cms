import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo";
import ProtocolView from "@/components/views/ProtocolView";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolPage() {
  return <ProtocolView />;
}
