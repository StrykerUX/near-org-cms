import type { Metadata } from "next";
import FooterLabKineticView from "@/components/views/footer-labs/FooterLabKineticView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function FooterLabKineticPage() {
  return <FooterLabKineticView />;
}
