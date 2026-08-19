import type { Metadata } from "next";
import ExDraftView from "@/components/views/ExDraftView";
import { ExBgVideo } from "@/components/sections/ex/ExBackgrounds";
import StackAxis from "@/components/sections/stack-labs/StackAxis";
import ProofColumns from "@/components/sections/proof-alt/ProofColumns";
import Belongs01Marquee from "@/components/sections/newsletter-labs/Belongs01Marquee";
import CustomerStories from "@/components/sections/home-ab7/CustomerStories";
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function EX1Page() {
  return (
    <ExDraftView
      current="ex1"
      background={<ExBgVideo />}
      layout="poster"
      reveal="lines"
      tone="ink"
      stack={<StackAxis />}
      proof={<ProofColumns />}
      newsletter={<Belongs01Marquee />}
      stories={<CustomerStories />}
      testimonials={<TestimonialMarquee />}
      latest={<LatestUpdates />}
      news={<UpdatesList />}
    />
  );
}
