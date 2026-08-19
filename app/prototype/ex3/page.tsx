import type { Metadata } from "next";
import ExDraftView from "@/components/views/ExDraftView";
import { ExBgAscii } from "@/components/sections/ex/ExBackgrounds";
import StackDolly from "@/components/sections/stack-labs/StackDolly";
import ProofDatum from "@/components/sections/proof-alt/ProofDatum";
import Belongs10Ascii from "@/components/sections/newsletter-labs/Belongs10Ascii";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function EX3Page() {
  return (
    <ExDraftView
      current="ex3"
      background={<ExBgAscii />}
      layout="center"
      reveal="scramble"
      tone="ink"
      stack={<StackDolly />}
      proof={<ProofDatum />}
      newsletter={<Belongs10Ascii />}
    />
  );
}
