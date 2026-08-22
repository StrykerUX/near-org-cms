import type { Metadata } from "next";
import ProtocolProofLabsView from "@/components/views/ProtocolProofLabsView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolProofLabsPage() {
  return <ProtocolProofLabsView />;
}
