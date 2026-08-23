import type { Metadata } from "next";
import QuantumSecurityH2View from "@/components/views/QuantumSecurityH2View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function QuantumSecurityH2Page() {
  return <QuantumSecurityH2View />;
}
