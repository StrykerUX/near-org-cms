import type { Metadata } from "next";
import ChainAbOpcion1View from "@/components/views/ChainAbOpcion1View";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ChainAbOpcion1Page() {
  return <ChainAbOpcion1View />;
}
