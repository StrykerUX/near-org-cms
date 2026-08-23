import type { Metadata } from "next";
import EconomicsCView from "@/components/views/EconomicsCView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function EconomicsCPage() {
  return <EconomicsCView />;
}
