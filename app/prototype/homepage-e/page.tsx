import type { Metadata } from "next";
import HomepageEView from "@/components/views/HomepageEView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageEPage() {
  return <HomepageEView />;
}
