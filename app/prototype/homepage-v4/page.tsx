import type { Metadata } from "next";
import HomepageV4View from "@/components/views/HomepageV4View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageV4Page() {
  return <HomepageV4View />;
}
