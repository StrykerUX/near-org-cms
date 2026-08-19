import type { Metadata } from "next";
import Ex2View from "@/components/views/Ex2View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function Ex2Page() {
  return <Ex2View />;
}
