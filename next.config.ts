import { NextConfig } from "next";
import withPWA from "next-pwa";
import path from "path";

// Define the base Next.js config
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This is the wildcard that means "any domain"
      },
      {
        protocol: "http", // Also allow non-secure http
        hostname: "**",
      },
    ],
  },
  reactStrictMode: true,
  // webpack(config, { isServer }) {
  //   // Only apply alias in production mode
  //   if (!isServer && process.env.NODE_ENV === "production") {
  //     config.resolve.alias["@sw"] = path.resolve(
  //       __dirname,
  //       "public/firebase-messaging-sw.js"
  //     );
  //   }
  //   return config;
  // },
};

export default withPWA({
  ...nextConfig,
  // Directly pass PWA options here without nesting it under 'pwa'
  dest: "public", // Directory to store service worker and manifest
  register: true, // Automatically register the service worker
  skipWaiting: true, // Skip the waiting phase and activate the worker immediately
  disable: process.env.NODE_ENV === "development", // Disable in development mode
});
