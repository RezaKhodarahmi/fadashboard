const path = require('path');

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  transpilePackages: [
    '@fullcalendar/common',
    '@fullcalendar/core',
    '@fullcalendar/react',
    '@fullcalendar/daygrid',
    '@fullcalendar/list',
    '@fullcalendar/timegrid'
  ],
  experimental: {
    esmExternals: false
  },
  webpack: false,

  // Add this to enable static export
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/': { page: '/' },
      // Add other paths here
      // Example: '/about': { page: '/about' }
    };
  },
  // This is required for static export
  // It disables server-side rendering and automatic static optimization
  exportTrailingSlash: true,
  assetPrefix: '',

  // Optionally, you can add rewrites, redirects, or headers as needed
  // For example:
  // async rewrites() {
  //   return [
  //     { source: '/custom-route', destination: '/another-route' },
  //   ]
  // },
};
