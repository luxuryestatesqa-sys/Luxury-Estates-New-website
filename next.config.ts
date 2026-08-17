import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    // The Vercel account is over its free-tier Image Optimization
    // Transformations quota for this billing period (6.5K/5K used), so
    // Vercel is hard-blocking every image request that isn't already
    // cached (402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED) — that's why
    // photos were broken site-wide. `unoptimized` serves the original
    // file directly instead of asking Vercel to resize/re-encode it, so
    // it doesn't touch that quota at all. Trade-off: browsers download
    // the original file size rather than a device-sized one. Once the
    // quota resets (or the plan changes), remove this line to restore
    // automatic resizing/format conversion.
    unoptimized: true,
    deviceSizes: [640, 828, 1200, 1920, 3840],
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
