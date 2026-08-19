import type { Metadata } from "next";
import ProofAltView from "@/components/views/ProofAltView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProofAltPage() {
  return <ProofAltView />;
}
