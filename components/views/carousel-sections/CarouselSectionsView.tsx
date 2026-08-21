import PressCarousel from "@/components/sections/carousel-sections/PressCarousel";
import StoriesCarousel from "@/components/sections/carousel-sections/StoriesCarousel";

export default function CarouselSectionsView() {
  return (
    <main className="flex flex-col pt-[var(--site-header-block)]">
      <PressCarousel />
      <StoriesCarousel />
    </main>
  );
}
