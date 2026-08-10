import type { Metadata } from "next";
import HomepageV2View from "@/components/views/HomepageV2View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageV2Page() {
  return <HomepageV2View />;
}
