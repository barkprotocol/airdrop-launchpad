/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disables strict mode to prevent errors from halting the build
  images: {
    domains: ['ucarecdn.com', 'images.unsplash.com'],
  },
  webpack(config: { ignoreWarnings: ((warning: any) => any)[]; performance: { hints: boolean; }; }, { isServer }: any) {
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
};

export default nextConfig;