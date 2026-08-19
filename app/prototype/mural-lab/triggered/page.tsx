import type { Metadata } from "next";
import MuralTriggeredView from "@/components/views/mural-lab/MuralTriggeredView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function MuralTriggeredPage() {
  return <MuralTriggeredView />;
}
