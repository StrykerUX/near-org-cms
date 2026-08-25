import type { Metadata } from "next";
import ClosingLabsPressView from "@/components/views/ClosingLabsPressView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ClosingLabsPressPage() {
  return <ClosingLabsPressView />;
}
