import type { Metadata } from "next";
import FooterLabStackView from "@/components/views/footer-labs/FooterLabStackView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function FooterLabStackPage() {
  return <FooterLabStackView />;
}
