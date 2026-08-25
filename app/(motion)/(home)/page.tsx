import type { Metadata } from "next";
import HomepageCView from "@/components/views/HomepageCView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// La homepage del sitio.
//
// Monta `HomepageCView`, la misma view que `/prototype/homepage-c`. Es el mismo
// componente montado dos veces y no dos copias, así que no pueden divergir —
// que es lo único que la regla de «promover una variante» viene a evitar.
//
// La ruta de prototipo se queda por ahora: es donde la exploración se venía
// enseñando y comparando contra `homepage-b`. Cuando la home se dé por
// asentada, esa ruta sobra y se borra.
export default function HomePage() {
  return <HomepageCView />;
}
