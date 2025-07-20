import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com", // GitHub
      "lh3.googleusercontent.com",     // Google
    ],
  },
  /* config options here */
};

module.exports = nextConfig;
