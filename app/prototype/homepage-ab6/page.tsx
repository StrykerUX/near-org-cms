import type { Metadata } from "next";
import HomepageAb6View from "@/components/views/HomepageAb6View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageAb6Page() {
  return <HomepageAb6View />;
}
