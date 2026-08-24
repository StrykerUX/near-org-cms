import type { Metadata } from "next";
import CommunityCView from "@/components/views/CommunityCView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function CommunityCPage() {
  return <CommunityCView />;
}
