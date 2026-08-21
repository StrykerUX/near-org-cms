import type { Metadata } from "next";
import HomepageAb9View from "@/components/views/HomepageAb9View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageAb9Page() {
  return <HomepageAb9View />;
}
