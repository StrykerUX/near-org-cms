import type { Metadata } from "next";
import HomepageExplorationView from "@/components/views/HomepageExplorationView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageExplorationPage() {
  return <HomepageExplorationView />;
}
