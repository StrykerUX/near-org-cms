import type { Metadata } from "next";
import ClosingLabsNumbersView from "@/components/views/ClosingLabsNumbersView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ClosingLabsNumbersPage() {
  return <ClosingLabsNumbersView />;
}
