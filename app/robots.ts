import { MetadataRoute } from "next";
import { noindexPaths } from "@/lib/routes";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", ...noindexPaths()] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
