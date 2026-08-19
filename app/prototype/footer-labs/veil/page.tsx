import type { Metadata } from "next";
import FooterLabVeilView from "@/components/views/footer-labs/FooterLabVeilView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function FooterLabVeilPage() {
  return <FooterLabVeilView />;
}
