import type { Metadata } from "next";
import ProtocolHeroesIndexView from "@/components/views/ProtocolHeroesIndexView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolHeroesIndexPage() {
  return <ProtocolHeroesIndexView />;
}
