import type { Metadata } from "next";
import HomepageHView from "@/components/views/HomepageHView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageHPage() {
  return <HomepageHView />;
}
