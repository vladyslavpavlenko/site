/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    domains: ["images.ctfassets.net", "i.scdn.co", "media.licdn.com", "images-us.bookshop.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.digitaloceanspaces.com",
      },
      {
        protocol: "http",
        hostname: "books.google.com",
      },

      {
        protocol: "https",
        hostname: "**.spotifycdn.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "lastfm.freetls.fastly.net",
      },
      {
        protocol: "https",
        hostname: "www.oreilly.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "images-us.bookshop.org",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      }
    ],
  },
  webpack: (config, { webpack }) => {
    /* Hide error "Critical dependency: the request of a dependency is an expression" from remark-textr */
    config.plugins.push(new webpack.ContextReplacementPlugin(/remark-textr/));

    return config;
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
