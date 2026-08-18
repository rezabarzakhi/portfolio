import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.rezabarzakhi.ir",
      },
    ],
  },
};

export default nextConfig;
