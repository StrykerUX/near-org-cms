import type { Metadata } from "next";
import HomepageBView from "@/components/views/HomepageBView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageGPage() {
  return <HomepageBView />;
}
