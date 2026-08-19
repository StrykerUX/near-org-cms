import type { Metadata } from "next";
import ExDraftView from "@/components/views/ExDraftView";
import { ExBgVideo } from "@/components/sections/ex/ExBackgrounds";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function EX1Page() {
  return <ExDraftView current="ex1" background={<ExBgVideo />} layout="poster" tone="ink" />;
}
