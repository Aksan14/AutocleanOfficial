module.exports = {
  images: {
    domains: ['192.168.1.22', 'localhost'],
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
    ],
  },
};