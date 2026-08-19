import type { Metadata } from "next";
import FooterLabCompactView from "@/components/views/footer-labs/FooterLabCompactView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function FooterLabCompactPage() {
  return <FooterLabCompactView />;
}
