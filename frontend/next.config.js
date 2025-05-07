/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      appDir: true,
      typedRoutes: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost", 
          port: "8000",
          pathname: "/media/**", // Adjusted for your media paths
        },
      ],
    },
  };
  
  module.exports = nextConfig;