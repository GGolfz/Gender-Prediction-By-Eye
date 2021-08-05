module.exports = {
  reactStrictMode: true,
  assetPrefix: '/gendy-static',
  rewrites() {
    return [
      { source: '/gendy-static/_next/:path*', destination: '/_next/:path*' }
    ]
  },
  images: {
    domains: ['lab.ggolfz.codes'],
  },
}
