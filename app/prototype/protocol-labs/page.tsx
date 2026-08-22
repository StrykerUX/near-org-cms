import type { Metadata } from "next";
import ProtocolLabsIndexView from "@/components/views/ProtocolLabsIndexView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolLabsIndexPage() {
  return <ProtocolLabsIndexView />;
}
