import type { NextConfig } from "next";

function getTrustedImageHostnames(): { protocol: "https"; hostname: string }[] {
  const patterns: { protocol: "https"; hostname: string }[] = [];
  if (process.env.R2_PUBLIC_URL) {
    try {
      const { hostname } = new URL(process.env.R2_PUBLIC_URL);
      patterns.push({ protocol: "https", hostname });
    } catch {}
  }
  if (process.env.S3_ENDPOINT) {
    try {
      const { hostname } = new URL(process.env.S3_ENDPOINT);
      patterns.push({ protocol: "https", hostname });
    } catch {}
  }
  return patterns;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  transpilePackages: ["@near/cms-core"],
  experimental: {
    // Convierte los imports de barril en imports directos por símbolo. Next ya
    // trae `lucide-react` en su lista por defecto; estos no están y son los que
    // pesan acá: `react-icons/fa6` (el barril completo son cientos de iconos para
    // los 7 que usa linktree-icons) y los ~30 paquetes de TipTap del editor del
    // admin. En dev la diferencia es enorme — sin esto, tocar un archivo del
    // admin recompila el barril entero.
    optimizePackageImports: ["react-icons/fa6", "@tiptap/react", "@tiptap/starter-kit"],
  },
  images: {
    remotePatterns: getTrustedImageHostnames(),
    // AVIF primero: pesa ~20-30% menos que WebP a calidad equivalente, y el
    // navegador elige por Accept. El orden ES la preferencia.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // `X-XSS-Protection` quitado: era el filtro XSS heredado de Chrome, que
          // se eliminó del navegador en 2019 y que ningún motor moderno lee. No
          // hacía nada y sugería una protección que no existe.
        ],
      },
      {
        // Los assets de public/ se sirven sin `Cache-Control` propio, así que caen
        // en el default de Next para archivos estáticos no versionados: se
        // revalidan en cada visita. Son inmutables en la práctica (un cambio de
        // arte viene con un nombre nuevo), y acá hay 12.7MB de mp4, ~6MB de PNG y
        // los tres JSON de las escenas de Unicorn.
        //
        // Va por extensión y no por `/:path*` para no cachear el HTML.
        source: "/:path*.:ext(mp4|webm|jpg|jpeg|png|webp|avif|svg|woff2|json)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
