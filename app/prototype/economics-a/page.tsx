import type { Metadata } from "next";
import EconomicsAView from "@/components/views/EconomicsAView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function EconomicsAPage() {
  return <EconomicsAView />;
}
