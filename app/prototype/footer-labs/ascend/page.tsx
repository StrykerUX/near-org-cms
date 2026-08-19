import type { Metadata } from "next";
import FooterLabAscendView from "@/components/views/footer-labs/FooterLabAscendView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function FooterLabAscendPage() {
  return <FooterLabAscendView />;
}
