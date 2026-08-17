import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
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
