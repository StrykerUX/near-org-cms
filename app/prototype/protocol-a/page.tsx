import type { Metadata } from "next";
import ProtocolLabAView from "@/components/views/ProtocolLabAView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolLabAPage() {
  return <ProtocolLabAView />;
}
