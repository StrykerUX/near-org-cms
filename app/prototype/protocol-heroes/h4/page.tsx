import type { Metadata } from "next";
import ProtocolHeroLabView from "@/components/views/ProtocolHeroLabView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolHeroH4Page() {
  return <ProtocolHeroLabView id="h4" />;
}
