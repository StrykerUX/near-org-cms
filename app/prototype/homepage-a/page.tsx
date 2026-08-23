import type { Metadata } from "next";
import HomepageAView from "@/components/views/HomepageAView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageUpdatePage() {
  return <HomepageAView />;
}
