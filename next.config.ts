import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.scdn.co" },
      { hostname: "i.ytimg.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://open.spotify.com https://sdk.scdn.co;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
