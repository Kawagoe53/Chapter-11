import { Domain } from "domain";
import type { NextConfig } from "next";
import { env } from "prisma/config";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.jp" },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/**",
      },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
