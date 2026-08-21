import type { Metadata } from "next";
import CarouselSectionsView from "@/components/views/carousel-sections/CarouselSectionsView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function CarouselSectionsPage() {
  return <CarouselSectionsView />;
}
