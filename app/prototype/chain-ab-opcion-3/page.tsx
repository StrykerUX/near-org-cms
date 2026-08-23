import type { Metadata } from "next";
import ChainAbOpcion3View from "@/components/views/ChainAbOpcion3View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ChainAbOpcion3Page() {
  return <ChainAbOpcion3View />;
}
