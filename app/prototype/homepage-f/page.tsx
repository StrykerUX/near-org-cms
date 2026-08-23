import type { Metadata } from "next";
import HomepageFView from "@/components/views/HomepageFView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageFPage() {
  return <HomepageFView />;
}
