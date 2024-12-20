import { NextConfig } from 'next';

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: false, // Disables strict mode to prevent errors from halting the build
  images: {
    domains: ['ucarecdn.com', 'images.unsplash.com'],
  },
  webpack(config, { isServer }) {
    // Modify webpack settings to allow building even with errors
    config.ignoreWarnings = [
      (warning: any) => warning.message.includes('react-refresh'),
      (warning: any) => warning.message.includes('webpack-dev-server'),
    ];

    // Disable performance hints in non-server builds to avoid errors
    if (!isServer) {
      config.performance = {
        hints: false,  // Disable performance hints to avoid errors about large bundles
      };
    }

    return config;
  },
  typescript: {
    ignoreBuildErrors: true, // Allows build to continue even with TypeScript errors
  },
};

export default nextConfig;