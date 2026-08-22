import type { Metadata } from "next";
import HomepageUpdateView from "@/components/views/HomepageUpdateView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageUpdatePage() {
  return <HomepageUpdateView />;
}
