import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kabe.lrznd.my.id",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
