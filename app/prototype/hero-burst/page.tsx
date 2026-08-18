import type { Metadata } from "next";
import HeroBurstView from "@/components/views/hero-burst/HeroBurstView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HeroBurstPage() {
  return <HeroBurstView />;
}
