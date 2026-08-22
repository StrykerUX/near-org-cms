import type { Metadata } from "next";
import ScrollSectionsView from "@/components/views/scroll-sections/ScrollSectionsView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ScrollSectionsPage() {
  return <ScrollSectionsView />;
}
