import type { Metadata } from "next";
import HomepageGView from "@/components/views/HomepageGView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageGPage() {
  return <HomepageGView />;
}
