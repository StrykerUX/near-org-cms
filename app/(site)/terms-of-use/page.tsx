import type { Metadata } from "next";
import StubView from "@/components/views/StubView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TermsOfUsePage() {
  return <StubView title={meta.title} />;
}
