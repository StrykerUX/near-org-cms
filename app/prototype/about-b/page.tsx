import type { Metadata } from "next";
import AboutBView from "@/components/views/AboutBView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function AboutBPage() {
  return <AboutBView />;
}
