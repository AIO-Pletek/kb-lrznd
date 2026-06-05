import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "directus",
        port: "8055",
        pathname: "/assets/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/cms/assets/**",
      },
      {
        protocol: "https",
        hostname: "kabe.lrznd.my.id",
        pathname: "/cms/assets/**",
      },
    ],
  },
};

export default nextConfig;
