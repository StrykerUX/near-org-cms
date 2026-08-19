import type { Metadata } from "next";
import NewsletterLabView from "@/components/views/NewsletterLabView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function NewsletterLabsPage() {
  return <NewsletterLabView />;
}
