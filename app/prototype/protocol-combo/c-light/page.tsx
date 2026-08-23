import type { Metadata } from "next";
import ProtocolComboLabView from "@/components/views/ProtocolComboLabView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ProtocolComboCLightPage() {
  return <ProtocolComboLabView id="c-light" />;
}
