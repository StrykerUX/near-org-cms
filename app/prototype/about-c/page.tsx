import type { Metadata } from "next";
import AboutCView from "@/components/views/AboutCView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function AboutCPage() {
  return <AboutCView />;
}
