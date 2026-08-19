import type { Metadata } from "next";
import FooterLabRevealView from "@/components/views/footer-labs/FooterLabRevealView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function FooterLabRevealPage() {
  return <FooterLabRevealView />;
}
