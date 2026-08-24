import type { Metadata } from "next";
import SolutionsAView from "@/components/views/SolutionsAView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function SolutionsAPage() {
  return <SolutionsAView />;
}
