import type { MetadataRoute } from "next";
import { currentSite } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/lp/", "/cotizar/", "/api/"],
      },
    ],
    sitemap: `https://${currentSite.domain}/sitemap.xml`,
  };
}
