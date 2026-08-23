import type { Metadata } from "next";
import ProtocolCombosIndexView from "@/components/views/ProtocolCombosIndexView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolCombosPage() {
  return <ProtocolCombosIndexView />;
}
