import type { Metadata } from "next";
import QuantumSecurityView from "@/components/views/QuantumSecurityView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function QuantumSecurityPage() {
  return <QuantumSecurityView />;
}
