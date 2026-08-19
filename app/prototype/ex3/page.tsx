import type { Metadata } from "next";
import ExDraftView from "@/components/views/ExDraftView";
import { ExBgAscii } from "@/components/sections/ex/ExBackgrounds";
import StackDolly from "@/components/sections/stack-labs/StackDolly";
import ProofDatum from "@/components/sections/proof-alt/ProofDatum";
import Belongs10Ascii from "@/components/sections/newsletter-labs/Belongs10Ascii";
import CustomerStories from "@/components/sections/home-ab7/CustomerStories";
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";
import FooterReveal from "@/components/sections/footer-labs/FooterReveal";
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
      stories={<CustomerStories tone="stone" eyebrow="Built on NEAR" />}
      testimonials={<TestimonialMarquee loopSeconds={32} />}
      latest={<LatestUpdates title="The latest from NEAR" align="left" />}
      news={<UpdatesList eyebrow="Media" title="In the news" rows={2} />}
      footer={<FooterReveal />}
    />
  );
}
