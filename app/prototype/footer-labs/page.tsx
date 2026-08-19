import type { Metadata } from "next";
import FooterLabIndexView from "@/components/views/footer-labs/FooterLabIndexView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function FooterLabsPage() {
  return <FooterLabIndexView />;
}
