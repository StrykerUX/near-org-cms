import type { Metadata } from "next";
import ExDraftView from "@/components/views/ExDraftView";
import { ExBgField } from "@/components/sections/ex/ExBackgrounds";
import StackTriptych from "@/components/sections/stack-labs/StackTriptych";
import ProofIndex from "@/components/sections/proof-alt/ProofIndex";
import Belongs05Halo from "@/components/sections/newsletter-labs/Belongs05Halo";
import CustomerStories from "@/components/sections/home-ab7/CustomerStories";
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";
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
      proof={<ProofIndex />}
      newsletter={<Belongs05Halo />}
      stories={<CustomerStories mirror />}
      testimonials={<TestimonialMarquee direction="right" loopSeconds={60} />}
      latest={<LatestUpdates align="left" />}
      news={<UpdatesList eyebrow="Press" title="NEAR in the news" />}
    />
  );
}
