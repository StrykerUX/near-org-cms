import type { Metadata } from "next";
import ChainAbHomepageRefined2View from "@/components/views/ChainAbHomepageRefined2View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ChainAbHomepageRefined2Page() {
  return <ChainAbHomepageRefined2View />;
}
