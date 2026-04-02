import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://stag.api.taxcenterug.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
