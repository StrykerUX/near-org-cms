import type { Metadata } from "next";
import HomepageProofDemoView from "@/components/views/HomepageProofDemoView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageProofColumnsPage() {
  return <HomepageProofDemoView proof="columns" />;
}
