import type { Metadata } from "next";
import StackLabIndexView from "@/components/views/StackLabIndexView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function StackLabsPage() {
  return <StackLabIndexView />;
}
