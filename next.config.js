const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'export',
  basePath: isProd ? '/eventflow-pro' : '',
  assetPrefix: isProd ? '/eventflow-pro' : '',
  trailingSlash: true,
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'],
    unoptimized: true,
  },
  webpack(config) {
    // Find the css-loader rule and disable URL resolution to prevent
    // Tailwind v4 & selectors being treated as file paths
    config.module.rules.forEach((rule) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((r) => {
          if (r.use) {
            const uses = Array.isArray(r.use) ? r.use : [r.use];
            uses.forEach((u) => {
              if (
                u &&
                typeof u === 'object' &&
                u.loader &&
                u.loader.includes('css-loader') &&
                u.options
              ) {
                u.options.url = false;
              }
            });
          }
        });
      }
    });
    return config;
  },
};

export default nextConfig;
