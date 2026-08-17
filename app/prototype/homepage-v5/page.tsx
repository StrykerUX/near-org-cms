import type { Metadata } from "next";
import HomepageV5View from "@/components/views/HomepageV5View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageV5Page() {
  return <HomepageV5View />;
}
