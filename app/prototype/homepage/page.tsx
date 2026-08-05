import type { Metadata } from "next";
import PrototypeHomepageView from "@/components/views/PrototypeHomepageView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HomepageDraftPage() {
  return <PrototypeHomepageView />;
}
