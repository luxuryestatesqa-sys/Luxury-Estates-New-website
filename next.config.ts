import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    // Fewer breakpoints = fewer distinct optimized variants Vercel has to
    // generate per source image, which is what the Image Optimization
    // quota is metered on. Trimmed from Next's 8-step default to the
    // widths this site's cards/heroes actually render at.
    deviceSizes: [640, 828, 1200, 1920, 3840],
    // Locked to the single quality every image on the site already uses.
    // Adding a second value here (e.g. a per-component `quality` prop)
    // forces every image in the catalog to be re-optimized from scratch
    // under that new value — that's what took the whole site's images
    // down on 2026-08-17. If you need a different quality, raise it here
    // deliberately and expect a one-time re-optimization spike.
    qualities: [75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "eskrxutnidutmflfxfnt.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "static.shared.propertyfinder.qa",
      },
      {
        protocol: "https",
        hostname: "**.propertyfinder.qa",
      },
    ],
  },
};

export default nextConfig;
