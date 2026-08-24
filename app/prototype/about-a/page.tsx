import type { Metadata } from "next";
import AboutAView from "@/components/views/AboutAView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function AboutAPage() {
  return <AboutAView />;
}
