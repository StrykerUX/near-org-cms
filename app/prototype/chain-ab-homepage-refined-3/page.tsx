import type { Metadata } from "next";
import ChainAbHomepageRefined3View from "@/components/views/ChainAbHomepageRefined3View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ChainAbHomepageRefined3Page() {
  return <ChainAbHomepageRefined3View />;
}
