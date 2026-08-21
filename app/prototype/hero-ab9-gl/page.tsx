import type { Metadata } from "next";
import HeroAb9GLView from "@/components/views/hero-ab9-gl/HeroAb9GLView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function HeroAb9GLPage() {
  return <HeroAb9GLView />;
}
