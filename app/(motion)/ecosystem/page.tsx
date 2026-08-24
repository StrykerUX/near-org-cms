import type { Metadata } from "next";
import EcosystemView from "@/components/views/EcosystemView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function EcosystemPage() {
  return <EcosystemView />;
}
