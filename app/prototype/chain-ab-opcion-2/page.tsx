import type { Metadata } from "next";
import ChainAbOpcion2View from "@/components/views/ChainAbOpcion2View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ChainAbOpcion2Page() {
  return <ChainAbOpcion2View />;
}
