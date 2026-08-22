import type { Metadata } from "next";
import ProtocolTransitionLabView from "@/components/views/ProtocolTransitionLabView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolTransitionT8Page() {
  return <ProtocolTransitionLabView id="t8" />;
}
