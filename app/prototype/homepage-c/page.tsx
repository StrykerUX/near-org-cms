import type { Metadata } from "next";
import HomepageCView from "@/components/views/HomepageCView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageKPage() {
  return <HomepageCView />;
}
