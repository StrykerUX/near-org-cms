import { prisma } from "@near/cms-core/lib/prisma";
import type { SerializedBanner } from "@near/cms-core/components/site/BannerView";

// Extraído de app/(site)/layout.tsx. El try/catch → [] es intencional: nunca
// deje que un hiccup de DB (ej. inalcanzable durante un build estático)
// rompa el render de la página — ver Fase 0 / hallazgo #5 del plan.
export async function getActiveBanners(): Promise<SerializedBanner[]> {
  const now = new Date();
  try {
    return await prisma.banner.findMany({
      where: {
        enabled: true,
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: now } }] },
          { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        ],
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        type: true,
        paths: true,
        frequency: true,
        contentMode: true,
        content: true,
        htmlContent: true,
        modalDelaySeconds: true,
        modalScrollPercent: true,
        modalPosition: true,
        displayMode: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch active banners:", error);
    return [];
  }
}
