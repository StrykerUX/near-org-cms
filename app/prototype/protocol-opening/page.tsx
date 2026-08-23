import type { Metadata } from "next";
import ProtocolOpeningsIndexView from "@/components/views/ProtocolOpeningsIndexView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolOpeningsIndexPage() {
  return <ProtocolOpeningsIndexView />;
}
