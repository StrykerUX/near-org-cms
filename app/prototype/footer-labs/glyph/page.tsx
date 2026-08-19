import type { Metadata } from "next";
import FooterLabGlyphView from "@/components/views/footer-labs/FooterLabGlyphView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function FooterLabGlyphPage() {
  return <FooterLabGlyphView />;
}
