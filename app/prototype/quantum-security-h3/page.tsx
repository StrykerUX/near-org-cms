import type { Metadata } from "next";
import QuantumSecurityH3View from "@/components/views/QuantumSecurityH3View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function QuantumSecurityH3Page() {
  return <QuantumSecurityH3View />;
}
