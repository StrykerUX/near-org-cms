import type { Metadata } from "next";
import ProtocolProofLabView from "@/components/views/ProtocolProofLabView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolProofP2Page() {
  return <ProtocolProofLabView id="p2" />;
}
