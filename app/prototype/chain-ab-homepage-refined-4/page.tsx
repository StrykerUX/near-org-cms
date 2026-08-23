import type { Metadata } from "next";
import ChainAbHomepageRefined4View from "@/components/views/ChainAbHomepageRefined4View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ChainAbHomepageRefined4Page() {
  return <ChainAbHomepageRefined4View />;
}
