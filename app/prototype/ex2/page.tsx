import type { Metadata } from "next";
import ExDraftView from "@/components/views/ExDraftView";
import { ExBgField } from "@/components/sections/ex/ExBackgrounds";
import StackTriptych from "@/components/sections/stack-labs/StackTriptych";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function EX2Page() {
  return (
    <ExDraftView
      current="ex2"
      background={<ExBgField />}
      layout="center"
      word="match"
      reveal="read"
      tone="ink"
      stack={<StackTriptych />}
    />
  );
}
