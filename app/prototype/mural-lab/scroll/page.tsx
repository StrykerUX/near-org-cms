import type { Metadata } from "next";
import MuralScrollView from "@/components/views/mural-lab/MuralScrollView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function MuralScrollPage() {
  return <MuralScrollView />;
}
