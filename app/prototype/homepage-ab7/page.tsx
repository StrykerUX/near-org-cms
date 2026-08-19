import type { Metadata } from "next";
import HomepageAb7View from "@/components/views/HomepageAb7View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageAb7Page() {
  return <HomepageAb7View />;
}
