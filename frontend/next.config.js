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
    NEXT_PUBLIC_BACKEND_URL: "https://aura-backend-11z6.onrender.com",
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
