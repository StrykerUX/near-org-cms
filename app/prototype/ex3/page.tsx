import type { Metadata } from "next";
import ExDraftView from "@/components/views/ExDraftView";
import { ExBgAscii } from "@/components/sections/ex/ExBackgrounds";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function EX3Page() {
  return <ExDraftView current="ex3" background={<ExBgAscii />} layout="center" tone="ink" />;
}
