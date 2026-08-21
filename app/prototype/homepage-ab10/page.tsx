import type { Metadata } from "next";
import HomepageAb10View from "@/components/views/HomepageAb10View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageAb10Page() {
  return <HomepageAb10View />;
}
