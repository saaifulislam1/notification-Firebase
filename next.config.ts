import type { NextConfig } from "next";
import withPWA from "next-pwa";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack: (config: any) => {
    config.resolve.alias["@sw"] = path.resolve(
      __dirname,
      "public/firebase-messaging-sw.js"
    );
    return config;
  },
};

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any); // override TS type
