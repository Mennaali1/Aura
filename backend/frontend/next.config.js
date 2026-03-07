/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },

  // Configure images for better optimization
  images: {
    domains: ["images.unsplash.com"],
  },

  // Environment variables for backend API
  env: {
    BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
  },

  // Enable strict mode for better development experience
  reactStrictMode: true,

  // Configure webpack for better bundle optimization
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;
