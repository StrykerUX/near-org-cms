import type { Metadata } from "next";
import HomepageIView from "@/components/views/HomepageIView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageIPage() {
  return <HomepageIView />;
}
