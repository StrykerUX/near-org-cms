import type { Metadata } from "next";
import TransitionLabIndexView from "@/components/views/TransitionLabIndexView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function TransitionLabsPage() {
  return <TransitionLabIndexView />;
}
