import type { Metadata } from "next";
import ComponentsShowcaseView from "@/components/views/ComponentsShowcaseView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ComponentsPage() {
  return <ComponentsShowcaseView />;
}
