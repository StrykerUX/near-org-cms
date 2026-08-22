import type { Metadata } from "next";
import ProtocolTransitionsIndexView from "@/components/views/ProtocolTransitionsIndexView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolTransitionsIndexPage() {
  return <ProtocolTransitionsIndexView />;
}
