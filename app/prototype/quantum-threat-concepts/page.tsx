import type { Metadata } from "next";
import QuantumThreatConceptsView from "@/components/views/QuantumThreatConceptsView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function QuantumThreatConceptsPage() {
  return <QuantumThreatConceptsView />;
}
