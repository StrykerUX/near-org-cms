import type { Metadata } from "next";
import MuralLabIndexView from "@/components/views/mural-lab/MuralLabIndexView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function MuralLabPage() {
  return <MuralLabIndexView />;
}
