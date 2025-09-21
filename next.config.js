module.exports = {
  // Explicit path mapping untuk memastikan resolusi bekerja di server
  experimental: {
    // Membantu dengan resolusi module
    externalDir: true,
  },
  images: {
    domains: ['192.168.1.22', 'localhost', 'autoclean.pusatweb.cloud'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.1.22',
        port: '1010',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'autoclean.pusatweb.cloud',
        pathname: '/**',
      },
    ],
  },
};